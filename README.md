# EcoBin

EcoBin is a smart waste-classification system that uses a laptop camera, an AI model, and an ESP32-controlled bin system. It can classify waste, trigger the correct bin servo, and report fill levels and status to Firebase and a monitoring dashboard.

## Project overview

- Python backend for AI classification and controller logic
- ESP32 integration over the same Wi-Fi network
- Firebase Firestore support for waste records and status updates
- Next.js dashboard for bin monitoring, alerts, settings, and history

## Requirements

- Python 3.12
- Node.js 18+ and npm
- An ESP32 on the same local Wi-Fi network as the laptop
- The trained model file `waste_classifier.keras` and `class_names.json` in the project root

## Python setup

Create and activate a virtual environment, then install the Python dependencies:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Copy `.env.example` to `.env` and configure the ESP32 address and Firebase settings as needed.

## Firebase / Firestore

EcoBin stores each AI classification in the `waste_records` collection and keeps the latest ESP32 state in `esp32_status/current`.

In Firebase Console, create a Cloud Firestore database, then open Project settings > Service accounts and generate a private key. In `.env`, provide:

```text
FIREBASE_SERVICE_ACCOUNT_FILE=your-downloaded-service-account.json
```

No database URL is needed for Firestore. Never commit `.env` or the downloaded private-key file. An inline `FIREBASE_SERVICE_ACCOUNT_JSON` is also supported when a file cannot be used. After starting the server, visit `http://127.0.0.1:5000/firebase-status` to verify the connection.

## ESP32 Vercel reporting

`esp32_ecobin_vercel.ino` replaces the Blynk firmware. Copy `secrets.example.h` to `secrets.h`, set the Wi-Fi details, your deployed Vercel URL, and a long random `VERCEL_DEVICE_TOKEN`. Set the same token as `ESP32_DEVICE_TOKEN` in this project's local `.env` and in the Vercel project's environment variables.

The Vercel endpoint is `POST /device-status`; it checks the `X-Device-Token` header and writes the latest values to `esp32_status/current` in Firestore.

## Run the Python services

Start the Flask AI server in one terminal:

```powershell
python ecobin_server.py
```

Then start the camera client in another terminal:

```powershell
python camera_ecobin.py
```

You can verify ESP32 connectivity without moving a servo by opening:

```text
http://<ESP32_IP>/status
```

## Next.js dashboard

This project also includes a Next.js dashboard for monitoring bins, alerts, settings, and alerts history.

Install the frontend dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Security

Do not commit Wi-Fi passwords, Blynk tokens, or other device secrets. Keep ESP32 credentials in a local `secrets.h` file, which is ignored by Git.

## Learn more

This project is configured as a Next.js app for the frontend and a Python backend for the waste-classification system. For the frontend stack, refer to the standard Next.js docs and deployment guidance.

