import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Player } from '../types'

export function usePlayers(teamId?: string) {
  return useQuery({
    queryKey: ['players', teamId],
    queryFn: async () => {
      let q = supabase.from('players').select('*, team:teams(*)').order('name')
      if (teamId) q = q.eq('team_id', teamId)
      const { data, error } = await q
      if (error) throw error
      return data as Player[]
    },
  })
}

export function useMatchPlayers(matchId: string) {
  return useQuery({
    queryKey: ['match-players', matchId],
    queryFn: async () => {
      const { data: match } = await supabase
        .from('matches')
        .select('home_team_id, away_team_id')
        .eq('id', matchId)
        .single()

      if (!match) return []

      const { data, error } = await supabase
        .from('players')
        .select('*, team:teams(*)')
        .in('team_id', [match.home_team_id, match.away_team_id].filter(Boolean))
        .order('name')

      if (error) throw error
      return data as Player[]
    },
    enabled: !!matchId,
  })
}

export function useCreatePlayer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Player>) => {
      const { error } = await supabase.from('players').insert(data)
      if (error) throw error
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  })
}
