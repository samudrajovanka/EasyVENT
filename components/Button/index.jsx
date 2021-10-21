import PropTypes from 'prop-types';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export default function Button({
  children, type, onClick, typeButton, href, full, target, disabled, loading,
}) {
  let backgroundBtn = '';
  let textColor = 'text-ev-black';
  if (typeButton === 'primary') {
    backgroundBtn = `bg-ev-blue ${disabled ? '' : 'hover:bg-blue-700'}`;
    textColor = 'text-white';
  } else if (typeButton === 'secondary') {
    backgroundBtn = `bg-ev-gray ${disabled ? '' : 'hover:bg-gray-300'}`;
  }

  let disabledBtn = '';
  if (disabled) {
    disabledBtn = 'cursor-not-allowed';
  }

  const sizeBtn = full ? 'w-full' : '';

  if (href !== null) {
    return (
      <Link href={href}>
        <a
          className={`${backgroundBtn} ${textColor} ${disabledBtn} ${sizeBtn} flex items-center h-10 px-8 rounded justify-center`}
          target={target}
        >
          {children}
        </a>
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${backgroundBtn} ${textColor} ${disabledBtn} ${sizeBtn} h-10 px-8 rounded`}
      disabled={disabled || loading}
    >
      {loading && (
        <p>
          <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
          Loading
        </p>
      )}
      {!loading && children}
    </button>
  );
}

Button.defaultProps = {
  type: 'button',
  typeButton: 'primary',
  href: null,
  full: false,
  target: '_self',
  disabled: false,
  loading: false,
};

Button.propsTypes = {
  type: PropTypes.string,
  onClick: PropTypes.func,
  typeButton: PropTypes.string,
  href: PropTypes.string,
  full: PropTypes.bool,
  target: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};
