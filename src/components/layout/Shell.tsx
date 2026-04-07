import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { ChatView } from '../chat/ChatView'
import { useStore } from '../../store/useStore'

export function Shell() {
  const sidebarOpen = useStore((s) => s.sidebarOpen)

  return (
    <div className="h-screen flex flex-col bg-pod">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && <Sidebar />}
        <main className="flex-1 overflow-hidden">
          <ChatView />
        </main>
      </div>
    </div>
  )
}
