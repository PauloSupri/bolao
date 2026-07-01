import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export function useRanking() {
  return useQuery({
    queryKey: ['ranking'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ranking')
        .select(`*, profile:profiles(id, full_name, avatar_url, email)`)
        .order('total_points', { ascending: false })
      if (error) throw error
      return data?.map((r, i) => ({ ...r, position: i + 1 })) ?? []
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
