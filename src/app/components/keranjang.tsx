'use client';

interface Item {
  id: string;
  nama: string;
  jumlah: number;
  subtotal: number;
  onHapus: () => void;
}

export default function KeranjangItem({ nama, jumlah, subtotal, onHapus }: Item) {
  return (
    <li className="flex justify-between items-center border-b py-1">
      <div>
        {nama} x{jumlah}
        <div className="text-sm text-gray-500">Rp {subtotal.toLocaleString('id-ID')}</div>
      </div>
      <button
        onClick={onHapus}
        className="text-red-500 text-sm hover:underline"
      >
        Hapus
      </button>
    </li>
  );
}
