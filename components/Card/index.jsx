import PropTypes from 'prop-types';

export default function Card({
  children, width, padding, direction, gap,
}) {
  return (
    <div className={`border border-ev-gray shadow-lg rounded flex ${width} ${padding} ${direction} ${gap}`}>
      {children}
    </div>
  );
}

Card.defaultProps = {
  width: 'w-full',
  padding: 'p-4',
  direction: 'flex-col',
  gap: 'gap-4',
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  width: PropTypes.string,
  padding: PropTypes.string,
  direction: PropTypes.string,
  gap: PropTypes.string,
};
