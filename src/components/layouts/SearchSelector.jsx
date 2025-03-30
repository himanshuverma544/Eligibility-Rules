import { useState, useRef } from "react";

import Icon from "../utils/Icon";

import useClickOutside from "../../hooks/utils/useClickOutside";


const SearchSelector = ({ className = "", options = [], placeholder = "Search…", index = null, onSelect = () => {} }) => {

  const [inputValue, setInputValue] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  const [selectedItems, setSelectedItems] = useState([]);

  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);  


  const handleChange = event => {

    const value = event.target.value;

    setInputValue(value);
    setFilteredOptions(options.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    ));

    setShowDropdown(true);
  }


  const handleFocus = () => {

    setFilteredOptions(options);
    setShowDropdown(true);
  }


  const handleSelectedItems = (option) => {

    let currentSelectedItems = selectedItems.includes(option)
      ? selectedItems.filter(item => item !== option)
      : [...selectedItems, option];

    setSelectedItems(currentSelectedItems);
    onSelect({ index, currentSelectedItems });
  }


  useClickOutside(dropdownRef.current, () => {

    setShowDropdown(false);
    inputRef.current?.blur();
    
  }, showDropdown);


  return (
    <div ref={dropdownRef} className={`relative w-64 ${className}`}>

      <div className="input-group flex justify-between items-center border rounded">
        <div className="icon-cont px-2">
          <Icon
            className="icon size-[1.2rem] relative"
            innerClassName="size-full absolute inset-0"
            icon="/icons/search.svg"
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <span className="selection-count px-2">
          {`${selectedItems.length}/${options.length}`}
        </span>
      </div>

      {showDropdown && filteredOptions.length > 0 && (
        <ul className="z-10 absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-md max-h-40 overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="space-x-5 px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
              onClick={() => handleSelectedItems(option)}
            >
              <input 
                type="checkbox"
                checked={selectedItems.includes(option)}
                onChange={() => handleSelectedItems(option)}
                className="w-4 h-4 cursor-pointer"
              />
              <span className="option">
                {option}
              </span>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}


export default SearchSelector;