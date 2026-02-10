import { useState } from "react"
import { ChevronLeft } from "lucide-react"

/* ===== TYPES ===== */
type Jenis =
  | "kredit_barang"
  | "modal_usaha"
  | "pelatihan"
  | "pendidikan"
  | ""

/* ===== PROPS ===== */
type Props = {
  session: any
  onBack: () => void
}

/* ===== PAGE ===== */
export default function PembiayaanView({ onBack }: Props) {
  const [jenis, setJenis] = useState<Jenis>("")

  const handleAjukan = () => {
    alert("Pengajuan pembiayaan berhasil dikirim")
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      {/* HEADER */}
      <div className="bg-[#0e2a6d] px-4 py-4 flex items-center gap-3 sticky top-0 z-30">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-white/10 text-white"
        >
          <ChevronLeft />
        </button>
        <div>
          <h1 className="text-white text-lg font-bold">
            Pembiayaan
          </h1>
          <p className="text-blue-200 text-xs">
            Pengajuan pembiayaan anggota
          </p>
        </div>
      </div>

      {/* PILIH JENIS */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-2xl p-4 shadow">
          <label className="text-sm font-semibold">
            Pilih Jenis Pembiayaan
          </label>

          <select
            value={jenis}
            onChange={(e) => setJenis(e.target.value as Jenis)}
            className="w-full border rounded-lg px-3 py-2 mt-2"
          >
            <option value="">-- Pilih --</option>
            <option value="kredit_barang">Kredit Barang</option>
            <option value="modal_usaha">Modal Usaha</option>
            <option value="pelatihan">Biaya Pelatihan</option>
            <option value="pendidikan">Biaya Pendidikan</option>
          </select>
        </div>
      </div>

      {/* FORM */}
      <div className="px-4 mt-6 space-y-4">
        {jenis === "kredit_barang" && (
          <KreditBarang onSubmit={handleAjukan} />
        )}

        {jenis === "modal_usaha" && (
          <ModalUsaha onSubmit={handleAjukan} />
        )}

        {jenis === "pelatihan" && (
          <Pelatihan onSubmit={handleAjukan} />
        )}

        {jenis === "pendidikan" && (
          <Pendidikan onSubmit={handleAjukan} />
        )}
      </div>
    </div>
  )
}

/* ===================== */
/* ===== FORM-FORM ===== */
/* ===================== */

function KreditBarang({ onSubmit }: { onSubmit: () => void }) {
  const [harga, setHarga] = useState(0)
  const [tenor, setTenor] = useState(12)

  const total = harga + harga * 0.1
  const angsuran = tenor ? total / tenor : 0

  return (
    <FormWrapper title="Kredit Barang" angsuran={angsuran} onSubmit={onSubmit}>
      <Input label="Nama Barang" />
      <Input label="Estimasi Harga" type="number" onChange={setHarga} />
      <Input label="Tenor (bulan)" type="number" value={tenor} onChange={setTenor} />
    </FormWrapper>
  )
}

function ModalUsaha({ onSubmit }: { onSubmit: () => void }) {
  const [modal, setModal] = useState(0)
  const [tenor, setTenor] = useState(12)

  const total = modal + modal * 0.1
  const angsuran = tenor ? total / tenor : 0

  return (
    <FormWrapper title="Modal Usaha" angsuran={angsuran} onSubmit={onSubmit}>
      <Input label="Nama Usaha" />
      <Input label="Besar Modal" type="number" onChange={setModal} />
      <Input label="Tenor (bulan)" type="number" value={tenor} onChange={setTenor} />
    </FormWrapper>
  )
}

function Pelatihan({ onSubmit }: { onSubmit: () => void }) {
  const [biaya, setBiaya] = useState(0)
  const [tenor, setTenor] = useState(6)

  const total = biaya + biaya * 0.006 * tenor
  const angsuran = tenor ? total / tenor : 0

  return (
    <FormWrapper title="Biaya Pelatihan" angsuran={angsuran} onSubmit={onSubmit}>
      <Input label="Nama Pelatihan" />
      <Input label="Biaya" type="number" onChange={setBiaya} />
      <Input label="Tenor (bulan)" type="number" value={tenor} onChange={setTenor} />
    </FormWrapper>
  )
}

function Pendidikan({ onSubmit }: { onSubmit: () => void }) {
  const [biaya, setBiaya] = useState(0)
  const [tenor, setTenor] = useState(6)

  const total = biaya + biaya * 0.006 * tenor
  const angsuran = tenor ? total / tenor : 0

  return (
    <FormWrapper title="Biaya Pendidikan" angsuran={angsuran} onSubmit={onSubmit}>
      <Input label="Nama Anak" />
      <Input label="Nama Sekolah" />
      <Input label="Jumlah Pembiayaan" type="number" onChange={setBiaya} />
      <Input label="Tenor (bulan)" type="number" value={tenor} onChange={setTenor} />
    </FormWrapper>
  )
}

/* ===================== */
/* ===== COMPONENT ===== */
/* ===================== */

function FormWrapper({
  title,
  angsuran,
  onSubmit,
  children,
}: {
  title: string
  angsuran: number
  onSubmit: () => void
  children: React.ReactNode
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow">
      <h2 className="font-semibold mb-4">{title}</h2>

      <div className="space-y-3">{children}</div>

      <div className="mt-4 bg-gray-100 rounded-lg p-3">
        <p className="text-xs text-gray-500">Estimasi Angsuran / bulan</p>
        <p className="font-bold text-lg">
          Rp {Math.round(angsuran).toLocaleString("id-ID")}
        </p>
      </div>

      <button
        onClick={onSubmit}
        className="w-full mt-4 bg-[#0e2a6d] text-white py-3 rounded-lg font-bold"
      >
        Ajukan Pembiayaan
      </button>
    </div>
  )
}

function Input({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string
  type?: string
  value?: number
  onChange?: (v: number) => void
}) {
  return (
    <div>
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange && onChange(Number(e.target.value))}
        className="w-full border rounded-lg px-3 py-2 mt-1"
      />
    </div>
  )
}
