import PropTypes from 'prop-types';
import Link from 'next/link';

export default function Button({
  children, type, onClick, typeButton, href,
}) {
  let backgroundBtn = '';
  let textColor = 'text-ev-black';
  if (typeButton === 'primary') {
    backgroundBtn = 'bg-ev-blue hover:bg-blue-700';
    textColor = 'text-white';
  } else if (typeButton === 'secondary') {
    backgroundBtn = 'bg-ev-gray hover:bg-gray-300';
  }

  if (href !== null) {
    return (
      <Link href={href}>
        <a className={`${backgroundBtn} ${textColor} flex items-center h-10 px-8 rounded`}>
          {children}
        </a>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${backgroundBtn} ${textColor} h-10 px-8 rounded`}
    >
      {children}
    </button>
  );
}

Button.defaultProps = {
  type: 'button',
  typeButton: 'primary',
  href: null,
};

Button.propsTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  typeButton: PropTypes.string,
  href: PropTypes.string,
};
