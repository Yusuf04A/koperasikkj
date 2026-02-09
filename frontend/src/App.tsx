import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './Auth'
import Dashboard from './Dashboard'      // Tampilan Member
import AdminDashboard from './AdminDashboard' // Tampilan Admin Baru

export default function App() {
  const [session, setSession] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Cek sesi login saat aplikasi dibuka
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) fetchUserProfile(session.user.id)
      else setLoading(false)
    })

    // 2. Pantau perubahan auth (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) fetchUserProfile(session.user.id)
      else {
        setUserProfile(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fungsi ambil data profil (Role & Status)
  const fetchUserProfile = async (userId: string) => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetch profile:', error)
    } else {
      setUserProfile(data)
    }
    setLoading(false)
  }

  // --- LOGIKA TAMPILAN (ROUTING) ---

  // 1. Loading Screen
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-primary font-bold">Memuat Data Koperasi...</div>
  }

  // 2. Belum Login -> Tampilkan Auth
  if (!session) {
    return <Auth />
  }

  // 3. Sudah Login tapi Profil belum ke-load (Jaga-jaga)
  if (!userProfile) {
    return <div className="text-center p-10">Data profil tidak ditemukan. Silakan login ulang. <br /> <button onClick={() => supabase.auth.signOut()}>Keluar</button></div>
  }

  // 4. JIKA ADMIN -> Masuk Admin Dashboard
  if (userProfile.role === 'admin') {
    return <AdminDashboard />
  }

  // 5. JIKA MEMBER TAPI BELUM VERIFIKASI -> Tahan di layar tunggu
  if (userProfile.status_verifikasi === 'pending') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm">
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Menunggu Verifikasi</h2>
          <p className="text-gray-600 mb-6">
            Terima kasih telah mendaftar, <b>{userProfile.nama_lengkap}</b>. <br /><br />
            Data Anda sedang diperiksa oleh Pengurus Koperasi. Mohon tunggu persetujuan admin atau hubungi pengurus via WhatsApp.
          </p>
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full bg-gray-200 text-gray-700 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Keluar & Cek Nanti
          </button>
        </div>
      </div>
    )
  }

  // 6. JIKA MEMBER & SUDAH VERIFIED -> Masuk Dashboard Utama
  return <Dashboard session={session} />
}