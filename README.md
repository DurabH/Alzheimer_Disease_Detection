# Alzheimer Disease Detection System (Multimodal)

A sophisticated medical diagnosis platform for early detection of Alzheimer's Disease using MRI scans and Cognitive Assessment.

## 🔗 Quick Links
- **Detailed Documentation:** [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- **Technical Architecture:** [DOCUMENTATION.md](./DOCUMENTATION.md)

## 🌟 Key Features
- **Multimodal AI:** Combined MRI (Deep Learning) + Cognitive Test analysis.
- **Microservices:** Decoupled Node.js backend and Python FastAPI ML service.
- **Real-time:** Live prediction tracking with confidence meters.
- **Secure:** Role-based access control, JWT, and encrypted sessions.

## 🛠 Tech Stack
- **Frontend:** React 19, TailwindCSS, Framer Motion, Recharts.
- **Backend:** Node.js, Express, MongoDB, Redis (BullMQ).
- **Machine Learning:** Python, TensorFlow/Keras, InceptionV3, MobileNet.

## 🚀 How to Run
1.  **Backend:** `cd backend && npm install && npm run dev`
2.  **Frontend:** `cd frontend && npm install && npm run dev`
3.  **ML Service:** `cd ml_service && pip install -r requirements.txt && python main.py`

---
*Developed for medical research and early diagnostic support.*

===================================

{"level":"warn","message":"Operational error: Cannot find GET /","service":"alzheimer-api","timestamp":"2026-07-04 16:24:17"}
{"level":"info","message":"103.113.103.163 - - [04/Jul/2026:16:24:17 +0000] \"GET / HTTP/1.1\" 404 57 \"https://huggingface.co/\" \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36\"","service":"alzheimer-api","timestamp":"2026-07-04 16:24:17"}
{"level":"warn","message":"Operational error: Cannot find GET /","service":"alzheimer-api","timestamp":"2026-07-04 16:24:18"}
{"level":"info","message":"103.113.103.163 - - [04/Jul/2026:16:24:18 +0000] \"GET / HTTP/1.1\" 404 57 \"https://huggingface.co/\" \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36\"","service":"alzheimer-api","timestamp":"2026-07-04 16:24:18"}
{"level":"info","message":"Auth success","method":"GET","service":"alzheimer-api","timestamp":"2026-07-04 16:24:26","url":"/api/auth/me","userId":"6a0bf475f4a8f75f7594f762"}
{"level":"info","message":"103.113.103.163 - - [04/Jul/2026:16:24:26 +0000] \"GET /api/auth/me HTTP/1.1\" 304 - \"https://alzheimer-disease-detection-three.vercel.app/\" \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36\"","service":"alzheimer-api","timestamp":"2026-07-04 16:24:26"}
{"level":"info","message":"Processing contact form submission from: 46614@students.riphah.edu.pk","service":"alzheimer-api","timestamp":"2026-07-04 16:24:37"}
{"level":"info","message":"Attempting to send email using API Key starting with: xsmt...","service":"alzheimer-api","timestamp":"2026-07-04 16:24:38"}
{"data":{"code":"unauthorized","message":"Key not found"},"level":"error","message":"Brevo API Email failed: Key not found","service":"alzheimer-api","status":401,"timestamp":"2026-07-04 16:24:38"}
{"error":"Email delivery failed: Key not found","level":"warn","message":"Email notification failed for contact form, but record was saved to DB","service":"alzheimer-api","timestamp":"2026-07-04 16:24:38"}
{"from":"46614@students.riphah.edu.pk","id":"6a4933c5cf76cebf148940d0","level":"info","message":"Contact form submitted and saved to DB","service":"alzheimer-api","timestamp":"2026-07-04 16:24:38","userId":"6a0bf475f4a8f75f7594f762"}
{"level":"info","message":"103.113.103.163 - - [04/Jul/2026:16:24:38 +0000] \"POST /api/contact HTTP/1.1\" 201 406 \"https://alzheimer-disease-detection-three.vercel.app/\" \"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36\"","service":"alzheimer-api","timestamp":"2026-07-04 16:24:38"}