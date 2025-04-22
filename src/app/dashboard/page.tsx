'use client';

import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import dayjs from 'dayjs';
import AuthGuard from '../components/AuthGuard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const [totalTransaksi, setTotalTransaksi] = useState(0);
  const [totalPendapatan, setTotalPendapatan] = useState(0);
  const [totalItemTerjual, setTotalItemTerjual] = useState(0);
  const [terakhirTransaksi, setTerakhirTransaksi] = useState<string | null>(null);
  const [filter, setFilter] = useState<'minggu' | 'bulan'>('minggu');
  const [dataGrafik, setDataGrafik] = useState<{ tanggal: string; total: number }[]>([]);

  useEffect(() => {
    const fetchStatistik = async () => {
      const querySnapshot = await getDocs(collection(db, 'transaksi'));
      const transaksiList = querySnapshot.docs.map((doc) => doc.data());

      setTotalTransaksi(transaksiList.length);

      const totalUang = transaksiList.reduce((sum, trx: any) => sum + trx.total, 0);
      setTotalPendapatan(totalUang);

      const totalBarang = transaksiList.reduce(
        (sum, trx: any) =>
          sum + trx.items.reduce((itemSum: number, item: any) => itemSum + item.jumlah, 0),
        0
      );
      setTotalItemTerjual(totalBarang);

      const waktuTerakhir = transaksiList
        .map((trx: any) => trx.waktu?.seconds)
        .filter(Boolean)
        .sort((a, b) => b - a)[0];

      if (waktuTerakhir) {
        const date = new Date(waktuTerakhir * 1000);
        setTerakhirTransaksi(date.toLocaleString('id-ID'));
      }

      const now = dayjs();
      const data: { [key: string]: number } = {};

      for (const trx of transaksiList) {
        if (!trx.waktu?.seconds) continue;

        const date = dayjs(trx.waktu.seconds * 1000);
        const isInFilter =
          filter === 'minggu' ? now.diff(date, 'day') <= 6 : now.diff(date, 'month') === 0;

        if (isInFilter) {
          const key = filter === 'minggu' ? date.format('ddd') : date.format('D MMM');
          data[key] = (data[key] || 0) + trx.total;
        }
      }

      const sortedKeys = Object.keys(data).sort((a, b) => {
        const da = dayjs(a, filter === 'minggu' ? 'ddd' : 'D MMM');
        const db = dayjs(b, filter === 'minggu' ? 'ddd' : 'D MMM');
        return da.unix() - db.unix();
      });

      setDataGrafik(sortedKeys.map((key) => ({ tanggal: key, total: data[key] })));
    };

    fetchStatistik();
  }, [filter]);

  const chartData = {
    labels: dataGrafik.map((d) => d.tanggal),
    datasets: [
      {
        label: 'Pendapatan',
        data: dataGrafik.map((d) => d.total),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
      },
    ],
  };

  return (

    <AuthGuard>

    
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Transaksi</p>
          <p className="text-2xl font-bold">{totalTransaksi}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Pendapatan</p>
          <p className="text-2xl font-bold">Rp {totalPendapatan.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-500">Total Item Terjual</p>
          <p className="text-2xl font-bold">{totalItemTerjual}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="text-sm text-gray-500">Transaksi Terakhir</p>
          <p className="text-base">{terakhirTransaksi || '-'}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="mr-4 font-medium">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as 'minggu' | 'bulan')}
          className="border px-2 py-1 rounded-md"
        >
          <option value="minggu">Minggu Ini</option>
          <option value="bulan">Bulan Ini</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <Line data={chartData} />
      </div>
    </div>
    </AuthGuard>
  );
}
