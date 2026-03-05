import { useState } from "react";


const Input = ({ className = "", type = "text", placeholder = "", ...props }) => {

  const [inputValue, setInputValue] = useState("");


  const handleInputProtocols = event => {

    let value = event.target.value;

    switch (type) {

      case "number":

        if (event.type === "keydown") {
          if (["-", "e", "E"].includes(event.key)) {
            event.preventDefault();
            return;
          }
        }

        if (event.type === "paste") {
          const pasted = (event.clipboardData || window.clipboardData).getData("text");
          if (/[-eE]/.test(pasted)) {
            event.preventDefault();
            return;
          }
        }

        if (event.type === "change") {
          const positiveNumsRegex = /^\d*\.?\d*$/;
          if (positiveNumsRegex.test(value)) {
            setInputValue(value);
          }
        }

        break;

      default:
        setInputValue(value);
        break;
    }
  }


  return (
    <input
      className={`input-${type} px-4 border rounded text-sm ${className}`}
      type={type}
      placeholder={placeholder}
      value={inputValue}
      onChange={handleInputProtocols}
      onKeyDown={handleInputProtocols}
      onPaste={handleInputProtocols}
      {...props}
    />
  );
};


export default Input;