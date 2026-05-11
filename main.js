// ===========================
//  SAKECE – main.js
// ===========================

const WA_NUMBER = '6281263631265';

// ----- NAVBAR SCROLL -----
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ----- HAMBURGER MENU -----
const hamburger = document.getElementById('hamburger');
const menu = document.querySelector('.menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  menu.classList.toggle('open');
});

// Tutup menu saat link diklik
document.querySelectorAll('.menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    menu.classList.remove('open');
  });
});

// ----- QTY CONTROL -----
function changeQty(inputId, delta) {
  const input = document.getElementById(inputId);
  const current = parseInt(input.value) || 1;
  const newVal = Math.max(1, Math.min(99, current + delta));
  input.value = newVal;
}

// ----- FORMAT RUPIAH -----
function formatRupiah(num) {
  return 'Rp ' + num.toLocaleString('id-ID');
}

// ----- TOAST NOTIFICATION -----
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// ----- CHECKOUT via WhatsApp -----
function checkout(namaProduk, hargaSatuan, qtyId, payId) {
  const jumlah = parseInt(document.getElementById(qtyId).value) || 1;
  const metode = document.getElementById(payId).value;
  const total = hargaSatuan * jumlah;

  // Validasi
  if (!metode) {
    showToast('⚠️ Pilih metode pembayaran dulu!');
    document.getElementById(payId).focus();
    return;
  }
  if (jumlah < 1) {
    showToast('⚠️ Jumlah minimal 1!');
    return;
  }

  // Buat pesan WhatsApp
  const pesan = `Halo SAKECE! 👋\n\nSaya ingin memesan:\n\n` +
    `🛒 *Produk:* ${namaProduk}\n` +
    `🔢 *Jumlah:* ${jumlah} pcs\n` +
    `💰 *Harga Satuan:* ${formatRupiah(hargaSatuan)}\n` +
    `🧾 *Total:* ${formatRupiah(total)}\n` +
    `💳 *Pembayaran:* ${metode}\n\n` +
    `Mohon konfirmasi pesanan saya. Terima kasih! 🙏`;

  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`;

  showToast('✅ Mengalihkan ke WhatsApp...');
  setTimeout(() => window.open(url, '_blank'), 600);
}

// ----- SMOOTH REVEAL on SCROLL -----
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .tentang-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});
