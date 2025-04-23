'use client';

import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import AuthGuard from '../components/AuthGuard';

export default function ProdukPage() {
  const [produk, setProduk] = useState<{ id: string; [key: string]: any }[]>([]);
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [kategori, setKategori] = useState('buket');

  const fetchProduk = async () => {
    const querySnapshot = await getDocs(collection(db, 'produk'));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProduk(data);
  };

  const tambahProduk = async () => {
    if (!nama || !harga) return;
    await addDoc(collection(db, 'produk'), {
      nama,
      harga: parseInt(harga),
      kategori,
    });
    setNama('');
    setHarga('');
    setKategori('buket');
    fetchProduk();
  };

  const hapusProduk = async (id: string) => {
    await deleteDoc(doc(db, 'produk', id));
    fetchProduk();
  };

  useEffect(() => {
    fetchProduk();
  }, []);

  return (
    <AuthGuard>
      <div className="container mx-auto p-6 ">
        <h1 className="text-3xl font-semibold mb-6">Manajemen Produk</h1>
        
        <div className="mb-6 space-y-4">
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Nama produk"
            value={nama}
            onChange={(e) => setNama(e.target.value)}
          />
          
          <input
            type="number"
            className="w-full p-3 border border-gray-300 rounded-md"
            placeholder="Harga (Rp)"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
          />
          
          <select
            className="w-full p-3 border border-gray-300 rounded-md"
            value={kategori}
            onChange={(e) => setKategori(e.target.value)}
          >
            <option value="buket">Buket</option>
            <option value="bloom box">Bloom Box</option>
            <option value="vase">Vase</option>
            <option value="standing board">Standing Board</option>
            <option value="standing flowers">Standing Flowers</option>
            <option value="hampers">Hampers</option>
          </select>

          <button
            onClick={tambahProduk}
            className="w-full bg-teal-500 text-white py-3 rounded-md hover:bg-teal-600 transition"
          >
            Tambah Produk
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4 text-left text-sm font-medium">Nama</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Kategori</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Harga</th>
                <th className="py-3 px-4 text-left text-sm font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {produk.map((p: any) => (
                <tr key={p.id} className="border-b">
                  <td className="py-3 px-4 text-sm ">{p.nama}</td>
                  <td className="py-3 px-4 text-sm ">{p.kategori}</td>
                  <td className="py-3 px-4 text-sm ">Rp {p.harga.toLocaleString('id-ID')}</td>
                  <td className="py-3 px-4 text-sm">
                    <button
                      onClick={() => hapusProduk(p.id)}
                      className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
}
