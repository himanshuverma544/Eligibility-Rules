/* Gives the rules along with their group in an array for the RuleSelector Component */

export default function getRuleOptionsArray(eligibilityCriteriaData = null) {

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