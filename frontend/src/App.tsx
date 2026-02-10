import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './supabaseClient'

import Auth from './Auth'
import Dashboard from './Dashboard'
import AdminDashboard from './AdminDashboard'
import Profile from './dashboard/view/ProfileView'

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchUserProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        if (session) fetchUserProfile(session.user.id)
        else {
          setUserProfile(null)
          setLoading(false)
        }
      })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    setUserProfile(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-bold">
        Memuat Data Koperasi...
      </div>
    )
  }

  const isAdmin = session && userProfile?.role === 'admin'
  const isMemberVerified =
    session &&
    userProfile?.role === 'member' &&
    userProfile?.status_verifikasi === 'verified'

  return (
    <BrowserRouter>
      <Routes>

        {/* BELUM LOGIN */}
        {!session && (
          <>
            <Route path="/login" element={<Auth />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

        {/* SUDAH LOGIN TAPI PROFIL TIDAK ADA */}
        {session && !userProfile && (
          <Route
            path="*"
            element={
              <div className="text-center p-10">
                Data profil tidak ditemukan.
                <br />
                <button onClick={() => supabase.auth.signOut()}>
                  Keluar
                </button>
              </div>
            }
          />
        )}

        {/* ADMIN */}
        {isAdmin && (
          <>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </>
        )}

        {/* MEMBER BELUM VERIFIKASI */}
        {session && userProfile?.status_verifikasi === 'pending' && (
          <Route
            path="*"
            element={
              <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded-xl shadow text-center">
                  <h2 className="text-xl font-bold mb-2">
                    Menunggu Verifikasi
                  </h2>
                  <p className="mb-4">
                    Terima kasih, <b>{userProfile.nama_lengkap}</b>.
                    <br />
                    Data Anda sedang diperiksa admin.
                  </p>
                  <button
                    onClick={() => supabase.auth.signOut()}
                    className="bg-gray-200 px-4 py-2 rounded"
                  >
                    Keluar
                  </button>
                </div>
              </div>
            }
          />
        )}

        {/* MEMBER VERIFIED */}
        {isMemberVerified && (
          <>
            <Route path="/dashboard" element={<Dashboard session={session} />} />
           <Route
  path="/profile"
  element={
    <Profile
      session={session}
      onBack={() => window.history.back()}
    />
  }
/>

            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        )}

      </Routes>
    </BrowserRouter>
  )
}
