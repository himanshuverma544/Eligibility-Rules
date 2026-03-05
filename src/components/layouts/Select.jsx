import { useState, useEffect, useRef } from "react";

import Icon from "../utils/Icon";

import useClickOutside from "../../hooks/utils/useClickOutside";


const Select = ({
  className = "",
  innerClassName = "",
  optionsGroupClassName = "",
  optionClassName = "",
  options = [],
  defaultOption = null,
  group = false,
  onSelect = () => {},
  getSelectRefCurrent = () => {},
  ...props
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
    if (option.disabled) return;

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
      <div
        ref={parentNodeRef}
        className={`relative inline-block ${className}`}
        {...props}
      >
        {/* Selected Option as Readonly Input */}
        <div
          className="relative w-full cursor-pointer"
          onClick={() => setIsDropDownOpen(prev => !prev)}
        >
          <input
            type="text"
            readOnly
            className={`w-full px-4 py-2 border focus:outline-none rounded-md cursor-pointer text-sm bg-white border-black/50 ${innerClassName}`}
            value={
              options.flatMap(grp => grp.items || [grp]).find((opt) => opt.value === selectedOption)?.label || defaultOption?.label || ""
            }
          />
          <Icon
            icon="/icons/up-down-arrow.svg"
            className="absolute size-[1rem] right-3 top-1/2 transform -translate-y-1/2"
          />
        </div>

        {/* Dropdown Menu */}
        {isDropDownOpen && (
          <div className="absolute top-[95%] left-0 right-0 z-10 border rounded-md mt-1 text-sm shadow-md border-gray-300 bg-white">
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
