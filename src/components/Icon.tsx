import type { ReactNode } from 'react'
import type { IconName } from '../types'

type Props = {
  name: IconName
  size?: number
}

export function Icon({ name, size = 32 }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      className="icon"
    >
      {paths[name]}
    </svg>
  )
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const paths: Record<IconName, ReactNode> = {
  shield: (
    <>
      <path {...stroke} d="M24 6 10 12v12c0 9 6.2 14.6 14 17 7.8-2.4 14-8 14-17V12L24 6Z" />
      <path {...stroke} d="m17 24 5 5 9-10" />
    </>
  ),
  check: (
    <>
      <circle {...stroke} cx="24" cy="24" r="16" />
      <path {...stroke} d="m16 24.5 5.2 5.2L32 18.5" />
    </>
  ),
  phone: (
    <>
      <rect {...stroke} x="15" y="6" width="18" height="36" rx="4" />
      <path {...stroke} d="M22 36h4" />
    </>
  ),
  brain: (
    <>
      <path {...stroke} d="M18 14a6 6 0 0 1 6-6 6 6 0 0 1 6 6 5 5 0 0 1 4 8 6 6 0 0 1-2 10c-1.5 3-4 6-8 6s-6.5-3-8-6a6 6 0 0 1-2-10 5 5 0 0 1 4-8Z" />
      <path {...stroke} d="M24 10v26M18 20h6M24 26h7" />
    </>
  ),
  lamp: (
    <>
      <path {...stroke} d="M18 28h12l1.5 4H16.5L18 28Z" />
      <path {...stroke} d="M20 32v2a4 4 0 0 0 8 0v-2" />
      <path {...stroke} d="M17 20a7 7 0 1 1 14 0c0 3-2 5-3 8H20c-1-3-3-5-3-8Z" />
    </>
  ),
  photo: (
    <>
      <rect {...stroke} x="7" y="12" width="34" height="26" rx="4" />
      <path {...stroke} d="m7 30 9-8 7 6 5-4 13 10" />
      <circle {...stroke} cx="17" cy="20" r="2.2" />
    </>
  ),
  gift: (
    <>
      <rect {...stroke} x="8" y="20" width="32" height="20" rx="3" />
      <path {...stroke} d="M8 28h32M24 20v20" />
      <path {...stroke} d="M24 20c-4 0-8-2.2-8-6.2S20 8 24 14c4-6 8-5.6 8-.2S28 20 24 20Z" />
    </>
  ),
  alert: (
    <>
      <path {...stroke} d="M24 8 6 40h36L24 8Z" />
      <path {...stroke} d="M24 20v10" />
      <path {...stroke} d="M24 35h.1" />
    </>
  ),
  users: (
    <>
      <circle {...stroke} cx="18" cy="16" r="5" />
      <circle {...stroke} cx="31" cy="17" r="4" />
      <path {...stroke} d="M8 36c1.4-5 5-8 10-8s8.6 3 10 8" />
      <path {...stroke} d="M28 28c3.2-.4 6 .8 8 4" />
    </>
  ),
  spark: (
    <>
      <path {...stroke} d="M24 6v8M24 34v8M6 24h8M34 24h8M11 11l6 6M31 31l6 6M37 11l-6 6M17 31l-6 6" />
      <circle {...stroke} cx="24" cy="24" r="5" />
    </>
  ),
  android: (
    <>
      <rect {...stroke} x="15" y="8" width="18" height="32" rx="4" />
      <path {...stroke} d="M22 34h4" />
      <text x="24" y="26" textAnchor="middle" fontSize="9" fontWeight="700" fill="currentColor">
        And
      </text>
    </>
  ),
  apple: (
    <>
      <rect {...stroke} x="15" y="8" width="18" height="32" rx="4" />
      <path {...stroke} d="M22 34h4" />
      <text x="24" y="26" textAnchor="middle" fontSize="10" fontWeight="700" fill="currentColor">
        iOS
      </text>
    </>
  ),
  help: (
    <>
      <circle {...stroke} cx="24" cy="24" r="16" />
      <path {...stroke} d="M19 19a5 5 0 1 1 6.6 4.7c-.9.4-1.6 1.2-1.6 2.3V28" />
      <path {...stroke} d="M24 34h.1" />
    </>
  ),
  lock: (
    <>
      <rect {...stroke} x="12" y="20" width="24" height="18" rx="3" />
      <path {...stroke} d="M17 20v-5a7 7 0 0 1 14 0v5" />
    </>
  ),
  bolt: (
    <path {...stroke} d="M26 6 12 26h10l-2 16 16-22H26l2-14Z" />
  ),
  star: (
    <path
      fill="currentColor"
      d="m24 6 4.6 10.2 11.1 1.2-8.4 7.3 2.4 11L24 30.8 14.3 35.7l2.4-11L8.3 17.4l11.1-1.2L24 6Z"
    />
  ),
}
