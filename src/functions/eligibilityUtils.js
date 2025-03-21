export const getNextAvailableRule = (rulesOptions, disabledRules) => {

  for (const group of rulesOptions) {
    for (const rule of group.items) {

      if (!disabledRules.has(rule.value)) {
        return { group, rule };
      }
    }
  }

  return null;
}


export const addMutualIndex = (criteriaMap, ruleIndex, currentRule) => {

  if (!currentRule.operators?.index) {

    for (let [index, rule] of criteriaMap.entries()) {

      if (rule.selectedRule?.value === currentRule?.operators?.mutuallyExclusiveWith) {

        currentRule.operators.index = index;
        rule.operators.index = ruleIndex;

        criteriaMap.set(index, rule);
        break;
      }
    }
  }
}


export const applyMutuallyExclusiveRules = (ruleIndex, criteriaMap, currentRule) => {

  currentRule = currentRule || criteriaMap.get(ruleIndex);
  if (!currentRule) return criteriaMap;

  addMutualIndex(criteriaMap, ruleIndex, currentRule);

  const relatedRuleIndex = currentRule.operators?.index;
  const relatedRule = relatedRuleIndex !== undefined ? criteriaMap.get(relatedRuleIndex) : null;

  if (relatedRule) {

    if (currentRule.selectedOperator.operatorType) {
      relatedRule.operators.options = relatedRule.operators.options.map(option => ({
        ...option,
        disabled: option.operatorType === currentRule.selectedOperator.operatorType,
      }));
    }
    else {
      currentRule.operators.options = currentRule.operators.options.map(option => ({
        ...option,
        disabled: option.operatorType === relatedRule.selectedOperator.operatorType,
      }));
      
      relatedRule.operators.options = relatedRule.operators.options.map(option => ({ ...option, disabled: false }));
    }
    criteriaMap.set(relatedRuleIndex, relatedRule);
  }

  criteriaMap.set(ruleIndex, currentRule);
  return criteriaMap;
};
