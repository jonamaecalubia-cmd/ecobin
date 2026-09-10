import { NextRequest, NextResponse } from "next/server";

const PUSHBULLET_API =
  "https://api.pushbullet.com/v2";

const pushbulletToken =
  process.env.PUSHBULLET_ACCESS_TOKEN;

const faculty1 =
  process.env.FACULTY_1_PHONE;

const faculty2 =
  process.env.FACULTY_2_PHONE;

const alertApiKey =
  process.env.ALERT_API_KEY;

export async function POST(request: NextRequest) {
  try {
    // ==========================================
    // SECURITY CHECK
    // ==========================================

    const authorization =
      request.headers.get("authorization");

    if (
      !authorization ||
      authorization !== `Bearer ${alertApiKey}`
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // CHECK ENVIRONMENT VARIABLES
    // ==========================================

    if (!pushbulletToken) {
      return NextResponse.json(
        {
          success: false,
          message:
            "PUSHBULLET_ACCESS_TOKEN is missing.",
        },
        { status: 500 }
      );
    }

    if (!faculty1 || !faculty2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Faculty phone numbers are not configured.",
        },
        { status: 500 }
      );
    }

    // ==========================================
    // READ REQUEST
    // ==========================================

    const data = await request.json();

    const binName = String(
      data.binName || ""
    ).trim();

    const level = Number(data.level);

    const status = String(
      data.status || ""
    ).toUpperCase();

    // ==========================================
    // VALIDATE DATA
    // ==========================================

    if (
      !binName ||
      !Number.isFinite(level)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "binName and level are required.",
        },
        { status: 400 }
      );
    }

    if (
      status !== "WARNING" &&
      status !== "FULL"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Status must be WARNING or FULL.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // CREATE SMS MESSAGE
    // ==========================================

    let message = "";

    if (status === "WARNING") {
      message =
        `ECOBIN WARNING ALERT: ${binName} is at ${level}% capacity. Please prepare for waste collection.`;
    }

    if (status === "FULL") {
      message =
        `ECOBIN FULL ALERT: ${binName} has reached ${level}% capacity. Please collect the waste as soon as possible.`;
    }

    // ==========================================
    // GET PUSHBULLET USER
    // ==========================================

    const userResponse = await fetch(
      `${PUSHBULLET_API}/users/me`,
      {
        method: "GET",
        headers: {
          "Access-Token": pushbulletToken,
        },
        cache: "no-store",
      }
    );

    if (!userResponse.ok) {
      const errorText =
        await userResponse.text();

      throw new Error(
        `Pushbullet user request failed: ${errorText}`
      );
    }

    const user =
      await userResponse.json();

    // ==========================================
    // GET DEVICES
    // ==========================================

    const devicesResponse = await fetch(
      `${PUSHBULLET_API}/devices`,
      {
        method: "GET",
        headers: {
          "Access-Token": pushbulletToken,
        },
        cache: "no-store",
      }
    );

    if (!devicesResponse.ok) {
      const errorText =
        await devicesResponse.text();

      throw new Error(
        `Pushbullet device request failed: ${errorText}`
      );
    }

    const devicesData =
      await devicesResponse.json();

    // ==========================================
    // FIND ANDROID SMS DEVICE
    // ==========================================

    const devices =
      devicesData.devices || [];

    const smsDevice =
      devices.find(
        (device: any) =>
          device.active === true &&
          device.has_sms === true
      );

    if (!smsDevice) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No active Android device with SMS capability was found in Pushbullet. Make sure the Android phone is logged into the same Pushbullet account and SMS permission is enabled.",
        },
        { status: 500 }
      );
    }

    // ==========================================
    // SEND SMS FUNCTION
    // ==========================================

    async function sendSMS(
      phoneNumber: string
    ) {
      const smsResponse =
        await fetch(
          `${PUSHBULLET_API}/texts`,
          {
            method: "POST",

            headers: {
              "Access-Token":
                pushbulletToken!,
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              data: {
                addresses: [
                  phoneNumber,
                ],

                message: message,

                target_device_iden:
                  smsDevice.iden,

                source_user_iden:
                  user.iden,
              },
            }),

            cache: "no-store",
          }
        );

      const result =
        await smsResponse.text();

      if (!smsResponse.ok) {
        throw new Error(
          `SMS request failed for ${phoneNumber}: ${result}`
        );
      }

      return result
        ? JSON.parse(result)
        : {};
    }

    // ==========================================
    // SEND TO FACULTY #1
    // ==========================================

    const sms1 =
      await sendSMS(faculty1);

    // ==========================================
    // SEND TO FACULTY #2
    // ==========================================

    const sms2 =
      await sendSMS(faculty2);

    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json({
      success: true,

      message:
        "ECOBIN SMS alerts sent successfully.",

      status: status,

      binName: binName,

      level: level,

      sendingDevice:
        smsDevice.nickname ||
        smsDevice.model ||
        smsDevice.iden,

      recipients: [
        {
          recipient:
            "Faculty/Staff 1",
          phone:
            faculty1,
          result:
            sms1,
        },

        {
          recipient:
            "Faculty/Staff 2",
          phone:
            faculty2,
          result:
            sms2,
        },
      ],
    });

  } catch (error) {
    console.error(
      "PUSHBULLET SMS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          "Failed to send Pushbullet SMS.",

        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },

      { status: 500 }
    );
  }
}