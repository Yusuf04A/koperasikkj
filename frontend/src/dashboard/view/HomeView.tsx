
import {
  Bell, User, Wallet, Send, Download, History,
  Smartphone, Zap, Wifi, CreditCard, ShieldCheck,
  Droplet, Tv, Gamepad2, DollarSign, Users, Gift,
  PlusCircle, ArrowRight
} from 'lucide-react'

type Props = {
  profile: any
  setView: (v: string) => void
}

export default function HomeView({ profile, setView }: Props) {
  return (
    <div className="space-y-6 pb-24 font-sans">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#003366] to-[#004080] text-white pt-8 pb-32 px-6 rounded-b-[40px] relative">

        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg">
              <ShieldCheck size={28} className="text-[#0e2a6d]" />
            </div>
            <div>
              <h1 className="font-bold text-sm">KOPERASI KARYA KITA JAYA</h1>
              <p className="text-[10px] text-yellow-400 italic">
                Berkoperasi Demi Kesejahteraan
              </p>
            </div>
          </div>
          <Bell size={22} />
        </div>

        {/* KARTU ANGGOTA */}
        <div className="bg-blue-700 rounded-xl p-5 text-white">
          <h2 className="font-bold text-lg">
            {profile?.nama_lengkap || 'Memuat...'}
          </h2>

          <p className="text-xs mt-1">
            ID: {profile?.nomor_anggota || '-'}
          </p>

          <div className="mt-4">
            <p className="text-[10px] text-blue-200">Saldo Tapro</p>
            <p className="text-2xl font-bold">
              Rp {profile?.saldo_lhu?.toLocaleString() || '0'}
            </p>
          </div>
        </div>
      </div>

      {/* QUICK MENU */}
      <div className="px-5 grid grid-cols-2 gap-4 -mt-16">
        <MenuItem icon={<Wallet />} label="Top Up" onClick={() => setView('topup')} />
        <MenuItem icon={<History />} label="Simpanan" onClick={() => setView('simpanan')} />
        <MenuItem icon={<Send />} label="Kirim" />
        <MenuItem icon={<Download />} label="Tarik" />
      </div>
    </div>
  )
}

const MenuItem = ({ icon, label, onClick }: any) => (
  <div
    onClick={onClick}
    className="bg-white p-4 rounded-xl shadow flex items-center gap-3 cursor-pointer"
  >
    <div className="text-[#0e2a6d]">{icon}</div>
    <span className="font-semibold">{label}</span>
  </div>
)
