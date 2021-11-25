import Select from '@components/Select';
import PropTypes from 'prop-types';

export default function LabelSelect({
  id, label, options, required, placeholder, onChange, errorMessage, value,
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id}>
        {label}
        {required && <span className="text-ev-red">*</span>}
      </label>
      <Select
        id={id}
        required={required}
        placeholder={placeholder}
        value={value}
        options={options}
        onChange={onChange}
      />
      {errorMessage && <p className="text-ev-red text-sm">{errorMessage}</p>}
    </div>
  );
}

LabelSelect.defaultProps = {
  required: false,
  errorMessage: '',
};

LabelSelect.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.string,
};
