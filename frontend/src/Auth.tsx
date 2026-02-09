import { useState } from 'react'
import { supabase } from './supabaseClient'
import { Fingerprint, ChevronLeft, Shield } from 'lucide-react'

export default function Auth() {
    // State untuk mengatur tampilan: 'landing' | 'login' | 'register'
    const [view, setView] = useState<'landing' | 'login' | 'register'>('landing')

    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('') // Sesuai Dokumen
    const [phone, setPhone] = useState('')       // Sesuai Dokumen

    // Fungsi Login
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // 1. Coba Login ke Supabase Auth
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            alert('Login Gagal: ' + error.message)
            setLoading(false)
            return
        }

        // 2. CEK STATUS VERIFIKASI (LOGIKA TAMBAHAN)
        if (data.user) {
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('status_verifikasi, role')
                .eq('id', data.user.id)
                .single()

            // Jika terjadi error saat ambil profil atau profil tidak ditemukan
            if (profileError || !profile) {
                alert('Gagal mengambil data profil.')
                await supabase.auth.signOut() // Paksa keluar
                setLoading(false)
                return
            }

            // Jika status MASIH PENDING (Belum di-approve admin)
            if (profile.status_verifikasi === 'pending') {
                alert('Mohon maaf, akun Anda sedang dalam proses verifikasi oleh Pengurus Koperasi. Mohon tunggu persetujuan.')
                await supabase.auth.signOut() // Paksa keluar lagi
                setLoading(false)
                return
            }

            // Jika DITOLAK
            if (profile.status_verifikasi === 'rejected') {
                alert('Pendaftaran Anda ditolak oleh Pengurus.')
                await supabase.auth.signOut()
                setLoading(false)
                return
            }

            // Jika VERIFIED, biarkan lanjut (App.tsx akan otomatis mendeteksi session)
        }
        setLoading(false)
    }

    // Fungsi Daftar (Register)
    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // 1. Daftar ke Supabase
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            alert(error.message)
        } else if (data.user) {
            // 2. Simpan data profil dengan status 'pending'
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        nama_lengkap: fullName,
                        no_wa: phone,
                        role: 'member',
                        status_verifikasi: 'pending', // PENTING: Default pending
                        saldo_lhu: 0
                    }
                ])

            if (profileError) {
                alert('Gagal menyimpan profil: ' + profileError.message)
            } else {
                // 3. Beri notifikasi ke user
                alert('Pendaftaran Berhasil! Data Anda telah masuk ke sistem dan sedang menunggu verifikasi Pengurus. Anda belum bisa login sampai diverifikasi.')
                setView('login')
            }
        }
        setLoading(false)
    }

    return (
        // Background Utama: Biru Tua Gradient (Sesuai Konsep Identitas)
        <div className="min-h-screen bg-gradient-to-b from-[#0f2052] to-[#1e3a8a] flex items-center justify-center relative overflow-hidden font-sans">

            {/* Hiasan Background (Lengkungan Emas/Cahaya) */}
            <div className="absolute top-0 right-0 w-full h-1/2 bg-gradient-to-b from-blue-500/20 to-transparent rounded-bl-[100px] pointer-events-none"></div>

            {/* Container Konten (Max width HP) */}
            <div className="w-full max-w-md px-6 z-10 flex flex-col h-screen justify-center">

                {/* --- TAMPILAN 1: LANDING SCREEN (Awal Buka Aplikasi) --- */}
                {view === 'landing' && (
                    <div className="text-center animate-fade-in space-y-8">

                        {/* Logo Area */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="bg-white p-4 rounded-xl shadow-2xl mb-4 rotate-3 border-2 border-secondary">
                                {/* Logo Placeholder (Ganti img src jika sudah ada file logo) */}
                                <Shield size={64} className="text-primary" />
                                <h1 className="text-2xl font-bold text-primary mt-[-40px] ml-1">KKJ</h1>
                            </div>
                            <h1 className="text-2xl font-bold text-white tracking-wide">KOPERASI<br />KARYA KITA JAYA</h1>
                            <p className="text-secondary text-sm mt-2 italic">"Aplikasi Koperasi Anda"</p>
                        </div>

                        {/* Tombol-tombol Utama */}
                        <div className="space-y-4 w-full">
                            {/* Tombol LOGIN (Emas Gradient) */}
                            <button
                                onClick={() => setView('login')}
                                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-blue-900 font-bold py-4 rounded-xl shadow-lg hover:scale-105 transition transform text-lg border-b-4 border-yellow-700"
                            >
                                LOGIN
                            </button>

                            {/* Tombol DAFTAR (Biru Outline/Dark) */}
                            <button
                                onClick={() => setView('register')}
                                className="w-full bg-[#172554] text-white font-bold py-4 rounded-xl shadow-lg border border-blue-400 hover:bg-blue-900 transition text-lg"
                            >
                                DAFTAR ANGGOTA
                            </button>
                        </div>

                        {/* Fingerprint Area */}
                        <div className="mt-12 flex flex-col items-center gap-3 opacity-80 cursor-pointer hover:opacity-100 transition">
                            <div className="p-4 border-2 border-blue-400/30 rounded-full bg-white/5 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                <Fingerprint size={40} className="text-blue-200" />
                            </div>
                            <p className="text-blue-200 text-xs">Atau masuk dengan sidik jari</p>
                        </div>

                        {/* Footer Bahasa */}
                        <div className="absolute bottom-6 left-0 right-0 text-center">
                            <p className="text-xs text-blue-300">Bahasa Indonesia | English</p>
                        </div>
                    </div>
                )}

                {/* --- TAMPILAN 2: FORM LOGIN --- */}
                {view === 'login' && (
                    <div className="bg-white rounded-2xl p-8 shadow-2xl relative animate-slide-up">
                        <button onClick={() => setView('landing')} className="absolute top-4 left-4 text-gray-400 hover:text-primary">
                            <ChevronLeft size={28} />
                        </button>

                        <h2 className="text-2xl font-bold text-center text-primary mb-6">Masuk Aplikasi</h2>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email / No HP</label>
                                <input
                                    type="email"
                                    placeholder="Masukkan email terdaftar"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    placeholder="********"
                                    required
                                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition shadow-lg mt-4"
                            >
                                {loading ? 'Memproses...' : 'MASUK'}
                            </button>
                        </form>
                        <p className="mt-4 text-center text-sm text-gray-500">
                            Lupa password? <span className="text-secondary cursor-pointer font-semibold">Reset disini</span>
                        </p>
                    </div>
                )}

                {/* --- TAMPILAN 3: FORM REGISTRASI --- */}
                {view === 'register' && (
                    <div className="bg-white rounded-2xl p-8 shadow-2xl relative animate-slide-up my-auto">
                        <button onClick={() => setView('landing')} className="absolute top-4 left-4 text-gray-400 hover:text-primary">
                            <ChevronLeft size={28} />
                        </button>

                        <h2 className="text-2xl font-bold text-center text-primary mb-2">Form Pendaftaran</h2>
                        <p className="text-center text-xs text-gray-500 mb-6">Isi data sesuai KTP Anda</p>

                        <form onSubmit={handleRegister} className="space-y-3">
                            {/* Input: Nama Lengkap */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase">Nama Lengkap (Sesuai KTP)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary outline-none"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                            </div>

                            {/* Input: No WhatsApp */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase">Nomor WhatsApp Aktif</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="08xxxxxxxxxx"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary outline-none"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>

                            {/* Input: Email (Wajib di Supabase) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary outline-none"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            {/* Input: Password */}
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase">Buat Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-primary outline-none"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#172554] text-white font-bold py-3 rounded-lg hover:bg-blue-900 transition shadow-lg mt-2"
                            >
                                {loading ? 'Mendaftarkan...' : 'KIRIM PENDAFTARAN'}
                            </button>
                        </form>
                    </div>
                )}

            </div>
        </div>
    )
}