# Rotarix - AI Driven Automated Cryptographic Key Rotation with Blockchain Auditing

## Overview
Rotarix is a cryptographic key management and rotation system designed to enhance security through automated key lifecycle management. It integrates **quantum-resistant key generation, blockchain-based audit logging, AI-driven threat detection, and fine-grained access control.**

## Project Structure

### 1. Frontend - Rotarix Dashboard
#### Key Pages & Features
- **Authentication & Access Control**
  - Login Page (MFA-secured authentication)
  - Multi-Factor Authentication (OTP-based or Authenticator app)
  - Password reset & account recovery
- **User Management (Admins only)**
  - Add/Edit/Delete Users
  - Role-Based Access Control (RBAC) with roles: Admin, Security Analyst, Auditor
- **Dashboard (Main Page)**
  - System Security Score (Risk rating based on threats)
  - Key Rotation Status (Last rotation timestamp, next scheduled rotation)
  - Real-Time Threat Alerts (Live notifications on detected security risks)
- **Live System Monitoring**
  - AI-based Anomaly Detection Logs (Flagged security incidents)
  - Graphical Trends (Past rotations, threat levels)
  - Log Sources & Health Status (Connected SIEMs, Cloud Logs, etc.)
- **Key Management**
  - Display all active cryptographic keys (AES, RSA, Kyber, etc.)
  - Key expiration & usage tracking
  - Auto-Rotation (On/Off toggle)
  - Manual Key Rotation (Immediate key change trigger)
  - Rotation Frequency Settings (Daily, Weekly, Monthly, Custom)
  - Quantum-Resistant Key Generation (Kyber, Dilithium, Falcon)
  - Download/Export Public Keys
- **Blockchain Audit Logs**
  - View immutable logs (Hyperledger/Ethereum-based event tracking)
  - Timestamped event history
  - Tamper-proof verification
  - Log Filtering & Search by time, severity, key type, user
  - Smart Contract Details (Deployed contract address, query transactions)
- **Security Alerts & Notifications**
  - Incident Response Panel (AI-detected high-risk incidents, unauthorized key access attempts, AI confidence score)
  - Admin Notifications (Email & Slack Alerts for key rotations, anomalies, in-dashboard critical alerts)
  - Audit Reports (Download compliance reports: PCI-DSS, GDPR, HIPAA; generate security logs in CSV, JSON, PDF)
- **Settings & Integrations**
  - SIEM & Cloud Log Integrations (AWS, Azure, Splunk, ELK, HashiCorp Vault)
  - Encryption algorithm selection
  - API keys for external services
  - Role-Based Access Control (RBAC) permissions for Admins, Security Analysts, and Auditors
  - Webhooks for external event triggers

---

### 2. Backend - API & Key Management
#### Core Functionalities
- **Key Lifecycle Management**
  - Generate, store, retrieve, and delete cryptographic keys securely
  - Support for AES, RSA, ECC, Kyber, Dilithium, Falcon
- **Automated Key Rotation**
  - Periodic rotation (customizable schedule)
  - Manual trigger via API or Dashboard
- **Encryption & Decryption Services**
  - Secure encryption API for applications
  - Decryption validation with access control
- **Access Control & Authentication**
  - JWT-based authentication
  - RBAC enforcement on API endpoints
  - MFA enforcement for critical operations
- **Threat Detection & AI Monitoring**
  - AI-driven anomaly detection for key access patterns
  - Unauthorized access alerts

---

### 3. Security & Compliance
- **Hardware Security Module (HSM) Integration**
  - Secure key storage and management
  - Support for AWS CloudHSM, Azure Key Vault, Google Cloud KMS
- **Quantum-Resistant Cryptography**
  - Implementation of NIST post-quantum algorithms
- **Tamper-Proof Logging**
  - Immutable blockchain-based logging
- **Regulatory Compliance**
  - Meets PCI-DSS, GDPR, HIPAA, and NIST standards

---

### 4. Blockchain Audit Logging
- **Smart Contract for Key Events**
  - Stores key generation, rotation, and access logs
- **Immutable Event History**
  - Ensures tamper-proof compliance logs
- **Integration with Hyperledger/Ethereum**
  - Blockchain transactions for security audit

---

### 5. Deployment & Infrastructure
- **Dockerized Microservices**
  - Containerized backend, frontend, and monitoring tools
- **CI/CD Pipeline**
  - Automated testing and deployment using GitHub Actions
- **Cloud Integration**
  - Supports AWS, Azure, GCP for HSM, logging, and AI models

---

### 6. API Documentation
- **RESTful API Endpoints**
  - Key Management (Create, Rotate, Retrieve, Delete)
  - Audit Logs (Retrieve, Search, Export)
  - User Access (Authentication, Role Management)
  - Threat Detection (Incident Logs, Anomaly Reports)
- **GraphQL Support (Optional)**
  - Efficient querying for frontend integration
---

## Research Paper
Our project is supported by our research paper on **AI-Driven Automated Cryptographic Key Management**, which details the methodologies, implementation, and security enhancements of Rotarix. 

📄 **Read the paper here**: [AI-Driven Automated Cryptographic Key Management](https://drive.google.com/file/d/1UO27A1JvB3JkQxTKJKWy8plL_xsCwA5u/view?usp=sharing)

---
## Demo Video  
🔗 **Watch the full demo here:** [https://youtu.be/t-4hM0UX-OE](https://youtu.be/t-4hM0UX-OE)  
---

## Getting Started

### Prerequisites
- Node.js (Frontend)
- Python (Backend API)
- Docker (For deployment)
- PostgreSQL (Database)
- Redis (Caching layer)

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/fromjyce/rotarix.git
   cd rotarix
   ```
2. Install dependencies
   ```bash
   cd frontend && npm install
   cd ../backend && pip install -r requirements.txt
   ```

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any questions or contributions, feel free to contact:

### Developed by Team JNR
- **Jayashre**  
  - Email: jaya2004kra@gmail.com  
  - GitHub: [fromjyce](https://github.com/fromjyce)
- **Nidhi Gummaraju**  
  - Email: nidhigumm05@gmail.com  
  - GitHub: [Nidhi045](https://github.com/Nidhi045)
- **Roahith R**  
  - Email: roahith11@gmail.com  
  - GitHub: [Roahr](https://github.com/Roahr)
