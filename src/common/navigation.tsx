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
    label: 'Insights',
    href: '/insights',
    icon: <FactSvg />,
  }
];

const navBar: cat.Navbar = [
    { id: 3, label: 'Insights', href: '/Insights', external: false },
];

export { bottomNavigation, navBar };
