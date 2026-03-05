import Component from "./Icon";


const RequiredComponent = ({ componentName = "", componentsMap = null, ...props }) => {

  if (!componentName || !componentsMap) null;

  return (
    <Component
      content={componentsMap[componentName]}
      {...props}
    />
  );
}


export default RequiredComponent;