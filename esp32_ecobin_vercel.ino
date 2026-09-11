/* EcoBin ESP32 firmware — local servo API + Vercel dashboard reporting.
   Copy secrets.example.h to secrets.h before uploading. This replaces Blynk.
   Laptop API: GET /status and GET /classify?type=BIODEGRADABLE|RECYCLABLE|RESIDUAL */

#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <HTTPClient.h>
#include <WebServer.h>
#include <ESP32Servo.h>
#include "secrets.h"

WebServer server(80);
#define TRIG1 5
#define ECHO1 18
#define TRIG2 19
#define ECHO2 21
#define TRIG3 22
#define ECHO3 23
#define SERVO1_PIN 13
#define SERVO2_PIN 14
#define SERVO3_PIN 27
#define BUZZER_PIN 26

const float BIN_HEIGHT_CM = 30.0;
const unsigned long REPORT_INTERVAL_MS = 15000;
const int WARNING_LEVEL = 70;
const int FULL_LEVEL = 90;
Servo servo1, servo2, servo3;
int fill1 = 0, fill2 = 0, fill3 = 0;
unsigned long lastReportAt = 0;

float readDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW); delayMicroseconds(2);
  digitalWrite(trigPin, HIGH); delayMicroseconds(10); digitalWrite(trigPin, LOW);
  unsigned long duration = pulseIn(echoPin, HIGH, 30000);
  return duration ? duration * 0.0343f / 2.0f : -1;
}

int calculateFill(float distance) {
  if (distance < 0) return 0;
  return constrain((int)(((BIN_HEIGHT_CM - distance) / BIN_HEIGHT_CM) * 100.0f), 0, 100);
}

String binStatus(int fill) {
  if (fill >= FULL_LEVEL) return "FULL";
  if (fill >= WARNING_LEVEL) return "WARNING";
  return "NORMAL";
}

void updateFillLevels() {
  fill1 = calculateFill(readDistance(TRIG1, ECHO1));
  fill2 = calculateFill(readDistance(TRIG2, ECHO2));
  fill3 = calculateFill(readDistance(TRIG3, ECHO3));
}

String statusJson() {
  return "{\"biodegradable\":" + String(fill1) + ",\"recyclable\":" + String(fill2) +
         ",\"residual\":" + String(fill3) + ",\"status1\":\"" + binStatus(fill1) +
         "\",\"status2\":\"" + binStatus(fill2) + "\",\"status3\":\"" + binStatus(fill3) + "\"}";
}

void reportToVercel() {
  if (WiFi.status() != WL_CONNECTED) return;
  WiFiClientSecure client;
  // Vercel uses HTTPS. Replace this with its root CA certificate for production.
  client.setInsecure();
  HTTPClient http;
  http.setTimeout(8000);
  if (!http.begin(client, VERCEL_DEVICE_STATUS_URL)) return;
  http.addHeader("Content-Type", "application/json");
  http.addHeader("X-Device-Token", VERCEL_DEVICE_TOKEN);
  int code = http.POST(statusJson());
  Serial.printf("Vercel status report: HTTP %d\n", code);
  http.end();
}

void openServo(Servo &servo) { servo.write(90); delay(1000); servo.write(0); }

void handleClassify() {
  if (!server.hasArg("type")) { server.send(400, "application/json", "{\"ok\":false,\"error\":\"Missing type\"}"); return; }
  String type = server.arg("type"); type.toUpperCase();
  if (type == "BIODEGRADABLE") {
    if (fill1 >= FULL_LEVEL) { server.send(409, "application/json", "{\"ok\":false,\"message\":\"Biodegradable bin is full\"}"); return; }
    openServo(servo1);
  } else if (type == "RECYCLABLE") {
    if (fill2 >= FULL_LEVEL) { server.send(409, "application/json", "{\"ok\":false,\"message\":\"Recyclable bin is full\"}"); return; }
    openServo(servo2);
  } else if (type == "RESIDUAL") {
    if (fill3 >= FULL_LEVEL) { server.send(409, "application/json", "{\"ok\":false,\"message\":\"Residual bin is full\"}"); return; }
    openServo(servo3);
  } else { server.send(400, "application/json", "{\"ok\":false,\"error\":\"Invalid type\"}"); return; }
  reportToVercel();
  server.send(200, "application/json", "{\"ok\":true,\"message\":\"Servo command completed\"}");
}

void setup() {
  Serial.begin(115200);
  pinMode(TRIG1, OUTPUT); pinMode(ECHO1, INPUT); pinMode(TRIG2, OUTPUT); pinMode(ECHO2, INPUT); pinMode(TRIG3, OUTPUT); pinMode(ECHO3, INPUT); pinMode(BUZZER_PIN, OUTPUT);
  servo1.setPeriodHertz(50); servo2.setPeriodHertz(50); servo3.setPeriodHertz(50);
  servo1.attach(SERVO1_PIN, 500, 2400); servo2.attach(SERVO2_PIN, 500, 2400); servo3.attach(SERVO3_PIN, 500, 2400);
  servo1.write(0); servo2.write(0); servo3.write(0);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) { delay(500); Serial.print("."); }
  Serial.println(); Serial.print("ESP32 IP address: "); Serial.println(WiFi.localIP());
  server.on("/", HTTP_GET, []() { server.send(200, "text/plain", "EcoBin ESP32 online"); });
  server.on("/status", HTTP_GET, []() { server.send(200, "application/json", statusJson()); });
  server.on("/classify", HTTP_GET, handleClassify);
  server.begin(); updateFillLevels(); reportToVercel();
}

void loop() {
  server.handleClient();
  if (millis() - lastReportAt >= REPORT_INTERVAL_MS) { lastReportAt = millis(); updateFillLevels(); reportToVercel(); }
}
