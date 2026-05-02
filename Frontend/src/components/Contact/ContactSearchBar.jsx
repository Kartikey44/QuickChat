import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";

function ContactSearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onSearch?.(val); 
  };

  return (
    <div className="w-full ">
      <div className="px-4 py-1.5 bg-[#3c3c3c]/80 rounded-full flex items-center gap-2 focus-within:ring-2 focus-within:ring-fuchsia-600">
        <IoIosSearch size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search a contact"
          value={query}
          onChange={handleChange}
          className="text-gray-200 w-full bg-transparent focus:outline-none"
        />
      </div>
    </div>
  );
}

export default ContactSearchBar;