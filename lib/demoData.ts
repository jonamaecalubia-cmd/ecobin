export type BinStatus = "NORMAL" | "WARNING" | "FULL";

export type Bin = {
  id: string;
  name: string;
  description: string;
  icon: string;
  level: number;
};

export type AlertItem = {
  id: number;
  bin: string;
  level: number;
  status: BinStatus;
  time: string;
  date: string;
};

export type SmsItem = {
  id: number;
  bin: string;
  level: number;
  status: BinStatus;
  time: string;
  date: string;
  recipient: string;
  result: "SENT" | "FAILED";
};

export const WARNING_THRESHOLD = 70;
export const FULL_THRESHOLD = 90;

export const demoBins: Bin[] = [
  {
    id: "biodegradable",
    name: "Biodegradable Bin",
    description: "Organic waste (food, leaves, etc.)",
    icon: "🌱",
    level: 45,
  },
  {
    id: "recyclable",
    name: "Recyclable Bin",
    description: "Paper, plastic, glass, metal",
    icon: "♻️",
    level: 78,
  },
  {
    id: "residual",
    name: "Residual Bin",
    description: "Other non-recyclable waste",
    icon: "🗑️",
    level: 92,
  },
];

export const demoAlerts: AlertItem[] = [
  {
    id: 1,
    bin: "Residual Bin",
    level: 92,
    status: "FULL",
    time: "10:24 AM",
    date: "September 10, 2026",
  },
  {
    id: 2,
    bin: "Recyclable Bin",
    level: 78,
    status: "WARNING",
    time: "10:24 AM",
    date: "September 10, 2026",
  },
];

export const demoSms: SmsItem[] = [
  {
    id: 1,
    bin: "Residual Bin",
    level: 92,
    status: "FULL",
    time: "10:24 AM",
    date: "September 10, 2026",
    recipient: "+63 9XX XXX XXXX",
    result: "SENT",
  },
  {
    id: 2,
    bin: "Recyclable Bin",
    level: 78,
    status: "WARNING",
    time: "10:24 AM",
    date: "September 10, 2026",
    recipient: "+63 9XX XXX XXXX",
    result: "SENT",
  },
];

export function getStatus(level: number): BinStatus {
  if (level >= FULL_THRESHOLD) return "FULL";
  if (level >= WARNING_THRESHOLD) return "WARNING";
  return "NORMAL";
}