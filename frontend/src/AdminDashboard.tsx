import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import {
    LayoutDashboard, Users, FileText, Settings, LogOut,
    CheckCircle, XCircle, Search, Bell, Wallet, ArrowUpRight
} from 'lucide-react'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard') // dashboard | users | transactions
    const [pendingUsers, setPendingUsers] = useState<any[]>([])
    const [transactions, setTransactions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchData()
    }, [activeTab])

    const fetchData = async () => {
        setLoading(true)

        // Ambil User Pending
        const { data: users } = await supabase
            .from('profiles')
            .select('*')
            .eq('status_verifikasi', 'pending')
            .order('created_at', { ascending: false })
        setPendingUsers(users || [])

        // Ambil Transaksi (Semua)
        const { data: trans } = await supabase
            .from('transactions')
            .select('*, profiles(nama_lengkap)')
            .order('created_at', { ascending: false })
        setTransactions(trans || [])

        setLoading(false)
    }

    // --- LOGIKA ACC USER ---
    const handleApproveUser = async (id: string) => {
        if (!confirm('Verifikasi anggota ini?')) return;
        const noAnggota = `KKJ-${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
        await supabase.from('profiles').update({ status_verifikasi: 'verified', nomor_anggota: noAnggota }).eq('id', id)
        alert(`Anggota diverifikasi! NIAK: ${noAnggota}`)
        fetchData()
    }

    const handleRejectUser = async (id: string) => {
        if (!confirm('Tolak pendaftaran?')) return;
        await supabase.from('profiles').delete().eq('id', id)
        fetchData()
    }

    // --- LOGIKA ACC TOP UP (UANG) ---
    const handleApproveTopUp = async (id: string, amount: number) => {
        if (!confirm(`Terima uang Top Up sebesar Rp ${amount.toLocaleString()}?`)) return;

        // Kita cukup ubah status jadi 'success'.
        // Trigger di Database yang akan otomatis menambah saldo user.
        const { error } = await supabase
            .from('transactions')
            .update({ status: 'success' })
            .eq('id', id)

        if (error) alert('Gagal: ' + error.message)
        else alert('Top Up Berhasil! Saldo anggota otomatis bertambah.')

        fetchData()
    }

    const handleRejectTopUp = async (id: string) => {
        if (!confirm('Tolak request Top Up ini?')) return;
        await supabase.from('transactions').update({ status: 'failed' }).eq('id', id)
        fetchData()
    }

    return (
        <div className="flex min-h-screen bg-gray-100 font-sans">

            {/* SIDEBAR */}
            <aside className="w-64 bg-[#0e2a6d] text-white flex flex-col fixed h-full shadow-xl z-20">
                <div className="p-6 border-b border-blue-800">
                    <h1 className="text-xl font-bold tracking-wide">ADMIN PANEL</h1>
                    <p className="text-xs text-blue-300 mt-1">Koperasi Karya Kita Jaya</p>
                </div>
                <nav className="flex-1 p-4 space-y-2 mt-4">
                    <SidebarItem icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
                    <SidebarItem icon={<Users size={20} />} label="Verifikasi Anggota" active={activeTab === 'users'} onClick={() => setActiveTab('users')} />
                    <SidebarItem icon={<Wallet size={20} />} label="Keuangan & Top Up" active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} />
                </nav>
                <div className="p-4 border-t border-blue-800">
                    <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-3 text-red-300 hover:text-white transition w-full p-2 rounded-lg hover:bg-white/10">
                        <LogOut size={20} /> <span>Keluar</span>
                    </button>
                </div>
            </aside>

            {/* CONTENT */}
            <main className="flex-1 ml-64 p-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            {activeTab === 'dashboard' ? 'Ringkasan Koperasi' :
                                activeTab === 'users' ? 'Verifikasi Anggota' : 'Manajemen Keuangan'}
                        </h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-2 rounded-full shadow-sm text-gray-500 relative">
                            <Bell size={20} />
                            {pendingUsers.length > 0 && <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>}
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-gray-700 text-sm">Administrator</p>
                            <p className="text-xs text-green-600">Online</p>
                        </div>
                    </div>
                </div>

                {/* --- TAB DASHBOARD --- */}
                {activeTab === 'dashboard' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StatCard label="Menunggu Verifikasi" value={pendingUsers.length} color="bg-orange-500" icon={<Users />} />
                        <StatCard label="Transaksi Pending" value={transactions.filter(t => t.status === 'pending').length} color="bg-blue-500" icon={<Wallet />} />
                        <StatCard label="Total Transaksi" value={transactions.length} color="bg-green-600" icon={<FileText />} />
                    </div>
                )}

                {/* --- TAB USERS (Verifikasi Anggota) --- */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100"><h3 className="font-bold text-gray-800">Permintaan Anggota Baru</h3></div>
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 uppercase font-bold">
                                <tr><th className="p-4">Nama</th><th className="p-4">WA</th><th className="p-4">Tanggal</th><th className="p-4 text-center">Aksi</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pendingUsers.length === 0 ? <tr><td colSpan={4} className="p-6 text-center italic">Tidak ada data.</td></tr> :
                                    pendingUsers.map(user => (
                                        <tr key={user.id}>
                                            <td className="p-4 font-bold">{user.nama_lengkap}</td>
                                            <td className="p-4">{user.no_wa}</td>
                                            <td className="p-4">{new Date(user.created_at).toLocaleDateString()}</td>
                                            <td className="p-4 flex justify-center gap-2">
                                                <button onClick={() => handleApproveUser(user.id)} className="bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200 text-xs font-bold">Terima</button>
                                                <button onClick={() => handleRejectUser(user.id)} className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 text-xs font-bold">Tolak</button>
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* --- TAB TRANSACTIONS (ACC Top Up) --- */}
                {activeTab === 'transactions' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100"><h3 className="font-bold text-gray-800">Riwayat Transaksi & Top Up</h3></div>
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50 text-gray-700 uppercase font-bold">
                                <tr><th className="p-4">Anggota</th><th className="p-4">Jenis</th><th className="p-4">Nominal</th><th className="p-4">Status</th><th className="p-4 text-center">Aksi</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {transactions.map(t => (
                                    <tr key={t.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold">{t.profiles?.nama_lengkap || 'User Dihapus'}</td>
                                        <td className="p-4 uppercase text-xs font-bold">{t.type}</td>
                                        <td className="p-4 font-mono font-bold">Rp {t.amount.toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'success' ? 'bg-green-100 text-green-700' :
                                                    t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>{t.status}</span>
                                        </td>
                                        <td className="p-4 text-center">
                                            {t.status === 'pending' && t.type === 'topup' && (
                                                <div className="flex justify-center gap-2">
                                                    <button onClick={() => handleApproveTopUp(t.id, t.amount)} className="bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> ACC</button>
                                                    <button onClick={() => handleRejectTopUp(t.id)} className="bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 text-xs font-bold"><XCircle size={14} /></button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            </main>
        </div>
    )
}

function SidebarItem({ icon, label, active, onClick }: any) {
    return <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${active ? 'bg-white/20 text-white font-bold' : 'text-blue-100 hover:bg-white/10'}`}>{icon} <span>{label}</span></div>
}

function StatCard({ label, value, color, icon }: any) {
    return <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4"><div className={`p-4 rounded-full text-white ${color}`}>{icon}</div><div><p className="text-xs uppercase font-bold text-gray-500">{label}</p><h3 className="text-2xl font-bold text-gray-800">{value}</h3></div></div>
}