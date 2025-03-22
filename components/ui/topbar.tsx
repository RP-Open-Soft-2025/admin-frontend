import { Moon, Search } from "lucide-react";

export default function topbar() {
  return (
    <div className="flex justify-between items-center bg-gradient-to-r from-green-100 to-green-300 p-4 rounded-lg shadow-md">
      {/* Logo */}
      <div className="text-xl font-bold flex items-center">
        <span className="text-black">Deloitte.</span>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-white px-3 py-1 rounded-lg shadow-sm w-1/3">
        <Search className="text-gray-500" size={18} />
        <input
          type="text"
          placeholder="Search for 'keyword'"
          className="ml-2 w-full outline-none bg-transparent text-gray-700"
        />
      </div>

      {/* Right Side (Dark Mode + Profile) */}
      <div className="flex items-center gap-4">
        <button className="p-2 bg-white rounded-full shadow-md">
          <Moon size={20} className="text-gray-700" />
        </button>
        <div className="flex items-center bg-green-200 px-4 py-1 rounded-lg shadow-sm">
          <span className="mr-2 text-gray-800">Meel Roy</span>
          <span className="text-sm text-gray-600">Admin</span>
        </div>
      </div>
    </div>
  );
}
