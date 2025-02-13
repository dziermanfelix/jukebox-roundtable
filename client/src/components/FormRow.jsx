const FormRow = ({ type, name, labelText, defaultValue, isRequired, hide }) => {
  return (
    <div>
      {!hide && <label htmlFor={name}>{labelText || name}</label>}
      <input type={type} id={name} name={name} defaultValue={defaultValue || ''} required={isRequired && true} />
    </div>
  );
};

export default FormRow;
