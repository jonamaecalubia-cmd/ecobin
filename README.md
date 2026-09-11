# EcoBin

EcoBin classifies waste from a laptop camera and sends the selected bin command to an ESP32 over the local network. The ESP32 controls the servo lids and reports bin fill levels through Blynk.

## Requirements

- Python 3.12
- An ESP32 connected to the same local Wi-Fi network as the laptop
- ESP32 firmware that exposes `GET /classify?type=...` and `GET /status`
- The trained `waste_classifier.keras` model and `class_names.json` in the project root

## Setup

Create and activate a virtual environment, then install the dependencies:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Copy `.env.example` to `.env`, then set `ESP32_IP` to the address printed by
the ESP32 Serial Monitor. The laptop and ESP32 must be on the same non-guest
Wi-Fi network with client/AP isolation disabled.

## Cloud Firestore

EcoBin adds each AI classification to the `waste_records` collection and stores
the latest ESP32 status in `esp32_status/current`. In Firebase Console, create
a **Cloud Firestore** database, then open **Project settings > Service
accounts** and generate a new private key. In `.env`, provide:

```text
FIREBASE_SERVICE_ACCOUNT_FILE=your-downloaded-service-account.json
```

No database URL is needed for Firestore. Never commit `.env` or the downloaded
private-key file. An inline `FIREBASE_SERVICE_ACCOUNT_JSON` is also supported
when a file cannot be used. After starting the server, visit
`http://127.0.0.1:5000/firebase-status` to verify the connection. Without the
credential, local camera and ESP32 operation continues normally.

## ESP32 Vercel reporting

`esp32_ecobin_vercel.ino` replaces the Blynk firmware. Copy
`secrets.example.h` to `secrets.h`, set the Wi-Fi details, your deployed Vercel
URL, and a long random `VERCEL_DEVICE_TOKEN`. Set the same token as
`ESP32_DEVICE_TOKEN` in this project's local `.env` and in the Vercel project's
environment variables. The Vercel endpoint is `POST /device-status`; it checks
the `X-Device-Token` header and writes the latest values to
`esp32_status/current` in Firestore.

## Run

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

## Security

Do not commit Wi-Fi passwords, Blynk tokens, or other device secrets. Keep ESP32 credentials in a local `secrets.h` file, which is ignored by Git.
