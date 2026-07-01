export type UserRole = 'admin' | 'user'
export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'cancelled'
export type MatchPhase =
  | 'group_a' | 'group_b' | 'group_c' | 'group_d' | 'group_e' | 'group_f'
  | 'group_g' | 'group_h' | 'group_i' | 'group_j' | 'group_k' | 'group_l'
  | 'round_of_32' | 'round_of_16' | 'quarter_final' | 'semi_final'
  | 'third_place' | 'final'

export interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: UserRole
  created_at: string
}

export interface Team {
  id: string
  name: string
  code: string
  flag_url?: string
  group?: string
  created_at: string
}

export interface Match {
  id: string
  phase: MatchPhase
  match_number: number
  home_team_id?: string | null
  away_team_id?: string | null
  home_team?: Team
  away_team?: Team
  home_score?: number | null
  away_score?: number | null
  home_score_penalties?: number | null
  away_score_penalties?: number | null
  match_date: string
  venue?: string
  city?: string
  status: MatchStatus
  is_locked: boolean
  created_at: string
  updated_at: string
}

export interface Player {
  id: string
  name: string
  team_id: string
  team?: Team
  position?: string
  shirt_number?: number
  created_at: string
}

export interface MatchGoalscorer {
  id: string
  match_id: string
  player_id: string
  player?: Player
  goals: number
  is_penalty: boolean
  created_at: string
}

export interface Prediction {
  id: string
  user_id: string
  match_id: string
  match?: Match
  home_score: number
  away_score: number
  predicted_goalscorers?: string[]
  score_points: number
  goalscorer_points: number
  total_points: number
  exact_score: boolean
  correct_result: boolean
  created_at: string
  updated_at: string
}

export interface PredictionGoalscorer {
  id: string
  prediction_id: string
  player_id: string
  player?: Player
}

export interface Ranking {
  user_id: string
  profile?: Profile
  total_points: number
  exact_scores: number
  correct_results: number
  goalscorer_points: number
  games_predicted: number
  position?: number
}

export interface Settings {
  id: string
  key: string
  value: string
  description?: string
}
