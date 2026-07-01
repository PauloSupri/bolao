import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, parseISO, isPast, isFuture } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { MatchPhase, MatchStatus } from '../types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  } catch {
    return dateStr
  }
}

export function formatDateShort(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'dd/MM HH:mm', { locale: ptBR })
  } catch {
    return dateStr
  }
}

export function isMatchLocked(matchDate: string, isLocked: boolean): boolean {
  if (isLocked) return true
  return isPast(parseISO(matchDate))
}

export function isMatchUpcoming(matchDate: string): boolean {
  return isFuture(parseISO(matchDate))
}

export function phaseLabel(phase: MatchPhase): string {
  const labels: Record<MatchPhase, string> = {
    group_a: 'Grupo A',
    group_b: 'Grupo B',
    group_c: 'Grupo C',
    group_d: 'Grupo D',
    group_e: 'Grupo E',
    group_f: 'Grupo F',
    group_g: 'Grupo G',
    group_h: 'Grupo H',
    group_i: 'Grupo I',
    group_j: 'Grupo J',
    group_k: 'Grupo K',
    group_l: 'Grupo L',
    round_of_32: 'Fase de Grupos — Rodada Final',
    round_of_16: 'Oitavas de Final',
    quarter_final: 'Quartas de Final',
    semi_final: 'Semifinal',
    third_place: '3º Lugar',
    final: 'Final',
  }
  return labels[phase] || phase
}

export function statusLabel(status: MatchStatus): string {
  const labels: Record<MatchStatus, string> = {
    scheduled: 'Agendado',
    live: 'Ao Vivo',
    finished: 'Encerrado',
    cancelled: 'Cancelado',
  }
  return labels[status]
}

export function isGroupPhase(phase: MatchPhase): boolean {
  return phase.startsWith('group_')
}

export function getFlagEmoji(code: string): string {
  // 48 seleções classificadas para a Copa do Mundo 2026
  const flags: Record<string, string> = {
    // CONMEBOL
    ARG: '🇦🇷', BRA: '🇧🇷', COL: '🇨🇴', ECU: '🇪🇨', PAR: '🇵🇾', URU: '🇺🇾',
    // CONCACAF
    CAN: '🇨🇦', CUW: '🇨🇼', HAI: '🇭🇹', MEX: '🇲🇽', PAN: '🇵🇦', USA: '🇺🇸',
    // UEFA
    AUT: '🇦🇹', BEL: '🇧🇪', BIH: '🇧🇦', CRO: '🇭🇷', CZE: '🇨🇿',
    ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', FRA: '🇫🇷', GER: '🇩🇪', NED: '🇳🇱', NOR: '🇳🇴',
    POR: '🇵🇹', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', ESP: '🇪🇸', SWE: '🇸🇪', SUI: '🇨🇭', TUR: '🇹🇷',
    // AFC
    AUS: '🇦🇺', IRN: '🇮🇷', IRQ: '🇮🇶', JPN: '🇯🇵', JOR: '🇯🇴',
    QAT: '🇶🇦', SAU: '🇸🇦', KOR: '🇰🇷', UZB: '🇺🇿',
    // CAF
    ALG: '🇩🇿', CPV: '🇨🇻', COD: '🇨🇩', EGY: '🇪🇬', GHA: '🇬🇭',
    CIV: '🇨🇮', MAR: '🇲🇦', SEN: '🇸🇳', RSA: '🇿🇦', TUN: '🇹🇳',
    // OFC
    NZL: '🇳🇿',
  }
  return flags[code] || '🏳️'
}
