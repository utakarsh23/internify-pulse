import Navbar from '@/components/layout/Navbar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar companyName="Tech Solutions Pvt Ltd" />
      <main>
        {children}
      </main>
    </div>
  )
}