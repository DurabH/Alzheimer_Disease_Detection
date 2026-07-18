# 🧠 Multimodal Early Alzheimer's Disease Detection System

[![Vite](https://img.shields.io/badge/Frontend-Vite%20%2F%20React%2019-646CFF?style=flat-for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?style=flat-for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/ML%20Service-FastAPI%20%2F%20Python-009688?style=flat-for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![TensorFlow](https://img.shields.io/badge/Deep%20Learning-TensorFlow%202.15-FF6F00?style=flat-for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat-for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Deployment-Docker%20Container-2496ED?style=flat-for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

An enterprise-ready, dual-path, microservices-based medical diagnostic platform that fuses **Deep Computer Vision** (Structural Brain MRI Analysis) with **Cognitive Assessments** (standardized 30-item clinical questionnaire) to predict early-stage Alzheimer's Disease with clinical precision.

---

## 🔗 Live Deployments & Interactive Demos

The platform is deployed live across highly optimized cloud environments, demonstrating production-ready containerized microservices and serverless infrastructure:

| Component | Platform | Deployment URL / Live Link | Technical Details |
| :--- | :--- | :--- | :--- |
| **Frontend UI Client** | **Vercel** | [Live Web Dashboard](https://alzheimer-disease-detection-three.vercel.app/) | React 19 Single Page Application, responsive layout, fluid Framer Motion animations. |
| **API Gateway & Orchestrator** | **Vercel Serverless** | [API Gateway Endpoint](https://alzheimer-disease-detection-three.vercel.app/api) | Node.js Serverless runtime, connection caching to MongoDB Atlas cluster, secure JWT-based RBAC. |
| **ML Inference Service** | **Hugging Face Spaces** | [FastAPI ML Container](https://huggingface.co/) | Docker Container running Python, FastAPI, and TensorFlow with model warm-up on launch. |

---

## 🧠 Multimodal Diagnostic Fusion (The Engineering Core)

Traditional computer vision pipelines for Alzheimer's focus exclusively on **MRI scans**. However, structural atrophy (detected on MRI) may lag behind functional/cognitive decline, or vice-versa. 

To achieve optimal diagnostic sensitivity, this project implements a **Late Feature Fusion Neural Network** that integrates structural visual features with cognitive tabular indicators:

```text
  [ MRI Scan (128x128x1) ] ---> [ InceptionV3 + MobileNet Transfer Learning ] 
                                                      |
                                           [ AttentionPooling Layer ]
                                                      |
                                            (Feature Vector v_mri)
                                                      |
                                                      v
                                             [ Concatenation ] <--- (30-dim Cognitive Vector v_cog)
                                                      |
                                                      v
                                             [ Fusion MLP Network ]
                                                      |
                                                      v
                                            [ 4-Class Softmax ]
                                        (AD, CN, EMCI, LMCI Predictions)
```

### Technical Model Breakdown:
1. **The Visual Branch (MRI)**: Processed brain MRI scans are fed into an ensemble attention model utilizing **InceptionV3** and **MobileNet** features. A custom `@tf.keras.utils.register_keras_serializable()` **AttentionPooling** layer learns spatial attention-weighted scores across the image and pools them to extract a robust feature vector representing structural brain health.
2. **The Cognitive Branch (MMSE)**: A 30-dimensional binary vector representing clinical cognitive symptoms is processed through a dense Multi-Layer Perceptron (MLP).
3. **The Late Fusion Layer**: The visual feature embedding and cognitive assessment vector are concatenated and passed through a final multi-stage classification dense layer, predicting across 4 critical diagnostic categories with comprehensive confidence meters:
   - **AD** (*Alzheimer's Disease / Demented*)
   - **CN** (*Cognitive Normal / Healthy Control*)
   - **EMCI** (*Early Mild Cognitive Impairment*)
   - **LMCI** (*Late Mild Cognitive Impairment*)

---

### 🚦 Processing Path Flexibility:
*   **Synchronous Path (`USE_ASYNC=false`)**: The Express API receives client requests, issues a direct HTTP POST request to the FastAPI ML service, awaits the response, and returns the diagnostic report. Ideal for straightforward local deployments.
*   **Asynchronous Scalable Path (`USE_ASYNC=true`)**: Under production loads, the API Gateway immediately offloads incoming MRI and Cognitive assessments to a **Redis-backed BullMQ Queue**, returning a `pending` ticket to the client. A dedicated, horizontally scalable background **Worker process** (`prediction.worker.js`) consumes the queue, handles the API payload, sends it to the ML Microservice, and updates MongoDB. The client updates in real-time via status polling.
*   **Auto-Fallback Safe Mode (`SAFE_MODE=true`)**: If async mode is configured but the Redis connection experiences an unexpected outage, the API Gateway dynamically catches the error, downgrades to synchronous HTTP transmission, and proceeds to deliver the result without service disruption.

---

## 💻 Tech Stack & Engineering Highlights

### Frontend
*   **Core**: React 19, React Router Dom v7, Context API (modular global state management).
*   **UX/Aesthetics**: TailwindCSS (modern, clinical-grade minimal UI/UX), Framer Motion (fluid interactive feedback and smooth micro-interactions), and Lucide React.
*   **Data Visualization**: Recharts (interactive visual feedback for confidence levels and multi-class probability metrics).
*   **Document Generation**: jsPDF & jsPDF-AutoTable (instantly compiles diagnostic results, clinician notes, and patient details into beautiful, downloadable medical PDF reports).

### Backend (Orchestration & Gateway)
*   **Core**: Node.js, Express.js, MongoDB + Mongoose (Strict schema design).
*   **Queue Management**: BullMQ & ioredis (High-throughput redis queue).
*   **Authentication & AuthZ**: JWT token authentication with customized middleware for role-based access control (RBAC: `patient`, `clinician`, `admin`), and passport-google-oauth20 for Google Social OAuth.
*   **Physical Media Handling**: Multer for Multi-Part MRI processing. The upload pipeline is completely abstract and cloud-ready, supporting relative-path local uploads alongside dynamic adapters for Cloudinary and AWS S3 out of the box.
*   **Winston Structured Logging**: Production logging separated into level-specific files (`error.log`, `combined.log`) with custom formats for easy debugging and ingestion.

### Machine Learning Service
*   **Core**: Python 3.10, FastAPI, Uvicorn (Asynchronous Python Server), OpenCV, NumPy, Pillow, TensorFlow 2.15.
*   **ML Singleton Architecture**: Models are loaded once into memory on application startup.
*   **Compilation Warm-Up**: Triggers a dummy prediction (`warm_up()`) with empty tensors during the lifespan setup phase. This compiles the TensorFlow graph beforehand so that real patient queries are evaluated in sub-second response times.

---

## 🛡 Security & Production-Ready Hardening

The system employs rigorous enterprise-grade security middleware:
*   **Helmet.js**: Configured with strict custom Content Security Policies (CSP) to block Cross-Site Scripting (XSS), Clickjacking, and packet sniffing.
*   **Rate Limiters**: Express Rate Limit applied dynamically with separate buckets for standard endpoints and file upload routes, preventing Denial of Service (DoS) attacks.
*   **Data Sanitization**: `express-mongo-sanitize` sanitizes inputs against NoSQL injection vectors, and `xss-clean` purges raw user HTML/JS injections.
*   **HTTP Parameter Pollution (HPP)**: Prevents query parameter manipulation in complex database search queries.
*   **Serverless DB Connection Caching**: Specifically handles connection pools in serverless deployment platforms (like Vercel) by caching and reusing the MongoDB Atlas mongoose instance, preventing database connection exhaustion during traffic bursts.

---

## 📂 Repository Layout

```text
ALZHEIMER-DETECTION/
├── backend/                    # Node.js Express API Gateway & Orchestrator
│   ├── api/                    # Serverless handler index (Vercel entrypoint)
│   ├── src/                    # Primary application codebase
│   │   ├── config/             # DB, Logger, Redis connection logic
│   │   ├── middleware/         # Security, rate limiters, upload processors, RBAC
│   │   ├── modules/            # Domain-driven backend modules (Auth, Upload, Results)
│   │   └── utils/              # AppError, Email templates, ML Client REST handlers
│   └── workers/                # Dedicated background consumer thread for BullMQ
├── frontend/                   # React 19 Frontend SPA (Vite)
│   ├── public/                 # Static assets & fallbacks
│   └── src/                    # Core React application
│       ├── components/         # Modular layout, forms, visual feedback sections
│       ├── context/            # AuthContext, ToastContext (State managers)
│       ├── pages/              # Cognitive assessment, patient dashboard, admin panel
│       └── utils/              # API wrapper services
├── ml_service/                 # FastAPI Python Inference Engine
│   ├── models/                 # Pre-trained visual attention & cognitive fusion models
│   ├── services/               # Grayscale preprocessing, feature extraction, predictions
│   ├── Dockerfile              # Hugging Face deployment container configuration
│   └── main.py                 # FastAPI application & startup lifespan lifecycle
├── PROJECT_OVERVIEW.md         # In-depth architectural detail overview
├── DOCUMENTATION.md           # Developer setup, async mode, and deployment checklists
├── Alzheimer_Disease_Detection_CS_Mubariz_Rehman.pdf    # Full thesis research paper
├── Alzheimer_Disease_Detection_CS_Mubariz_Rehman.pptx   # Defense slide-deck
└── README.md                   # Highly-detailed general project profile
```

---

## ⚙ Local Installation & Running Guide

### 1. Prerequisites
Ensure you have the following installed:
*   **Node.js** (v18 or v20 Recommended)
*   **Python** (3.9 to 3.11)
*   **MongoDB** (Local instance or MongoDB Atlas account)
*   **Redis** (Optional, required for BullMQ Asynchronous processing mode)

### 2. Backend Gateway Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the environment files:
   Create a `.env` file in the root of the `/backend` folder based on `.env.example`:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_cryptographically_secure_jwt_secret_key
   USE_ASYNC=false # Set to true to enable BullMQ / Redis
   REDIS_URL=redis://127.0.0.1:6379
   ML_SERVICE_URL=http://localhost:7860
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 3. ML Service Setup
1. Navigate to the ML service directory:
   ```bash
   cd ../ml_service
   ```
2. Create and activate a Python virtual environment:
   ```bash
   # Windows
   python -m venv venv
   .\venv\Scripts\activate

   # macOS/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install core packages:
   ```bash
   pip install -r requirements.txt
   ```
4. Launch the FastAPI server:
   ```bash
   python main.py
   ```
   *The service will warm up the models and bind to `http://localhost:7860`.*

### 4. Frontend UI Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Launch Vite development server:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:5173` in your browser to interact with the system.*

---

## 🎓 Academic Thesis Research Background

For detailed coverage of the underlying scientific models, clinical dataset metrics (derived from ADNI), performance reviews, and theoretical foundations of late feature fusion, please review the academic assets included at the root of the project:

*   **[`Alzheimer_Disease_Detection_CS_Mubariz_Rehman.pdf`](./Alzheimer_Disease_Detection_CS_Mubariz_Rehman.pdf)**: Complete written research paper detailing model formulation, performance metrics, and clinical evaluations.
*   **[`Alzheimer_Disease_Detection_CS_Mubariz_Rehman.pptx`](./Alzheimer_Disease_Detection_CS_Mubariz_Rehman.pptx)**: Project presentation slides summarizing architecture, methodology, results, and thesis defence.
*   **[`Alzheimer_Disease_Detection_CS_Mubariz_Rehman.docx`](./Alzheimer_Disease_Detection_CS_Mubariz_Rehman.docx)**: Raw document containing full thesis drafts and extensive literature reviews.

---

*This system was meticulously designed to demonstrate modern microservices-inspired engineering, secure serverless design, cloud-ready file-handling, and practical deep-learning deployments.*
