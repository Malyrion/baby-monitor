import Link from 'next/link';
import { BabySvg } from '../svg/index';
import NavBar from './NavBar';
import styles from '../../styles/Header.module.css';

/**
 * It returns a header element with a logo, a title, and a navigation bar
 * @returns A JSX element
 */
function Header(): JSX.Element {
  return (
    <header className={styles.container}>
      <div className={styles.logo}>
        <div className="h-16">
          <Link href="/">
            <BabySvg className="w-full h-full" />
          </Link>
        </div>
      </div>
      <div className={styles.name}>
        <Link href="/">ButtonTech</Link>
      </div>
      <div className={styles.small}>
        <div className={styles.smallCat}>
          <Link href="/" aria-label="Cat">
            <BabySvg className="w-full h-full" />
          </Link>
        </div>
      </div>
      {/* NAVIGATION BAR */}
      <NavBar />
    </header>
  );
}

export default Header;
