import { ReactNode, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Trophy, LayoutDashboard, Swords, Star, BarChart3,
  Shield, LogOut, Menu, X, User, ChevronDown
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { cn } from '../lib/utils'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/jogos', icon: Swords, label: 'Jogos' },
  { to: '/meus-palpites', icon: Star, label: 'Meus Palpites' },
  { to: '/ranking', icon: BarChart3, label: 'Ranking' },
]

const adminItems = [
  { to: '/admin', icon: Shield, label: 'Administração' },
]

function NavLink({ to, icon: Icon, label, mobile = false, onClick }: { to: string; icon: any; label: string; mobile?: boolean; onClick?: () => void }) {
  const location = useLocation()
  const active = location.pathname === to || location.pathname.startsWith(to + '/')

  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
        active
          ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
          : 'text-slate-400 hover:text-white hover:bg-slate-800',
        mobile && 'w-full'
      )}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  )
}

export function Layout({ children }: { children: ReactNode }) {
  const { profile, isAdmin, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white hidden sm:block">Bolão Copa 2026</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink key={item.to} {...item} />
              ))}
              {isAdmin && adminItems.map((item) => (
                <NavLink key={item.to} {...item} />
              ))}
            </nav>

            {/* User menu */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm text-slate-300 hidden sm:block max-w-32 truncate">
                    {profile?.full_name || profile?.email}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-1 z-50">
                    <div className="px-3 py-2 border-b border-slate-700">
                      <p className="text-xs text-slate-400">Logado como</p>
                      <p className="text-sm text-white font-medium truncate">{profile?.email}</p>
                      {isAdmin && (
                        <span className="text-xs text-blue-400 font-medium">Administrador</span>
                      )}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-slate-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-slate-800 text-slate-400"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink key={item.to} {...item} mobile onClick={() => setMobileOpen(false)} />
          ))}
          {isAdmin && adminItems.map((item) => (
            <NavLink key={item.to} {...item} mobile onClick={() => setMobileOpen(false)} />
          ))}
        </div>
      )}

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

    </div>
  )
}
