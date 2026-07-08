import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  Moon,
  Sun,
  ChevronDown,
  User,
  Package,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { logout } from "@/features/auth/authSlice";
import { useTheme } from "@/context/ThemeContext";
import logo from '@/assets/logo.png'
import logoLight from '@/assets/logo-light.png'

const navLinks = [
  { label: "Menu", to: "/menu" },
  { label: "Orders", to: "/orders" },
  { label: "About", to: "/about" },
];

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const cartCount = items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest('[aria-label="Toggle menu"]')
      ) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";
  const avatarUrl = user?.avatar;

  return (
    <header className="sticky top-0 z-50 bg-cream/90 dark:bg-surface-dark/90 backdrop-blur-sm border-b border-ink/10 dark:border-border-dark">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img 
            src={theme === 'dark' ? logoLight : logo} 
            alt="Khaja" 
            className="h-14 sm:h-18 w-auto" 
          />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-body text-sm font-medium text-ink/70 dark:text-text-dark/70 hover:text-chili dark:hover:text-chili transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Theme toggle - hide on very small screens */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 sm:p-2.5 rounded-full text-ink/70 dark:text-text-dark/70 hover:bg-clay-light dark:hover:bg-card-dark transition-colors cursor-pointer"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2 sm:p-2.5 rounded-full text-ink/70 dark:text-text-dark/70 hover:bg-clay-light dark:hover:bg-card-dark transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-chili text-cream text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </Link>

          {/* Auth area */}
          {isAuthenticated ? (
            <div className="relative ml-1" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-1 sm:gap-2 pl-1 pr-1.5 sm:pr-2 py-1 rounded-full hover:bg-clay-light dark:hover:bg-card-dark transition-colors cursor-pointer"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-chili text-cream font-body font-semibold text-xs flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-ink/50 dark:text-text-dark/50 transition-transform hidden sm:block ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-cream dark:bg-card-dark border border-ink/10 dark:border-border-dark rounded-sm shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-ink/10 dark:border-border-dark">
                    <p className="font-body font-semibold text-sm text-ink dark:text-text-dark truncate">
                      {user?.name}
                    </p>
                    <p className="font-body text-xs text-ink/50 dark:text-text-dark/50 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-ink/80 dark:text-text-dark/80 hover:bg-clay-light dark:hover:bg-surface-dark transition-colors"
                  >
                    <User size={16} />
                    My profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-ink/80 dark:text-text-dark/80 hover:bg-clay-light dark:hover:bg-surface-dark transition-colors"
                  >
                    <Package size={16} />
                    My orders
                  </Link>

                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-ink/80 dark:text-text-dark/80 hover:bg-clay-light dark:hover:bg-surface-dark transition-colors"
                    >
                      <ChevronDown size={16} className="-rotate-90" />
                      Admin dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 font-body text-sm text-chili hover:bg-clay-light dark:hover:bg-surface-dark transition-colors border-t border-ink/10 dark:border-border-dark"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-1 font-body text-xs sm:text-sm font-semibold bg-ink dark:bg-chili text-cream px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors whitespace-nowrap"
            >
              Log in
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2 sm:p-2.5 rounded-full text-ink/70 dark:text-text-dark/70 hover:bg-clay-light dark:hover:bg-card-dark transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu with overlay */}
      {mobileOpen && (
        <>
          {/* Overlay */}
          <div 
            className="md:hidden fixed inset-0 bg-ink/20 dark:bg-ink/40 z-40"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          
          {/* Menu panel */}
          <div 
            ref={mobileMenuRef}
            className="md:hidden fixed top-16 right-0 w-64 max-w-[80vw] h-[calc(100vh-4rem)] bg-cream dark:bg-surface-dark border-l border-ink/10 dark:border-border-dark shadow-xl z-50 overflow-y-auto"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={closeMobileMenu}
                  className="font-body text-sm font-medium text-ink/80 dark:text-text-dark/80 py-3 hover:text-chili dark:hover:text-chili transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            
            {/* Mobile auth info */}
            {isAuthenticated && (
              <div className="px-6 py-4 border-t border-ink/10 dark:border-border-dark">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-10 h-10 rounded-full bg-chili text-cream font-body font-semibold text-sm flex items-center justify-center overflow-hidden shrink-0">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={user?.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="font-body font-semibold text-sm text-ink dark:text-text-dark truncate">
                      {user?.name}
                    </p>
                    <p className="font-body text-xs text-ink/50 dark:text-text-dark/50 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <Link
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2.5 font-body text-sm text-ink/80 dark:text-text-dark/80 hover:bg-clay-light dark:hover:bg-surface-dark rounded-sm transition-colors"
                  >
                    <User size={16} />
                    My profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 px-3 py-2.5 font-body text-sm text-ink/80 dark:text-text-dark/80 hover:bg-clay-light dark:hover:bg-surface-dark rounded-sm transition-colors"
                  >
                    <Package size={16} />
                    My orders
                  </Link>
                  
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2.5 font-body text-sm text-ink/80 dark:text-text-dark/80 hover:bg-clay-light dark:hover:bg-surface-dark rounded-sm transition-colors"
                    >
                      <ChevronDown size={16} className="-rotate-90" />
                      Admin dashboard
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </header>
  );
}

export default Navbar;