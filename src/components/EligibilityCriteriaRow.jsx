import { useState, useCallback } from "react";

import SearchSelectorFilter from "./SearchSelectorFilter";
import RequiredComponent from "./utils/RequiredComponent";
import Icon from "./utils/Icon";

import componentsMap from "../mappings/componentsMap";

import { getNextAvailableRule, getRuleLayout } from "../functions/rulesUtils";


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


  const getRequiredComponentProps = useCallback((index, componentName) => {

    if (!currentRow) return {};
  
    switch (componentName) {
  
      case "RuleSelector":
        return {
          options: rulesOptions.map(group => ({
            ...group,
            items: group.items.map(item => ({
              ...item,
              active: activeRules.get(index) === item.value,
              disabled: item.value !== activeRules.get(index) && disabledRules.has(item.value)
            }))
          })),
          defaultOption: currentRow?.selectedRule || getNextAvailableRule(rulesOptions, disabledRules)?.rule,
          group: true,
          onSelect: selectedRule => handleOnRuleSelect(index, selectedRule)
        };
  
        case "OperatorSelector":
          return {
            options: currentRow?.operators?.options.map(option => ({
              ...option,
              disabled: option.disabled,
            })),
            defaultOption: currentRow?.operators?.options.find(option => option?.value === currentRow?.selectedOperator?.value),
            onSelect: selectedOperator => handleOnOperatorSelect(index, selectedOperator),
            getSelectRefCurrent: selectOperatorHandler.selectRefCurrent
          };
        
        case "ItemsSearchSelector":
          return {
            options: currentRow.items,
            placeholder: "Search",
            onSelect: selectedSearchItems => getSearchSelection(selectedSearchItems),
            setHandleSelectedSearchItems
          };
  
        case "TextInput":
          return {
            placeholder: "Enter Text",
          };
  
        case "NumberInput":
          return {
            placeholder: "Enter Number",
          };
  
      default:
        return {};
    }
  }, [activeRules, disabledRules]);
  
  
  return (
    <div className="row-cont flex flex-col justify-center">
      <div
        key={index}
        className={`row flex gap-x-5 ${className}`}
      >
        {currentRuleRowLayout.map((componentName, innerIndex) => {
          return (
            <RequiredComponent
              key={innerIndex}
              componentName={componentName}
              componentsMap={componentsMap}
              style={{ width: `${(100 / currentRuleRowLayout?.length) || 100}%` }}
              {...getRequiredComponentProps(index, componentName)}
            />
          )
        })}

        <button
          className="row-remove-btn"
          onClick={() => removeRow(index)}
        >
          <Icon
            className="cross-icon relative size-[0.5rem]"
            innerClassName="absolute inset-0 size-full"
            icon="/icons/cross.svg"
            alt="cross-icon"
          />
        </button>
      </div>

      <SearchSelectorFilter
        selectedSearchItems={selectedSearchItems}
        handleSelectedSearchItems={handleSelectedSearchItems}
      />
    </div>
  );
}


export default EligibilityCriteriaRow;