"use client";
export default function StatsPanel() {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 mb-10 max-w-3xl mx-auto mt-8">
      <div className="bg-gradient-to-r from-indigo-700 to-purple-500 px-6 py-3 flex items-center text-white font-semibold text-lg rounded-t-3xl">
        <span className="material-symbols-outlined mr-2">analytics</span>
        Domain Statistics
      </div>
      <div className="px-6 py-6">
        <div className="flex flex-col sm:flex-row gap-5 mb-6">
          <div className="flex-1 bg-blue-50 rounded-xl flex items-center p-4">
            <span className="bg-blue-600 text-white p-2 rounded-full mr-3 text-xl">
              <span className="material-symbols-outlined">shield</span>
            </span>
            <div>
              <div className="text-blue-800 font-bold">
                Blacklisted
                <span className="ml-1 text-2xl font-extrabold align-middle">147</span>
              </div>
              <div className="flex items-center text-xs text-blue-600 mt-1">
                <span className="material-symbols-outlined text-green-500 text-base mr-1">trending_up</span>
                12% increase this week
              </div>
            </div>
          </div>
          <div className="flex-1 bg-green-50 rounded-xl flex items-center p-4">
            <span className="bg-green-600 text-white p-2 rounded-full mr-3 text-xl">
              <span className="material-symbols-outlined">check_circle</span>
            </span>
            <div>
              <div className="text-green-800 font-bold">
                Whitelisted
                <span className="ml-1 text-2xl font-extrabold align-middle">93</span>
              </div>
              <div className="flex items-center text-xs text-green-600 mt-1">
                <span className="material-symbols-outlined text-green-500 text-base mr-1">trending_up</span>
                8% increase this week
              </div>
            </div>
          </div>
          <div className="flex-1 bg-purple-50 rounded-xl flex items-center p-4">
            <span className="bg-purple-600 text-white p-2 rounded-full mr-3 text-xl">
              <span className="material-symbols-outlined">pending</span>
            </span>
            <div>
              <div className="text-purple-800 font-bold">
                Pending
                <span className="ml-1 text-2xl font-extrabold align-middle">24</span>
              </div>
              <div className="flex items-center text-xs text-pink-500 mt-1">
                <span className="material-symbols-outlined text-red-500 text-base mr-1">trending_down</span>
                3% decrease this week
              </div>
            </div>
          </div>
        </div>
        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-gray-700 font-medium flex items-center">
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
