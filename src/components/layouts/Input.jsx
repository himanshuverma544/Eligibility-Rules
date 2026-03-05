const Input = ({ className = "", type = "text", placeholder = "",  ...props }) => {

  return (
    <input
      className={`input-${type} px-4 border rounded text-sm ${className}`}
      type={type}
      placeholder={placeholder}
      {...props}
    />
  );
}


export default Input;