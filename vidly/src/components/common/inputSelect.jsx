import React from "react";

const InputSelect = ({ name, label, error, dropList, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <select className="custom-select" id={name} name={name} {...rest}>
        {dropList.map(item => (
          <option key={item._id} value={item._id}>
            {item.name}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default InputSelect;
