import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { BottomBar } from './BottomBar'
import { CommandHub } from '../command/CommandHub'
import { ReferenceView } from '../reference/ReferenceView'
import { useStore } from '../../store/useStore'

export function Shell() {
  const activeTab = useStore((s) => s.activeTab)

  return (
    <div className="h-screen flex flex-col bg-pod">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'cmd' ? <CommandHub /> : <ReferenceView />}
        </main>
      </div>
      <BottomBar />
    </div>
  )
}
