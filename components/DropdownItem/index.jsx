import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './style.module.css';

export default function DropdownItem({ children, href, onClick }) {
  if (href) {
    return (
      <Link href={href}>
        <a
          className={`block px-3 py-2 bg-white hover:bg-ev-gray ${styles['dropdown-item']}`}
          onClick={onClick}
        >
          {children}
        </a>
      </Link>
    );
  }

  return (
    <button
      className={`px-3 py-2 bg-white hover:bg-ev-gray text-left ${styles['dropdown-item']}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

DropdownItem.defaultProps = {
  href: null,
};

DropdownItem.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};
