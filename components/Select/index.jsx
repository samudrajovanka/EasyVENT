import PropTypes from 'prop-types';

export default function Select({
  options,
  placeholder,
  required,
  onChange,
  value,
}) {
  return (
    <select required={required} className="border border-ev-gray px-3 py-2 rounded" onChange={onChange} value={value}>
      <option>{ `- ${placeholder} -` }</option>
      {options.map((option) => (
        <option key={option.value} value={option.value} selected={option.selected}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    selected: PropTypes.bool,
  })).isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
