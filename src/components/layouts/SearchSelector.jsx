import { useState, useRef, useEffect } from "react";

import Icon from "../utils/Icon";

import useClickOutside from "../../hooks/utils/useClickOutside";


const SearchSelector = ({
  className = "",
  options = [],
  placeholder = "Search…",
  onSelect = null,
  setHandleSelectedSearchItems = null,
  ...props
}) => {

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


  const handleSelectedItems = (option = null) => {

    let currentSelectedItems = selectedItems.includes(option)
      ? selectedItems.filter(item => item !== option)
      : [...selectedItems, option];

    setSelectedItems(currentSelectedItems);
    onSelect(currentSelectedItems);
  }


  useEffect(() => {

    if (setHandleSelectedSearchItems) {
      setHandleSelectedSearchItems(() => handleSelectedItems);
    }
  }, [selectedItems]);


  useClickOutside(dropdownRef.current, () => {

    setShowDropdown(false);
    inputRef.current?.blur();
    
  }, showDropdown);


  return (
    <div
      ref={dropdownRef}
      className={`relative ${className}`}
      {...props}
    >
      <div className="input-group flex justify-between items-center rounded border-1 border-black/50 ">
        <div className="icon-cont ps-3 pe-2">
          <Icon
            className="icon size-[13px] relative"
            innerClassName="size-full absolute inset-0"
            icon="/icons/search.svg"
          />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="w-full py-2 rounded-md focus:outline-none text-sm"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onFocus={handleFocus}
        />
        <span className="selection-count ps-2 pe-3 text-sm text-black/50">
          {`${selectedItems.length}/${options.length}`}
        </span>
      </div>

      {showDropdown && filteredOptions.length > 0 && (
        <ul className="absolute top-[95%] left-0 right-0 max-h-40 z-10 mt-1 rounded-md border text-sm bg-white border-gray-300 shadow-md overflow-auto">
          {filteredOptions.map((option, index) => (
            <li
              key={index}
              className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectedItems(option, "change")}
            >
              <input
                type="checkbox"
                className="w-4 h-4 cursor-pointer accent-black"
                checked={selectedItems.includes(option)}
                onChange={() => handleSelectedItems(option)}
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