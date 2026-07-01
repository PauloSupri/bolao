import { useState } from 'react'
import { Plus, Edit2, Save, X } from 'lucide-react'
import { useTeams, useCreateTeam, useUpdateTeam } from '../../hooks/useTeams'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { FlagImage } from '../FlagImage'
import type { Team } from '../../types'

const groups = ['A','B','C','D','E','F','G','H','I','J','K','L']

export function AdminTeams() {
  const { data: teams = [] } = useTeams()
  const createTeam = useCreateTeam()
  const updateTeam = useUpdateTeam()

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '', code: '', group: 'A' })

  function resetForm() {
    setForm({ name: '', code: '', group: 'A' })
    setShowForm(false)
    setEditingId(null)
  }

  async function handleSubmit() {
    if (!form.name || !form.code) return
    if (editingId) {
      await updateTeam.mutateAsync({ id: editingId, data: form })
    } else {
      await createTeam.mutateAsync(form)
    }
    resetForm()
  }

  function startEdit(team: Team) {
    setForm({ name: team.name, code: team.code, group: team.group ?? 'A' })
    setEditingId(team.id)
    setShowForm(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Seleções ({teams.length})</h2>
        <Button onClick={() => setShowForm(true)} size="sm">
          <Plus className="w-4 h-4" /> Adicionar
        </Button>
      </div>

      {showForm && (
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-white mb-3">
            {editingId ? 'Editar seleção' : 'Nova seleção'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Nome"
              placeholder="Brasil"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              label="Código (3 letras)"
              placeholder="BRA"
              maxLength={3}
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            />
            <Select
              label="Grupo"
              value={form.group}
              onChange={(e) => setForm({ ...form, group: e.target.value })}
            >
              {groups.map((g) => <option key={g} value={g}>Grupo {g}</option>)}
            </Select>
          </div>
          <div className="flex gap-2 mt-3">
            <Button onClick={handleSubmit} loading={createTeam.isPending || updateTeam.isPending}>
              <Save className="w-4 h-4" /> Salvar
            </Button>
            <Button variant="ghost" onClick={resetForm}>
              <X className="w-4 h-4" /> Cancelar
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {teams.map((team) => (
          <Card key={team.id} className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FlagImage code={team.code} size="md" />
              <div>
                <p className="text-sm font-medium text-white">{team.name}</p>
                <p className="text-xs text-slate-400">{team.code} • Grupo {team.group}</p>
              </div>
            </div>
            <button onClick={() => startEdit(team)} className="text-slate-400 hover:text-white p-1">
              <Edit2 className="w-4 h-4" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  )
}
