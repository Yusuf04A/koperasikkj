import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import {
    LayoutDashboard, Users, FileText, Settings, LogOut,
    CheckCircle, XCircle, Search, Bell
} from 'lucide-react'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard') // dashboard | users | transactions
    const [pendingUsers, setPendingUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPendingUsers()
    }, [])

    const fetchPendingUsers = async () => {
        setLoading(true)
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('status_verifikasi', 'pending')
            .order('created_at', { ascending: false })
        setPendingUsers(data || [])
        setLoading(false)
    }

    const handleApprove = async (id: string) => {
        if (!confirm('Verifikasi anggota ini?')) return;
        // Generate Nomor Anggota otomatis (Contoh sederhana)
        const noAnggota = `KKJ-${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;

        await supabase.from('profiles').update({
            status_verifikasi: 'verified',
            nomor_anggota: noAnggota
        }).eq('id', id)

        alert(`Anggota diverifikasi! NIAK: ${noAnggota}`)
        fetchPendingUsers()
    }

    const handleReject = async (id: string) => {
        if (!confirm('Tolak pendaftaran ini?')) return;
        await supabase.from('profiles').delete().eq('id', id)
        fetchPendingUsers()
    }

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">

            {/* --- SIDEBAR (KIRI) --- */}
            <aside className="w-64 bg-[#0e2a6d] text-white flex flex-col fixed h-full shadow-xl z-20">
                <div className="p-6 border-b border-blue-800">
                    <h1 className="text-xl font-bold tracking-wide">ADMIN PANEL</h1>
                    <p className="text-xs text-blue-300 mt-1">Koperasi Karya Kita Jaya</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarItem icon={<Users size={20} />} label="Anggota & Verifikasi" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <SidebarItem icon={<FileText size={20} />} label="Transaksi" active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
                    <SidebarItem icon={<Settings size={20} />} label="Pengaturan" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                </nav>

                <div className="p-4 border-t border-blue-800">
                    <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 text-red-300 hover:text-white transition w-full p-2 rounded-lg hover:bg-white/10">
                        <LogOut size={20} />
                        <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* --- CONTENT AREA (KANAN) --- */}
            <main className="flex-1 ml-64 p-8">

                {/* Top Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {activeTab === 'dashboard' ? 'Ringkasan Koperasi' :
                                activeTab === 'users' ? 'Manajemen Anggota' : 'Data Transaksi'}
                        </h2>
                        <p className="text-gray-500 text-sm">Update terakhir: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-500"><Search size={20} /></div>
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-500 relative">
                            <Bell size={20} />
                            <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-[#0e2a6d] font-bold">A</div>
                            <div className="text-sm">
                                <p className="font-bold text-gray-700">Administrator</p>
                                <p className="text-xs text-green-600">Online</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- KONTEN DINAMIS --- */}

                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <StatCard label="Total Anggota" value="1,240" color="bg-blue-500" icon={<Users />} />
                        <StatCard label="Menunggu Verifikasi" value={pendingUsers.length.toString()} color="bg-orange-500" icon={<Users />} />
                        <StatCard label="Aset Koperasi" value="Rp 2.4M" color="bg-green-600" icon={<LayoutDashboard />} />
                        <StatCard label="Pinjaman Aktif" value="Rp 850jt" color="bg-purple-600" icon={<FileText />} />
                    </div>
                )}

                {(activeTab === 'users' || activeTab === 'dashboard') && (
                    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">Permintaan Verifikasi Anggota Baru</h3>
                            <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-bold">{pendingUsers.length} Pending</span>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-700 uppercase font-bold">
                                    <tr>
                                        <th className="p-4">Nama Lengkap</th>
                                        <th className="p-4">WhatsApp</th>
                                        <th className="p-4">Tanggal Daftar</th>
                                        <th className="p-4 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {loading ? (
                                        <tr><td colSpan={4} className="p-6 text-center">Memuat data...</td></tr>
                                    ) : pendingUsers.length === 0 ? (
                                        <tr><td colSpan={4} className="p-6 text-center italic">Tidak ada pendaftaran baru.</td></tr>
                                    ) : (
                                        pendingUsers.map(user => (
                                            <tr key={user.id} className="hover:bg-blue-50 transition">
                                                <td className="p-4 font-bold text-gray-800">{user.nama_lengkap}</td>
                                                <td className="p-4">{user.no_wa}</td>
                                                <td className="p-4">{new Date(user.created_at).toLocaleDateString()}</td>
                                                <td className="p-4 flex justify-center gap-2">
                                                    <button onClick={() => handleApprove(user.id)} className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-green-200 font-semibold text-xs transition">
                                                        <CheckCircle size={14} /> Terima
                                                    </button>
                                                    <button onClick={() => handleReject(user.id)} className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-red-200 font-semibold text-xs transition">
                                                        <XCircle size={14} /> Tolak
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

            </main>
        </div>
    )
}

// --- Komponen Admin Kecil ---
function SidebarItem({ icon, label, active, onClick }: any) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition duration-200 ${active ? 'bg-white/20 text-white font-bold' : 'text-blue-100 hover:bg-white/10'}`}
        >
            {icon} <span>{label}</span>
        </div>
    )
}

function StatCard({ label, value, color, icon }: any) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`p-4 rounded-full text-white ${color} shadow-lg`}>
                {icon}
            </div>
            <div>
                <p className="text-gray-500 text-xs uppercase font-bold tracking-wide">{label}</p>
                <h3 className="text-2xl font-bold text-gray-800 mt-1">{value}</h3>
            </div>
        </div>
    )
}