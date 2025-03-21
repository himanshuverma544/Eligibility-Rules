import { useEffect } from "react";


const useClickOutside = (node = null, onClickOutside, isActive = false) => {

  useEffect(() => {

    if (!node || !isActive) return; 

    const handleClickOutside = event => {
      if (node && node.contains && !node.contains(event.target)) {
        onClickOutside();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }

  }, [node, onClickOutside]);
}


export default useClickOutside;