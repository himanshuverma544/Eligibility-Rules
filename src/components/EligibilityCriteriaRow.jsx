import Wrapper from "./Wrapper";


export default function EligibilityCriteria({ className = "", tag = "div", num = "", children }) {

  
  return (
    <Wrapper className={`${className} rule-${num}`} tag={tag}>
      {children}
    </Wrapper>
  );
}