import { Home, Wallet, CreditCard, Bell, User } from 'lucide-react'

type Props = {
  active: string
  onChange: (v: string) => void
}

export default function BottomNav({ active, onChange }: Props) {
  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 h-20 flex justify-around items-end pb-4 text-[10px] font-medium text-gray-400 z-50">

      <NavItem
        label="Home"
        icon={<Home size={24} />}
        active={active === 'home'}
        onClick={() => onChange('home')}
      />

      <NavItem
        label="Transaksi"
        icon={<Wallet size={24} />}
        active={active === 'topup'}
        onClick={() => onChange('topup')}
      />

      <NavItem
        label="Pembiayaan"
        icon={<CreditCard size={24} />}
        active={active === 'pembiayaan'}
        onClick={() => onChange('pembiayaan')}
      />

      <NavItem
        label="Notifikasi"
        icon={<Bell size={24} />}
        active={active === 'notifikasi'}
        onClick={() => onChange('notifikasi')}
      />

    <NavItem
  label="Profil"
  icon={<User size={24} />}
  active={active === 'profile'}
  onClick={() => onChange('profile')}
/>

    </div>
  )
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 w-14 transition
        ${active ? 'text-[#0e2a6d]' : 'hover:text-[#0e2a6d]'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}
