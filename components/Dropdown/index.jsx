import PropTypes from 'prop-types';

export default function Dropdown({ children }) {
  return (
    <div className="absolute right-0 -bottom-24 border border-ev-gray rounded bg-white shadow-lg">
      {children}
    </div>
  );
}

Dropdown.propTypes = {
  children: PropTypes.node.isRequired,
};
