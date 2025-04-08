# Rotarix API Documentation

## 📁 Directory Structure
```
backend/
├── node_modules/          # Node.js dependencies
├── ml_training.ipynb      # Jupyter notebook for ML model training
├── server.js              # Main Node.js/Express application
├── simulator.py           # Threat scenario simulation script
├── package.json           # Node.js project configuration
└── package-lock.json      # Dependency lock file
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- Python 3.9+ (for ML components)
- PostgreSQL 14+
- Ethereum node (or Infura API key)

### Installation
```bash
# Install Node.js dependencies
npm install

# Install Python requirements (for simulator)
pip install pandas scikit-learn xgboost tensorflow faker
```

### Running the System
```bash
# Start Node.js server
npm start

# Run threat simulation (separate terminal)
python simulator.py
```

## 🔧 Key Components

### 1. Core Services
| File | Purpose |
|------|---------|
| `server.js` | Main API server with endpoints for:<br>• Key management<br>• Authentication<br>• Blockchain logging<br>• System monitoring |
| `package.json` | Defines:<br>• Dependencies (Express, Ethers.js, etc)<br>• Scripts (`start`, `test`) |

### 2. Machine Learning
| File | Purpose |
|------|---------|
| `ml_training.ipynb` | Trains hybrid anomaly detection models:<br>• Isolation Forest<br>• Random Forest<br>• LSTM neural network |
| `simulator.py` | Generates synthetic attack scenarios for testing |

## 🌐 API Endpoints

### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user (admin/auditor) |
| `/api/auth/login` | POST | JWT token generation |

### Key Management
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/keys/generate` | POST | Create new quantum-resistant key |
| `/api/keys/rotate/:keyId` | POST | Rotate specific key |

### Threat Detection
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/anomaly/detect` | POST | Process logs for risk scoring |

### Blockchain Audit
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/audit/logs` | GET | Retrieve tamper-proof logs |

## 🛠️ Development

### Testing
```bash
npm test  # Runs API tests (TODO: Add test suite)
```

### Deployment
1. **Production**:
```bash
npm run build && npm start
```

2. **Docker**:
```dockerfile
FROM node:18-alpine
COPY . /app
WORKDIR /app
RUN npm install --production
EXPOSE 3001
CMD ["node", "server.js"]
```

## 📊 Monitoring
Access real-time metrics at:
- `http://localhost:3001/api/system/status`

## 📜 License
Apache 2.0 (See [LICENSE](LICENSE))

---