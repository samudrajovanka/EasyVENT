import Link from 'next/link';
import PropTypes from 'prop-types';

export default function NavLink({ children, href, active }) {
  return (
    <Link href={href}>
      <a className={active ? '' : 'text-ev-dark-gray'}>{children}</a>
    </Link>
  );
}

NavLink.defaultProps = {
  active: false,
};

NavLink.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string.isRequired,
  active: PropTypes.bool,
};
