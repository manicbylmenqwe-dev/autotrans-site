const burger = document.getElementById('headerBurger');
const mobileMenu = document.getElementById('mobileMenu');

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (
      mobileMenu.classList.contains('is-open') &&
      !mobileMenu.contains(e.target) &&
      !burger.contains(e.target)
    ) {
      mobileMenu.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

const header = document.getElementById('header');
if (header) {
  const onScroll = () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(0,0,0,0.3)'
      : 'none';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

const swapBtn = document.getElementById('swapCities');
const cityFrom = document.getElementById('cityFrom');
const cityTo = document.getElementById('cityTo');

if (swapBtn && cityFrom && cityTo) {
  swapBtn.addEventListener('click', () => {
    const tmpVal = cityFrom.value;
    cityFrom.value = cityTo.value;
    cityTo.value = tmpVal;
  });
}

const calcForm = document.getElementById('calcForm');

if (calcForm && cityFrom && cityTo) {
  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const from = cityFrom.value;
    const to = cityTo.value;

    if (!from) {
      cityFrom.focus();
      cityFrom.style.outline = '2px solid #D42929';
      setTimeout(() => cityFrom.style.outline = '', 2000);
      return;
    }
    if (!to) {
      cityTo.focus();
      cityTo.style.outline = '2px solid #D42929';
      setTimeout(() => cityTo.style.outline = '', 2000);
      return;
    }
    if (from === to) {
      alert('Пожалуйста, выберите разные города для отправки и получения груза');
      return;
    }
    window.location.href = `calculator.html?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

function observeReveal() {
  document.querySelectorAll('.reveal, .reveal-left').forEach(el => {
    revealObserver.observe(el);
  });
}

observeReveal();
window.addEventListener('load', observeReveal);

const modal = document.getElementById('requestModal');
const openBtn = document.getElementById('openModal');
const closeBtn = document.getElementById('closeModal');
const formWrap = document.getElementById('modalFormWrap');
const successMsg = document.getElementById('modalSuccess');
const form = document.getElementById('requestForm');

function openModal() {
  if (!modal) return;
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  if (formWrap) formWrap.style.display = '';
  if (successMsg) successMsg.classList.remove('is-visible');
  if (form) form.reset();
  const phoneEl = document.getElementById('req-phone');
  if (phoneEl) phoneEl.classList.remove('error');
}

function closeModal() {
  if (!modal) return;
  modal.classList.remove('is-open');
  document.body.style.overflow = '';
}

if (openBtn) openBtn.addEventListener('click', openModal);
if (closeBtn) closeBtn.addEventListener('click', closeModal);
if (modal) {
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal && modal.classList.contains('is-open')) closeModal();
});

const openModalCta = document.getElementById('openModalCta');
if (openModalCta) openModalCta.addEventListener('click', openModal);

const phoneInput = document.getElementById('req-phone');
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '');
    if (v.startsWith('8')) v = '7' + v.slice(1);
    if (v.startsWith('7')) {
      let m = v.match(/^(\d{0,1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
      if (m) {
        let res = '+7';
        if (m[2]) res += ' (' + m[2];
        if (m[2].length === 3) res += ') ';
        if (m[3]) res += m[3];
        if (m[3].length === 3) res += '-';
        if (m[4]) res += m[4];
        if (m[4].length === 2) res += '-';
        if (m[5]) res += m[5];
        e.target.value = res;
      }
    }
  });
}

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const phone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '';
    if (phone.length < 11) {
      if (phoneInput) {
        phoneInput.classList.add('error');
        phoneInput.focus();
        setTimeout(() => phoneInput.classList.remove('error'), 2500);
      }
      return;
    }
    if (formWrap) formWrap.style.display = 'none';
    if (successMsg) successMsg.classList.add('is-visible');
    setTimeout(() => closeModal(), 3000);
  });
}

(function () {
  const slider = document.getElementById('reviewsSlider');
  const track = document.getElementById('reviewsTrack');
  if (!slider || !track) return;

  const cards = Array.from(track.querySelectorAll('.review-card'));
  const prevBtn = document.getElementById('reviewsPrev');
  const nextBtn = document.getElementById('reviewsNext');
  const dots = Array.from(document.querySelectorAll('.reviews__dot'));
  const total = cards.length;
  let current = 0, cardW = 0, gap = 20, visible = 4;
  let autoTimer = null, isDragging = false, dragStartX = 0, dragDeltaX = 0;

  cards.forEach(c => track.appendChild(c.cloneNode(true)));

  function getVisible() {
    const w = window.innerWidth;
    return w < 540 ? 1 : w < 840 ? 2 : w < 1100 ? 3 : 4;
  }

  function calcLayout() {
    visible = getVisible();
    gap = window.innerWidth < 540 ? 12 : 20;
    const containerW = slider.offsetWidth;
    cardW = (containerW - gap * (visible - 1)) / visible;
    track.querySelectorAll('.review-card').forEach(c => {
      c.style.minWidth = cardW + 'px';
      c.style.maxWidth = cardW + 'px';
    });
    track.style.gap = gap + 'px';
    goTo(current, false);
  }

  function goTo(idx, animate = true) {
    current = idx;
    track.style.transition = animate ? 'transform 0.55s cubic-bezier(0.16,1,0.3,1)' : 'none';
    track.style.transform = 'translateX(-' + (current * (cardW + gap)) + 'px)';
    dots.forEach((d, i) => d.classList.toggle('is-active', i === (current % total)));
  }

  function next() {
    const nextIdx = current + 1;
    goTo(nextIdx);
    if (nextIdx >= total) setTimeout(() => goTo(0, false), 560);
  }

  function prev() {
    if (current <= 0) {
      goTo(total, false);
      setTimeout(() => goTo(total - 1), 20);
    } else {
      goTo(current - 1);
    }
  }

  function startAuto() { stopAuto(); autoTimer = setInterval(next, 4000); }
  function stopAuto() { clearInterval(autoTimer); }

  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); startAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); startAuto(); });
  dots.forEach((d, i) => {
    d.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
  });

  slider.addEventListener('mouseenter', stopAuto);
  slider.addEventListener('mouseleave', startAuto);

  function onDragStart(x) { isDragging = true; dragStartX = x; dragDeltaX = 0; track.style.transition = 'none'; }
  function onDragMove(x) { if (!isDragging) return; dragDeltaX = x - dragStartX; track.style.transform = 'translateX(-' + (current * (cardW + gap) - dragDeltaX) + 'px)'; }
  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    if (dragDeltaX < -50) next();
    else if (dragDeltaX > 50) prev();
    else goTo(current);
    startAuto();
  }

  track.addEventListener('mousedown', e => { stopAuto(); onDragStart(e.clientX); });
  window.addEventListener('mousemove', e => onDragMove(e.clientX));
  window.addEventListener('mouseup', () => onDragEnd());
  track.addEventListener('touchstart', e => { stopAuto(); onDragStart(e.touches[0].clientX); }, { passive: true });
  track.addEventListener('touchmove', e => onDragMove(e.touches[0].clientX), { passive: true });
  track.addEventListener('touchend', () => onDragEnd());
  track.addEventListener('dragstart', e => e.preventDefault());

  calcLayout();
  window.addEventListener('resize', calcLayout);
  startAuto();
})();

const leaveBtn = document.getElementById('leaveReviewBtn');
const leaveDrop = document.getElementById('leaveReviewDropdown');
if (leaveBtn && leaveDrop) {
  leaveBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    leaveDrop.classList.toggle('is-open');
  });
  document.addEventListener('click', (e) => {
    if (!leaveDrop.contains(e.target) && !leaveBtn.contains(e.target)) {
      leaveDrop.classList.remove('is-open');
    }
  });
}

document.querySelectorAll('.faq__question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq__item');
    const isOpen = item.classList.contains('is-open');
    document.querySelectorAll('.faq__item.is-open').forEach(el => {
      el.classList.remove('is-open');
      el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

(function () {
  if (!document.getElementById('calcPageForm')) return;

  const CITIES = [
    { name: 'Тольятти', km: 0 },
    { name: 'Самара', km: 90 },
    { name: 'Сызрань', km: 130 },
    { name: 'Новокуйбышевск', km: 60 },
    { name: 'Чапаевск', km: 80 },
    { name: 'Жигулёвск', km: 45 },
    { name: 'Отрадный', km: 100 },
    { name: 'Кинель', km: 100 },
    { name: 'Похвистнево', km: 180 },
    { name: 'Нефтегорск', km: 170 },
    { name: 'Октябрьск', km: 160 },
    { name: 'Кинель-Черкассы', km: 130 },
    { name: 'Безенчук', km: 100 },
    { name: 'Богатое', km: 120 },
    { name: 'Борское', km: 150 },
    { name: 'Большая Глушица', km: 180 },
    { name: 'Исаклы', km: 190 },
    { name: 'Ульяновск', km: 135 },
    { name: 'Димитровград', km: 100 },
    { name: 'Инза', km: 180 },
    { name: 'Барыш', km: 200 },
    { name: 'Сенгилей', km: 120 },
    { name: 'Саратов', km: 340 },
    { name: 'Энгельс', km: 345 },
    { name: 'Балаково', km: 280 },
    { name: 'Вольск', km: 260 },
    { name: 'Пугачёв', km: 280 },
    { name: 'Маркс', km: 350 },
    { name: 'Оренбург', km: 480 },
    { name: 'Орск', km: 650 },
    { name: 'Новотроицк', km: 660 },
    { name: 'Бузулук', km: 260 },
    { name: 'Бугуруслан', km: 230 },
    { name: 'Казань', km: 370 },
    { name: 'Набережные Челны', km: 300 },
    { name: 'Альметьевск', km: 250 },
    { name: 'Нижнекамск', km: 320 },
    { name: 'Чистополь', km: 280 },
    { name: 'Бугульма', km: 230 },
    { name: 'Елабуга', km: 330 },
    { name: 'Лениногорск', km: 260 },
    { name: 'Уфа', km: 520 },
    { name: 'Стерлитамак', km: 560 },
    { name: 'Салават', km: 580 },
    { name: 'Нефтекамск', km: 400 },
    { name: 'Октябрьский', km: 300 },
    { name: 'Белебей', km: 350 },
    { name: 'Пенза', km: 360 },
    { name: 'Кузнецк', km: 330 },
    { name: 'Заречный', km: 370 },
    { name: 'Нижний Ломов', km: 400 },
    { name: 'Саранск', km: 400 },
    { name: 'Рузаевка', km: 420 },
    { name: 'Ковылкино', km: 450 },
  ];

  function norm(value) {
    return String(value || '').trim().toLowerCase().replace(/ё/g, 'е');
  }

  function getCityKm(name) {
    const key = norm(name);
    const found = CITIES.find(c => norm(c.name) === key);
    return found ? found.km : 400;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const fromInput = document.getElementById('calcFrom');
  const toInput = document.getElementById('calcTo');
  if (urlParams.get('from')) fromInput.value = urlParams.get('from');
  if (urlParams.get('to')) toInput.value = urlParams.get('to');

  function initAC(input, dropdown) {
    input.addEventListener('input', () => {
      const val = norm(input.value);
      dropdown.innerHTML = '';
      if (!val) { dropdown.classList.remove('is-open'); return; }
      const matches = CITIES.filter(c => norm(c.name).includes(val));
      if (!matches.length) { dropdown.classList.remove('is-open'); return; }
      matches.forEach(city => {
        const li = document.createElement('li');
        const idx = norm(city.name).indexOf(val);
        li.innerHTML = city.name.slice(0, idx)
          + '<mark>' + city.name.slice(idx, idx + val.length) + '</mark>'
          + city.name.slice(idx + val.length);
        li.addEventListener('mousedown', e => {
          e.preventDefault();
          input.value = city.name;
          dropdown.classList.remove('is-open');
        });
        dropdown.appendChild(li);
      });
      dropdown.classList.add('is-open');
    });
    input.addEventListener('blur', () => setTimeout(() => dropdown.classList.remove('is-open'), 160));
  }

  initAC(fromInput, document.getElementById('fromDropdown'));
  initAC(toInput, document.getElementById('toDropdown'));

  document.getElementById('calcSwap').addEventListener('click', () => {
    const tmp = fromInput.value;
    fromInput.value = toInput.value;
    toInput.value = tmp;
  });

  const dateInput = document.getElementById('calcDateInput');
  const dp = document.getElementById('datepicker');
  const dpMonthYear = document.getElementById('dpMonthYear');
  const dpDays = document.getElementById('dpDays');
  const MONTHS = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
  let dpView = new Date(), dpSelected = null;

  function renderDP() {
    const y = dpView.getFullYear(), m = dpView.getMonth();
    const today = new Date(); today.setHours(0,0,0,0);
    dpMonthYear.textContent = MONTHS[m] + ' ' + y;
    dpDays.innerHTML = '';
    let firstDow = new Date(y, m, 1).getDay();
    firstDow = firstDow === 0 ? 6 : firstDow - 1;
    const dim = new Date(y, m + 1, 0).getDate();
    for (let i = 0; i < firstDow; i++) {
      const e = document.createElement('button');
      e.type = 'button'; e.className = 'dp__day is-empty'; e.disabled = true;
      dpDays.appendChild(e);
    }
    for (let d = 1; d <= dim; d++) {
      const btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'dp__day'; btn.textContent = d;
      const date = new Date(y, m, d); date.setHours(0,0,0,0);
      if (date < today) { btn.classList.add('is-past'); btn.disabled = true; }
      if (date.getTime() === today.getTime()) btn.classList.add('is-today');
      if (dpSelected && date.getTime() === dpSelected.getTime()) btn.classList.add('is-selected');
      btn.addEventListener('click', () => {
        dpSelected = date;
        dateInput.value = String(d).padStart(2,'0') + '.' + String(m+1).padStart(2,'0') + '.' + y;
        dp.classList.remove('is-open');
        renderDP();
      });
      dpDays.appendChild(btn);
    }
  }

  dateInput.addEventListener('click', e => { e.stopPropagation(); dp.classList.toggle('is-open'); renderDP(); });
  document.getElementById('dpPrev').addEventListener('click', () => { dpView.setMonth(dpView.getMonth()-1); renderDP(); });
  document.getElementById('dpNext').addEventListener('click', () => { dpView.setMonth(dpView.getMonth()+1); renderDP(); });
  document.addEventListener('click', e => {
    if (!document.getElementById('datepickerWrap').contains(e.target)) dp.classList.remove('is-open');
  });
  renderDP();

  const toggleBtns = document.querySelectorAll('.calc-toggle__btn');
  const clientTypeInput = document.getElementById('calcClientType');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      clientTypeInput.value = btn.dataset.value;
      liveRecalc();
    });
  });

  function calcPrice() {
    const kmFrom = getCityKm(fromInput.value);
    const kmTo = getCityKm(toInput.value);
    const distance = Math.abs(kmFrom - kmTo) || 300;
    const weight = parseFloat(document.getElementById('calcWeight').value) || 0;
    const L = parseFloat(document.getElementById('calcLength').value) || 0;
    const W = parseFloat(document.getElementById('calcWidth').value) || 0;
    const H = parseFloat(document.getElementById('calcHeight').value) || 0;
    const volumeM3 = parseFloat(document.getElementById('calcVolume').value) || 0;
    const cargoVal = parseFloat(document.getElementById('calcCargoValue').value) || 0;
    const isLegal = clientTypeInput.value === 'legal';
    const express = document.getElementById('checkExpress').checked;
    const door = document.getElementById('checkDoor').checked;
    const insure = document.getElementById('checkInsure').checked;
    const volWeight = Math.max((L * W * H) / 5000, volumeM3 * 200);
    const effWeight = Math.max(weight, volWeight, 1);
    let base = distance * 45 + effWeight * 120;
    if (express) base *= 1.30;
    if (door) base *= 1.15;
    if (insure && cargoVal > 0) base += cargoVal * 0.05;
    if (isLegal) base *= 1.20;
    return Math.round(base / 100) * 100;
  }

  function liveRecalc() {
    if (document.getElementById('calcResult').classList.contains('is-visible')) {
      document.getElementById('calcResultPrice').textContent = calcPrice().toLocaleString('ru-RU') + ' ₽';
    }
  }

  document.getElementById('calcPageForm').addEventListener('submit', e => {
    e.preventDefault();
    const fromName = fromInput.value.trim();
    const toName = toInput.value.trim();
    if (!fromName || !toName) {
      alert('Укажите город отправления и город доставки');
      (!fromName ? fromInput : toInput).focus();
      return;
    }
    if (norm(fromName) === norm(toName)) {
      alert('Города отправления и доставки должны различаться');
      toInput.focus();
      return;
    }
    document.getElementById('calcResultPrice').textContent = calcPrice().toLocaleString('ru-RU') + ' ₽';
    const res = document.getElementById('calcResult');
    res.classList.add('is-visible');
    res.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  function syncVolume() {
    const L = parseFloat(document.getElementById('calcLength').value) || 0;
    const W = parseFloat(document.getElementById('calcWidth').value) || 0;
    const H = parseFloat(document.getElementById('calcHeight').value) || 0;
    if (L > 0 && W > 0 && H > 0) {
      document.getElementById('calcVolume').value = ((L * W * H) / 1000000).toFixed(2);
    }
    liveRecalc();
  }

  ['calcLength','calcWidth','calcHeight'].forEach(id => {
    document.getElementById(id).addEventListener('input', syncVolume);
  });
  ['calcWeight','calcVolume','calcCargoValue'].forEach(id => {
    document.getElementById(id).addEventListener('input', liveRecalc);
  });
  ['checkExpress','checkDoor','checkInsure'].forEach(id => {
    document.getElementById(id).addEventListener('change', liveRecalc);
  });
  fromInput.addEventListener('input', liveRecalc);
  toInput.addEventListener('input', liveRecalc);
})();
