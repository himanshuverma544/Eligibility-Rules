export default function Wrapper({ tag: Tag = "div", className = "", children, ...props }) {

  return (
    <Tag className={className} {...props}>
      {children}
    </Tag>    
  );
}
