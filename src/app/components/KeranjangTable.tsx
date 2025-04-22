type Props = {
    keranjang: {
      id: string;
      nama: string;
      jumlah: number;
      harga: number;
      subtotal: number;
    }[];
    onHapus: (id: string) => void;
  };
  
  export default function KeranjangTable({ keranjang, onHapus }: Props) {
    return (
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Produk</th>
            <th>Jumlah</th>
            <th>Harga</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {keranjang.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">{item.nama}</td>
              <td>{item.jumlah}</td>
              <td>Rp {item.harga.toLocaleString('id-ID')}</td>
              <td>Rp {item.subtotal.toLocaleString('id-ID')}</td>
              <td>
                <button onClick={() => onHapus(item.id)} className="text-red-600">
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  