// ===========================
//  SAKECE – main.js (redesign)
// ===========================

const WA_NUMBER = '6285774986264';

const PRICES = {
  'Sambal Kecepe Level 1': 18000,
  'Sambal Kecepe Level 2': 20000,
};

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

// ----- CUSTOM CURSOR -----
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursorRing');
  if (!cursor || !cursorRing) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    setTimeout(() => {
      cursorRing.style.left = e.clientX + 'px';
      cursorRing.style.top  = e.clientY + 'px';
    }, 80);
  });

  document.querySelectorAll('a, button, select, input').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(2)';
      cursor.style.background = 'var(--orange)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'translate(-50%, -50%) scale(1)';
      cursor.style.background = 'var(--red)';
    });
  });
})();

// ----- NAVBAR SCROLL -----
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ----- HAMBURGER MENU -----
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const menu = document.querySelector('.menu');
  if (!hamburger || !menu) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    menu.classList.toggle('open');
  });

  document.querySelectorAll('.menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      menu.classList.remove('open');
    });
  });
})();

// ----- QTY CONTROL -----
(function initQty() {
  const qtyInput = document.getElementById('qtyInput');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus  = document.getElementById('qtyPlus');
  if (!qtyInput) return;

  qtyMinus.addEventListener('click', () => {
    const v = parseInt(qtyInput.value) || 1;
    if (v > 1) { qtyInput.value = v - 1; updateTotal(); }
  });

  qtyPlus.addEventListener('click', () => {
    const v = parseInt(qtyInput.value) || 1;
    if (v < 99) { qtyInput.value = v + 1; updateTotal(); }
  });

  qtyInput.addEventListener('input', updateTotal);
})();

// ----- TOTAL PRICE -----
function updateTotal() {
  const produkSelect = document.getElementById('produkSelect');
  const qtyInput     = document.getElementById('qtyInput');
  const totalEl      = document.getElementById('totalPrice');
  if (!produkSelect || !totalEl) return;

  const produk = produkSelect.value;
  const qty    = parseInt(qtyInput.value) || 1;
  const price  = PRICES[produk] || 0;
  totalEl.textContent = formatRupiah(price * qty);
}

(function initSelect() {
  const produkSelect = document.getElementById('produkSelect');
  if (!produkSelect) return;
  produkSelect.addEventListener('change', updateTotal);

  // Pre-select via URL param
  const urlParams = new URLSearchParams(window.location.search);
  const param = urlParams.get('produk');
  if (param && PRICES[param]) {
    produkSelect.value = param;
    updateTotal();
  }
})();

// ----- CHECKOUT via WhatsApp -----
(function initCheckout() {
  const btn = document.getElementById('btnWa');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const produk  = document.getElementById('produkSelect').value;
    const jumlah  = parseInt(document.getElementById('qtyInput').value) || 1;
    const metode  = document.getElementById('payMethod').value;
    const nama    = (document.getElementById('namaInput').value || '').trim();

    if (!produk) {
      showToast('⚠️ Pilih produk dulu ya!');
      document.getElementById('produkSelect').focus();
      return;
    }
    if (!metode) {
      showToast('⚠️ Pilih metode pembayaran dulu!');
      document.getElementById('payMethod').focus();
      return;
    }

    const harga = PRICES[produk];
    const total = harga * jumlah;

    const pesan =
      `Halo SAKECE! 🌶️\n\n` +
      `Saya ingin memesan:\n\n` +
      `*Produk:* ${produk}\n` +
      `*Jumlah:* ${jumlah} pcs\n` +
      `*Harga Satuan:* ${formatRupiah(harga)}\n` +
      `*Total:* ${formatRupiah(total)}\n` +
      `*Pembayaran:* ${metode}\n` +
      (nama ? `*Nama:* ${nama}\n` : '') +
      `\nMohon konfirmasi pesanan saya. Terima kasih! 🙏`;

    const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`;

    showToast('✅ Mengalihkan ke WhatsApp...');
    setTimeout(() => window.open(url, '_blank'), 600);
  });
})();

// ----- SCROLL REVEAL -----
(function initReveal() {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
})();
