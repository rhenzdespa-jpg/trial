import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      try {
        // First, try to get the session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          setError(sessionError.message)
          setTimeout(() => router.push('/login'), 2000)
          return
        }

        if (session) {
          console.log('Session found, redirecting to home')
          router.push('/')
          return
        }

        // If no session, maybe the code needs to be exchanged?
        // Wait for router to be ready (in case we have query params)
        if (router.isReady) {
          // Just redirect to login if no session
          console.log('No session found, redirecting to login')
          router.push('/login')
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('Something went wrong')
        setTimeout(() => router.push('/login'), 2000)
      }
    }

    handleAuthCallback()
  }, [router, router.isReady])

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <div className="text-6xl mb-4 animate-bounce">💕</div>
        {error ? (
          <p className="font-display text-red-500 text-xl">{error}</p>
        ) : (
          <p className="font-display text-bubblegum text-xl">Logging you in...</p>
        )}
      </div>
    </div>
  )
}
