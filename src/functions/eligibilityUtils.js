export function sortByPriority(eligibilityCriteriaMap = new Map(), eligibilityCriteriaData = null) {

  if (!eligibilityCriteriaData) {
    return [...eligibilityCriteriaMap.entries()];
  }
  
  return [...eligibilityCriteriaMap.entries()].sort((a, b) => {
    
    const getSelectedRuleGroupPriority = currentRuleRow => {
      
      return eligibilityCriteriaData[currentRuleRow[1]?.selectedRule?.group]?.priority || 0;
    }
    
    const getSelectedRulePriority = currentRuleRow => {

      return eligibilityCriteriaData[currentRuleRow[1]?.selectedRule?.group]?.rules[currentRuleRow[1]?.selectedRule.value]?.priority || 0;
    }
    
    const groupPriorityA = getSelectedRuleGroupPriority(a);
    const groupPriorityB = getSelectedRuleGroupPriority(b);

    if (groupPriorityA !== groupPriorityB) {
      return groupPriorityA - groupPriorityB;
    }

    const rulePriorityA = getSelectedRulePriority(a);
    const rulePriorityB = getSelectedRulePriority(b);

    return rulePriorityA - rulePriorityB;
  });
}


export function getDefaultOperator(currentRuleRow = null, mutualRuleRow = null) {

  if (!currentRuleRow) return null;
    
  let defaultOperator = currentRuleRow?.selectedOperator || currentRuleRow?.operators?.options[0];

  if (mutualRuleRow) {
    
    let currentOperatorIndex = 0;
    const mutualSelectedOperator = mutualRuleRow?.selectedOperator;

    while(defaultOperator?.value === mutualSelectedOperator?.value) {
      
      const requiredIndex = currentOperatorIndex++ % currentRuleRow?.operators?.options?.length;
      defaultOperator = currentRuleRow?.operators?.options[requiredIndex];
    }
  }

  return defaultOperator;
}


export function addMutualIndexes(map, currentRuleRow, currentIndex, mutualRuleRow, mutualIndex) {

  if (currentRuleRow.priority > mutualRuleRow.priority) {

    currentRuleRow.operators.index = mutualIndex;
    mutualRuleRow.operators.index = currentIndex;

    map.set(currentIndex, currentRuleRow);
    map.set(mutualIndex, mutualRuleRow);
  }
  else if (currentRuleRow.priority < mutualRuleRow.priority) {

    currentRuleRow.operators.index = currentIndex;
    mutualRuleRow.operators.index = mutualIndex;

    map.set(currentIndex, mutualRuleRow);
    map.set(mutualIndex, currentRuleRow);
  }
  else {
    console.error("Invalid Priority.");
  }
}

export function addMutualIndexInBothRows(map = new Map(), currentIndex = null, currentRuleRow = null) {

  if (!currentRuleRow || currentIndex === null) return;
  
  for (let [index, rule] of map.entries()) {
    
    if (rule.selectedRule?.value === currentRuleRow?.operators?.mutuallyExclusiveWith) {
      
      addMutualIndexes(map, currentRuleRow, currentIndex, rule, index);
      break;
    } 
  }
}

export function disableOptions(targetRow = null, conditionFn = () => false) {

  if (!targetRow?.operators?.options) return; 

  targetRow.operators.options = targetRow?.operators?.options.map(option => ({
    ...option,
    disabled: conditionFn(option)
  }));
}

export function handleMutualExclusion(currentRuleRow = null, mutualRuleRow = null, map = new Map()) {

  if (!mutualRuleRow) return;

  const currentOperatorType = currentRuleRow?.selectedOperator?.operatorType;

  const isOperatorTypeDefault = !currentOperatorType;

  const mutualOperatorType = mutualRuleRow?.selectedOperator?.operatorType;
  const mutualIndex = currentRuleRow.operators?.index;

  if (isOperatorTypeDefault) {

    const disableRelatedTypeInCurrentRuleRow = option =>
      mutualOperatorType === option?.operatorType;
    disableOptions(currentRuleRow, disableRelatedTypeInCurrentRuleRow);

    const enableAllInMutualRuleRow = () => false;
    disableOptions(mutualRuleRow, enableAllInMutualRuleRow);
  }
  else {
    const disableComplementInCurrentRuleRow = option =>
      mutualOperatorType === option?.operatorType;
    disableOptions(currentRuleRow, disableComplementInCurrentRuleRow);

    const disableComplementInMutualRuleRow = option =>
      currentOperatorType === option?.operatorType;
    disableOptions(mutualRuleRow, disableComplementInMutualRuleRow);
  }

  map.set(mutualIndex, mutualRuleRow);
}

export function applyMutuallyExclusiveRules(currentIndex = null, map = new Map(), currentRuleRow = null) {

  if (!currentRuleRow) return map;

  addMutualIndexInBothRows(map, currentIndex, currentRuleRow);

  const mutualIndex = currentRuleRow.operators?.index;
  const mutualRuleRow = ![undefined, null].includes(mutualIndex) ? map.get(mutualIndex) : null;

  currentRuleRow.selectedOperator = getDefaultOperator(currentRuleRow, mutualRuleRow && mutualRuleRow);
  
  mutualRuleRow && handleMutualExclusion(currentRuleRow, mutualRuleRow, map);

  map.set(currentIndex, currentRuleRow);

  return map;
}