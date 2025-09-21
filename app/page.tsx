import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to company profile by default
  redirect('/profile')
}