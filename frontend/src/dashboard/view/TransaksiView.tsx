import { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { supabase } from '../../supabaseClient'

type TransaksiViewProps = {
  session: any
  onBack: () => void
}

export default function TransaksiView({
  session,
  onBack
}: TransaksiViewProps) {
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTopUp = async () => {
    if (!amount || Number(amount) <= 0) return
    setLoading(true)

    const { error } = await supabase.from('transactions').insert([
      {
        user_id: session.user.id,
        type: 'topup',
        amount: Number(amount),
        description: 'Top Up Saldo TAPRO',
        status: 'pending'
      }
    ])

    if (error) {
      alert('Gagal membuat transaksi')
      console.error(error)
    } else {
      alert('Transaksi berhasil dibuat')
      setAmount('')
      onBack()
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-[#0e2a6d] text-white p-4 flex items-center gap-3 sticky top-0 z-20">
        <button
          onClick={onBack}
          className="p-1 rounded hover:bg-white/10 transition"
        >
          <ChevronLeft />
        </button>
        <h2 className="font-bold text-lg">Transaksi</h2>
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-6 max-w-md mx-auto">
        <div className="bg-white p-5 rounded-xl shadow-sm border">
          <label className="text-sm font-semibold text-gray-600 block mb-2">
            Nominal Top Up
          </label>
          <div className="relative">
            <span className="absolute left-4 top-3 text-gray-500 font-semibold">
              Rp
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              className="w-full border rounded-lg p-3 pl-12 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#0e2a6d]"
            />
          </div>
        </div>

        <button
          onClick={handleTopUp}
          disabled={loading || !amount}
          className="w-full bg-[#0e2a6d] text-white py-3 rounded-xl font-bold text-lg shadow hover:bg-blue-900 transition disabled:opacity-50"
        >
          {loading ? 'Memproses...' : 'Lanjutkan'}
        </button>
      </div>
    </div>
  )
}
