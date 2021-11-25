import PropTypes from 'prop-types';

export default function Title({ children, heading }) {
  switch (heading) {
    case '2':
      return (
        <h2 className="font-medium text-lg md:text-xl">{children}</h2>
      );
    default:
      return (
        <h1 className="font-bold text-xl md:text-2xl">{children}</h1>
      );
  }
}

Title.defaultProps = {
  heading: 'heading-1',
};

Title.propTypes = {
  children: PropTypes.node.isRequired,
  heading: PropTypes.string,
};
