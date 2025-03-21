import Select from "../components/Select";

const RuleSelector = Select;
const OperatorSelector = Select;


import Input from "../components/Input";

const TextInput = Input;
const NumberInput = Input


import ItemsSearchSelector from '../components/SearchSelector';


const componentMap = {
  RuleSelector: props => <RuleSelector {...props}/>,
  OperatorSelector: props => <OperatorSelector {...props}/>,
  ItemsSearchSelector: props => <ItemsSearchSelector {...props}/>,
  TextInput: props => <TextInput type="text" placeholder="Enter Text" {...props}/>,
  NumberInput: props => <NumberInput type="number" placeholder="Enter Number" {...props}/>
};


export default componentMap;