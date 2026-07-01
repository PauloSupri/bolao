import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Prediction } from '../types'

export function useMyPredictions() {
  return useQuery({
    queryKey: ['my-predictions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          *,
          match:matches(
            *,
            home_team:teams!matches_home_team_id_fkey(*),
            away_team:teams!matches_away_team_id_fkey(*)
          ),
          prediction_goalscorers(*, player:players(*))
        `)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as (Prediction & { prediction_goalscorers: any[] })[]
    },
  })
}

export function useMatchPrediction(matchId: string) {
  return useQuery({
    queryKey: ['prediction', matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select(`*, prediction_goalscorers(*, player:players(*))`)
        .eq('match_id', matchId)
        .maybeSingle()
      if (error) throw error
      return data as (Prediction & { prediction_goalscorers: any[] }) | null
    },
    enabled: !!matchId,
  })
}

export function useMatchPredictions(matchId: string, enabled = false) {
  return useQuery({
    queryKey: ['match-predictions', matchId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('predictions')
        .select(`
          *,
          profile:profiles(id, full_name, avatar_url),
          prediction_goalscorers(*, player:players(*))
        `)
        .eq('match_id', matchId)
      if (error) throw error
      return data
    },
    enabled: enabled && !!matchId,
  })
}

export function useSavePrediction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      matchId,
      homeScore,
      awayScore,
      goalscorers,
      existingId,
    }: {
      matchId: string
      homeScore: number
      awayScore: number
      goalscorers: { player_id: string; goals: number }[]
      existingId?: string
    }) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Não autenticado')

      const validGoalscorers = goalscorers.filter((g) => g.goals > 0)

      if (existingId) {
        const { error } = await supabase
          .from('predictions')
          .update({
            home_score: homeScore,
            away_score: awayScore,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingId)
        if (error) throw error

        await supabase.from('prediction_goalscorers').delete().eq('prediction_id', existingId)

        if (validGoalscorers.length > 0) {
          const { error: gsError } = await supabase.from('prediction_goalscorers').insert(
            validGoalscorers.map((g) => ({ prediction_id: existingId, player_id: g.player_id, goals: g.goals }))
          )
          if (gsError) throw gsError
        }
      } else {
        // Upsert: se já existir palpite para este jogo (constraint unique), atualiza
        const { data: pred, error } = await supabase
          .from('predictions')
          .upsert(
            {
              user_id: user.id,
              match_id: matchId,
              home_score: homeScore,
              away_score: awayScore,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,match_id' }
          )
          .select()
          .single()
        if (error) throw error

        await supabase.from('prediction_goalscorers').delete().eq('prediction_id', pred.id)

        if (validGoalscorers.length > 0) {
          const { error: gsError } = await supabase.from('prediction_goalscorers').insert(
            validGoalscorers.map((g) => ({ prediction_id: pred.id, player_id: g.player_id, goals: g.goals }))
          )
          if (gsError) throw gsError
        }
      }
    },
    onSuccess: (_, { matchId }) => {
      queryClient.invalidateQueries({ queryKey: ['prediction', matchId] })
      queryClient.invalidateQueries({ queryKey: ['my-predictions'] })
    },
  })
}
