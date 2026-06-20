import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'

function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-surface-dark transition-colors">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout