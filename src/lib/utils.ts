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
    round_of_32: 'Rodada de 32',
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
  const flags: Record<string, string> = {
    BRA: '🇧🇷', ARG: '🇦🇷', FRA: '🇫🇷', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    GER: '🇩🇪', ESP: '🇪🇸', POR: '🇵🇹', ITA: '🇮🇹',
    NED: '🇳🇱', BEL: '🇧🇪', URU: '🇺🇾', COL: '🇨🇴',
    USA: '🇺🇸', MEX: '🇲🇽', CAN: '🇨🇦', JAP: '🇯🇵',
    KOR: '🇰🇷', MAR: '🇲🇦', SEN: '🇸🇳', GHA: '🇬🇭',
    NIG: '🇳🇬', CMR: '🇨🇲', EGY: '🇪🇬', TUN: '🇹🇳',
    AUS: '🇦🇺', NZL: '🇳🇿', SUI: '🇨🇭', DEN: '🇩🇰',
    SWE: '🇸🇪', NOR: '🇳🇴', POL: '🇵🇱', CRO: '🇭🇷',
    SRB: '🇷🇸', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', WAL: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', AUT: '🇦🇹',
    ECU: '🇪🇨', PER: '🇵🇪', CHI: '🇨🇱', VEN: '🇻🇪',
    BOL: '🇧🇴', PAR: '🇵🇾', IRN: '🇮🇷', SAU: '🇸🇦',
    QAT: '🇶🇦', UAE: '🇦🇪', IRQ: '🇮🇶', SYR: '🇸🇾',
    HUN: '🇭🇺', CZE: '🇨🇿', SVK: '🇸🇰', ROM: '🇷🇴',
    UKR: '🇺🇦', TUR: '🇹🇷', GRE: '🇬🇷', ALB: '🇦🇱',
    COD: '🇨🇩', MLI: '🇲🇱', BFA: '🇧🇫', CIV: '🇨🇮',
    THA: '🇹🇭', IDN: '🇮🇩', IND: '🇮🇳', CHN: '🇨🇳',
    SLO: '🇸🇮', MNT: '🇲🇪', KOS: '🇽🇰', MKD: '🇲🇰',
    GEO: '🇬🇪', ARM: '🇦🇲', ISL: '🇮🇸', FIN: '🇫🇮',
  }
  return flags[code] || '🏳️'
}
