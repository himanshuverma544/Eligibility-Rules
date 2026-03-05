import { sortByPriority, applyMutuallyExclusiveRules } from "../functions/eligibilityUtils";
import { getNextAvailableRule, getInitialRuleValues } from "../functions/rulesUtils";


export default function useEligibilityCriteriaManager({
  states = {},
  rulesOptions = [],
  eligibilityCriteriaData = null
} = {}) {

  const [_, setEligibilityCriteriaRows] = states?.eligibilityCriteriaRowsState || [];

  const [__, setActiveRules] = states?.activeRulesState || [];
  const [disabledRules, setDisabledRules] = states?.disabledRulesState || [];


  const manageRulesBehaviour = (requiredRule = null, operation = null) => {

    if (!requiredRule) return;

    const addActiveRule = (activeMap, requiredRule) => activeMap.set(activeMap.size, requiredRule.value);
    const removeActiveRule = (activeMap, requiredRule) => activeMap.delete(requiredRule.index);

    const addDisabledRule = (disabledSet, requiredRule) => disabledSet.add(requiredRule.value);
    const removeDisabledRule = (disabledSet, requiredRule) => { if (requiredRule) disabledSet.delete(requiredRule.value); }

    setActiveRules(prevActive => {

      const newActive = new Map(prevActive);

      switch (operation) {

        case "add":
          addActiveRule(newActive, requiredRule);
          break;

        case "remove":
          removeActiveRule(newActive, requiredRule);
          break;

        case "update":
          addActiveRule(newActive, requiredRule?.new || requiredRule);
      }

      return newActive;
    });

    setDisabledRules(prevDisabled => {

      const newDisabled = new Set(prevDisabled);

      switch (operation) {

        case "add":
          addDisabledRule(newDisabled, requiredRule);
          break;

        case "remove":
          removeDisabledRule(newDisabled, requiredRule);
          break;

        case "update":
          removeDisabledRule(newDisabled, requiredRule?.prev);
          addDisabledRule(newDisabled, requiredRule?.new);
      }

      return newDisabled;
    });
  }


  const addEligibilityCriteriaRow = () => {

    const nextRule = getNextAvailableRule(rulesOptions, disabledRules);
    if (!nextRule) return;

    setEligibilityCriteriaRows(prev => {

      const currentMap = new Map(prev);
      const newIndex = currentMap.size;

      const currentRuleRow = getInitialRuleValues(nextRule, eligibilityCriteriaData);

      let requiredMap = applyMutuallyExclusiveRules(newIndex, currentMap, currentRuleRow);
      requiredMap = sortByPriority(requiredMap, eligibilityCriteriaData);

      return new Map(requiredMap);
    });

    manageRulesBehaviour(nextRule.rule, "add");
  }

  
  const removeEligibilityCriteriaRow = index => {

    setEligibilityCriteriaRows(prev => {

      const newMap = new Map(prev);

      const removedRule = {
        index,
        value: newMap.get(index)?.selectedRule?.value
      };

      newMap.delete(index);
      manageRulesBehaviour(removedRule, "remove");

      return newMap;
    });
  }


  const selectOperatorHandler = (() => {

    let selectRefCurrent = null;
  
    return {
      selectRefCurrent: refCurrent => selectRefCurrent = refCurrent,
      update: selectedOptionValue => {
        
        if (selectRefCurrent) {
          selectRefCurrent.setState(selectedOptionValue);
        }
      }
    };
  })();
  
  const handleOnRuleSelect = (index, selectedRule) => {
    
    setEligibilityCriteriaRows(prev => {
      
      const newMap = new Map(prev);
      
      const prevRuleRow = newMap.get(index);
  
      const requiredRule = {
        index,
        prev: { value: prevRuleRow?.selectedRule?.value },
        new: { value: selectedRule?.value }
      }

      manageRulesBehaviour(requiredRule, "update");
      
      const currentSelectedRule = eligibilityCriteriaData[selectedRule.group].rules[selectedRule.value];

      const currentRuleRow = {
        ...prevRuleRow,
        operators: currentSelectedRule.operators,
        items: currentSelectedRule.items,
        layout: currentSelectedRule.layout,
        priority: currentSelectedRule.priority,
        selectedRule: { ...selectedRule, active: true },
        selectedOperator: currentSelectedRule?.operators?.options[0]
      };
  
      newMap.set(index, currentRuleRow);
  
      let requiredMap = applyMutuallyExclusiveRules(index, newMap, currentRuleRow);

      const requiredCurrentRuleRow = requiredMap.get(index);
      
      selectOperatorHandler.update(requiredCurrentRuleRow?.selectedOperator?.value);
      
      const sortedRequiredMapArr = sortByPriority(requiredMap, eligibilityCriteriaData);

      // console.log("At Rule Last: ", { requiredMap, currentIndex: index });

      return new Map(sortedRequiredMapArr);
    });
  }
  
  
  const handleOnOperatorSelect = (index, selectedOperator) => {
  
    setEligibilityCriteriaRows(prev => {
  
      const rows = new Map(prev);

      const currentRuleRow = rows.get(index);
      if (!currentRuleRow) return rows;
  
      currentRuleRow.selectedOperator = selectedOperator;

      rows.set(index, currentRuleRow);

      const requiredRows = applyMutuallyExclusiveRules(index, rows, currentRuleRow);
  
      return new Map(requiredRows);
    });
  }


  return {
    addEligibilityCriteriaRow,
    removeEligibilityCriteriaRow,
    handleOnRuleSelect,
    handleOnOperatorSelect,
    selectOperatorHandler
  };
}