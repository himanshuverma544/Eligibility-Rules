/* Kept in this data structure because objects in JS uses HashMap internally and will give O(1) time complexity for CRUD operations */

const eligibilityCriteriaData = {
  "Product Based": {
    priority: 1,
    rules: {
      "specific-collection": {
        label: "Specific Collections",
        operators: {
          options: [
            {
              label: "contains any",
              value: "contains-any",
              operatorType: "inclusion",
              active: false
            },
            {
              label: "is not",
              value: "is-not",
              operatorType: "exclusion",
              active: false
            }
          ],
          mutuallyExclusiveWith: "specific-product"
        },
        items: ["Archived", "Accessory", "Premium", "Snow", "Snowboard", "Sport", "Winter"],
        priority: 1.1,
        layout: ["RuleSelector", "OperatorSelector", "ItemsSearchSelector"],
        active: false
      },
      "product-tags": {
        label: "Product Tags",
        operators: {
          options: [
            {
              label: "contains any",
              value: "contains-any",
              active: false
            },
            {
              label: "is not",
              value: "is-not",
              active: false
            }
          ]
        },
        items: ["Black", "Blue"],
        priority: 1.2,
        layout: ["RuleSelector", "OperatorSelector", "ItemsSearchSelector"],
        active: false
      },
      "specific-product": {
        label: "Specific Product",
        operators: {
          options: [
            {
              label: "equals anything",
              value: "equals-anything",
              operatorType: null,
              active: false
            },
            {
              label: "contains any",
              value: "contains-any",
              operatorType: "inclusion",
              active: false
            },
            {
              label: "is not",
              value: "is-not",
              operatorType: "exclusion",
              active: false
            }
          ],
          mutuallyExclusiveWith: "specific-collection"
        },
        items: ["Shoes", "Headphone", "Watch", "Laptop"],
        priority: 1.3,
        layout: ["RuleSelector", "OperatorSelector", "ItemsSearchSelector"],
        active: false
      },
      "product-subscribed": {
        label: "Product Subscribed",
        operators: {
          options: [
            {
              label: "yes",
              value: "yes",
              active: false
            },
            {
              label: "no",
              value: "no",
              active: false
            }
          ]
        },
        priority: 1.4,
        layout: ["RuleSelector", "OperatorSelector"],
        active: false
      }
    }
  },
  "Discount Code": {
    priority: 2,
    rules: {
      "specific-discount-codes": {
        label: "Specific Discount Codes",
        priority: 2.1,
        layout: ["RuleSelector", "TextInput"],
        active: false
      }
    }
  },
  "Cart Based": {
    priority: 3,
    rules: {
      "cart-value-range": {
        label: "Cart Value Range",
        operators: {
          options: [
            {
              label: "is equal or greater",
              value: "is-equal-or-greater",
              active: false
            },
            {
              label: "is between",
              value: "is-between",
              active: false
            },
            {
              label: "is less than",
              value: "is-less-than",
              active: false
            }
          ]
        },
        currencies: ["All Currencies", "USD", "INR"],
        priority: 3.1,
        layout: ["RuleSelector", "OperatorSelector", "NumberInput", "NumberInput"],
        active: false
      }
    }
  }
};


export default eligibilityCriteriaData;