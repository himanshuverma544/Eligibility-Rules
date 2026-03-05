import "./App.css";

import { useState, useMemo } from "react";

import EligibilityCriteriaRow from "./components/EligibilityCriteriaRow.jsx"

import useEligibilityCriteriaManager from "./hooks/useEligibilityCriteriaManager.jsx"

import { getRuleOptionsArray, getNextAvailableRule } from "./functions/rulesUtils.js";

import eligibilityCriteriaData from "./constants/eligibilityCriteriaData.js";


function App() {

  const eligibilityCriteriaRowsState = useState(new Map());
  const [ eligibilityCriteriaRows ] = eligibilityCriteriaRowsState;

  const activeRulesState = useState(new Map());

  const disabledRulesState = useState(new Set());
  const [ disabledRules ] = disabledRulesState;


  const states = {
    eligibilityCriteriaRowsState,
    activeRulesState,
    disabledRulesState
  };

  const rulesOptions = useMemo(() => getRuleOptionsArray(eligibilityCriteriaData), []);


  const {
    addEligibilityCriteriaRow,
    removeEligibilityCriteriaRow,
    handleOnRuleSelect,
    handleOnOperatorSelect,
    selectOperatorHandler
  }
    = useEligibilityCriteriaManager({ states, rulesOptions, eligibilityCriteriaData });


  return (
    <div className="app h-screen flex justify-center items-center bg-gray-100">
      <div className="cont w-[60rem] flex flex-col justify-center gap-5 p-20 rounded-lg bg-white">
        <div className="text-cont w-full flex flex-col gap-2">
          <h1 className="heading font-semibold">
            Rule
          </h1>
          <h2 className="sub-heading text-sm font-medium">
            The offer will be triggered based on the rules in this section.
          </h2>
        </div>

        <hr className="divider w-full border-black/20"/>

        <div className="inner-cont flex flex-col gap-3">
          {eligibilityCriteriaRows.size > 0 &&
            <h3 className="super-sub-heading text-sm font-medium">
              Show offer if
            </h3>
          }
          <div className="eligiblity-criteria-rows-cont flex flex-col gap-5">
            {[...eligibilityCriteriaRows.entries()].map(([rowIndex, row], index) => {
              return (
                <EligibilityCriteriaRow
                  key={index}
                  index={rowIndex}
                  currentRow={row}
                  rulesOptions={rulesOptions}
                  activeRulesState={activeRulesState}
                  disabledRulesState={disabledRulesState}
                  selectOperatorHandler={selectOperatorHandler}
                  handlers={{
                    rule: { handleOnRuleSelect },
                    operator: { handleOnOperatorSelect, selectOperatorHandler }
                  }}
                  removeRow={removeEligibilityCriteriaRow}
                />
              );
            })}
          </div>
        </div>

        <button
          className="and-btn flex justify-center px-4 py-1 rounded-md bg-gray-400"
          onClick={addEligibilityCriteriaRow}
          disabled={!getNextAvailableRule(rulesOptions, disabledRules)}
        >
          + AND
        </button>
      </div>
    </div>
  );
}


export default App;