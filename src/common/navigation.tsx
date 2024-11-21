import { FactSvg, HomeSvg } from '../svg/index';
// import { DOCS_URL, GITHUB_URL } from '@constants/index';

const bottomNavigation: cat.BottomNavigation = [
  {
    id: 1,
    label: 'Home',
    href: '/',
    icon: <HomeSvg className="w-6 h-6" />,
  },
  {
    id: 2,
    label: 'Image',
    href: '/image',
    icon: <FactSvg />,
  }
];

const navBar: cat.Navbar = [
    { id: 3, label: 'Image', href: '/image', external: false },
];

export { bottomNavigation, navBar };
