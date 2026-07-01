import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useRanking() {
  return useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      const [{ data: profiles, error: profErr }, { data: rankData, error: rankErr }] = await Promise.all([
        supabase.from('profiles').select('id, full_name, avatar_url, email').order('full_name'),
        supabase.from('ranking').select('*'),
      ])
      if (profErr) throw profErr
      if (rankErr) throw rankErr

      const rankMap = new Map((rankData ?? []).map((r) => [r.user_id, r]))

      const merged = (profiles ?? []).map((p) => {
        const r = rankMap.get(p.id)
        return {
          user_id: p.id,
          profile: p,
          total_points: r?.total_points ?? 0,
          exact_scores: r?.exact_scores ?? 0,
          correct_results: r?.correct_results ?? 0,
          goalscorer_points: r?.goalscorer_points ?? 0,
          games_predicted: r?.games_predicted ?? 0,
        }
      })

      merged.sort((a, b) => b.total_points - a.total_points || (a.profile.full_name ?? '').localeCompare(b.profile.full_name ?? ''))

      return merged.map((r, i) => ({ ...r, position: i + 1 }))
    },
    refetchInterval: 60000,
  })
}

export function useMyRanking(userId?: string) {
  return useQuery({
    queryKey: ['my-ranking', userId],
    queryFn: async () => {
      if (!userId) return null
      const { data, error } = await supabase
        .from('ranking')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      if (error) throw error
      return data
    },
    enabled: !!userId,
  })
}
