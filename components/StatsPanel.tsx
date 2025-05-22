"use client";
export default function StatsPanel() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 mb-10 max-w-3xl mx-auto mt-8">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-500 px-6 py-3 flex items-center text-white font-semibold text-lg rounded-t-xl">
        <span className="material-symbols-outlined mr-2">analytics</span>
        Domain Statistics
      </div>
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-5 mb-6">
          <div className="flex-1 bg-blue-50 rounded-xl flex flex-row items-center justify-center p-4">
            <span className="bg-blue-600 text-white p-2 rounded-full mr-3 text-xl flex items-center justify-center">
              <span className="material-symbols-outlined">shield</span>
            </span>
            <div className="text-left">
              <div className="flex flex-row items-center text-blue-800 font-bold text-xl">
                <span>Blacklisted</span>
                <span className="ml-2 font-extrabold">{147}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-green-50 rounded-xl flex flex-row items-center justify-center p-4">
            <span className="bg-green-600 text-white p-2 rounded-full mr-3 text-xl flex items-center justify-center">
              <span className="material-symbols-outlined">check_circle</span>
            </span>
            <div className="text-left">
              <div className="flex flex-row items-center text-green-800 font-bold text-xl">
                <span>Whitelisted</span>
                <span className="ml-2 font-extrabold">{93}</span>
              </div>
            </div>
          </div>
          <div className="flex-1 bg-purple-50 rounded-xl flex flex-row items-center justify-center p-4">
            <span className="bg-purple-600 text-white p-2 rounded-full mr-3 text-xl flex items-center justify-center">
              <span className="material-symbols-outlined">pending</span>
            </span>
            <div className="text-left">
              <div className="flex flex-row items-center text-purple-800 font-bold text-xl">
                <span>Pending</span>
                <span className="ml-2 font-extrabold">{24}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-700 dark:text-gray-400 font-medium flex items-center">
              <span className="material-symbols-outlined mr-1 text-indigo-600">calendar_month</span>
              Recent Activity
            </div>
            <button className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center transition-colors">
              View all
              <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
            </button>
          </div>
          <div className="divide-y divide-gray-200 text-sm">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-red-500 mr-2">block</span>
                <span>example-domain123.com added to blacklist</span>
              </div>
              <span className="text-gray-400">2h ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-green-500 mr-2">verified</span>
                <span>trusted-site.org added to whitelist</span>
              </div>
              <span className="text-gray-400">3h ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-purple-500 mr-2">pending</span>
                <span>new-domain-check.com pending review</span>
              </div>
              <span className="text-gray-400">5h ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
