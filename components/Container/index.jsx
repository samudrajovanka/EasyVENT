import PropTypes from 'prop-types';

export default function Container({ children }) {
  return (
    <div className="px-48 py-10">
      {children}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};
