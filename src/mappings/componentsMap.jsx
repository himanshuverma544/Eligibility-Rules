import Select from "../components/layouts/Select";

const RuleSelector = Select;
const OperatorSelector = Select;

import Input from "../components/layouts/Input";

const TextInput = Input;
const NumberInput = Input

import ItemsSearchSelector from '../components/layouts/SearchSelector';


const componentsMap = {
  RuleSelector: props => <RuleSelector {...props}/>,
  OperatorSelector: props => <OperatorSelector {...props}/>,
  ItemsSearchSelector: props => <ItemsSearchSelector {...props}/>,
  TextInput: props => <TextInput {...props} type="text"/>,
  NumberInput: props => <NumberInput {...props} type="number"/>
};


export default componentsMap;