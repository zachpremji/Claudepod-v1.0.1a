import { useState } from 'react'
import { AuthStatus } from '../types'
import { getGoogleAuthUrl, disconnectGoogle, saveKeys } from '../api/client'

interface SettingsProps {
  isOpen: boolean
  onClose: () => void
  authStatus: AuthStatus | null
  onRefreshAuth: () => void
}

export default function Settings({ isOpen, onClose, authStatus, onRefreshAuth }: SettingsProps) {
  const [elevenLabsKey, setElevenLabsKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSaveElevenLabs = async () => {
    if (!elevenLabsKey.trim()) return
    setSaving(true)
    try {
      await saveKeys({ elevenlabs_api_key: elevenLabsKey })
      setElevenLabsKey('')
      onRefreshAuth()
      showToast('ElevenLabs key saved')
    } catch {
      showToast('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleConnectGoogle = () => {
    window.location.href = getGoogleAuthUrl()
  }

  const handleDisconnectGoogle = async () => {
    await disconnectGoogle()
    onRefreshAuth()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-950/95 backdrop-blur-xl border-l border-gray-800 z-50 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Settings</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">

            {/* Claude AI status */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
                Status
              </h3>
              <StatusRow
                name="Claude AI"
                detail="Powered by Anthropic"
                connected={authStatus?.anthropic.connected ?? false}
                notConnectedHint="Add ANTHROPIC_API_KEY to backend/.env"
              />
            </section>

            {/* Google */}
            <section>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Google
                </h3>
                {authStatus?.google.connected && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Gmail and Google Calendar
              </p>

              {authStatus?.google.connected ? (
                <div className="flex items-center justify-between p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2.5">
                    <GoogleIcon />
                    <span className="text-sm text-emerald-300">Google account linked</span>
                  </div>
                  <button
                    onClick={handleDisconnectGoogle}
                    className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : authStatus?.google.available ? (
                <button
                  onClick={handleConnectGoogle}
                  className="w-full flex items-center justify-center gap-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-xl transition-all active:scale-[0.98]"
                >
                  <GoogleIcon />
                  Sign in with Google
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-4 bg-white/[0.02] border border-gray-800 rounded-xl">
                    <p className="text-sm text-gray-300 mb-3">
                      Connect Google in your terminal:
                    </p>
                    <div className="bg-black/40 rounded-lg p-3 font-mono text-xs text-gray-300 space-y-1">
                      <p className="text-gray-500"># one-time setup</p>
                      <p>cd backend</p>
                      <p>python setup_google.py</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                      The script walks you through everything. It'll open your browser to sign in with Google — no copy-pasting tokens or IDs.
                    </p>
                  </div>

                  <details className="group">
                    <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400 transition-colors flex items-center gap-1">
                      <svg className="w-3 h-3 transition-transform group-open:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                      What does the script do?
                    </summary>
                    <div className="mt-2 pl-4 text-xs text-gray-600 space-y-1.5 leading-relaxed">
                      <p>1. Checks for <span className="text-gray-400 font-mono">credentials.json</span> (tells you how to get it if missing)</p>
                      <p>2. Opens your browser → you sign into your Google account</p>
                      <p>3. Saves the auth tokens locally — Gmail and Calendar are now active</p>
                    </div>
                  </details>
                </div>
              )}
            </section>

            {/* ElevenLabs */}
            <section>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  ElevenLabs
                </h3>
                {(authStatus?.elevenlabs.connected ?? false) && (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Connected
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-3">
                Optional — high-quality voice. Without it, browser TTS is used.
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  placeholder={authStatus?.elevenlabs.connected ? '••••••••••••••••' : 'Paste your ElevenLabs API key'}
                  value={elevenLabsKey}
                  onChange={(e) => setElevenLabsKey(e.target.value)}
                  className="flex-1 bg-white/[0.04] text-white text-sm px-3 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500/50 focus:outline-none placeholder-gray-600"
                />
                <button
                  onClick={handleSaveElevenLabs}
                  disabled={!elevenLabsKey.trim() || saving}
                  className="px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 rounded-lg transition-all"
                >
                  {saving ? '...' : authStatus?.elevenlabs.connected ? 'Update' : 'Save'}
                </button>
              </div>
            </section>

            {/* Coming Soon */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3">
                Coming Soon
              </h3>
              <div className="space-y-2 opacity-50">
                <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                  <span className="text-sm text-gray-500">SMS (Twilio)</span>
                </div>
                <div className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                  <span className="text-sm text-gray-500">Interac e-Transfer</span>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-800">
            <p className="text-[11px] text-gray-600 text-center">
              All data stored locally on your machine.
            </p>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white shadow-xl animate-fade-in">
          {toast}
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, 8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
    </>
  )
}

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  )
}

function StatusRow({
  name,
  detail,
  connected,
  notConnectedHint,
}: {
  name: string
  detail: string
  connected: boolean
  notConnectedHint: string
}) {
  return (
    <div className="flex items-center justify-between p-3.5 bg-white/[0.03] border border-gray-800 rounded-xl">
      <div>
        <span className="text-sm font-medium text-white">{name}</span>
        <p className="text-xs text-gray-500 mt-0.5">{detail}</p>
      </div>
      {connected ? (
        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Connected
        </span>
      ) : (
        <span className="text-[10px] text-amber-400/70 text-right max-w-[160px] leading-tight font-mono">
          {notConnectedHint}
        </span>
      )}
    </div>
  )
}
