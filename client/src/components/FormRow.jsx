const FormRow = ({ type, name, labelText, defaultValue, isRequired, hide }) => {
  return (
    <div className='form-row'>
      {!hide && (
        <label className='form-label' htmlFor={name}>
          {labelText || name}
        </label>
      )}
      <input
        className='form-input'
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue || ''}
        required={isRequired && true}
      />
    </div>
  );
};

export default FormRow;
