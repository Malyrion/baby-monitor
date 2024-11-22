import { Insights, HomeSvg } from '../../svg/index';


/**
 * @fileoverview Navigation configuration.
 * This file contains the configuration for both the bottom navigation and the main navbar.
 * It defines the structure and types for navigation items, including their routes, labels, and icons.
 */


/**
 * Interface for navigation items in the bottom navigation
 */
interface BottomNavigationItem {
  id: number;
  label: string;
  href: string;
  icon: JSX.Element;
}

/**
 * Interface for navigation items in the navbar
 */
interface NavbarItem {
  id: number;
  label: string;
  href: string;
  external: boolean;
}

/**
 * Type definition for the bottom navigation array
 */
type BottomNavigation = BottomNavigationItem[];

/**
 * Type definition for the navbar array
 */
type Navbar = NavbarItem[];

/**
 * Configuration for the bottom navigation bar.
 * Contains links to main application pages with their respective icons.
 */
const bottomNavigation: BottomNavigation = [
  {
    id: 1,
    label: 'Home',
    href: '/',
    icon: <HomeSvg />,
  },
  {
    id: 2,
    label: 'Insights',
    href: '/insights',
    icon: <Insights />,
  },
];

/**
 * Configuration for the main navigation bar.
 * Contains links to various sections of the application.
 */
const navBar: Navbar = [
  {
    id: 1,
    label: 'Insights',
    href: '/insights',
    external: false,
  },
];

export {
  bottomNavigation,
  navBar,
  // Type exports for use in other files
  type BottomNavigation,
  type Navbar,
  type BottomNavigationItem,
  type NavbarItem,
};
