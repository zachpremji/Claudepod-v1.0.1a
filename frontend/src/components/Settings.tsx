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
  const [anthropicKey, setAnthropicKey] = useState('')
  const [elevenLabsKey, setElevenLabsKey] = useState('')
  const [googleClientId, setGoogleClientId] = useState('')
  const [googleClientSecret, setGoogleClientSecret] = useState('')
  const [saving, setSaving] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  const handleSaveKey = async (
    key: string,
    payload: Parameters<typeof saveKeys>[0],
    clearFn: () => void
  ) => {
    setSaving(key)
    try {
      await saveKeys(payload)
      clearFn()
      onRefreshAuth()
      showToast('Saved')
    } catch {
      showToast('Failed to save')
    } finally {
      setSaving(null)
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
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-950/95 backdrop-blur-xl border-l border-white/[0.06] z-50 transition-transform duration-300 ease-out ${
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

            {/* Claude AI */}
            <section>
              <SectionHeader
                title="Claude AI"
                subtitle="Required — powers all conversations"
                connected={authStatus?.anthropic.connected ?? false}
              />
              <KeyInput
                placeholder="sk-ant-api03-..."
                value={anthropicKey}
                onChange={setAnthropicKey}
                onSave={() =>
                  handleSaveKey('anthropic', { anthropic_api_key: anthropicKey }, () => setAnthropicKey(''))
                }
                saving={saving === 'anthropic'}
                connected={authStatus?.anthropic.connected ?? false}
              />
            </section>

            {/* ElevenLabs */}
            <section>
              <SectionHeader
                title="ElevenLabs"
                subtitle="Optional — voice synthesis (falls back to browser TTS)"
                connected={authStatus?.elevenlabs.connected ?? false}
              />
              <KeyInput
                placeholder="ElevenLabs API key"
                value={elevenLabsKey}
                onChange={setElevenLabsKey}
                onSave={() =>
                  handleSaveKey('elevenlabs', { elevenlabs_api_key: elevenLabsKey }, () => setElevenLabsKey(''))
                }
                saving={saving === 'elevenlabs'}
                connected={authStatus?.elevenlabs.connected ?? false}
              />
            </section>

            {/* Google */}
            <section>
              <SectionHeader
                title="Google"
                subtitle="Gmail & Calendar — enter OAuth credentials, then connect"
                connected={authStatus?.google.connected ?? false}
              />

              {authStatus?.google.connected ? (
                <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-sm text-emerald-300">Google connected</span>
                  </div>
                  <button
                    onClick={handleDisconnectGoogle}
                    className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Google Client ID"
                      value={googleClientId}
                      onChange={(e) => setGoogleClientId(e.target.value)}
                      className="w-full bg-white/[0.04] text-white text-sm px-3 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500/50 focus:outline-none placeholder-gray-600"
                    />
                    <input
                      type="password"
                      placeholder="Google Client Secret"
                      value={googleClientSecret}
                      onChange={(e) => setGoogleClientSecret(e.target.value)}
                      className="w-full bg-white/[0.04] text-white text-sm px-3 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500/50 focus:outline-none placeholder-gray-600"
                    />
                  </div>

                  {googleClientId && googleClientSecret ? (
                    <div className="flex gap-2">
                      <button
                        onClick={async () => {
                          await handleSaveKey('google', {
                            google_client_id: googleClientId,
                            google_client_secret: googleClientSecret,
                          }, () => {
                            setGoogleClientId('')
                            setGoogleClientSecret('')
                          })
                          // After saving credentials, redirect to Google OAuth
                          setTimeout(() => {
                            window.location.href = getGoogleAuthUrl()
                          }, 500)
                        }}
                        disabled={saving === 'google'}
                        className="flex-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-lg transition-all disabled:opacity-50"
                      >
                        {saving === 'google' ? 'Saving...' : 'Save & Connect Google'}
                      </button>
                    </div>
                  ) : authStatus?.google.available ? (
                    <button
                      onClick={handleConnectGoogle}
                      className="w-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-lg transition-all"
                    >
                      Connect Google Account
                    </button>
                  ) : (
                    <p className="text-xs text-gray-600">
                      Enter your Google OAuth credentials above to connect.
                    </p>
                  )}
                </div>
              )}

              <p className="mt-2.5 text-[11px] text-gray-600 leading-relaxed">
                Create credentials at Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID (Web application). Add <span className="text-gray-500">http://localhost:8000/auth/google/callback</span> as a redirect URI.
              </p>
            </section>

            {/* Coming Soon */}
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-3">
                Coming Soon
              </h3>
              <div className="space-y-2 opacity-50">
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                  <span className="text-sm text-gray-500">SMS (Twilio)</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
                  <span className="text-sm text-gray-500">Interac e-Transfer</span>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-800">
            <p className="text-[11px] text-gray-600 text-center">
              Keys are stored locally on your server. Never shared externally.
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


function SectionHeader({ title, subtitle, connected }: { title: string; subtitle: string; connected: boolean }) {
  return (
    <div className="flex items-start justify-between mb-3">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {connected && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Connected
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  )
}


function KeyInput({
  placeholder,
  value,
  onChange,
  onSave,
  saving,
  connected,
}: {
  placeholder: string
  value: string
  onChange: (v: string) => void
  onSave: () => void
  saving: boolean
  connected: boolean
}) {
  return (
    <div className="flex gap-2">
      <input
        type="password"
        placeholder={connected ? '••••••••••••••••' : placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-white/[0.04] text-white text-sm px-3 py-2.5 rounded-lg border border-gray-700 focus:border-blue-500/50 focus:outline-none placeholder-gray-600"
      />
      <button
        onClick={onSave}
        disabled={!value.trim() || saving}
        className="px-4 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-500 disabled:opacity-30 disabled:hover:bg-blue-600 rounded-lg transition-all"
      >
        {saving ? '...' : connected ? 'Update' : 'Save'}
      </button>
    </div>
  )
}
