"use client";
import Link from "next/link";
type TabProps = {
  tabs: { label: React.ReactNode; value: string }[];
  active: string;
};

export default function Tabs({ tabs, active }: TabProps) {
  // Default to 'view' if active is falsy
  const currentActive = active || "view";
  return (
    <nav className="flex w-full">
      {tabs.map((tab) => (
        <Link
          key={tab.value}
          href={`/${tab.value === "view" ? "" : tab.value}`}
          className={
            "flex-1 mx-1 tab-btn px-4 py-2 rounded font-semibold transition-all text-center " +
            (currentActive === tab.value
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-indigo-100 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700")
          }
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}