import { useCallback } from "react";

import RequiredComponent from "./utils/RequiredComponent";
import componentsMap from "../mappings/componentsMap";

import { getNextAvailableRule } from "../functions/rulesUtils";


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
    <div
      key={index}
      className={`flex space-x-5 space-y-5 ${className}`}
    >
      {currentRow.layout.map((componentName, innerIndex) => {
        return (
          <RequiredComponent
            key={innerIndex}
            componentName={componentName}
            componentsMap={componentsMap}
            {...getRequiredComponentProps(index, componentName)}
          />
        )
      })}

      <button
        className="row-remove-btn mb-5"
        onClick={() => removeRow(index)}
      >
        ✖
      </button>
    </div>
  );
}


export default EligibilityCriteriaRow;