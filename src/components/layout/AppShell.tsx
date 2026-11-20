import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'

export function AppShell() {
  return (
    <div className="bg-background text-on-surface font-body-md overflow-hidden min-h-screen">
      <Sidebar />
      <TopNav />
      <main className="ml-[260px] pt-16 h-screen overflow-y-auto overflow-x-hidden scrollbar-visible">
        <div className="p-gutter max-w-[1600px] mx-auto space-y-stack_lg pb-8 min-w-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
