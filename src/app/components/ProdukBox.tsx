type Props = {
    produk: {
      id: string;
      nama: string;
      harga: number;
    };
    onClick: () => void;
  };
  
  export default function ProdukBox({ produk, onClick }: Props) {
    return (
      <div
        onClick={onClick}
        className="cursor-pointer border p-4 rounded shadow hover:bg-gray-100"
      >
        <div className="font-bold">{produk.nama}</div>
        <div className="text-sm text-gray-600">Rp {produk.harga.toLocaleString('id-ID')}</div>
      </div>
    );
  }
  