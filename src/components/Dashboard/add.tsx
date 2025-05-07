"use client";

export default function AddBrandForm() {
  return (
    <>
      <h2 className="text-xl font-bold text-black mb-4">Add New Brand</h2>
      <form className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Brand Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Brand Name
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter brand name"
            />
          </div>

          {/* Employee Daily Point */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employee Daily Point
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter daily point"
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Logo
            </label>
            <input
              type="file"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              placeholder="Enter description"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save Brand
          </button>
        </div>
      </form>
    </>
  );
}
