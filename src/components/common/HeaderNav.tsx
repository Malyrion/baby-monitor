import Link from 'next/link';
import { useRouter } from 'next/router';
import { BabySvg } from '../../svg/index';
import { navBar } from './navigation';

/**
 * Header component with logo, title, and navigation
 * Includes responsive design and dark mode support
 * 
 * @returns {JSX.Element} Header component
 */
function HeaderNav(): JSX.Element {
  const router = useRouter();

  return (
    <header className="sticky h-16 top-0 z-50 flex items-center justify-between px-8 py-2 rounded-b-2xl border-b bg-[#F3EFE0] dark:bg-[#18181b] dark:border-[#393941]">
      {/* Desktop Logo */}
      <div className="hidden sm:block lg:ml-36">
        <div className="flex items-center justify-center h-16">
          <Link href="/">
            <BabySvg className="w-11 h-11" />
          </Link>
        </div>
      </div>

      {/* Site Title */}
      <div className="mr-auto font-semibold text-xl">
        <Link href="/">ButtonTech</Link>
      </div>

      {/* Mobile Logo */}
      <div className="sm:hidden justify-end">
        <div className="flex items-center justify-center h-16 dark:hover:text-[#fff9d9]">
          <Link href="/" aria-label="Baby">
            <BabySvg className="w-11 h-11" />
          </Link>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:block">
        <nav className="text-lg px-4">
          <ul className="flex items-center gap-6 font-medium">
            {navBar.map((links) => (
              <li key={links.id} className="whitespace-nowrap">
                <Link
                  href={links.href}
                  target={links.external ? '_blank' : '_self'}
                  className={`
                    inline-flex items-center
                    ${router.pathname === links.href 
                      ? 'text-[#0099FF] dark:text-[#E6DDC4]' // active link
                      : 'text-zinc-600 hover:text-[#000000] dark:text-zinc-400 dark:hover:text-zinc-50' // inactive link
                    }
                    ${links.external ? 'ml-1' : ''} // external link styling
                  `}
                >
                  <span>{links.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default HeaderNav;
