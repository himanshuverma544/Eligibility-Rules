import { useState, useCallback } from "react";

import SearchSelectorFilter from "./SearchSelectorFilter";
import RequiredComponent from "./utils/RequiredComponent";
import Icon from "./utils/Icon";

import componentsMap from "../mappings/componentsMap";

import { getNextAvailableRule, getRuleLayout } from "../functions/rulesUtils";

import useWindowSize from "../hooks/utils/useWindowSize";


const EligibilityCriteriaRow = ({
  index = null,
  className = "",
  currentRow = null,
  rulesOptions = [],
  activeRulesState = [],
  disabledRulesState = [],
  handlers = {},
  removeRow = () => {}
}) => {
  
  const [ activeRules ] = activeRulesState;
  const [ disabledRules ] = disabledRulesState;

  const { 
    rule: { handleOnRuleSelect },
    operator: { handleOnOperatorSelect, selectOperatorHandler }
  }
  = handlers;

  const currentRuleRowLayout = getRuleLayout(currentRow);


  const [selectedSearchItems, setSelectedSearchItems] = useState([]);
  const [handleSelectedSearchItems, setHandleSelectedSearchItems] = useState(null);


  const getSearchSelection = (selectedSearchItems = []) =>
    setSelectedSearchItems(selectedSearchItems);

  
  const { responsive } = useWindowSize();


  const getRequiredComponentProps = useCallback((index, componentObj) => {

    if (!currentRow) return {};
  
    const width = responsive(
      "100%",
      {
        sm: `${98 / Math.min(currentRuleRowLayout.length, 2)}%`,
        lg: `${(95 / currentRuleRowLayout.length)}%`,
        xl: `${(94 / currentRuleRowLayout.length)}%`,
        xxl: `${(90 / currentRuleRowLayout.length)}%`
      }
    );

    switch (componentObj.component) {
      
      case "RuleSelector":
        return {
          options: rulesOptions.map(group => ({
            ...group,
            items: group.items.map(item => ({
              ...item,
              active: activeRules.get(index) === item.value,
              disabled: activeRules.get(index) !== item.value && disabledRules.has(item.value)
            }))
          })),
          defaultOption:
            currentRow?.selectedRule ||
            getNextAvailableRule(rulesOptions, disabledRules)?.rule,
          group: true,
          onSelect: selectedRule =>
            handleOnRuleSelect(
              index, selectedRule, setSelectedSearchItems
            ),
          style: { width }
        };
  
        case "OperatorSelector":
          return {
            options: currentRow?.operators?.options.map(option => ({
              ...option,
              disabled: option.disabled,
            })),
            defaultOption: currentRow?.operators?.options.find(option => option?.value === currentRow?.selectedOperator?.value),
            onSelect: selectedOperator => handleOnOperatorSelect(index, selectedOperator),
            getSelectRefCurrent: selectRefCurrent => selectOperatorHandler.attach(index, selectRefCurrent),
            style: { width }
          };
        
        case "ItemsSearchSelector":
          return {
            options: currentRow.items,
            placeholder: componentObj?.props?.placeholder || "Search",
            currentSelectedItems: selectedSearchItems,
            onSelect: selectedSearchItems => getSearchSelection(selectedSearchItems),
            setHandleSelectedSearchItems,
            style: { width }
          };
  
        case "TextInput":
          return {
            placeholder: componentObj?.props?.placeholder || "Enter Text",
            style: { width, height: "2.375rem", padding: "0.5rem 1rem" }
          };
  
        case "NumberInput":
          return {
            placeholder: componentObj?.props?.placeholder || "Enter Number",
            style: { width, height: "2.375rem", padding: "0.5rem 1rem" }
          };
  
      default:
        return {};
    }
  }, [activeRules, disabledRules, currentRuleRowLayout, responsive]);


  return (
    <div className="grid grid-cols-12">
      <div className="row-cont flex flex-col justify-center col-span-11">
        <div
          key={index}
          className={`row flex flex-wrap gap-x-[1vw] gap-y-[1vw] ${className}`}
        >
          {currentRuleRowLayout.map((componentObj, innerIndex) => {
            return (
              <RequiredComponent
                key={innerIndex}
                componentName={componentObj.component}
                componentsMap={componentsMap}
                {...getRequiredComponentProps(index, componentObj)}
              />
            )
          })}
        </div>

        <SearchSelectorFilter
          className="w-full"
          selectedSearchItems={selectedSearchItems}
          handleSelectedSearchItems={handleSelectedSearchItems}
        />
      </div>
      
      <button
        className="row-remove-btn col-span-1 flex justify-center mt-3"
        onClick={() => removeRow(index)}
      >
        <Icon
          className="cross-icon relative size-[0.5rem] cursor-pointer"
          innerClassName="absolute inset-0 size-full"
          icon="/icons/cross.svg"
          alt="cross-icon"
        />
      </button> 
    </div>

  );
}


export default EligibilityCriteriaRow;