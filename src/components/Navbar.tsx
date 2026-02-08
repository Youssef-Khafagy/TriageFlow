"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, LogOut, User, Home, Info, Clipboard, LayoutDashboard, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userProfile');
    localStorage.removeItem('currentSessionId');
    window.location.href = '/';
  };

  // Hide navbar on staff login page
  if (pathname === '/staff/login') return null;

  const isStaff = user?.role === 'staff';

  const navLinks = isStaff
    ? [{ href: '/staff/dashboard', label: 'Dashboard', icon: LayoutDashboard }]
    : [
        { href: '/', label: 'Home', icon: Home },
        { href: '/about', label: 'About', icon: Info },
        { href: '/patient/portal', label: 'Portal', icon: Clipboard },
      ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 no-print"
        style={{ background: 'var(--bg-nav)', borderBottom: '1px solid var(--border-color)' }}
      >
        <div className="flex items-center gap-8">
          <Link href={isStaff ? '/staff/dashboard' : '/'} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white group-hover:scale-105 transition-transform">
              <Activity size={18} strokeWidth={2.5} />
            </div>
            <span className="text-lg tracking-tight font-bold" style={{ color: 'var(--text-on-nav)' }}>
              Triage<span className="text-[var(--color-primary)]">Flow</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)]'
                      : 'hover:bg-white/5'
                  }`}
                  style={{ color: isActive ? 'var(--color-primary)' : 'var(--text-on-nav-muted)' }}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Dark mode toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
            style={{ color: 'var(--text-on-nav-muted)' }}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <>
              {!isStaff && (
                <Link
                  href="/profile"
                  className="hidden sm:flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  style={{ color: 'var(--text-on-nav-muted)' }}
                >
                  <User size={15} />
                  Profile
                </Link>
              )}

              <div className="hidden sm:block h-6 w-px bg-white/10" />

              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  {isStaff ? 'Staff' : 'Patient'}
                </span>
                <span className="text-xs font-semibold truncate max-w-[140px]" style={{ color: 'var(--text-on-nav-muted)' }}>
                  {user.email}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                className="text-sm font-semibold px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
                style={{ color: 'var(--text-on-nav)' }}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="text-sm font-semibold text-white bg-[var(--color-primary)] px-5 py-2 rounded-lg hover:brightness-110 transition-all shadow-sm"
              >
                Create Account
              </Link>
            </div>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10"
            style={{ color: 'var(--text-on-nav)' }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-16 right-4 left-4 rounded-2xl shadow-2xl border p-4 animate-scale-in"
            style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-color)' }}
          >
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium hover:bg-[var(--bg-surface-hover)] transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                <Icon size={18} /> {label}
              </Link>
            ))}
            {!user && (
              <>
                <hr style={{ borderColor: 'var(--border-color)' }} className="my-2" />
                <Link href="/login" className="block px-4 py-3 rounded-xl font-medium" style={{ color: 'var(--text-secondary)' }}>Sign In</Link>
                <Link href="/signup" className="block px-4 py-3 rounded-xl text-white bg-[var(--color-primary)] font-medium text-center mt-1">Create Account</Link>
              </>
            )}
          </div>
        </div>
      )}

      <div className="h-16" />
    </>
  );
}