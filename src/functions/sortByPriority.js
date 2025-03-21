export default function sortByPriority(eligibilityCriteriaMap = new Map(), eligibilityCriteriaData = null) {

  return [...eligibilityCriteriaMap.entries()].sort((a, b) => {

    const getSelectedRuleGroupPriority = currentRuleRow => {
  
      return eligibilityCriteriaData[currentRuleRow[1].selectedRule.group]?.priority || 0;
    }
    
    const getSelectedRulePriority = currentRuleRow => {
      
      return eligibilityCriteriaData[currentRuleRow[1].selectedRule.group]?.rules[currentRuleRow[1].selectedRule.value]?.priority || 0;
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