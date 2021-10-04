import PropTypes from 'prop-types';

export default function PaginationBox({
  children, active, onClick, type,
}) {
  let color = active ? 'bg-ev-blue text-white' : 'bg-white hover:bg-ev-gray';
  if (type === 'arrow') {
    color = active ? 'bg-white text-ev-gray' : 'bg-white';
  }

  let cursor = 'cursor-pointer';
  if (type === 'arrow') {
    cursor = active ? 'cursor-default' : 'cursor-pointer';
  }

  return (
    <div
      className={`flex items-center justify-center w-10 h-10 border-r border-l border-ev-gray ${cursor} ${color}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

PaginationBox.defaultProps = {
  active: false,
};

PaginationBox.propTypes = {
  children: PropTypes.node.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};
