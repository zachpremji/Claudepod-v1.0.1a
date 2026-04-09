import { OrbState } from '../types'

interface OrbProps {
  state: OrbState
}

const STATE_CONFIG = {
  idle: {
    color1: '#3b82f6',
    color2: '#1d4ed8',
    color3: '#1e3a8a',
    glow: 'rgba(59, 130, 246, 0.3)',
  },
  listening: {
    color1: '#60a5fa',
    color2: '#3b82f6',
    color3: '#2563eb',
    glow: 'rgba(96, 165, 250, 0.5)',
  },
  thinking: {
    color1: '#f59e0b',
    color2: '#d97706',
    color3: '#b45309',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
  speaking: {
    color1: '#34d399',
    color2: '#10b981',
    color3: '#059669',
    glow: 'rgba(52, 211, 153, 0.4)',
  },
}

export default function Orb({ state }: OrbProps) {
  const cfg = STATE_CONFIG[state]

  return (
    <div className="orb-container">
      {/* Ambient glow behind orb */}
      <div
        className="orb-glow"
        style={{ background: cfg.glow }}
      />

      {/* Ripple rings for listening */}
      {state === 'listening' && (
        <div className="orb-ripples">
          <div className="ripple ripple-1" />
          <div className="ripple ripple-2" />
          <div className="ripple ripple-3" />
        </div>
      )}

      {/* Spinner arc for thinking */}
      {state === 'thinking' && (
        <svg className="orb-spinner" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="spinGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={cfg.color1} stopOpacity="1" />
              <stop offset="100%" stopColor={cfg.color1} stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="100" cy="100" r="92"
            fill="none"
            stroke="url(#spinGrad)"
            strokeWidth="2.5"
            strokeDasharray="140 440"
            strokeLinecap="round"
          />
        </svg>
      )}

      {/* Frequency bars for speaking */}
      {state === 'speaking' && (
        <div className="orb-bars">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="freq-bar"
              style={{
                animationDelay: `${i * 0.12}s`,
                background: `linear-gradient(to top, ${cfg.color3}, ${cfg.color1})`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main orb sphere */}
      <svg
        className={`orb-svg ${state === 'idle' ? 'orb-breathe' : ''} ${state === 'listening' ? 'orb-pulse' : ''}`}
        viewBox="0 0 200 200"
      >
        <defs>
          <radialGradient id="orbFill" cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={cfg.color1} />
            <stop offset="60%" stopColor={cfg.color2} />
            <stop offset="100%" stopColor={cfg.color3} />
          </radialGradient>
          <radialGradient id="orbSheen" cx="35%" cy="30%" r="40%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <filter id="softShadow">
            <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor={cfg.color3} floodOpacity="0.5" />
          </filter>
        </defs>
        <circle cx="100" cy="100" r="82" fill="url(#orbFill)" filter="url(#softShadow)" />
        <circle cx="100" cy="100" r="82" fill="url(#orbSheen)" />
      </svg>

      {/* State label */}
      <span className="orb-label">{state}</span>

      <style>{`
        .orb-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          width: 220px;
          height: 220px;
        }

        .orb-glow {
          position: absolute;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          filter: blur(60px);
          transition: background 0.6s ease;
          pointer-events: none;
        }

        .orb-svg {
          position: relative;
          width: 170px;
          height: 170px;
          z-index: 2;
          transition: filter 0.3s ease;
        }

        .orb-label {
          position: absolute;
          bottom: -8px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: rgba(148, 163, 184, 0.6);
          z-index: 2;
        }

        /* Breathing (idle) */
        .orb-breathe {
          animation: breathe 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }

        /* Pulse (listening) */
        .orb-pulse {
          animation: pulse 1.2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        /* Ripples */
        .orb-ripples {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        .ripple {
          position: absolute;
          width: 170px;
          height: 170px;
          border-radius: 50%;
          border: 1.5px solid rgba(96, 165, 250, 0.5);
          opacity: 0;
        }
        .ripple-1 { animation: rippleOut 2.4s ease-out infinite; }
        .ripple-2 { animation: rippleOut 2.4s ease-out infinite 0.8s; }
        .ripple-3 { animation: rippleOut 2.4s ease-out infinite 1.6s; }
        @keyframes rippleOut {
          0% { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(2); opacity: 0; }
        }

        /* Spinner */
        .orb-spinner {
          position: absolute;
          width: 200px;
          height: 200px;
          z-index: 3;
          animation: spin 1.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Frequency bars */
        .orb-bars {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 5px;
          z-index: 3;
          height: 60px;
        }
        .freq-bar {
          width: 4px;
          border-radius: 4px;
          animation: freqBounce 0.5s ease-in-out infinite alternate;
        }
        @keyframes freqBounce {
          0% { height: 12px; }
          100% { height: 48px; }
        }
      `}</style>
    </div>
  )
}
