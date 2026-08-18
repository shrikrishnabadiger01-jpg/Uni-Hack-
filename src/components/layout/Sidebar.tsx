import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  ClipboardCheck,
  Upload,
  Settings,
  Factory,
  Sparkles,
} from 'lucide-react'
import { cn } from '../../lib/utils'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/catalog', icon: Package, label: 'Product Catalog' },
  { to: '/review', icon: ClipboardCheck, label: 'Review Queue', badge: 2 },
  { to: '/batch', icon: Upload, label: 'Batch Import' },
]

export function Sidebar() {
  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900/80">
      <div className="border-b border-slate-800 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/20 ring-1 ring-sky-500/40">
            <Factory className="h-5 w-5 text-sky-400" />
          </div>
          <div className="text-left">
            <div className="text-sm font-semibold text-white">ProductIntel</div>
            <div className="text-xs text-slate-500">Industrial Commerce AI</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{label}</span>
            {badge != null && (
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-400">
                {badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-slate-800 p-4">
        <div className="mb-3 flex items-start gap-2 rounded-lg bg-sky-500/10 p-3 ring-1 ring-sky-500/20">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
          <div className="text-left text-xs leading-relaxed text-slate-400">
            <span className="font-medium text-sky-300">AI Pipeline active</span>
            <br />
            RAG + extraction + validation
          </div>
        </div>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
        >
          <Settings className="h-4 w-4" />
          Settings
        </button>
      </div>
    </aside>
  )
}
