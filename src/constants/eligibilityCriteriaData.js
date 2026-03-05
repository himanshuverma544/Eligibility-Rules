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
              active: false,
              layout: [
                {
                  component: "RuleSelector",
                },
                {
                  component: "OperatorSelector"
                },
                {
                  component: "ItemsSearchSelector",
                  props: {
                    placeholder: "Search Collections"
                  }
                }
              ],
            },
            {
              label: "is not",
              value: "is-not",
              operatorType: "exclusion",
              active: false,
              layout: [
                {
                  component: "RuleSelector",
                },
                {
                  component: "OperatorSelector"
                },
                {
                  component: "ItemsSearchSelector",
                  props: {
                    placeholder: "Search Collections"
                  }
                }
              ],
            }
          ],
          mutuallyExclusiveWith: "specific-product"
        },
        items: ["Archived", "Accessory", "Premium", "Snow", "Snowboard", "Sport", "Winter"],
        priority: 1.1,
        active: false
      },
      "product-tags": {
        label: "Product Tags",
        operators: {
          options: [
            {
              label: "contains any",
              value: "contains-any",
              active: false,
              layout: [
                {
                  component: "RuleSelector"
                },
                {
                  component: "OperatorSelector"
                },
                {
                  component: "ItemsSearchSelector",
                  props: {
                    placeholder: "Search Product Tags"
                  }
                }
              ]
            },
            {
              label: "is not",
              value: "is-not",
              active: false,
              layout: [
                {
                  component: "RuleSelector"
                },
                {
                  component: "OperatorSelector"
                },
                {
                  component: "ItemsSearchSelector",
                  props: {
                    placeholder: "Search Product Tags"
                  }
                }
              ]
            }
          ]
        },
        items: ["Black", "Blue"],
        priority: 1.2,
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
              active: false,
              layout: [
                {
                  component: "RuleSelector"
                },
                {
                  component: "OperatorSelector"
                },
                {
                  component: "ItemsSearchSelector",
                  props: {
                    placeholder: "Search Specific Product"
                  }
                }
              ],
            },
            {
              label: "contains any",
              value: "contains-any",
              operatorType: "inclusion",
              active: false,
              layout: [
                {
                  component: "RuleSelector"
                },
                {
                  component: "OperatorSelector"
                },
                {
                  component: "ItemsSearchSelector",
                  props: {
                    placeholder: "Search Specific Product"
                  }
                }
              ],
            },
            {
              label: "is not",
              value: "is-not",
              operatorType: "exclusion",
              active: false,
              layout: [
                {
                  component: "RuleSelector"
                },
                {
                  component: "OperatorSelector"
                },
                {
                  component: "ItemsSearchSelector",
                  props: {
                    placeholder: "Search Specific Product"
                  }
                }
              ],
            }
          ],
          mutuallyExclusiveWith: "specific-collection"
        },
        items: ["Shoes", "Headphone", "Watch", "Laptop"],
        priority: 1.3,
        active: false
      },
      "product-subscribed": {
        label: "Product Subscribed",
        operators: {
          options: [
            {
              label: "yes",
              value: "yes",
              active: false,
              layout: [
                {
                  component: "RuleSelector",
                },
                {
                  component: "OperatorSelector"
                }
              ]
            },
            {
              label: "no",
              value: "no",
              active: false,
              layout: [
                {
                  component: "RuleSelector"
                },
                {
                  component: "OperatorSelector"
                }
              ]
            }
          ]
        },
        priority: 1.4,
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
        layout: [
          {
            component: "RuleSelector"
          },
          {
            component: "TextInput",
            props: {
              placeholder: "Enter Specific Discount Codes"
            }
          }
        ],
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
              active: false,
              layout: [
                {
                  component: "RuleSelector"
                },
                {
                  component: "OperatorSelector"
                },
                {
                  component: "NumberInput",
                  props: {
                    placeholder: "Enter Amount"
                  }
                }
              ]
            },
            {
              label: "is between",
              value: "is-between",
              active: false,
              layout: [
                {
                  component: "RuleSelector"
                },
                {
                  component: "OperatorSelector"
                },
                {
                  component: "NumberInput",
                  props: {
                    placeholder: "Enter Min. Amount"
                  }
                },
                {
                  component: "NumberInput",
                  props: {
                    placeholder: "Enter Max. Amount"
                  }
                }
              ]
            },
            {
              label: "is less than",
              value: "is-less-than",
              active: false,
              layout: [
                {
                  component: "RuleSelector"
                },
                {
                  component: "OperatorSelector"
                },
                {
                  component: "NumberInput",
                  props: {
                    placeholder: "Enter Amount"
                  }
                }
              ]
            }
          ]
        },
        currencies: ["All Currencies", "USD", "INR"],
        priority: 3.1,
        active: false
      }
    }
  }
};


export default eligibilityCriteriaData;