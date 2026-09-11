import { NextRequest, NextResponse } from "next/server";

type BinStatus = "NORMAL" | "WARNING" | "FULL";

type DeviceStatus = {
  biodegradable: number;
  recyclable: number;
  residual: number;
  status1: BinStatus;
  status2: BinStatus;
  status3: BinStatus;
  updatedAt: string;
};

let latestStatus: DeviceStatus | null = null;

const DEVICE_TOKEN = process.env.VERCEL_DEVICE_TOKEN;

export async function POST(request: NextRequest) {
  try {
    // ==========================================
    // SECURITY CHECK
    // ==========================================

    const deviceToken =
      request.headers.get("X-Device-Token");

    if (
      DEVICE_TOKEN &&
      deviceToken !== DEVICE_TOKEN
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized device.",
        },
        { status: 401 }
      );
    }

    // ==========================================
    // READ JSON
    // ==========================================

    const data = await request.json();

    const biodegradable =
      Number(data.biodegradable);

    const recyclable =
      Number(data.recyclable);

    const residual =
      Number(data.residual);

    const status1 =
      String(data.status1 || "").toUpperCase();

    const status2 =
      String(data.status2 || "").toUpperCase();

    const status3 =
      String(data.status3 || "").toUpperCase();

    // ==========================================
    // VALIDATE
    // ==========================================

    const validLevels =
      [biodegradable, recyclable, residual].every(
        (value) =>
          Number.isFinite(value) &&
          value >= 0 &&
          value <= 100
      );

    const validStatuses =
      [status1, status2, status3].every(
        (status) =>
          status === "NORMAL" ||
          status === "WARNING" ||
          status === "FULL"
      );

    if (!validLevels || !validStatuses) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid bin status data.",
        },
        { status: 400 }
      );
    }

    // ==========================================
    // SAVE LATEST STATUS
    // ==========================================

    latestStatus = {
      biodegradable,
      recyclable,
      residual,
      status1: status1 as BinStatus,
      status2: status2 as BinStatus,
      status3: status3 as BinStatus,
      updatedAt: new Date().toISOString(),
    };

    console.log(
      "ECOBIN DEVICE STATUS:",
      latestStatus
    );

    // ==========================================
    // SUCCESS
    // ==========================================

    return NextResponse.json({
      success: true,
      message: "EcoBin status received.",
      data: latestStatus,
    });

  } catch (error) {
    console.error(
      "DEVICE STATUS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON request.",
      },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    data: latestStatus,
  });
}