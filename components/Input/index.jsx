import PropTypes from 'prop-types';

export default function Input({
  type, required, placeholder, value, onChange, id, large,
}) {
  if (large) {
    return (
      <textarea
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        id={id}
        rows="5"
        className="border border-ev-gray px-3 py-2 rounded resize-y"
      />
    );
  }

  return (
    <input
      type={type}
      required={required}
      id={id}
      className="border border-ev-gray px-3 py-2 rounded w-full"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
}

Input.defaultProps = {
  type: 'text',
  required: false,
  large: false,
};

Input.propTypes = {
  type: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  large: PropTypes.bool,
};
