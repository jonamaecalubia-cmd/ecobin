import { NextRequest, NextResponse } from "next/server";

type ServoName =
  | "biodegradable"
  | "recyclable"
  | "residual";

type ServoAction =
  | "OPEN"
  | "CLOSE";

type Command = {
  id: number;
  servo: ServoName;
  action: ServoAction;
  createdAt: string;
};

let nextCommandId = 1;
let pendingCommands: Command[] = [];

function authorized(request: NextRequest) {
  const expectedToken = process.env.VERCEL_DEVICE_TOKEN;

  if (!expectedToken) {
    return true;
  }

  const deviceToken = request.headers.get("X-Device-Token");

  return deviceToken === expectedToken;
}

export async function POST(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized device command.",
      },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const servo = body.servo as string;
    const action = body.action as string;

    const validServos = [
      "biodegradable",
      "recyclable",
      "residual",
    ];

    const validActions = [
      "OPEN",
      "CLOSE",
    ];

    if (!validServos.includes(servo)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid servo name.",
        },
        { status: 400 }
      );
    }

    if (!validActions.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid servo action.",
        },
        { status: 400 }
      );
    }

    const command: Command = {
      id: nextCommandId++,
      servo: servo as ServoName,
      action: action as ServoAction,
      createdAt: new Date().toISOString(),
    };

    pendingCommands.push(command);

    console.log("New EcoBin servo command:", command);

    return NextResponse.json({
      success: true,
      message: "Servo command created.",
      data: command,
    });
  } catch (error) {
    console.error("Device command error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON request.",
      },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  if (!authorized(request)) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized device.",
      },
      { status: 401 }
    );
  }

  const commands = [...pendingCommands];

  pendingCommands = [];

  console.log("Sending commands to ESP32:", commands);

  return NextResponse.json({
    success: true,
    commands,
  });
}