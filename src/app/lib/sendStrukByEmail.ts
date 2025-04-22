// lib/sendStrukByEmail.ts

import emailjs from '@emailjs/browser';

export async function sendStrukByEmail(
  keranjang: {
    nama: string;
    jumlah: number;
    subtotal: number;
  }[],
  total: number,
  emailPelanggan: string
) {
  const itemList = keranjang
    .map(
      (item) =>
        `${item.nama} x${item.jumlah} = Rp ${item.subtotal.toLocaleString('id-ID')}`
    )
    .join('\n');

  const templateParams = {
    email_to: emailPelanggan,
    pesan: `Berikut adalah detail pembelian Anda:\n\n${itemList}\n\nTotal: Rp ${total.toLocaleString(
      'id-ID'
    )}`,
  };

  return emailjs.send(
    'service_hn5z7vn',     // ← Ganti dengan Service ID EmailJS kamu
    'template_a3uf23l',    // ← Ganti dengan Template ID EmailJS kamu
    templateParams,
    '01J2_DSw5_AktBUwd'      // ← Ganti dengan Public Key EmailJS kamu
  );
}
