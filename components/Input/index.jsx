import PropTypes from 'prop-types';

export default function Input({
  type, required, placeholder, value, onChange, id,
}) {
  return (
    <input
      type={type}
      required={required}
      id={id}
      className="border border-ev-gray px-3 py-2 rounded"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

Input.defaultProps = {
  type: 'text',
  required: false,
};

Input.propTypes = {
  type: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
};
