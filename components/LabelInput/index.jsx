import Input from '@components/Input';
import PropTypes from 'prop-types';

export default function LabelInput({
  type, id, label, required, placeholder, value, onChange, errorMessage,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>
        {label}
        {required && <span className="text-ev-red">*</span>}
      </label>
      <Input
        type={type}
        id={id}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {errorMessage && <p className="text-ev-red text-sm">{errorMessage}</p>}
    </div>
  );
}

LabelInput.defaultProps = {
  type: 'text',
  required: false,
  errorMessage: '',
};

LabelInput.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};
