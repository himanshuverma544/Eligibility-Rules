import { useState, useEffect, useRef } from "react";

import Icon from "./Icon";

import useClickOutside from "../hooks/useClickOutside";


const Select = ({
  className = "",
  innerClassName = "",
  optionsGroupClassName = "",
  optionClassName = "",
  options = [],
  defaultOption = null,
  group = false,
  onSelect = () => {},
  getSelectRefCurrent = () => {}
}) => {


  const [selectedOption, setSelectedOption] = useState(defaultOption?.value || options[0]?.value || "");
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const parentNodeRef = useRef(null);
  const selectRef = useRef({ setState: setSelectedOption });

  
  useEffect(() => {

    const sendToParent = () => {
      
      selectRef.current.setState = setSelectedOption;
      getSelectRefCurrent(selectRef.current);
    }

    sendToParent();

  }, [getSelectRefCurrent, setSelectedOption]);


  const handleOptionClick = option => {
    if (option.disabled) return; // ✅ Prevent selecting disabled options

    const selectedValue = option.value;
    let selectedGroup = "";

    if (group) {
      for (const grp of options) {
        const foundOption = grp.items.find((opt) => opt.value === selectedValue);
        if (foundOption) {
          selectedGroup = grp.label;
          break;
        }
      }
    }

    setSelectedOption(selectedValue);
    setIsDropDownOpen(false);
    onSelect({
      ...option,
      group: selectedGroup || null,      
    });
  };


  useClickOutside(parentNodeRef.current, () => {

    setIsDropDownOpen(false);

  }, isDropDownOpen);


  return (
    options.length > 0 && (
      <div ref={parentNodeRef} className={`relative inline-block ${className}`}>
        {/* Selected Option as Readonly Input */}
        <div
          className="relative w-full"
          onClick={() => setIsDropDownOpen(prev => !prev)}
        >
          <input
            type="text"
            readOnly
            className={`w-full px-4 py-2 border rounded-md cursor-pointer bg-white ${innerClassName}`}
            value={
              options.flatMap(grp => grp.items || [grp]).find((opt) => opt.value === selectedOption)?.label || defaultOption?.label || ""
            }
          />
          <Icon
            icon="/icons/up-down-arrow.svg"
            className={`absolute size-[1rem] right-3 top-1/2 transform -translate-y-1/2 transition-transform ${isDropDownOpen ? "rotate-180" : ""}`}
          />
        </div>

        {/* Dropdown Menu */}
        {isDropDownOpen && (
          <div className="absolute top-full left-0 right-0 bg-white z-10 border rounded-md mt-1 shadow-md">
            {group
              ? options.map((group, index) => (
                  <div key={index} className={`${optionsGroupClassName}`}>
                    <div className="font-bold cursor-default text-gray-600 px-4 py-2">{group.label}</div>
                    {group.items.map((option, innerIndex) => (
                      <div
                        key={innerIndex}
                        className={`px-4 py-2 flex justify-between ${
                          option.disabled ? "text-gray-400 cursor-default" : "hover:bg-gray-200 cursor-pointer"
                        } ${optionClassName} ${selectedOption === option.value ? "bg-gray-300" : ""}`}
                        onClick={() => handleOptionClick(option)}
                      >
                        {option.label}
                        {isDropDownOpen && selectedOption === option.value && " ✓"}
                      </div>
                    ))}
                  </div>
                ))
              : options.map((option, index) => (
                  <div
                    key={index}
                    className={`px-4 py-2  flex justify-between ${
                      option.disabled ? "text-gray-400 cursor-default" : "hover:bg-gray-200 cursor-pointer"
                    } ${optionClassName} ${selectedOption === option.value ? "bg-gray-300" : ""}`}
                    onClick={() => handleOptionClick(option)}
                  >
                    {option.label}
                    {isDropDownOpen && selectedOption === option.value && " ✓"}
                  </div>
                ))}
          </div>
        )}
      </div>
    )
  );
};

export default Select;
