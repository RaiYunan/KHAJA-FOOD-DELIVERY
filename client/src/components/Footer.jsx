import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Heart } from "lucide-react";
import logo from '@/assets/logo.png'
import logoLight from '@/assets/logo-light.png'
import { useTheme } from '@/context/ThemeContext'

function Footer() {
  const year = new Date().getFullYear();
  const { theme } = useTheme()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-cream dark:bg-surface-dark border-t border-ink/5 dark:border-border-dark/50 mt-20 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-chili rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-chili rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-20">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand column */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/">
              <img src={theme === 'dark' ? logoLight : logo} alt="Khaja" className="h-24 w-auto" />
            </Link>
            <p className="font-body text-sm text-ink/50 dark:text-text-dark/50 leading-relaxed max-w-sm">
              Connecting you with authentic Nepali flavors, crafted in home
              kitchens across Dharan.
            </p>

            {/* Location badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink/3 dark:bg-text-dark/5   dark:border-border-dark/30">
              <span className="text-xs font-medium text-ink/50 dark:text-text-dark/50">
                Dharan, Nepal
              </span>
            </div>
          </div>

          {/* Links columns */}
          <div className="md:col-span-4">
            <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-ink/30 dark:text-text-dark/30 mb-4">
              Links
            </h4>
            <nav className="space-y-2.5">
              {[
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms of Service" },
                { to: "/contact", label: "Get in Touch" },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="group flex items-center gap-2 font-body text-sm text-ink/60 dark:text-text-dark/60 hover:text-chili transition-all duration-200 w-fit"
                >
                  <span className="relative">
                    {link.label}
                    <span className="absolute bottom-0 left-0 w-0 h-px bg-chili/40 group-hover:w-full transition-all duration-300" />
                  </span>
                  <ArrowUpRight
                    size={12}
                    className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 text-chili"
                  />
                </Link>
              ))}
            </nav>
          </div>

          {/* CTA column */}
          <div className="md:col-span-3">
            <h4 className="font-body text-xs font-semibold uppercase tracking-wider text-ink/30 dark:text-text-dark/30 mb-4">
              Ready to eat?
            </h4>
            <button
              onClick={scrollToTop}
              className="group relative inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-chili/5 hover:bg-chili/10 dark:bg-chili/10 dark:hover:bg-chili/15 border border-chili/10 dark:border-chili/20 text-chili font-body text-sm font-medium transition-all duration-300 hover:scale-[1.02]"
            >
              <span>Browse Khajas</span>
              <ArrowUpRight
                size={14}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
              />
            </button>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="relative my-12">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-ink/5 dark:border-border-dark/30" />
          </div>
          <div className="relative flex justify-center">
            <div className="px-4 bg-cream dark:bg-surface-dark">
              <Heart size={16} className="text-chili/40" fill="currentColor" />
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs text-ink/30 dark:text-text-dark/30 order-2 sm:order-1">
            © {year} Khaja — Made with love in Dharan
          </p>

          <button
            onClick={scrollToTop}
            className="order-1 sm:order-2 flex items-center gap-1.5 text-xs text-ink/30 dark:text-text-dark/30 hover:text-chili transition-colors duration-200 group"
          >
            <span>Back to top</span>
            <span className="inline-block group-hover:-translate-y-0.5 transition-transform duration-200">
              ↑
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
