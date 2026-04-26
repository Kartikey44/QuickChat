import React from 'react'
import { IoIosSearch } from "react-icons/io";
function SearchBar() {
  return (
    <div className="px-4 py-2 bg-[#3c3c3c]/80 rounded-full flex items-center gap-2 focus-within:ring-2 focus-within:ring-fuchsia-600">
          <IoIosSearch size={20} className="text-gray-400" />
          <input
          type="text"
          placeholder="Search a chat"
          className="text-gray-200 w-full bg-transparent focus:outline-none"
          />
        </div>
  )
}

export default SearchBar
