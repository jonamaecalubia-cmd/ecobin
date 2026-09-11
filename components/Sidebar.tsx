"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: "⌂",
  },
  {
    label: "Bin Monitoring",
    href: "/bin-monitoring",
    icon: "🗑",
  },
  {
    label: "Alerts",
    href: "/alerts",
    icon: "🔔",
  },
  {
    label: "SMS Alerts",
    href: "/sms-alerts",
    icon: "💬",
  },
  {
    label: "History",
    href: "/history",
    icon: "◷",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: "⚙",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item ${
                active ? "nav-active" : ""
              }`}
            >
              <span className="nav-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>

              {item.label === "Alerts" && (
                <span className="sidebar-alert-count">
                  2
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}