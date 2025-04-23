import emailjs from '@emailjs/browser';

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const PUBLIC_KEY  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

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
    SERVICE_ID,
    TEMPLATE_ID,
    templateParams,
    PUBLIC_KEY
  );
}
