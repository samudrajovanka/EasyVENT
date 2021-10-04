import PropTypes from 'prop-types';

export default function Badge({ children }) {
  return (
    <div className="py-2 px-4 bg-ev-gray rounded-full">
      {children}
    </div>
  );
}

Badge.propTypes = {
  children: PropTypes.node.isRequired,
};
