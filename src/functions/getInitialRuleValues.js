export default function getInitialRuleValues(rule = null, eligibilityCriteriaData = null) {

  if (!rule) return null;

  const { group, rule: ruleItem } = rule;

  const ruleItemValue = eligibilityCriteriaData[group.label].rules[ruleItem.value];

  return {
    selectedRule: {...ruleItem, group: group.label, active: true},
    selectedOperator: ruleItemValue?.operators?.options[0],
    operators: ruleItemValue?.operators || null,
    items: ruleItemValue?.items || null,
    layout: ruleItemValue.layout
  };
}