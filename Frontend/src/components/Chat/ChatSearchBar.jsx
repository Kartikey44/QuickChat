import React, { useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";

function ChatSearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300); // debounce delay

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="h-full w-full px-2">
      <div className="px-4 py-1.5 bg-[#3c3c3c]/80 rounded-full flex items-center gap-2 focus-within:ring-2 focus-within:ring-fuchsia-600">
        <IoIosSearch size={20} className="text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a chat"
          className="text-gray-200 w-full bg-transparent focus:outline-none"
        />
      </div>
    </div>
  );
}

export default ChatSearchBar;