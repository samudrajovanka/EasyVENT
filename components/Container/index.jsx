import PropTypes from 'prop-types';

export default function Container({ children }) {
  return (
    <div className="px-4 pt-4 pb-20 sm:pb-4 md:px-12 lg:px-24 xl:px-48 2xl:px-56 lg:py-10">
      {children}
    </div>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};
