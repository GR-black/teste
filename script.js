// ===== STICKY CTA =====
const stickyCta = document.getElementById('stickyCta');
window.addEventListener('scroll', function() {
  stickyCta.classList.toggle('visible', window.scrollY > 500);
});

// ===== TOAST NOTIFICATION =====
const toasts = [
  { name: 'Valeria F.',   city: 'Guadalajara, Jal.', time: '3 minutos' },
  { name: 'María G.',     city: 'CDMX',              time: '7 minutos' },
  { name: 'Luis R.',      city: 'Monterrey, N.L.',   time: '12 minutos' },
  { name: 'Patricia M.',  city: 'Puebla, Pue.',      time: '2 minutos' },
  { name: 'Ana L.',       city: 'Tijuana, B.C.',     time: '5 minutos' },
  { name: 'Carlos E.',    city: 'León, Gto.',        time: '1 minuto'  },
  { name: 'Rosa M.',      city: 'Mérida, Yuc.',      time: '8 minutos' },
];

const toastEl = document.getElementById('toast');
let toastIndex = 0;
let toastTimer = null;

function buildToast(t) {
  toastEl.innerHTML = `
    <div class="toast-icon-box">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="6" fill="#15803D"/>
        <path d="M5 13l4 4L19 7" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    <div class="toast-body">
      <strong>${t.name} acaba de garantir o Pack Completo</strong>
      <span>há ${t.time} · ${t.city}</span>
    </div>
    <button class="toast-close" onclick="hideToast()" aria-label="Fechar">×</button>
  `;
}

function showToast(t) {
  buildToast(t);
  toastEl.classList.remove('toast-hide');
  toastEl.classList.add('toast-show');

  // Auto-hide after 5s
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 5000);
}

function hideToast() {
  toastEl.classList.remove('toast-show');
  toastEl.classList.add('toast-hide');
}

// Initial show after 2s, then rotate every 9s
setTimeout(function() {
  showToast(toasts[toastIndex]);
  setInterval(function() {
    toastIndex = (toastIndex + 1) % toasts.length;
    hideToast();
    setTimeout(function() { showToast(toasts[toastIndex]); }, 700);
  }, 15727);
}, 3000);

// ===== TOP BAR DATE =====
(function() {
  const el = document.getElementById('today-date');
  if (!el) return;
  const d = new Date();
  el.textContent =
    String(d.getDate()).padStart(2,'0') + '/' +
    String(d.getMonth()+1).padStart(2,'0') + '/' +
    d.getFullYear();
})();

// ===== FAQ TOGGLE (both styles) =====
// Style 1: .faq-q / .faq-a (objections + final FAQ)
document.querySelectorAll('.faq-q').forEach(function(q) {
  const a = q.nextElementSibling;
  if (a && a.classList.contains('faq-a')) {
    a.style.display = 'none';
    q.addEventListener('click', function() {
      const isOpen = a.style.display === 'block';
      document.querySelectorAll('.faq-a').forEach(function(el) { el.style.display = 'none'; });
      document.querySelectorAll('.faq-q').forEach(function(el) { el.classList.remove('open'); });
      if (!isOpen) {
        a.style.display = 'block';
        q.classList.add('open');
      }
    });
  }
});