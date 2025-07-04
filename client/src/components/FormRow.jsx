const FormRow = ({ type, name, labelText, defaultValue, isRequired, hide }) => {
  return (
    <div className='m-0 w-full text-left'>
      {!hide && (
        <label className='m-0 capitalize' htmlFor={name}>
          {labelText || name}
        </label>
      )}
      <input
        className='w-full p-2 mb-2 border-1 rounded'
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
