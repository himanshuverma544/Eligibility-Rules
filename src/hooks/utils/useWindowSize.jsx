import { useState, useEffect } from "react";

const defaultBreakpoints = {
  xxl: 1400,
  xl: 1200,
  lg: 992,
  md: 768,
  sm: 576,
  xs: 425,
  xxs: 375
};


const useWindowSize = (customBreakpoints = {}) => {

  const [screenWidth, setScreenWidth] = useState(0);
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints };


  useEffect(() => {

    setScreenWidth(window.innerWidth);

    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);


  const responsive = (generalValue, responsiveValues = {}) => {

    let appliedValue = generalValue;
    
    for (const [breakpoint, value] of Object.entries(responsiveValues)) {
      if (screenWidth >= breakpoints[breakpoint]) {
        appliedValue = value;
      }
    }

    return appliedValue;
  }

  return { screenWidth, breakpoints, responsive };
}


export default useWindowSize;