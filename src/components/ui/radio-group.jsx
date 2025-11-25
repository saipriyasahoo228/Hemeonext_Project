import * as React from "react";

const RadioGroup = ({ value, onChange, children, className, ...props }) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value); // Pass the selected value to the parent
    }
  };

  return (
    <div role="radiogroup" className={`flex flex-col space-y-2 ${className}`} {...props}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          checked: child.props.value === value, // Sync checked state
          onChange: handleChange, // Pass the change handler
        })
      )}
    </div>
  );
};

const RadioGroupItem = ({ id, value, label, checked, onChange, ...props }) => {
  return (
    <label htmlFor={id} className="flex items-center space-x-2 cursor-pointer">
      <input
        type="radio"
        id={id}
        name="radio-group"
        value={value}
        checked={checked} // Controlled by RadioGroup
        onChange={onChange} // Triggered by user interaction
        {...props}
      />
      <span>{label}</span>
    </label>
  );
};

export { RadioGroup, RadioGroupItem };