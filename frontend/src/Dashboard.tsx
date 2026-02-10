import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import {
  Bell, User,
  Wallet, Send, Download, History,
  Smartphone, Zap, Wifi,
  CreditCard, ShieldCheck, Droplet, Tv,
  Home, QrCode, FileText, ChevronLeft, PlusCircle,
  Gamepad2, DollarSign, Users, Gift, ArrowRight
} from 'lucide-react'
import BottomNav from './components/BottomNav'
import TransaksiView from './dashboard/view/TransaksiView'
import PembiayaanView from './dashboard/view/PembiayaanView'
import Profile from './dashboard/view/ProfileView'



// PENTING: Komponen menerima props 'session' dari App.tsx
export default function Dashboard({ session }: { session: any }) {
    // 1. State untuk Data Profil & Simpanan
    const [profile, setProfile] = useState<any>(null)
    const [simpananList, setSimpananList] = useState<any[]>([])

    // 2. State untuk Tampilan (Pindah Halaman)
    const [view, setView] = useState('home') // 'home', 'topup', 'simpanan'

    // 3. State Form TopUp
    const [amount, setAmount] = useState('')
    const [loadingTopup, setLoadingTopup] = useState(false)

    // Ambil data saat komponen dimuat
    useEffect(() => {
        if (session) {
            getProfile()
            getSimpananData()
        }
    }, [session])

    const getProfile = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

            if (error) throw error
            if (data) setProfile(data)
        } catch (error) {
            console.log('Error ambil profil:', error)
        }
    }

    const getSimpananData = async () => {
        const { data } = await supabase
            .from('rekening_simpanan')
            .select('*, jenis_simpanan(nama_simpanan, kode_simpanan)')
            .eq('user_id', session.user.id)

        if (data) setSimpananList(data)
    }

    const handleTopUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoadingTopup(true)

        // Simpan ke database transaksi
        const { error } = await supabase.from('transactions').insert([{
            user_id: session.user.id,
            type: 'topup',
            amount: parseInt(amount),
            description: 'Top Up Saldo TAPRO',
            status: 'pending'
        }])

        if (error) {
            alert('Gagal: ' + error.message)
        } else {
            alert('Permintaan Top Up Berhasil! Silakan transfer sesuai nominal.')
            setView('home')
            setAmount('')
        }
        setLoadingTopup(false)
    }

    // --- KOMPONEN UI KECIL (Reusable) ---

    const QuickActionButton = ({ icon, label, onClick }: any) => (
        <div
            onClick={onClick}
            className="flex flex-col items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition active:scale-95"
        >
            <div className="text-[#0e2a6d]">{icon}</div>
            <span className="text-xs font-semibold text-gray-700">{label}</span>
        </div>
    )

    const ServiceIcon = ({ icon, label, colorBg, colorIcon }: any) => (
        <div className="flex flex-col items-center gap-2 cursor-pointer hover:-translate-y-1 transition duration-200 group">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${colorBg} ${colorIcon} group-hover:opacity-90`}>
                {icon}
            </div>
            <span className="text-[10px] text-center text-gray-600 font-medium leading-tight h-8 flex items-start justify-center">
                {label}
            </span>
        </div>
    )

    // --- TAMPILAN HALAMAN UTAMA (HOME) ---
    const HomeView = () => (
        <div className="space-y-6 pb-24 md:pb-6 font-sans">

            {/* === HEADER SECTION (Mobile & Desktop Unified Look) === */}
            {/* Background Gradient Header */}
            <div className="bg-gradient-to-r from-[#003366] to-[#004080] text-white pt-8 pb-32 px-6 rounded-b-[40px] relative overflow-hidden -mx-5 -mt-5 md:rounded-2xl md:mx-0 md:mt-0 md:pb-12 md:mb-12 shadow-lg">

                {/* Hiasan Pita Emas */}
                <div className="absolute top-16 left-0 w-full h-32 bg-gradient-to-r from-yellow-500/20 to-transparent transform -skew-y-6 pointer-events-none"></div>

                <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-1 rounded-lg shadow-md">
                            <ShieldCheck size={28} className="text-[#0e2a6d]" />
                        </div>
                        <div>
                            <h1 className="font-bold text-sm md:text-lg leading-tight">KOPERASI KARYA KITA JAYA</h1>
                            <p className="text-[10px] md:text-xs text-yellow-400 italic font-medium">Berkoperasi Demi Wujud Kesejahteraan Bersama</p>
                        </div>
                    </div>
                    <div className="relative">
                        <Bell size={24} className="text-white hover:text-yellow-400 cursor-pointer" />
                        <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#003366]"></div>
                    </div>
                </div>

                {/* KARTU ANGGOTA (Floating Card) */}
                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-0 shadow-2xl border border-blue-400/30 relative text-white max-w-2xl mx-auto overflow-hidden mt-6">

                    {/* Header Kartu Emas */}
                    <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 flex justify-between items-center">
                        <span className="text-xs font-bold text-[#0e2a6d] tracking-widest">KARTU ANGGOTA KKJ</span>
                        <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-2 h-2 bg-white/50"></div><div className="w-2 h-2 bg-white/50"></div>
                            <div className="w-2 h-2 bg-white/50"></div><div className="w-2 h-2 bg-white/50"></div>
                        </div>
                    </div>

                    <div className="p-5 relative">
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10"></div>

                        <div className="flex justify-between items-start relative z-10 gap-4">
                            <div className="flex-1">
                                <h2 className="font-bold text-lg md:text-xl text-white mb-1">{profile?.nama_lengkap || 'Memuat Nama...'}</h2>

                                <div className="space-y-1 mt-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-blue-200 uppercase w-10">NIAK</span>
                                        <span className="text-xs font-mono font-bold text-yellow-300">: {profile?.nomor_anggota || '...'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] text-blue-200 uppercase w-10">STATUS</span>
                                        <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-sm">: ANGGOTA AKTIF</span>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <p className="text-[10px] text-blue-200 uppercase mb-0.5">Saldo Tapro</p>
                                    <p className="text-2xl font-bold text-white tracking-wide">Rp {profile?.saldo_lhu?.toLocaleString() || '0'}</p>
                                </div>
                            </div>

                            {/* Bingkai Foto Profil */}
                            <div className="w-24 h-28 bg-gray-200 rounded-lg border-4 border-white shadow-md overflow-hidden flex items-center justify-center flex-shrink-0">
                                {/* Placeholder User Icon - Nanti bisa diganti <img src={profile.avatar} /> */}
                                <User className="text-gray-400 w-12 h-12" />
                            </div>
                        </div>
                    </div>

                    {/* Footer Kartu */}
                    <div className="bg-[#002244] px-4 py-2 flex justify-between items-center text-[10px] text-blue-300">
                        <span>Bergabung Sejak: 2024</span>
                        <span>Berlaku s/d: 2029</span>
                    </div>
                </div>
            </div>

            {/* === BODY CONTENT === */}
            <div className="px-5 md:px-0 -mt-20 relative z-20 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                {/* KOLOM KIRI (Saldo & Quick Menu) */}
                <div className="md:col-span-1 space-y-5">

                    {/* CARD TOTAL SIMPANAN */}
                    <div className="bg-gradient-to-r from-[#0e2a6d] to-blue-900 rounded-xl shadow-lg p-5 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full blur-xl -mr-5 -mt-5"></div>
                        <div className="relative z-10">
                            <p className="text-xs text-blue-200 font-bold uppercase mb-1">TOTAL SIMPANAN</p>
                            <p className="text-2xl font-bold mb-4 text-yellow-400">Rp 10.452.000</p>

                            <button
                                onClick={() => setView('simpanan')}
                                className="bg-yellow-500 hover:bg-yellow-400 text-[#0e2a6d] w-full py-2.5 rounded-lg text-xs font-bold shadow-md transition flex items-center justify-center gap-2"
                            >
                                <Wallet size={14} /> BAYAR SIMPANAN
                            </button>
                        </div>
                    </div>

                    {/* QUICK MENU CARD */}
                    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition" onClick={() => setView('topup')}>
                                <div className="bg-blue-50 p-2 rounded-full text-blue-600"><Wallet size={20} /></div>
                                <span className="text-sm font-semibold text-gray-700">Top Up</span>
                            </div>
                            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                                <div className="bg-blue-50 p-2 rounded-full text-blue-600"><Send size={20} /></div>
                                <span className="text-sm font-semibold text-gray-700">Kirim</span>
                            </div>
                            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                                <div className="bg-blue-50 p-2 rounded-full text-blue-600"><Download size={20} /></div>
                                <span className="text-sm font-semibold text-gray-700">Tarik Tunai</span>
                            </div>
                            <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition">
                                <div className="bg-blue-50 p-2 rounded-full text-blue-600"><History size={20} /></div>
                                <span className="text-sm font-semibold text-gray-700">Riwayat</span>
                            </div>
                        </div>
                    </div>

                    {/* PEMBIAYAAN PROMO */}
                   {/* PEMBIAYAAN CARD - Pastikan ada cursor-pointer dan z-30 */}
<div
  className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 cursor-pointer"
  onClick={() => {
    console.log('PEMBIAYAAN DIKLIK')
    setView('pembiayaan')
  }}
>
  <div className="flex justify-between items-center mb-4">
    <h3 className="font-bold text-gray-800 text-sm">PEMBIAYAAN</h3>
    <span className="text-xs text-blue-600 flex items-center gap-1">
      Lihat Semua <ArrowRight size={12} />
    </span>
  </div>

  <p className="text-xs text-gray-500 mb-4">
    Akses pembiayaan sesuai kebutuhan Anda
  </p>

  <div className="grid grid-cols-2 gap-3">
    <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3 border">
      <CreditCard size={16} />
      <span className="text-xs font-bold">Kredit Barang</span>
    </div>
    <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3 border">
      <Users size={16} />
      <span className="text-xs font-bold">Modal Usaha</span>
    </div>
  </div>
</div>


                </div>

                {/* KOLOM KANAN (Menu PPOB Grid - Sesuai Gambar) */}
                <div className="md:col-span-2 space-y-6">

                    {/* TOP UP & TAGIHAN SECTION */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-bold text-gray-800 text-base">Top Up & Tagihan</h3>
                            <span className="text-xs text-blue-600 cursor-pointer border border-blue-200 px-3 py-1 rounded-full hover:bg-blue-50">Lihat Semua &gt;</span>
                        </div>

                        {/* GRID ICON WARNA WARNI */}
                        <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-8 gap-x-2">
                            <ServiceIcon icon={<Smartphone size={24} />} label="Pulsa" colorBg="bg-blue-100" colorIcon="text-blue-600" />
                            <ServiceIcon icon={<Wifi size={24} />} label="Paket Data" colorBg="bg-orange-100" colorIcon="text-orange-600" />
                            <ServiceIcon icon={<Zap size={24} />} label="Token" colorBg="bg-yellow-100" colorIcon="text-yellow-600" />
                            <ServiceIcon icon={<DollarSign size={24} />} label="Pulsa Transfer" colorBg="bg-green-100" colorIcon="text-green-600" />
                            <ServiceIcon icon={<Wallet size={24} />} label="Dompet Digital" colorBg="bg-purple-100" colorIcon="text-purple-600" />
                            <ServiceIcon icon={<CreditCard size={24} />} label="Uang Elektronik" colorBg="bg-red-100" colorIcon="text-red-600" />
                            <ServiceIcon icon={<FileText size={24} />} label="Pulsa SMS" colorBg="bg-gray-100" colorIcon="text-gray-600" />
                            <ServiceIcon icon={<Gamepad2 size={24} />} label="Game" colorBg="bg-indigo-100" colorIcon="text-indigo-600" />

                            {/* Baris Kedua (Tagihan) */}
                            <div className="col-span-4 md:col-span-5 lg:col-span-6 h-px bg-gray-100 my-2"></div>

                            <ServiceIcon icon={<Zap size={24} />} label="Tagihan Listrik" colorBg="bg-yellow-50" colorIcon="text-yellow-600" />
                            <ServiceIcon icon={<ShieldCheck size={24} />} label="BPJS" colorBg="bg-green-50" colorIcon="text-green-600" />
                            <ServiceIcon icon={<Tv size={24} />} label="TV Kabel" colorBg="bg-orange-50" colorIcon="text-orange-600" />
                            <ServiceIcon icon={<CreditCard size={24} />} label="Pascabayar" colorBg="bg-blue-50" colorIcon="text-blue-600" />
                            <ServiceIcon icon={<Gift size={24} />} label="Asuransi" colorBg="bg-pink-50" colorIcon="text-pink-600" />
                            <ServiceIcon icon={<Droplet size={24} />} label="PDAM" colorBg="bg-cyan-50" colorIcon="text-cyan-600" />
                            <ServiceIcon icon={<Users size={24} />} label="Multi Finance" colorBg="bg-emerald-50" colorIcon="text-emerald-600" />
                            <ServiceIcon icon={<PlusCircle size={24} />} label="Lainnya" colorBg="bg-gray-50" colorIcon="text-gray-500" />
                        </div>
                    </div>

                    {/* KABAR KKJ / PROMO SLIDER */}
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 text-sm">Program Unggulan Koperasi</h3>
                            <span className="text-xs text-blue-600 cursor-pointer">Lihat Semua &gt;</span>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            <div className="min-w-[140px] h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl relative overflow-hidden shadow-md flex items-end p-3 cursor-pointer hover:scale-105 transition">
                                <div className="text-white">
                                    <p className="font-bold text-sm">TAMASA</p>
                                    <p className="text-[10px]">Tabungan Emas</p>
                                </div>
                                <div className="absolute top-2 right-2 bg-white/20 px-2 py-0.5 rounded text-[8px] text-white font-bold">UNGGULAN</div>
                            </div>
                            <div className="min-w-[140px] h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl relative overflow-hidden shadow-md flex items-end p-3 cursor-pointer hover:scale-105 transition">
                                <div className="text-white">
                                    <p className="font-bold text-sm">INFLIP</p>
                                    <p className="text-[10px]">Investasi Properti</p>
                                </div>
                                <div className="absolute top-2 right-2 bg-blue-800/30 px-2 py-0.5 rounded text-[8px] text-white font-bold">BARU</div>
                            </div>
                            <div className="min-w-[140px] h-24 bg-gradient-to-br from-[#c6a856] to-[#e6cf8b] rounded-xl relative overflow-hidden shadow-md flex items-end p-3 cursor-pointer hover:scale-105 transition">
                                <div className="text-white">
                                    <p className="font-bold text-sm">GADAI</p>
                                    <p className="text-[10px]">Logam Mulia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )

    // 2. HALAMAN TOP UP (Sederhana & Bersih)
    const TopUpView = () => (
        <div className="max-w-xl mx-auto bg-white min-h-screen md:min-h-0 md:rounded-2xl md:shadow-lg md:mt-8 md:mb-8 overflow-hidden">
            <div className="bg-[#0e2a6d] text-white p-4 flex items-center gap-4 shadow-md sticky top-0 z-30">
                <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-full transition"><ChevronLeft /></button>
                <h2 className="font-bold text-lg">Top Up Saldo</h2>
            </div>
            <div className="p-6">
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-8">
                    <p className="text-xs text-gray-500 mb-1">Saldo Saat Ini</p>
                    <p className="text-2xl font-bold text-[#0e2a6d]">Rp {profile?.saldo_lhu?.toLocaleString() || '0'}</p>
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-bold text-gray-700 mb-3">Pilih Nominal Top Up</label>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        {[50000, 100000, 200000, 500000, 1000000, 2000000].map((val) => (
                            <button
                                key={val}
                                onClick={() => setAmount(String(val))}
                                className={`py-3 px-4 border rounded-xl text-sm font-semibold transition ${amount === String(val) ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-400 text-gray-600'}`}
                            >
                                Rp {val.toLocaleString()}
                            </button>
                        ))}
                    </div>

                    <label className="block text-sm font-bold text-gray-700 mb-2">Atau Masukkan Nominal Lain</label>
                    <div className="relative">
                        <span className="absolute left-4 top-3.5 text-gray-500 font-bold">Rp</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0"
                            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-[#0e2a6d] focus:ring-1 focus:ring-[#0e2a6d] outline-none font-bold text-lg"
                        />
                    </div>
                </div>

                <button
                    onClick={handleTopUp}
                    disabled={loadingTopup || !amount}
                    className="w-full bg-[#0e2a6d] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loadingTopup ? 'Memproses...' : 'Lanjut Pembayaran'}
                </button>
            </div>
        </div>
    )

    // 3. HALAMAN SIMPANAN
    const SimpananView = () => (
        <div className="max-w-3xl mx-auto bg-white min-h-screen md:min-h-0 md:rounded-2xl md:shadow-lg md:mt-8 md:mb-8 pb-10">
            <div className="bg-[#0e2a6d] text-white p-4 flex items-center gap-4 sticky top-0 z-30 shadow-md">
                <button onClick={() => setView('home')} className="p-2 hover:bg-white/10 rounded-full transition"><ChevronLeft /></button>
                <h2 className="font-bold text-lg">9 Dompet Simpanan</h2>
            </div>

            <div className="p-6">
                {/* Header Summary */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex justify-between items-center">
                    <div>
                        <p className="text-xs text-yellow-800 font-bold uppercase">Total Akumulasi</p>
                        <p className="text-xl font-bold text-[#0e2a6d]">Rp 10.452.000</p>
                    </div>
                    <div className="bg-yellow-500 text-white p-2 rounded-full shadow-sm"><Wallet size={20} /></div>
                </div>

                <div className="space-y-3">
                    {simpananList.length > 0 ? simpananList.map((item) => (
                        <div key={item.id} className="p-4 border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center bg-white group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100 group-hover:bg-[#0e2a6d] group-hover:text-white transition">
                                    {item.jenis_simpanan?.kode_simpanan?.substring(0, 2) || 'S'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 text-sm">{item.jenis_simpanan?.nama_simpanan}</h3>
                                    <p className="text-xs text-gray-400">{item.jenis_simpanan?.kode_simpanan}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[#0e2a6d] font-bold text-sm">Rp {item.saldo.toLocaleString()}</p>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border-dashed border-2 border-gray-200">
                            <p className="font-medium">Data Simpanan Belum Tersedia</p>
                            <p className="text-xs mt-1">Silakan hubungi admin untuk aktivasi rekening.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )

    // --- RENDER UTAMA ---
   return (
  <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
    <div className="w-full">
      {view === 'home' && <HomeView />}
      {view === 'topup' && <TopUpView />}
      {view === 'simpanan' && <SimpananView />}
      
      {/* Pastikan ini ada dan variabel 'view' dieja dengan benar */}
      {view === 'pembiayaan' && (
        <PembiayaanView
          session={session}
          onBack={() => setView('home')}
        />
      )}

      {view === 'transaksi' && (
        <TransaksiView
          session={session}
          onBack={() => setView('home')}
        />
      )}
    </div>
    {view === 'profile' && (

  <Profile
    session={session}
    onBack={() => setView('home')}
  />
)}


    <BottomNav
      active={view}
      onChange={setView}
    />
  </div>
)

}
