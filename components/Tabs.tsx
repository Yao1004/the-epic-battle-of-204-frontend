"use client";
type TabProps = {
  tabs: { label: React.ReactNode; value: string }[];
  active: string;
  onChange: (val: string) => void;
};

export default function Tabs({ tabs, active, onChange }: TabProps) {
  return (
    <nav className="flex w-full">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={
            "flex-1 mx-1 tab-btn px-4 py-2 rounded font-semibold transition-all " +
            (active === tab.value
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-indigo-100 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-700")
          }
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}