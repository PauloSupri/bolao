import { cn } from '../lib/utils'

// Mapeia código de 3 letras para ISO 2 letras do flagcdn.com
const codeToIso2: Record<string, string> = {
  // CONMEBOL
  ARG: 'ar', BRA: 'br', COL: 'co', ECU: 'ec', PAR: 'py', URU: 'uy',
  // CONCACAF
  CAN: 'ca', CUW: 'cw', HAI: 'ht', MEX: 'mx', PAN: 'pa', USA: 'us',
  // UEFA
  AUT: 'at', BEL: 'be', BIH: 'ba', CRO: 'hr', CZE: 'cz',
  ENG: 'gb-eng', FRA: 'fr', GER: 'de', NED: 'nl', NOR: 'no',
  POR: 'pt', SCO: 'gb-sct', ESP: 'es', SWE: 'se', SUI: 'ch', TUR: 'tr',
  // AFC
  AUS: 'au', IRN: 'ir', IRQ: 'iq', JPN: 'jp', JOR: 'jo',
  QAT: 'qa', SAU: 'sa', KOR: 'kr', UZB: 'uz',
  // CAF
  ALG: 'dz', CPV: 'cv', COD: 'cd', EGY: 'eg', GHA: 'gh',
  CIV: 'ci', MAR: 'ma', SEN: 'sn', RSA: 'za', TUN: 'tn',
  // OFC
  NZL: 'nz',
}

interface FlagImageProps {
  code: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

export function FlagImage({ code, size = 'md', className }: FlagImageProps) {
  const iso2 = codeToIso2[code]

  const sizes = {
    sm:  'w-6 h-4',
    md:  'w-10 h-7',
    lg:  'w-14 h-10',
    xl:  'w-20 h-14',
  }

  if (!iso2) {
    return (
      <div className={cn('bg-slate-700 rounded flex items-center justify-center text-xs text-slate-400 font-bold', sizes[size], className)}>
        {code?.slice(0, 2)}
      </div>
    )
  }

  return (
    <img
      src={`https://flagcdn.com/w80/${iso2}.png`}
      alt={code}
      className={cn('rounded shadow-sm object-cover', sizes[size], className)}
      onError={(e) => {
        const el = e.currentTarget
        el.style.display = 'none'
        if (el.nextSibling) return
        const fallback = document.createElement('div')
        fallback.className = el.className + ' bg-slate-700 flex items-center justify-center text-xs text-slate-400 font-bold'
        fallback.textContent = code?.slice(0, 2)
        el.parentNode?.insertBefore(fallback, el.nextSibling)
      }}
    />
  )
}
