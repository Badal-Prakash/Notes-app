import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
function SearchBar({ value, onChange, handlesearch, onClearSearch }) {
  return (
    <div className="w-80 flex items-center px-4 rounded-md bg-slate-200">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-sm bg-transparent py-[11px] outline-none"
        value={value}
        onChange={onChange}
      />

      {value && (
        <IoMdClose
          className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3"
          onClick={onClearSearch}
        />
      )}
      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={handlesearch}
      />
    </div>
  );
}

export default SearchBar;

{
  /* <FaMagnifyingGlass /> */

  {
    /* <IoMdClose /> */
  }
}
