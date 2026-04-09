import { OrbState } from '../types'

interface OrbProps {
  state: OrbState
}

export default function Orb({ state }: OrbProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Listening ripple rings */}
        {state === 'listening' && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[180px] h-[180px] md:w-[180px] md:h-[180px] w-[130px] h-[130px] rounded-full border-2 border-blue-400 animate-ripple-1 opacity-0" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[180px] h-[180px] md:w-[180px] md:h-[180px] w-[130px] h-[130px] rounded-full border-2 border-blue-400 animate-ripple-2 opacity-0" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[180px] h-[180px] md:w-[180px] md:h-[180px] w-[130px] h-[130px] rounded-full border-2 border-blue-400 animate-ripple-3 opacity-0" />
            </div>
          </>
        )}

        {/* Thinking spinner */}
        {state === 'thinking' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="md:w-[200px] md:h-[200px] w-[150px] h-[150px] animate-spin-slow"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="95"
                fill="none"
                stroke="#d97706"
                strokeWidth="3"
                strokeDasharray="120 480"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}

        {/* Speaking frequency bars */}
        {state === 'speaking' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1.5 items-end h-[200px] md:h-[200px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-1.5 bg-green-500 rounded-full animate-freq-bar"
                  style={{
                    animationDelay: `${i * 0.15}s`,
                    height: '60px',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Main orb */}
        <svg
          className={`md:w-[180px] md:h-[180px] w-[130px] h-[130px] relative z-10 ${
            state === 'idle' ? 'animate-breathe' : ''
          } ${state === 'listening' ? 'animate-pulse-bright' : ''}`}
          viewBox="0 0 180 180"
        >
          <defs>
            <radialGradient id="orbGradient" cx="50%" cy="40%" r="50%">
              <stop
                offset="0%"
                stopColor={
                  state === 'idle'
                    ? '#1e40af'
                    : state === 'listening'
                    ? '#2563eb'
                    : state === 'thinking'
                    ? '#d97706'
                    : '#16a34a'
                }
              />
              <stop
                offset="100%"
                stopColor={
                  state === 'idle'
                    ? '#1e3a8a'
                    : state === 'listening'
                    ? '#1d4ed8'
                    : state === 'thinking'
                    ? '#b45309'
                    : '#15803d'
                }
              />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="url(#orbGradient)"
            filter={state === 'listening' ? 'url(#glow)' : undefined}
          />
        </svg>
      </div>

      <span className="text-xs text-gray-500 uppercase tracking-widest">
        {state}
      </span>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes pulse-bright {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.9; }
        }
        @keyframes ripple {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes freq-bar {
          0%, 100% { height: 20px; }
          50% { height: 70px; }
        }
        .animate-breathe {
          animation: breathe 3s ease-in-out infinite;
        }
        .animate-pulse-bright {
          animation: pulse-bright 1s ease-in-out infinite;
        }
        .animate-ripple-1 {
          animation: ripple 2s ease-out infinite;
        }
        .animate-ripple-2 {
          animation: ripple 2s ease-out infinite 0.66s;
        }
        .animate-ripple-3 {
          animation: ripple 2s ease-out infinite 1.33s;
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
        .animate-freq-bar {
          animation: freq-bar 0.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
