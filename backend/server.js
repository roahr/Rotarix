require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const { ethers } = require('ethers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const speakeasy = require('speakeasy');
const { Sequelize, DataTypes } = require('sequelize');
const { Kyber } = require('pqc-kyber');
const { Dilithium } = require('pqc-dilithium');
const winston = require('winston');
const { WebhookClient } = require('discord-webhook-node');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Database setup (PostgreSQL)
const sequelize = new Sequelize(process.env.DB_URI, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.DB_SSL === 'true' ? { require: true } : false
  }
});

// Define models
const User = sequelize.define('User', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'security_analyst', 'auditor'), defaultValue: 'security_analyst' },
  mfaSecret: { type: DataTypes.STRING },
  lastLogin: { type: DataTypes.DATE }
});

const Key = sequelize.define('Key', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  keyId: { type: DataTypes.STRING, unique: true },
  publicKey: { type: DataTypes.TEXT },
  encryptedPrivateKey: { type: DataTypes.TEXT },
  algorithm: { type: DataTypes.STRING }, // 'kyber', 'dilithium', 'aes'
  status: { type: DataTypes.ENUM('active', 'rotated', 'compromised'), defaultValue: 'active' },
  rotationDate: { type: DataTypes.DATE },
  expiryDate: { type: DataTypes.DATE },
  metadata: { type: DataTypes.JSONB }
});

const AuditLog = sequelize.define('AuditLog', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  action: { type: DataTypes.STRING },
  entityType: { type: DataTypes.STRING },
  entityId: { type: DataTypes.STRING },
  performedBy: { type: DataTypes.UUID },
  details: { type: DataTypes.JSONB },
  blockchainTxHash: { type: DataTypes.STRING }
});

// Initialize Ethereum provider
const provider = new ethers.providers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const wallet = new ethers.Wallet(process.env.ETHEREUM_PRIVATE_KEY, provider);
const auditContract = new ethers.Contract(
  process.env.AUDIT_CONTRACT_ADDRESS,
  require('./abis/AuditLog.json'),
  wallet
);

// Logger setup
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Webhook client for alerts
const alertWebhook = new WebhookClient(process.env.ALERT_WEBHOOK_URL);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// Apply to all requests
app.use(apiLimiter);

// Middleware
const authenticate = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) throw new Error('User not found');
    
    req.user = user;
    next();
  } catch (err) {
    logger.error(`Authentication failed: ${err.message}`);
    res.status(401).json({ error: 'Invalid token' });
  }
};

const authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    logger.warn(`Unauthorized access attempt by user ${req.user.id}`);
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

// Utility functions
const encryptWithAES = (data, key) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
    authTag: cipher.getAuthTag().toString('hex')
  };
};

const decryptWithAES = (encrypted, key) => {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(key, 'hex'),
    Buffer.from(encrypted.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));
  let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const logToBlockchain = async (action, entityType, entityId, details) => {
  try {
    const tx = await auditContract.logAction(
      action,
      entityType,
      entityId,
      JSON.stringify(details)
    );
    await tx.wait();
    return tx.hash;
  } catch (err) {
    logger.error(`Blockchain logging failed: ${err.message}`);
    return null;
  }
};

// API Endpoints

// 1. Authentication & Access Control
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!['admin', 'security_analyst', 'auditor'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const mfaSecret = speakeasy.generateSecret({ length: 20 }).base32;
    
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      mfaSecret
    });

    logger.info(`User registered: ${user.id}`);
    res.status(201).json({ 
      id: user.id,
      email: user.email,
      mfaSecret // In production, this would be sent via email/SMS
    });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    res.status(400).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    // In production, you'd verify MFA token here
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    await user.update({ lastLogin: new Date() });
    logger.info(`User logged in: ${user.id}`);
    
    res.json({ token });
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(401).json({ error: 'Login failed' });
  }
});

// 2. Key Management
app.post('/api/keys/generate', authenticate, authorize(['admin', 'security_analyst']), async (req, res) => {
  try {
    const { algorithm, metadata } = req.body;
    let publicKey, privateKey, encryptedPrivateKey;

    // Generate quantum-resistant key pair
    if (algorithm === 'kyber') {
      const keyPair = Kyber.keyPair();
      publicKey = keyPair.publicKey.toString('hex');
      privateKey = keyPair.privateKey.toString('hex');
    } else if (algorithm === 'dilithium') {
      const keyPair = Dilithium.keyPair();
      publicKey = keyPair.publicKey.toString('hex');
      privateKey = keyPair.privateKey.toString('hex');
    } else if (algorithm === 'aes') {
      privateKey = crypto.randomBytes(32).toString('hex');
      publicKey = crypto.createHash('sha256').update(privateKey).digest('hex');
    } else {
      return res.status(400).json({ error: 'Invalid algorithm' });
    }

    // Encrypt private key with master key
    encryptedPrivateKey = encryptWithAES(privateKey, process.env.MASTER_KEY);

    // Create key record
    const key = await Key.create({
      keyId: crypto.randomBytes(16).toString('hex'),
      publicKey,
      encryptedPrivateKey,
      algorithm,
      metadata,
      rotationDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    // Log to blockchain
    const txHash = await logToBlockchain(
      'KEY_GENERATED',
      'Key',
      key.id,
      { algorithm, keyId: key.keyId }
    );

    await AuditLog.create({
      action: 'KEY_GENERATED',
      entityType: 'Key',
      entityId: key.id,
      performedBy: req.user.id,
      details: { algorithm, keyId: key.keyId },
      blockchainTxHash: txHash
    });

    logger.info(`Key generated: ${key.keyId}`);
    res.status(201).json({
      keyId: key.keyId,
      publicKey,
      algorithm,
      expiryDate: key.expiryDate
    });
  } catch (err) {
    logger.error(`Key generation error: ${err.message}`);
    res.status(500).json({ error: 'Key generation failed' });
  }
});

app.post('/api/keys/rotate/:keyId', authenticate, authorize(['admin', 'security_analyst']), async (req, res) => {
  try {
    const { keyId } = req.params;
    const { reason } = req.body;

    const oldKey = await Key.findOne({ where: { keyId } });
    if (!oldKey) return res.status(404).json({ error: 'Key not found' });

    // Generate new key (same algorithm as old key)
    const { publicKey, encryptedPrivateKey } = await generateNewKeyPair(oldKey.algorithm);

    // Mark old key as rotated
    await oldKey.update({
      status: 'rotated',
      metadata: {
        ...oldKey.metadata,
        rotatedBy: req.user.id,
        rotationReason: reason,
        rotatedAt: new Date()
      }
    });

    // Create new key
    const newKey = await Key.create({
      keyId: crypto.randomBytes(16).toString('hex'),
      publicKey,
      encryptedPrivateKey,
      algorithm: oldKey.algorithm,
      metadata: {
        ...oldKey.metadata,
        previousKeyId: oldKey.keyId,
        rotationReason: reason
      },
      rotationDate: new Date(),
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    // Log to blockchain
    const txHash = await logToBlockchain(
      'KEY_ROTATED',
      'Key',
      newKey.id,
      { 
        oldKeyId: oldKey.keyId,
        newKeyId: newKey.keyId,
        algorithm: newKey.algorithm,
        reason 
      }
    );

    await AuditLog.create({
      action: 'KEY_ROTATED',
      entityType: 'Key',
      entityId: newKey.id,
      performedBy: req.user.id,
      details: { 
        oldKeyId: oldKey.keyId,
        newKeyId: newKey.keyId,
        algorithm: newKey.algorithm,
        reason 
      },
      blockchainTxHash: txHash
    });

    // Send alert
    await alertWebhook.send(`🔑 Key rotated: ${oldKey.keyId} → ${newKey.keyId}\nReason: ${reason}`);

    logger.info(`Key rotated: ${oldKey.keyId} → ${newKey.keyId}`);
    res.json({
      oldKeyId: oldKey.keyId,
      newKeyId: newKey.keyId,
      algorithm: newKey.algorithm,
      rotationDate: newKey.rotationDate
    });
  } catch (err) {
    logger.error(`Key rotation error: ${err.message}`);
    res.status(500).json({ error: 'Key rotation failed' });
  }
});

// 3. AI Anomaly Detection
app.post('/api/anomaly/detect', authenticate, authorize(['admin', 'security_analyst']), async (req, res) => {
  try {
    const { logs } = req.body;
    
    // In a real implementation, this would call your ML model
    const anomalyScore = analyzeLogsForAnomalies(logs);
    
    if (anomalyScore > process.env.ANOMALY_THRESHOLD) {
      // Trigger automatic key rotation for affected keys
      const affectedKeys = await Key.findAll({
        where: { status: 'active' },
        order: [['rotationDate', 'ASC']], // Rotate oldest keys first
        limit: 3
      });

      const rotationResults = await Promise.all(
        affectedKeys.map(key => 
          rotateKeyAutomatically(key.keyId, 'High anomaly score detected')
        )
      );

      // Send critical alert
      await alertWebhook.send(`🚨 CRITICAL: High anomaly score detected (${anomalyScore.toFixed(2)}). Rotated ${rotationResults.length} keys.`);

      logger.warn(`Anomaly detected (score: ${anomalyScore}). Rotated ${rotationResults.length} keys.`);
      res.json({
        anomalyScore,
        action: 'key_rotation_triggered',
        rotatedKeys: rotationResults.map(r => r.newKeyId)
      });
    } else {
      res.json({
        anomalyScore,
        action: 'none',
        message: 'No significant anomalies detected'
      });
    }
  } catch (err) {
    logger.error(`Anomaly detection error: ${err.message}`);
    res.status(500).json({ error: 'Anomaly detection failed' });
  }
});

// 4. Audit Logs
app.get('/api/audit/logs', authenticate, authorize(['admin', 'auditor']), async (req, res) => {
  try {
    const { page = 1, limit = 20, action, entityType } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;

    const logs = await AuditLog.findAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: User, attributes: ['email', 'role'] }]
    });

    const total = await AuditLog.count({ where });

    res.json({
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    logger.error(`Audit log fetch error: ${err.message}`);
    res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

// 5. System Monitoring
app.get('/api/system/status', authenticate, async (req, res) => {
  try {
    const activeKeys = await Key.count({ where: { status: 'active' } });
    const rotatedKeys = await Key.count({ where: { status: 'rotated' } });
    const lastAnomaly = await AuditLog.findOne({
      where: { action: 'ANOMALY_DETECTED' },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      status: 'operational',
      keys: { active: activeKeys, rotated: rotatedKeys },
      lastAnomaly: lastAnomaly?.details || null,
      blockchain: {
        network: process.env.ETHEREUM_NETWORK,
        lastBlock: await provider.getBlockNumber()
      }
    });
  } catch (err) {
    logger.error(`System status check error: ${err.message}`);
    res.status(500).json({ error: 'Failed to check system status' });
  }
});

// Helper functions (would be in separate files in a real project)
async function generateNewKeyPair(algorithm) {
  let publicKey, privateKey;

  if (algorithm === 'kyber') {
    const keyPair = Kyber.keyPair();
    publicKey = keyPair.publicKey.toString('hex');
    privateKey = keyPair.privateKey.toString('hex');
  } else if (algorithm === 'dilithium') {
    const keyPair = Dilithium.keyPair();
    publicKey = keyPair.publicKey.toString('hex');
    privateKey = keyPair.privateKey.toString('hex');
  } else if (algorithm === 'aes') {
    privateKey = crypto.randomBytes(32).toString('hex');
    publicKey = crypto.createHash('sha256').update(privateKey).digest('hex');
  } else {
    throw new Error('Unsupported algorithm');
  }

  const encryptedPrivateKey = encryptWithAES(privateKey, process.env.MASTER_KEY);
  return { publicKey, encryptedPrivateKey };
}

function analyzeLogsForAnomalies(logs) {
  // Simplified anomaly detection - in reality this would use your ML model
  const suspiciousPatterns = [
    'unauthorized access',
    'brute force',
    'failed login',
    'injection attempt'
  ];

  const suspiciousLogs = logs.filter(log => 
    suspiciousPatterns.some(pattern => 
      log.message.toLowerCase().includes(pattern)
    )
  );

  // Calculate a fake anomaly score based on suspicious logs
  const score = Math.min(1, suspiciousLogs.length / 10);
  return parseFloat(score.toFixed(2));
}

async function rotateKeyAutomatically(keyId, reason) {
  const oldKey = await Key.findOne({ where: { keyId } });
  if (!oldKey) throw new Error('Key not found');

  const { publicKey, encryptedPrivateKey } = await generateNewKeyPair(oldKey.algorithm);

  await oldKey.update({ status: 'rotated' });

  const newKey = await Key.create({
    keyId: crypto.randomBytes(16).toString('hex'),
    publicKey,
    encryptedPrivateKey,
    algorithm: oldKey.algorithm,
    metadata: {
      ...oldKey.metadata,
      previousKeyId: oldKey.keyId,
      rotationReason: reason,
      automated: true
    },
    rotationDate: new Date(),
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });

  const txHash = await logToBlockchain(
    'AUTO_KEY_ROTATED',
    'Key',
    newKey.id,
    { 
      oldKeyId: oldKey.keyId,
      newKeyId: newKey.keyId,
      reason 
    }
  );

  await AuditLog.create({
    action: 'AUTO_KEY_ROTATED',
    entityType: 'Key',
    entityId: newKey.id,
    performedBy: null, // System action
    details: { 
      oldKeyId: oldKey.keyId,
      newKeyId: newKey.keyId,
      reason 
    },
    blockchainTxHash: txHash
  });

  return { oldKeyId: oldKey.keyId, newKeyId: newKey.keyId };
}

// Start server
const PORT = process.env.PORT || 3001;
sequelize.sync()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Rotarix backend running on port ${PORT}`);
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    logger.error(`Database connection failed: ${err.message}`);
    console.error('Database connection failed:', err);
    process.exit(1);
  });

module.exports = app;