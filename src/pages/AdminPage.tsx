import { useState } from 'react'
import { Shield, Users, Swords, Trophy, Plus } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { AdminTeams } from '../components/admin/AdminTeams'
import { AdminMatches } from '../components/admin/AdminMatches'
import { AdminResults } from '../components/admin/AdminResults'
import { AdminPlayers } from '../components/admin/AdminPlayers'

type Tab = 'matches' | 'results' | 'teams' | 'players'

const tabs: { value: Tab; label: string; icon: any }[] = [
  { value: 'matches', label: 'Jogos', icon: Swords },
  { value: 'results', label: 'Resultados', icon: Trophy },
  { value: 'teams', label: 'Seleções', icon: Users },
  { value: 'players', label: 'Jogadores', icon: Plus },
]

export function AdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>('matches')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Shield className="w-7 h-7 text-blue-400" />
        <h1 className="text-2xl font-bold text-white">Administração</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-800/60 border border-slate-700/50 rounded-xl p-1">
        {tabs.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium flex-1 justify-center transition-all ${
              activeTab === value
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:block">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'matches' && <AdminMatches />}
      {activeTab === 'results' && <AdminResults />}
      {activeTab === 'teams' && <AdminTeams />}
      {activeTab === 'players' && <AdminPlayers />}
    </div>
  )
}
