import { useEffect, useState } from 'react'
import { supabase } from '../../supabaseClient'
import {
  User,
  Phone,
  Mail,
  CreditCard,
  LogOut,
  Pencil,
  Save,
  X
} from 'lucide-react'

export default function Profile({
  session,
  onBack
}: {
  session: any
  onBack: () => void
}) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState({
    nama_lengkap: '',
    no_hp: ''
  })

  useEffect(() => {
    if (session?.user) fetchProfile()
  }, [session])

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles') // ✅ BENAR
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (!error && data) {
      setProfile(data)
      setForm({
        nama_lengkap: data.nama_lengkap || '',
        no_hp: data.no_hp || ''
      })
    }
    setLoading(false)
  }

  const handleSave = async () => {
    const { error } = await supabase
      .from('profiles') // ✅ BENAR
      .update({
        nama_lengkap: form.nama_lengkap,
        no_hp: form.no_hp
      })
      .eq('id', session.user.id)

    if (error) {
      alert('Gagal menyimpan profil')
    } else {
      setIsEdit(false)
      fetchProfile()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    location.reload()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Memuat profil...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">

      {/* HEADER */}
      <div className="bg-[#0e2a6d] text-white p-6 rounded-b-3xl flex justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white text-[#0e2a6d] rounded-full flex items-center justify-center">
            <User size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg">
              {profile?.nama_lengkap}
            </h2>
            <p className="text-xs text-blue-200">
              Anggota Koperasi
            </p>
          </div>
        </div>

        {!isEdit && (
          <button
            onClick={() => setIsEdit(true)}
            className="bg-white/20 p-2 rounded-full"
          >
            <Pencil size={18} />
          </button>
        )}
      </div>

      {/* CARD */}
      <div className="bg-white mx-4 -mt-6 p-5 rounded-2xl shadow space-y-4">

        <InfoItem
          icon={<CreditCard />}
          label="ID Anggota"
          value={profile?.nomor_anggota || '-'}
        />

        {isEdit ? (
          <InputItem
            icon={<User />}
            label="Nama Lengkap"
            value={form.nama_lengkap}
           onChange={(v: string) =>
  setForm({ ...form, nama_lengkap: v })
}

          />
        ) : (
          <InfoItem
            icon={<User />}
            label="Nama Lengkap"
            value={profile?.nama_lengkap}
          />
        )}

        {isEdit ? (
          <InputItem
            icon={<Phone />}
            label="No. HP"
            value={form.no_hp}
           onChange={(v: string) =>
  setForm({ ...form, nama_lengkap: v })
}

          />
        ) : (
          <InfoItem
            icon={<Phone />}
            label="No. HP"
            value={profile?.no_hp || '-'}
          />
        )}

        <InfoItem
          icon={<Mail />}
          label="Email"
          value={session.user.email}
        />

        {isEdit && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex-1 bg-[#0e2a6d] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Save size={18} /> Simpan
            </button>
            <button
              onClick={() => setIsEdit(false)}
              className="flex-1 bg-gray-200 py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <X size={18} /> Batal
            </button>
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mx-4 mt-6 w-[calc(100%-2rem)] bg-red-100 text-red-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2"
      >
        <LogOut size={18} /> Keluar
      </button>
    </div>
  )
}

/* ========= KOMPONEN ========= */

const InfoItem = ({ icon, label, value }: any) => (
  <div className="flex items-center gap-4">
    <div className="text-[#0e2a6d]">{icon}</div>
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  </div>
)

const InputItem = ({ icon, label, value, onChange }: any) => (
  <div className="flex items-center gap-4">
    <div className="text-[#0e2a6d]">{icon}</div>
    <div className="flex-1">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#0e2a6d]"
      />
    </div>
  </div>
)
