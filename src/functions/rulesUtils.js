/* Gives the rules along with their group in an array for the RuleSelector Component */

export function getRuleOptionsArray(eligibilityCriteriaData = null) {

  return (
    Object.entries(eligibilityCriteriaData).map(([groupKey, group]) => ({
      label: groupKey,
      items: Object.entries(group.rules).map(([ruleKey, rule]) => ({
        label: rule.label,
        value: ruleKey,
        active: rule.active
      }))
    }))
  );
}


export function getNextAvailableRule (rulesOptions = [], disabledRules = new Set()) {

  for (const group of rulesOptions) {
    for (const rule of group.items) {

      if (!disabledRules.has(rule.value)) {
        return { group, rule };
      }
    }
  }

  return null;
}


export function getInitialRuleValues (nextRule = null, eligibilityCriteriaData = null) {

  if (!nextRule || !eligibilityCriteriaData) {
    return null;
  }

  const { group, rule: ruleItem } = nextRule;

  const ruleItemValue = eligibilityCriteriaData[group.label].rules[ruleItem.value];

  return {
    selectedRule: {...ruleItem, group: group.label, active: true},
    selectedOperator: {...ruleItemValue?.operators?.options[0], index: 0},
    operators: ruleItemValue?.operators || null,
    items: ruleItemValue?.items || null,
    layout: ruleItemValue?.layout,
    priority: ruleItemValue?.priority
  };
}
