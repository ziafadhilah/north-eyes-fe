"use client";

export default function AddUserForm() {
  return (
    <>
      <div className="relative z-10">
        <h2 className="text-xl font-bold text-black mb-4">Add User</h2>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter Full Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter Username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter Email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter Phone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter Password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Picture
              </label>
              <input
                type="file"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Enter Password"
              />
            </div>
          </div>
          <div className="text-right">
            <button
              type="submit"
              className="text-white px-4 py-2 rounded-2xl hover:bg-blue-700"
              style={{
                background:
                  "linear-gradient(251.41deg, #1A2A6C -0.61%, #2671FF 74.68%)",
              }}
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
