import "./App.css";

import { useState, useMemo } from "react";

import EligibilityCriteriaRow from "./components/EligibilityCriteriaRow.jsx";

import useEligibilityCriteriaManager from "./hooks/useEligibilityCriteriaManager.jsx";

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
  = useEligibilityCriteriaManager({
      states,
      rulesOptions,
      eligibilityCriteriaData
  });


  const isNextRuleAvailable = getNextAvailableRule(rulesOptions, disabledRules);


  return (
    <div className="app min-h-screen flex justify-center items-center bg-gray-100 p-[5vw]">
      <div className="cont w-full flex flex-col justify-center gap-5 p-[5vw] rounded-lg bg-white lg:w-[60rem] lg:p-20">
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

        <div className="btn-cont flex justify-center items-center">
          <button
            className="add-btn px-4 py-1 rounded-md shadow-[1px_1px_0_0_#E3E3E3] text-sm font-medium"
            onClick={addEligibilityCriteriaRow}
            disabled={!isNextRuleAvailable}
            style={{ opacity: !isNextRuleAvailable ? 0.5 : 1 }}
          >
            + ADD
          </button>
        </div>
      </div>
    </div>
  );
}


export default App;