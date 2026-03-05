import "./App.css";

import { React, useState, useMemo } from "react";

import EligibilityCriteriaRow from "./components/EligibilityCriteriaRow.jsx";

import eligibilityCriteriaData from "./constants/eligibilityCriteriaData.js";

import getInitialRuleValues from "./functions/getInitialRuleValues.js";
import sortByPriority from "./functions/sortByPriority.js";
import getRulesOptionsArray from "./functions/getRulesOptionsArray.js";



function App() {

  const rulesOptions = useMemo(() => getRulesOptionsArray(eligibilityCriteriaData), []);

  const [eligibilityCriteriaMap, setEligibilityCriteriaMap] = useState(new Map());
  const [activeRules, setActiveRules] = useState(new Map()); // ✅ Store selected rules per row
  const [disabledRules, setDisabledRules] = useState(new Set()); // ✅ Store globally disabled rules


  const getNextAvailableRule = () => {

    for (const group of rulesOptions) {
      for (const rule of group.items) {

        if (!disabledRules.has(rule.value)) {
          return { group, rule };
        }
      }
    }

    return null;
  }




const addMutualIndex = (map = new Map(), currentIndex = null, currentRuleRow = null) => {

  if (!currentRuleRow.operators?.index) {

    for (let [index, rule] of map.entries()) {

      if (rule.selectedRule?.value === currentRuleRow?.operators?.mutuallyExclusiveWith) {
  
        currentRuleRow.operators.index = index;

        rule.operators.index = currentIndex;
        map.set(index, rule);

        break;
      }
    }
  }
}

const getDefaultOperator = (currentRuleRow = null, mutualRuleRow = null) => {

  if (!currentRuleRow) return null;

  const currentOperatorIndex = 0

  let defaultOperator = currentRuleRow?.operators?.options[currentOperatorIndex];
    
  const mutualSelectedOperator = mutualRuleRow?.selectedOperator;

  if (mutualSelectedOperator === defaultOperator) {
    defaultOperator = currentRuleRow?.operators?.options[
      (currentOperatorIndex + 1) % currentRuleRow.operators.options.length
    ];
  }

  return defaultOperator;
}

const applyMutuallyExclusiveRules = (currentIndex = null, map = new Map(), currentRuleRow = null) => {
  
  const selectedOperator = currentRuleRow?.selectedOperator;

  currentRuleRow = currentRuleRow || map.get(currentIndex);
  if (!currentRuleRow) return map;
  
  addMutualIndex(map, currentIndex, currentRuleRow);

  const mutualIndex = currentRuleRow.operators?.index;

  const isMutualIndexExist = ![undefined, null].includes(mutualIndex);

  const mutualRuleRow = isMutualIndexExist && map.get(mutualIndex);

  const defaultOperator = getDefaultOperator(currentRuleRow, mutualRuleRow);
  
  if (isMutualIndexExist && mutualRuleRow) {
    
    if (selectedOperator.operatorType) {
      
      // If selecting an inclusive/exclusive operator, disable the same type in the current rule
      currentRuleRow.operators.options = currentRuleRow.operators.options.map(option => ({
        ...option,
        disabled: selectedOperator.operatorType && option.operatorType
          && (option.operatorType !== selectedOperator.operatorType)
      }));
      
      // If selecting an inclusive/exclusive operator, disable the same type in the mutual rule
      mutualRuleRow.operators.options = mutualRuleRow.operators.options.map(option => ({
        ...option,
        disabled: option.operatorType === selectedOperator.operatorType
      }));
    }
    else {
      // If selecting a null operator ("equals anything"), disable the same row's "contains any"
      currentRuleRow.operators.options = currentRuleRow.operators.options.map(option => ({
        ...option,
        disabled: option.operatorType === mutualRuleRow.selectedOperator.operatorType,
      }));

      // Re-enable all options in the mutual rule since it's now unrelated
      mutualRuleRow.operators.options = mutualRuleRow.operators.options.map(option => ({
        ...option,
        disabled: false,
      }));
    }
    
    map.set(mutualIndex, mutualRuleRow);
  }

  map.set(currentIndex, {
    ...currentRuleRow,
    selectedOperator: defaultOperator
  });
  

  return map;
}



// ✅ Add New Eligibility Criteria
const addEligibilityCriteria = () => {

  const nextRule = getNextAvailableRule();
  if (!nextRule) return;

  setEligibilityCriteriaMap(prev => {

    const currentMap = new Map(prev);
    const newIndex = currentMap.size;

    const currentRuleRow = getInitialRuleValues(nextRule, eligibilityCriteriaData);

    return new Map(sortByPriority(
      applyMutuallyExclusiveRules(
        newIndex,
        currentMap,
        currentRuleRow
      ),
      eligibilityCriteriaData
    ));
  });

  setActiveRules(prev => {
    const currentMap = new Map(prev);
    currentMap.set(currentMap.size, nextRule.rule.value);
    return currentMap;
  });

  setDisabledRules(prev => new Set([...prev, nextRule.rule.value]));
}



// ✅ Remove Eligibility Criteria
const removeEligibilityCriteria = (index) => {

  setEligibilityCriteriaMap(prev => {
    const newMap = new Map(prev);
    const removedRule = newMap.get(index)?.selectedRule?.value;
    newMap.delete(index);

    setActiveRules(prevActive => {
      const newActive = new Map(prevActive);
      newActive.delete(index);
      return newActive;
    });

    setDisabledRules(prevDisabled => {
      const newDisabled = new Set(prevDisabled);
      if (removedRule) newDisabled.delete(removedRule); // ✅ Re-enable removed rule
      return newDisabled;
    });

    return newMap;
  });
}


const selectOperatorHandler = (() => {

  let selectRefCurrent = null;

  return {
    selectRefCurrent: refCurrent => selectRefCurrent = refCurrent,
    update: selectedOptionValue => {
      if (selectRefCurrent) selectRefCurrent.setState(selectedOptionValue);
    }
  };
})();



// ✅ Handle Rule Selection
const handleOnRuleSelect = (index, selectedRule) => {

  setEligibilityCriteriaMap(prev => {

    const newMap = new Map(prev);
    
    const prevRuleRow = newMap.get(index);
    const prevRule = prevRuleRow.selectedRule?.value;

    setActiveRules(prevActive => {
      const newActive = new Map(prevActive);
      newActive.set(index, selectedRule.value);
      return newActive;
    });

    setDisabledRules(prevDisabled => {
      const newDisabled = new Set(prevDisabled);
      if (prevRule) newDisabled.delete(prevRule); // ✅ Remove old rule from disabled list
      newDisabled.add(selectedRule.value); // ✅ Add newly selected rule to disabled list
      return newDisabled;
    });

    const selectedRuleValue = eligibilityCriteriaData[selectedRule.group].rules[selectedRule.value];
    
    const currentRuleRow = {
      ...prevRuleRow,
      selectedRule: { ...selectedRule, active: true },
      operators: selectedRuleValue.operators,
      items: selectedRuleValue.items,
      layout: selectedRuleValue.layout
    };

    newMap.set(index, currentRuleRow);

    const updatedMap = applyMutuallyExclusiveRules(index, newMap, currentRuleRow);
    const updatedCurrentRuleRow = updatedMap.get(index);

    selectOperatorHandler.update(updatedCurrentRuleRow?.selectedOperator?.value);

    return new Map(sortByPriority(updatedMap, eligibilityCriteriaData));
  });
}


const handleOnOperatorSelect = (index, selectedOperator) => {

  setEligibilityCriteriaMap(prev => {

    const newMap = new Map(prev);
    const currentRuleRow = newMap.get(index);

    if (!currentRuleRow) return newMap;

    currentRuleRow.selectedOperator = selectedOperator;


    return new Map(
      applyMutuallyExclusiveRules(
        index,
        newMap,
        currentRuleRow
      )
    );
  });
}


// ✅ Generates Props for Each Component in Layout
const handleComponentProps = useCallback((index, componentName) => {

  const row = eligibilityCriteriaMap.get(index);
  if (!row) return {};

  switch (componentName) {

    case "RuleSelector":
      return {
        options: rulesOptions.map((group) => ({
          ...group,
          items: group.items.map((item) => ({
            ...item,
            active: activeRules.get(index) === item.value,
            disabled: item.value !== activeRules.get(index) && disabledRules.has(item.value),
          })),
        })),
        defaultOption: row?.selectedRule || getNextAvailableRule()?.rule, // ✅ Use next available rule
        group: true,
        onSelect: selectedRule => handleOnRuleSelect(index, selectedRule),
      };

      case "OperatorSelector":
        return {
          options: row.operators.options.map(op => ({
            ...op,
            disabled: op.disabled,
          })),
          defaultOption: row.operators.options.find(option => option.value === row.selectedOperator.value),
          group: false,
          onSelect: selectedOperator => handleOnOperatorSelect(index, selectedOperator),
          getSelectRefCurrent: selectOperatorHandler.selectRefCurrent,
        };
      

    case "ItemsSearchSelector":
      return {
        options: row.items,
        placeholder: "Search",
      };

    default:
      return {};
  }
}, [eligibilityCriteriaMap, activeRules, disabledRules]);



return (
  <div className="app h-screen flex justify-center items-center ">
    <div className="cont flex flex-col items-center gap-5">
      <h1 className="heading mb-5 text-4xl text-center">
        Eligibility Rules
      </h1>
      <div className="inner-cont">
        {[...eligibilityCriteriaMap.keys()].map(index => {
          const row = eligibilityCriteriaMap.get(index);
          return (
            <EligibilityCriteriaRow key={index} className="flex space-x-5 space-y-5">
              {row.layout.map((componentName, innerIndex) => {
                const Component = componentsMap[componentName];
                return Component ? (
                  <Component key={innerIndex} {...handleComponentProps(index, componentName)} />
                ) : null;
              })}
              <button
                className="remove-btn mb-5"
                onClick={() => removeEligibilityCriteria(index)}
              >
                ✖
              </button>
            </EligibilityCriteriaRow>
          );
        })}
      </div>
      <button
        className="and-btn flex justify-center px-4 py-1 rounded-md bg-gray-400"
        onClick={addEligibilityCriteria}
        disabled={!getNextAvailableRule()}
      >
        + AND
      </button>
    </div>
  </div>
);
}


export default App;