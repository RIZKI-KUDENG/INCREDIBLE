"use client";

import { useEffect, useState } from "react";
import { sendStrukByEmail } from "../lib/sendStrukByEmail";
import { db } from "../lib/firebase";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import TransaksiCard from "../components/TransaksiCard";
import KeranjangItem from "../components/keranjang";
import AuthGuard from "../components/AuthGuard";

interface Produk {
  id: string;
  nama: string;
  harga: number;
}

export default function TransaksiPage() {
  const [produkList, setProdukList] = useState<Produk[]>([]);
  const [keranjang, setKeranjang] = useState<any[]>([]);
  const [emailPelanggan, setEmailPelanggan] = useState("");

  const totalHarga = keranjang.reduce(
    (total, item) => total + item.harga * item.jumlah,
    0
  );

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const snapshot = await getDocs(collection(db, "produk"));
        const data = snapshot.docs.map((doc) => {
          const docData = doc.data();
          return {
            id: doc.id,
            nama: docData.nama ?? "Tanpa Nama",
            harga: docData.harga ?? 0,
          };
        });
        setProdukList(data);
      } catch (err) {
        console.error("Gagal ambil produk:", err);
      }
    };
    fetchProduk();
  }, []);

  const tambahKeKeranjang = (produk: Produk) => {
    setKeranjang((prev) => {
      const existing = prev.find((item: any) => item.id === produk.id);
      if (existing) {
        return prev.map((item: any) =>
          item.id === produk.id
            ? {
                ...item,
                jumlah: item.jumlah + 1,
                subtotal: (item.jumlah + 1) * item.harga,
              }
            : item
        );
      } else {
        return [
          ...prev,
          {
            id: produk.id,
            nama: produk.nama,
            harga: produk.harga,
            jumlah: 1,
            subtotal: produk.harga,
          },
        ];
      }
    });
  };

  const handleCheckout = async () => {
    // Hapus validasi email
    try {
      // Kirim struk ke email jika email ada
      if (emailPelanggan) {
        await sendStrukByEmail(keranjang, totalHarga, emailPelanggan);
      }
  
      // Simpan transaksi ke Firestore
      await addDoc(collection(db, 'transaksi'), {
        waktu: Timestamp.now(),
        items: keranjang,
        total: totalHarga,
      });
  
      // Tampilkan alert transaksi berhasil
      alert("Transaksi berhasil!");
      setKeranjang([]);  // Kosongkan keranjang
      setEmailPelanggan("");  // Kosongkan input email
  
    } catch (error) {
      console.error("Gagal mengirim email:", error);
      alert("Gagal mengirim transaksi!");
    }
  };
  
  const hapusDariKeranjang = (id: string) => {
    setKeranjang((prev) => prev.filter((item) => item.id !== id));
  };
  

  return (
    <AuthGuard>


    
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Transaksi</h1>

      <input
        type="email"
        placeholder="Email pelanggan"
        value={emailPelanggan}
        onChange={(e) => setEmailPelanggan(e.target.value)}
        className="border px-2 py-1 mb-4 w-full rounded"
      />

      <div className="grid grid-cols-2 gap-4 mb-6">
        {produkList.map((produk) => (
          <TransaksiCard
            key={produk.id}
            id={produk.id}
            nama={produk.nama}
            harga={produk.harga}
            onClick={() => tambahKeKeranjang(produk)}
          />
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-2">Keranjang</h2>
      <ul className="mb-4">
        {keranjang.map((item) => (
          <KeranjangItem
            key={item.id}
            id={item.id}
            nama={item.nama}
            jumlah={item.jumlah}
            subtotal={item.subtotal}
            onHapus={() => hapusDariKeranjang(item.id)}
          />
        ))}
      </ul>

      <div className="font-bold mb-2">
        Total: Rp {totalHarga.toLocaleString("id-ID")}
      </div>

      <button
        onClick={handleCheckout}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Kirim Struk via Email
      </button>
    </div>
    </AuthGuard>
  );
}
