// The Q Studio lockup: a geometric "Q" mark plus the "STUDIO" wordmark.
// Drawn inline rather than shipped as an image file so it stays crisp at any
// size and inherits `currentColor` from whatever surface it sits on.
export default function Logo({ className = '', markSize = 30 }) {
  return (
    <span className={`flex items-center gap-2 text-white ${className}`}>
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 32 32"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle
          cx="14.5"
          cy="14.5"
          r="9.5"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path
          d="M20.5 20.5 L27.5 27.5"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>
      <span className="text-lg font-extrabold uppercase leading-none tracking-[0.18em]">
        Studio
      </span>
    </span>
  )
}
