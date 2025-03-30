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
    <div className="app h-screen flex justify-center items-center ">
      <div className="cont flex flex-col items-center gap-5">
        <h1 className="heading mb-5 text-4xl text-center">
          Eligibility Rules
        </h1>

        <div className="inner-cont">
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