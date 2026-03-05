import React from 'react';

import Wrapper from "../components/Wrapper";

let ImageComponent;

try {
  ImageComponent = require("next/image").default;
}
catch (error) {
  ImageComponent = null;
}


function isReactElement(icon) {
  return React.isValidElement(icon);
}

function isReactComponent(icon) {
  return (
    typeof icon === 'function' &&
    (
      icon.prototype?.isReactComponent || 
      String(icon).includes('createElement') || 
      React.isValidElement(React.createElement(icon))
    )
  );
}

function isImage(icon) {
  const imageExtensions = /\.(jpg|jpeg|png|gif|svg|webp|bmp|tiff|heic|heif|ico|avif|raw|cr2|nef|arw|dng|jfif|psd|eps|pdf|exr|tga|pcx|xcf)$/i;
  return typeof icon === 'string' && imageExtensions.test(icon);
}

function isHTML(icon) {
  return /<[^>]+>/.test(icon);
}

function isString(icon) {
  return typeof icon === "string";
}


const Icon = ({
  className = "",
  innerClassName = "",
  icon = null,
  content = null,
  alt = "",
  tag = "div",
  ...props
}) => {

  icon = content;

  if (isReactElement(icon)) {
    return React.cloneElement(icon, { className, 'aria-label': alt, ...props });
  }

  if (isReactComponent(icon)) {
    const TheIcon = icon;
    return <TheIcon className={className} aria-label={alt} {...props} />;
  }

  if (isImage(icon)) {
    return (
      <div className={className} {...props}>
        {ImageComponent ? (
          <ImageComponent className={innerClassName} fill src={icon} alt={alt} />
        ) : (
          <img className={innerClassName} src={icon} alt={alt} />
        )}
      </div>
    );
  }

  if (isHTML(icon)) {

    const HTML = icon;

    return (
      <Wrapper
        tag={tag}
        className={className}
        dangerouslySetInnerHTML={{ __html: HTML }}
        {...props}
      />
    );
  }

  if (isString(icon)) {
    return <span className={className} {...props}>{icon}</span>;
  }

  return null;
};


export default Icon;