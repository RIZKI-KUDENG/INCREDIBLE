'use client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export async function generatePdf(items: any[], total: number): Promise<Blob> {
  const doc = new jsPDF();

  doc.text('Struk Pembelian - Incredible Moment', 10, 10);

  autoTable(doc, {
    startY: 20,
    head: [['Produk', 'Qty', 'Harga', 'Subtotal']],
    body: items.map((item) => [
      item.nama,
      item.jumlah,
      'Rp ' + item.harga.toLocaleString('id-ID'),
      'Rp ' + item.subtotal.toLocaleString('id-ID'),
    ]),
  });

  const finalY = (doc as any).lastAutoTable.finalY || 30;
  doc.text(`Total: Rp ${total.toLocaleString('id-ID')}`, 10, finalY + 10);

  const blob = doc.output('blob');
  return blob;
}
