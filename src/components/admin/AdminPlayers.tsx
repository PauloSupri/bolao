import { useState } from 'react'
import { Plus, Save, X } from 'lucide-react'
import { usePlayers, useCreatePlayer } from '../../hooks/usePlayers'
import { useTeams } from '../../hooks/useTeams'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { FlagImage } from '../FlagImage'

export function AdminPlayers() {
  const { data: players = [] } = usePlayers()
  const { data: teams = [] } = useTeams()
  const createPlayer = useCreatePlayer()

  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', team_id: '', position: '', shirt_number: '' })
  const [filterTeam, setFilterTeam] = useState('')

  async function handleSubmit() {
    if (!form.name || !form.team_id) return
    await createPlayer.mutateAsync({
      name: form.name,
      team_id: form.team_id,
      position: form.position || undefined,
      shirt_number: form.shirt_number ? Number(form.shirt_number) : undefined,
    })
    setForm({ name: '', team_id: form.team_id, position: '', shirt_number: '' })
    setShowForm(false)
  }

  const filtered = filterTeam ? players.filter((p) => p.team_id === filterTeam) : players

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Jogadores ({players.length})</h2>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="w-4 h-4" /> Adicionar
        </Button>
      </div>

      {showForm && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3">Novo jogador</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Select label="Seleção" value={form.team_id} onChange={(e) => setForm({ ...form, team_id: e.target.value })}>
              <option value="">Selecione...</option>
              {teams.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.code})</option>)}
            </Select>
            <Input
              label="Nome"
              placeholder="Vini Jr."
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Posição"
              placeholder="Atacante"
              value={form.position}
              onChange={(e) => setForm({ ...form, position: e.target.value })}
            />
            <Input
              label="Camisa"
              type="number"
              placeholder="7"
              value={form.shirt_number}
              onChange={(e) => setForm({ ...form, shirt_number: e.target.value })}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <Button onClick={handleSubmit} loading={createPlayer.isPending}>
              <Save className="w-4 h-4" /> Salvar
            </Button>
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              <X className="w-4 h-4" /> Cancelar
            </Button>
          </div>
        </Card>
      )}

      <div className="flex gap-3 items-center">
        <Select
          value={filterTeam}
          onChange={(e) => setFilterTeam(e.target.value)}
          className="max-w-xs"
        >
          <option value="">Todas as seleções</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.code})</option>)}
        </Select>
        <span className="text-sm text-slate-400">{filtered.length} jogadores</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {filtered.map((player) => (
          <Card key={player.id} className="p-3">
            <div className="flex items-center gap-3">
              <FlagImage code={player.team?.code ?? ''} size="sm" />
              <div>
                <p className="text-sm font-medium text-white">
                  {player.shirt_number ? `#${player.shirt_number} ` : ''}{player.name}
                </p>
                <p className="text-xs text-slate-400">
                  {player.team?.name} {player.position ? `· ${player.position}` : ''}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
