import React from "react";

interface Props {
    id: string;
    nama: string;
    harga: number;
    onClick: () => void;
  }
  
  export default function TransaksiCard({ nama, harga, onClick }: Props) {
    return (
      <button
        onClick={onClick}
        className="bg-white text-black rounded-lg p-3 shadow hover:scale-105 transition"
      >
        <div className="font-semibold">{nama}</div>
        <div className="text-sm text-gray-600">Rp {harga.toLocaleString('id-ID')}</div>
      </button>
    );
  }
  