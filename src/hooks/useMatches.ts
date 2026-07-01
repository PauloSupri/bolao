import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Match } from '../types'

export function useMatches(phase?: string) {
  return useQuery({
    queryKey: ['matches', phase],
    queryFn: async () => {
      let q = supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(*),
          away_team:teams!matches_away_team_id_fkey(*)
        `)
        .order('match_date', { ascending: true })

      if (phase) q = q.eq('phase', phase)

      const { data, error } = await q
      if (error) throw error
      return data as Match[]
    },
  })
}

export function useMatch(id: string) {
  return useQuery({
    queryKey: ['match', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('matches')
        .select(`
          *,
          home_team:teams!matches_home_team_id_fkey(*),
          away_team:teams!matches_away_team_id_fkey(*),
          match_goalscorers(*, player:players(*))
        `)
        .eq('id', id)
        .single()
      if (error) throw error
      return data as Match & { match_goalscorers: any[] }
    },
    enabled: !!id,
  })
}

export function useUpdateMatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Match> }) => {
      const { error } = await supabase
        .from('matches')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })
}

export function useCreateMatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Match>) => {
      const { error } = await supabase.from('matches').insert(data)
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] })
    },
  })
}
