/* =========================================================
   Très Jolie Festas — admin.js
   Painel para gerenciar o conteúdo do site:
   - Carrossel do topo (coleção "carrossel")
   - Cenários das galerias (coleção "cenarios")
   - Fotos da Montagem de festa (coleção "montagem")
   ========================================================= */

/* Cenários que já estão fixos no HTML do site, usados apenas pelo
   botão "Importar cenários do site" para trazê-los para o Firebase
   na primeira vez que o painel for usado. */
const EXISTING_SITE_ITEMS = [
  { title: 'Fadinhas', category: 'cenarios', imageUrl: 'imagens/cenarios/fadinhas2.png' },
  { title: 'Hello Kitty', category: 'cenarios', imageUrl: 'imagens/cenarios/hello%20kity.png' },
  { title: 'Minnie Rosa', category: 'cenarios', imageUrl: 'imagens/cenarios/minnie%20rosa.png' },
  { title: 'Turma da Mônica', category: 'cenarios', imageUrl: 'imagens/cenarios/turma%20da%20monica.png' },
  { title: 'Wandinha', category: 'cenarios', imageUrl: 'imagens/cenarios/wandinha.png' },
  { title: 'Basquetebol', category: 'cenarios', imageUrl: 'imagens/cenarios/basquetebol.jpeg' },
  { title: 'Borboletas', category: 'cenarios', imageUrl: 'imagens/cenarios/borboletas.jpeg' },
  { title: 'Futebol', category: 'cenarios', imageUrl: 'imagens/cenarios/futbol.jpeg' },
  { title: 'Futebol', category: 'cenarios', imageUrl: 'imagens/cenarios/fut%20bol%202.jpeg' },
  { title: 'Cenário 1', category: 'cenarios', imageUrl: 'imagens/cenarios/cenario1.jpeg' },
  { title: 'Cenário 2', category: 'cenarios', imageUrl: 'imagens/cenarios/cenario2.jpeg' },
  { title: 'Cenário 3', category: 'cenarios', imageUrl: 'imagens/cenarios/cenario%203.jpeg' },
  { title: 'Cenário 4', category: 'cenarios', imageUrl: 'imagens/cenarios/cenario4.jpeg' },
  { title: 'Cenário 5', category: 'cenarios', imageUrl: 'imagens/cenarios/cenario%205.jpeg' },
  { title: 'Cenário 6', category: 'cenarios', imageUrl: 'imagens/cenarios/cenario%206.jpeg' },
  { title: 'Laço e Neon', category: 'cenarios', imageUrl: 'imagens/imagem%206.jpeg' },
  { title: 'Capivara', category: 'cenarios', imageUrl: 'imagens/cenarios/capivara.jpeg' },
  { title: 'Fazendinha', category: 'cenarios', imageUrl: 'imagens/cenarios/fazendinha.jpeg' },
  { title: 'Unicórnio', category: 'cenarios', imageUrl: 'imagens/cenarios/unicorinho.jpeg' },
  { title: 'Pequena Sereia', category: 'cenarios', imageUrl: 'imagens/cenarios/pequena%20sereia.jpeg' },
  { title: 'Chá de Bebê', category: 'cha-de-bebe', imageUrl: 'imagens/cha%20de%20bebe/cha%20de%20bebe%203.jpeg' },
  { title: 'Chá de Bebê', category: 'cha-de-bebe', imageUrl: 'imagens/cha%20de%20bebe/cha%20de%20bebe%204.jpeg' },
  { title: 'Chá de Bebê', category: 'cha-de-bebe', imageUrl: 'imagens/cha%20de%20bebe/cha%20de%20bebe.png' },
  { title: 'Chá de Bebê', category: 'cha-de-bebe', imageUrl: 'imagens/cha%20de%20bebe/cha%20de%20bebe2.png' },
  { title: 'Chá de Bebê', category: 'cha-de-bebe', imageUrl: 'imagens/cha%20de%20bebe/cha%20de%20bebe%207.jpeg' },
];

/* Fotos da "Montagem de festa" já fixas no HTML (botão de importar). */
const EXISTING_MONTAGEM_PHOTOS = [
  'imagens/imagem%201.jpeg',
  'imagens/imagem%202.jpeg',
  'imagens/imagem%203.jpeg',
  'imagens/imagem%207.jpeg',
  'imagens/imagem%209.jpeg',
  'imagens/imagem%2011.jpeg',
  'imagens/imagem%2012.jpeg',
  'imagens/cenarios/monatgem1.jpeg',
  'imagens/cenarios/moantagem%202.jpeg',
];

/* Fotos do carrossel do topo já fixas no HTML (botão de importar). */
const EXISTING_CAROUSEL_SLIDES = [
  { imageUrl: 'imagens/imagem%20inicio.jpeg', alt: 'Cenário elegante em branco com arco decorativo e pedestais' },
  { imageUrl: 'imagens/imagem%204.jpeg', alt: 'Cenário tema fazendinha com painel redondo e cercadinho de madeira' },
  { imageUrl: 'imagens/imagem%205.jpeg', alt: 'Cenário decorado com painel redondo tema unicórnio' },
  { imageUrl: 'imagens/imagem%206.jpeg', alt: 'Cenário rosa com laço decorativo e número em neon' },
  { imageUrl: 'imagens/imagem%208.jpeg', alt: 'Cenário tema Pequena Sereia com painel redondo' },
  { imageUrl: 'imagens/imagem%2010.jpeg', alt: 'Cenário tema capivara Feliz Aniversário com número em neon' },
];

/* Textos e contato que o site mostra hoje; usados quando config/site ainda não existe. */
const DEFAULT_SITE_CONFIG = {
  whatsapp: '5561992378041',
  instagram: 'tresjoliefestas',
  addressLine1: 'CLS 411, Bloco A, Loja 16',
  addressLine2: 'Asa Sul, Brasília - DF',
  cep: '70277-510',
  hoursWeek: 'Segunda a sexta, das 9h às 18h',
  hoursSaturday: 'Sábado, das 9h às 13h',
  heroTitle: 'Locação de móveis, louças',
  heroTitleHighlight: 'e painéis para festas',
  heroSubtitle: 'Cenários personalizados para tornar a sua festa inesquecível.',
  locamos: [
    { icon: 'painel', title: 'Painéis', text: 'Painéis decorativos para compor o fundo do seu cenário.' },
    { icon: 'movel', title: 'Móveis', text: 'Mesas, cilindros e peças para a estrutura da decoração.' },
    { icon: 'louca', title: 'Louças', text: 'Louças de cerâmica delicadas para uma mesa elegante.' },
    { icon: 'neon', title: 'Números em neon', text: 'Números iluminados para destacar a idade ou o tema.' },
    { icon: 'coracao', title: 'Itens decorativos', text: 'Detalhes que completam e personalizam o cenário.' },
  ],
  steps: [
    { title: 'Mesa de testes', text: 'Montamos uma mesa de testes para você ver a combinação das peças antes de decidir.' },
    { title: 'Escolha livre', text: 'Escolha painéis, mesas, suportes e itens decorativos do seu jeito.' },
    { title: 'Veja pronto', text: 'Veja o cenário montado no nosso espaço antes de fechar a locação.' },
    { title: '100% personalizado', text: 'Tudo planejado do seu jeito, com atendimento exclusivo do início ao fim.' },
  ],
  montagemQuote: 'Tranquilidade e sofisticação para o seu evento.',
  montagemBenefits: [
    'Montagem completa e sob medida, feita no seu evento.',
    'A sua festa personalizada alinhada ao seu planejamento.',
    'A comodidade de receber sua festa pronta, no seu endereço.',
  ],
};

/* Ícones que podem ser escolhidos em "O que locamos" (os desenhos ficam em script.js) */
const ICON_OPTIONS = {
  painel: 'Painel',
  movel: 'Móvel',
  louca: 'Louça',
  neon: 'Neon / raio',
  coracao: 'Coração',
  estrela: 'Estrela',
  balao: 'Balão',
  presente: 'Presente',
  bolo: 'Bolo',
};

const BADGE_OPTIONS = { '': 'Nenhuma', novo: 'Novo', 'mais-pedido': 'Mais pedido' };

const CATEGORY_LABELS = { cenarios: 'Nossos cenários', 'cha-de-bebe': 'Chá de Bebê' };
const VIEWS = ['inicio', 'carrossel', 'cenarios', 'montagem', 'site'];

let cachedItems = [];
let cachedMontagemPhotos = [];
let cachedSlides = [];
let currentFilter = 'cenarios';
let siteConfig = null;
let siteDirty = false;

document.addEventListener('DOMContentLoaded', () => {
  const loginMsg = document.getElementById('login-msg');
  if (!window.auth || !window.db) {
    loginMsg.textContent =
      'O Firebase ainda não foi configurado (arquivo firebase-config.js). Preencha as chaves do seu projeto antes de usar o painel.';
    return;
  }
  if (!window.CLOUDINARY_CLOUD_NAME || window.CLOUDINARY_CLOUD_NAME === 'SEU_CLOUD_NAME') {
    loginMsg.textContent =
      'O Cloudinary ainda não foi configurado (arquivo firebase-config.js). Preencha CLOUDINARY_CLOUD_NAME e CLOUDINARY_UPLOAD_PRESET antes de usar o painel.';
    return;
  }

  const loginSection = document.getElementById('admin-login');
  const dashboard = document.getElementById('admin-dashboard');

  window.auth.onAuthStateChanged((user) => {
    if (user) {
      loginSection.classList.add('admin-hidden');
      dashboard.classList.remove('admin-hidden');
      document.getElementById('user-email').textContent = user.email || '';
      document.getElementById('user-avatar').textContent = (user.email || 'T').charAt(0).toUpperCase();
      showView();
      loadList();
      loadMontagemList();
      loadCarouselList();
      loadSiteConfig();
    } else {
      loginSection.classList.remove('admin-hidden');
      dashboard.classList.add('admin-hidden');
    }
  });

  // Uma foto solta fora da área de envio faria o navegador sair do painel para abrir a imagem
  ['dragover', 'drop'].forEach((type) => window.addEventListener(type, (e) => e.preventDefault()));

  setupLogin();
  document.getElementById('logout-btn').addEventListener('click', () => window.auth.signOut());

  setupGreeting();
  setupRouter();
  setupDrawer();
  setupCenarios();
  setupImport();
  setupMontagem();
  setupMontagemImport();
  setupCarousel();
  setupCarouselImport();
  setupSiteForm();
  setupSiteTabs();
  setupSitePreview();
  setupTours();
});

/* ---------- Login ---------- */
function setupLogin() {
  const form = document.getElementById('login-form');
  const msg = document.getElementById('login-msg');
  const submit = document.getElementById('login-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    submit.disabled = true;
    submit.textContent = 'Entrando...';
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    try {
      await window.auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'Não existe nenhum usuário com esse e-mail.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/invalid-credential': 'E-mail ou senha incorretos.',
        'auth/invalid-email': 'E-mail inválido.',
        'auth/too-many-requests': 'Muitas tentativas erradas. Aguarde um pouco e tente de novo.',
      };
      msg.textContent = messages[err.code] || `Não foi possível entrar (${err.code || err.message}).`;
    } finally {
      submit.disabled = false;
      submit.textContent = 'Entrar';
    }
  });

  const passwordInput = document.getElementById('login-password');
  const passwordToggle = document.getElementById('login-password-toggle');
  passwordToggle.addEventListener('click', () => {
    const isVisible = passwordInput.type === 'text';
    passwordInput.type = isVisible ? 'password' : 'text';
    passwordToggle.classList.toggle('is-visible', !isVisible);
    passwordToggle.setAttribute('aria-label', isVisible ? 'Mostrar senha' : 'Ocultar senha');
  });
}

function setupGreeting() {
  const date = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  document.getElementById('today-date').textContent = date;
}

/* ---------- Navegação entre seções (pelo # da URL) ---------- */
function setupRouter() {
  window.addEventListener('hashchange', showView);
  document.querySelector('[data-action="new-cenario"]').addEventListener('click', () => openNewCenario());
}

function showView() {
  const hash = window.location.hash.slice(1);
  const view = VIEWS.includes(hash) ? hash : 'inicio';
  document.querySelectorAll('.admin-view').forEach((el) => el.classList.toggle('is-active', el.dataset.view === view));
  document.querySelectorAll('.admin-nav__link').forEach((el) => {
    const active = el.dataset.view === view;
    el.classList.toggle('is-active', active);
    if (active) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
  });
  window.scrollTo(0, 0);
  const loggedIn = window.auth && window.auth.currentUser;
  if (view === 'carrossel' && !sitePreviewLoaded && loggedIn) refreshSitePreview(true);
  if (loggedIn) maybeAutoStartTour(view);
}

/* ---------- Utilitários ---------- */
function escapeHtml(str) {
  return String(str ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function normalizeText(str) {
  return String(str ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function icon(name) {
  return `<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

async function uploadToCloudinary(file, folder = 'cenarios') {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', window.CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${window.CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  if (!json.secure_url) throw new Error('Falha no upload da imagem para o Cloudinary');
  return json.secure_url;
}

/* Envia várias fotos em sequência, avisando o progresso a cada uma. */
async function uploadMany(files, folder, onProgress) {
  const urls = [];
  for (let i = 0; i < files.length; i += 1) {
    onProgress(i, files.length);
    urls.push(await uploadToCloudinary(files[i], folder));
  }
  onProgress(files.length, files.length);
  return urls;
}

/* ---------- Avisos (toasts) ---------- */
function showToast(text, type = 'success') {
  const wrap = document.getElementById('admin-toasts');
  const toast = document.createElement('div');
  toast.className = `admin-toast admin-toast--${type}`;
  toast.innerHTML = `${icon(type === 'error' ? 'alert' : 'check')}<span>${escapeHtml(text)}</span>`;
  wrap.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('is-leaving');
    toast.addEventListener('animationend', () => toast.remove(), { once: true });
  }, type === 'error' ? 5000 : 3000);
}

/* ---------- Modal de confirmação/alerta ---------- */
function showModal({ title, text, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', danger = false, alertOnly = false }) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('admin-modal-overlay');
    const modal = document.getElementById('admin-modal');
    const confirmBtn = document.getElementById('admin-modal-confirm');
    const cancelBtn = document.getElementById('admin-modal-cancel');

    document.getElementById('admin-modal-title').textContent = title;
    document.getElementById('admin-modal-text').textContent = text;
    confirmBtn.textContent = alertOnly ? 'OK' : confirmLabel;
    cancelBtn.textContent = cancelLabel;
    modal.classList.toggle('admin-modal--danger', danger);
    modal.classList.toggle('admin-modal--alert', alertOnly);
    overlay.classList.remove('admin-hidden');
    confirmBtn.focus();

    function cleanup(result) {
      overlay.classList.add('admin-hidden');
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onOverlay);
      document.removeEventListener('keydown', onKey);
      resolve(result);
    }
    function onConfirm() { cleanup(true); }
    function onCancel() { cleanup(false); }
    function onOverlay(e) { if (e.target === overlay) cleanup(false); }
    function onKey(e) { if (e.key === 'Escape') cleanup(false); }

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlay);
    document.addEventListener('keydown', onKey);
  });
}

/* ---------- Painel lateral de edição ---------- */
let drawerHideTimer = null;

function setupDrawer() {
  const overlay = document.getElementById('admin-drawer-overlay');
  document.getElementById('admin-drawer-close').addEventListener('click', closeDrawer);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeDrawer(); });
  document.addEventListener('keydown', (e) => {
    const modalOpen = !document.getElementById('admin-modal-overlay').classList.contains('admin-hidden');
    if (e.key === 'Escape' && !modalOpen && overlay.classList.contains('is-open')) closeDrawer();
  });
}

function openDrawer(title) {
  const overlay = document.getElementById('admin-drawer-overlay');
  clearTimeout(drawerHideTimer);
  document.getElementById('admin-drawer-title').textContent = title;
  const body = document.getElementById('admin-drawer-body');
  body.innerHTML = '';
  body.scrollTop = 0;
  overlay.classList.remove('admin-hidden');
  void overlay.offsetWidth; // força o navegador a aplicar o estado inicial antes de animar
  overlay.classList.add('is-open');
  document.body.classList.add('admin-no-scroll');
  return body;
}

function closeDrawer() {
  const overlay = document.getElementById('admin-drawer-overlay');
  overlay.classList.remove('is-open');
  document.body.classList.remove('admin-no-scroll');
  drawerHideTimer = setTimeout(() => overlay.classList.add('admin-hidden'), 300);
}

/* ---------- Área de soltar/escolher fotos ---------- */
function setupDropzone(zone, onFiles) {
  const input = zone.querySelector('input[type="file"]');
  input.addEventListener('change', () => {
    const files = Array.from(input.files || []);
    input.value = '';
    if (files.length) onFiles(files);
  });
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('is-dragging');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('is-dragging'));
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('is-dragging');
    if (zone.classList.contains('is-busy')) return;
    const files = Array.from(e.dataTransfer.files || []).filter((f) => f.type.startsWith('image/'));
    if (files.length) onFiles(files);
  });
}

function setDropzoneBusy(zone, done, total) {
  const busy = total > 0 && done < total;
  zone.classList.toggle('is-busy', busy);
  zone.querySelector('input[type="file"]').disabled = busy;
  const bar = zone.querySelector('.admin-dropzone__progress span');
  if (bar) bar.style.width = total ? `${Math.max(8, (done / total) * 100)}%` : '0';
  const strong = zone.querySelector('strong');
  if (!zone.dataset.label) zone.dataset.label = strong.textContent;
  strong.textContent = busy ? `Enviando foto ${done + 1} de ${total}...` : zone.dataset.label;
}

/* ---------- Estatísticas da tela inicial ---------- */
function updateStats() {
  document.getElementById('stat-slides').textContent = cachedSlides.length;
  document.getElementById('stat-cenarios').textContent = cachedItems.length;
  document.getElementById('stat-categorias').textContent = new Set(cachedItems.map((i) => i.category)).size;
  document.getElementById('stat-montagem').textContent = cachedMontagemPhotos.length;
  document.getElementById('nav-count-slides').textContent = cachedSlides.length || '';
  document.getElementById('nav-count-cenarios').textContent = cachedItems.length || '';
  document.getElementById('nav-count-montagem').textContent = cachedMontagemPhotos.length || '';
}

/* =========================================================
   CARROSSEL DO TOPO
   ========================================================= */
let heroPreviewTimer = null;

function setupCarousel() {
  const zone = document.querySelector('[data-dropzone="carrossel"]');
  setupDropzone(zone, async (files) => {
    try {
      const urls = await uploadMany(files, 'carrossel', (done, total) => setDropzoneBusy(zone, done, total));
      const baseOrder = cachedSlides.reduce((max, s) => Math.max(max, s.order ?? 0), -1) + 1;
      const batch = window.db.batch();
      urls.forEach((imageUrl, i) => {
        batch.set(window.db.collection('carrossel').doc(), {
          imageUrl,
          alt: '',
          order: baseOrder + i,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
      await batch.commit();
      showToast(urls.length > 1 ? `${urls.length} fotos adicionadas ao carrossel!` : 'Foto adicionada ao carrossel!');
      loadCarouselList();
    } catch (err) {
      showToast('Não foi possível enviar as fotos. Tente novamente.', 'error');
      console.error(err);
    } finally {
      setDropzoneBusy(zone, 0, 0);
    }
  });
}

function setupCarouselImport() {
  const btn = document.getElementById('carrossel-import-btn');
  btn.addEventListener('click', async () => {
    const confirmed = await showModal({
      title: 'Importar fotos do carrossel',
      text: 'Isso traz as fotos atuais do carrossel do site para o painel. Confirme apenas se ainda não fez isso antes.',
      confirmLabel: 'Importar',
    });
    if (!confirmed) return;

    btn.disabled = true;
    try {
      const batch = window.db.batch();
      EXISTING_CAROUSEL_SLIDES.forEach((slide, i) => {
        batch.set(window.db.collection('carrossel').doc(), {
          ...slide,
          order: i,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
      await batch.commit();
      showToast('Fotos do carrossel importadas!');
      loadCarouselList();
    } catch (err) {
      showToast('Ocorreu um erro ao importar.', 'error');
      console.error(err);
    } finally {
      btn.disabled = false;
    }
  });
}

async function loadCarouselList() {
  try {
    const snapshot = await window.db.collection('carrossel').orderBy('order', 'asc').get();
    cachedSlides = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    document.getElementById('carrossel-import-box').classList.toggle('admin-hidden', cachedSlides.length > 0);
    renderCarouselList();
    renderHeroPreviews();
    updateStats();
    refreshSitePreview();
  } catch (err) {
    document.getElementById('carrossel-list').innerHTML =
      '<p class="admin-empty">Não foi possível carregar o carrossel. Confira se as regras do Firestore liberam a coleção “carrossel”.</p>';
    console.error(err);
  }
}

function renderCarouselList() {
  const listEl = document.getElementById('carrossel-list');

  if (!cachedSlides.length) {
    listEl.innerHTML = '<p class="admin-empty">Nenhuma foto cadastrada ainda — o site está mostrando as fotos originais. Importe-as ou adicione novas acima.</p>';
    return;
  }

  const last = cachedSlides.length - 1;
  listEl.innerHTML = cachedSlides.map((slide, i) => `
    <article class="admin-slide" draggable="true" data-index="${i}">
      <div class="admin-slide__media">
        <img src="${escapeHtml(slide.imageUrl)}" alt="" draggable="false" loading="lazy">
        <span class="admin-slide__pos">${i + 1}</span>
        ${i === 0 ? `<span class="admin-slide__cover">${icon('star')}Capa</span>` : ''}
        <span class="admin-slide__grip" title="Arraste para reordenar">${icon('drag')}</span>
      </div>
      <div class="admin-slide__body">
        <p class="admin-slide__alt">${slide.alt ? escapeHtml(slide.alt) : '<em>Sem descrição</em>'}</p>
        <div class="admin-slide__actions">
          <button type="button" class="admin-icon-btn js-move" data-dir="-1" aria-label="Mover para antes" title="Mover para antes" ${i === 0 ? 'disabled' : ''}>${icon('left')}</button>
          <button type="button" class="admin-icon-btn js-move" data-dir="1" aria-label="Mover para depois" title="Mover para depois" ${i === last ? 'disabled' : ''}>${icon('right')}</button>
          <span class="admin-spacer"></span>
          <button type="button" class="admin-icon-btn js-edit-slide" aria-label="Editar foto" title="Editar">${icon('edit')}</button>
          <button type="button" class="admin-icon-btn admin-icon-btn--danger js-delete-slide" aria-label="Excluir foto" title="Excluir">${icon('trash')}</button>
        </div>
      </div>
    </article>
  `).join('');

  let dragIndex = null;
  listEl.querySelectorAll('.admin-slide').forEach((card) => {
    const index = Number(card.dataset.index);
    card.querySelectorAll('.js-move').forEach((btn) => {
      btn.addEventListener('click', () => moveSlide(index, index + Number(btn.dataset.dir)));
    });
    card.querySelector('.js-edit-slide').addEventListener('click', () => openEditSlide(cachedSlides[index]));
    card.querySelector('.js-delete-slide').addEventListener('click', () => deleteSlide(cachedSlides[index]));

    card.addEventListener('dragstart', (e) => {
      dragIndex = index;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      listEl.querySelectorAll('.is-over').forEach((el) => el.classList.remove('is-over'));
    });
    card.addEventListener('dragover', (e) => {
      if (dragIndex === null) return;
      e.preventDefault();
      card.classList.add('is-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('is-over'));
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('is-over');
      if (dragIndex !== null) moveSlide(dragIndex, index);
      dragIndex = null;
    });
  });
}

async function moveSlide(from, to) {
  if (from === to || to < 0 || to >= cachedSlides.length) return;
  const [slide] = cachedSlides.splice(from, 1);
  cachedSlides.splice(to, 0, slide);
  renderCarouselList();
  renderHeroPreviews();

  try {
    const batch = window.db.batch();
    cachedSlides.forEach((s, i) => {
      s.order = i;
      batch.update(window.db.collection('carrossel').doc(s.id), { order: i });
    });
    await batch.commit();
    showToast('Nova ordem salva!');
    refreshSitePreview();
  } catch (err) {
    showToast('Não foi possível salvar a nova ordem.', 'error');
    console.error(err);
    loadCarouselList();
  }
}

function openEditSlide(slide) {
  const body = openDrawer('Editar foto do carrossel');
  let imageUrl = slide.imageUrl;

  body.innerHTML = `
    <div class="admin-drawer__hero"><img class="js-slide-preview" src="${escapeHtml(imageUrl)}" alt=""></div>
    <label class="admin-dropzone admin-dropzone--compact">
      <input type="file" accept="image/*" class="admin-file-input">
      ${icon('upload')}
      <strong>Trocar esta foto</strong>
      <span class="admin-dropzone__progress" aria-hidden="true"><span></span></span>
    </label>
    <form class="admin-form js-form">
      <div class="admin-field">
        <label for="slide-alt">Descrição da foto</label>
        <textarea id="slide-alt" rows="3" placeholder="Ex.: Cenário rosa com arco de balões e mesa de doces">${escapeHtml(slide.alt || '')}</textarea>
        <small class="admin-hint">Não aparece no site, mas ajuda o Google e pessoas com deficiência visual a entenderem a foto.</small>
      </div>
      <div class="admin-drawer__actions">
        <button type="button" class="btn admin-btn-danger js-delete">${icon('trash')}Excluir</button>
        <button type="submit" class="btn btn--primary">Salvar alterações</button>
      </div>
    </form>
  `;

  const zone = body.querySelector('.admin-dropzone');
  setupDropzone(zone, async (files) => {
    try {
      [imageUrl] = await uploadMany(files.slice(0, 1), 'carrossel', (done, total) => setDropzoneBusy(zone, done, total));
      body.querySelector('.js-slide-preview').src = imageUrl;
      showToast('Foto nova carregada — clique em “Salvar alterações”.');
    } catch (err) {
      showToast('Não foi possível enviar a foto.', 'error');
      console.error(err);
    } finally {
      setDropzoneBusy(zone, 0, 0);
    }
  });

  body.querySelector('.js-delete').addEventListener('click', async () => {
    if (await deleteSlide(slide)) closeDrawer();
  });

  body.querySelector('.js-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const submit = e.target.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      await window.db.collection('carrossel').doc(slide.id).update({
        imageUrl,
        alt: body.querySelector('#slide-alt').value.trim(),
      });
      showToast('Foto do carrossel atualizada!');
      closeDrawer();
      loadCarouselList();
    } catch (err) {
      showToast('Erro ao salvar as alterações.', 'error');
      console.error(err);
      submit.disabled = false;
    }
  });
}

async function deleteSlide(slide) {
  const isLast = cachedSlides.length === 1;
  const confirmed = await showModal({
    title: 'Excluir foto do carrossel',
    text: isLast
      ? 'Esta é a última foto. Sem nenhuma foto cadastrada, o site volta a mostrar as fotos originais do carrossel. Deseja excluir?'
      : 'Excluir esta foto do carrossel? Essa ação não pode ser desfeita.',
    confirmLabel: 'Excluir',
    danger: true,
  });
  if (!confirmed) return false;

  try {
    await window.db.collection('carrossel').doc(slide.id).delete();
    showToast('Foto excluída do carrossel.');
    loadCarouselList();
    return true;
  } catch (err) {
    showToast('Não foi possível excluir esta foto.', 'error');
    console.error(err);
    return false;
  }
}

/* Prévia de verdade: o próprio site (index.html) dentro de um iframe, reduzido
   para caber na tela. Desenhamos o site no tamanho real e encolhemos com scale. */
const PREVIEW_SIZES = {
  desktop: { width: 1280, height: 800 },
  mobile: { width: 390, height: 780, shown: 300 },
};
let sitePreviewLoaded = false;

function setupSitePreview() {
  const preview = document.getElementById('site-preview');
  const stage = preview.querySelector('.admin-site-preview__stage');

  preview.querySelectorAll('.admin-site-preview__toggle button').forEach((btn) => {
    btn.addEventListener('click', () => {
      preview.dataset.device = btn.dataset.device;
      preview.querySelectorAll('.admin-site-preview__toggle button').forEach((b) => b.classList.toggle('is-active', b === btn));
      layoutSitePreview();
    });
  });

  new ResizeObserver(layoutSitePreview).observe(stage);
}

function layoutSitePreview() {
  const preview = document.getElementById('site-preview');
  const stage = preview.querySelector('.admin-site-preview__stage');
  const screen = preview.querySelector('.admin-site-preview__screen');
  const frame = document.getElementById('site-preview-frame');
  const size = PREVIEW_SIZES[preview.dataset.device];
  const shownWidth = Math.min(size.shown || stage.clientWidth, stage.clientWidth);
  const scale = shownWidth / size.width;

  frame.style.width = `${size.width}px`;
  frame.style.height = `${size.height}px`;
  frame.style.transform = `scale(${scale})`;
  screen.style.width = `${shownWidth}px`;
  screen.style.height = `${size.height * scale}px`;
}

/* Carrega a prévia só quando a aba Carrossel é aberta, e recarrega depois de cada mudança */
function refreshSitePreview(force = false) {
  if (!sitePreviewLoaded && !force) return;
  sitePreviewLoaded = true;
  document.getElementById('site-preview-frame').src = `index.html?previa=${Date.now()}`;
  layoutSitePreview();
}

/* Prévia que imita o topo do site, trocando de foto sozinha (tela Início). */
function renderHeroPreviews() {
  const urls = (cachedSlides.length ? cachedSlides : EXISTING_CAROUSEL_SLIDES).map((s) => s.imageUrl);
  const heroTitle = (siteConfig && siteConfig.heroTitle) || DEFAULT_SITE_CONFIG.heroTitle;
  const heroHighlight = (siteConfig && siteConfig.heroTitleHighlight) || DEFAULT_SITE_CONFIG.heroTitleHighlight;
  document.querySelectorAll('.js-hero-preview').forEach((el) => {
    el.innerHTML = `
      ${urls.map((url, i) => `<img src="${escapeHtml(url)}" alt="" class="${i === 0 ? 'is-active' : ''}">`).join('')}
      <div class="admin-hero-preview__overlay"></div>
      <span class="admin-hero-preview__badge"><i></i>Prévia do site</span>
      <p class="admin-hero-preview__title">${escapeHtml(heroTitle)}<em>${escapeHtml(heroHighlight)}</em></p>
      <div class="admin-hero-preview__dots">${urls.map((_, i) => `<i class="${i === 0 ? 'is-active' : ''}"></i>`).join('')}</div>
    `;
  });

  clearInterval(heroPreviewTimer);
  if (urls.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let index = 0;
  heroPreviewTimer = setInterval(() => {
    index = (index + 1) % urls.length;
    document.querySelectorAll('.js-hero-preview').forEach((el) => {
      el.querySelectorAll('img').forEach((img, i) => img.classList.toggle('is-active', i === index));
      el.querySelectorAll('.admin-hero-preview__dots i').forEach((dot, i) => dot.classList.toggle('is-active', i === index));
    });
  }, 3500);
}

/* =========================================================
   CENÁRIOS
   ========================================================= */
function getKnownCategories() {
  const set = new Set(['cenarios', 'cha-de-bebe']);
  cachedItems.forEach((i) => set.add(i.category));
  return Array.from(set);
}

function categoryOptionsHtml(selected) {
  const options = getKnownCategories().map((cat) =>
    `<option value="${escapeHtml(cat)}" ${cat === selected ? 'selected' : ''}>${escapeHtml(CATEGORY_LABELS[cat] || cat)}</option>`
  ).join('');
  return `${options}<option value="__new__">+ Criar nova categoria</option>`;
}

function categoryFieldsHtml(selected) {
  return `
    <div class="admin-field">
      <label for="cenario-category">Onde aparece no site</label>
      <select id="cenario-category" class="js-category">${categoryOptionsHtml(selected)}</select>
    </div>
    <div class="admin-field admin-hidden js-new-category-wrap">
      <label for="cenario-new-category">Nome da nova categoria</label>
      <input type="text" id="cenario-new-category" class="js-new-category" placeholder="Ex.: Aniversário Adulto">
    </div>
  `;
}

function setupCategoryToggle(container) {
  const select = container.querySelector('.js-category');
  const wrap = container.querySelector('.js-new-category-wrap');
  const input = container.querySelector('.js-new-category');
  select.addEventListener('change', () => {
    const isNew = select.value === '__new__';
    wrap.classList.toggle('admin-hidden', !isNew);
    input.required = isNew;
    if (isNew) input.focus();
  });
  return () => (select.value === '__new__' ? input.value.trim() : select.value);
}

/* Mesma ordem do site: a escolhida no painel; sem ordem vão para o fim, por data de cadastro */
function byOrder(a, b) {
  const oa = a.order ?? Infinity;
  const ob = b.order ?? Infinity;
  if (oa !== ob) return oa - ob;
  const ta = a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : 0;
  const tb = b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : 0;
  return ta - tb;
}

function badgeFieldsHtml(item = {}) {
  return `
    <div class="admin-field">
      <label for="cenario-badge">Etiqueta na foto</label>
      <select id="cenario-badge" class="js-badge">${Object.entries(BADGE_OPTIONS).map(([key, label]) =>
        `<option value="${key}" ${(item.badge || '') === key ? 'selected' : ''}>${label}</option>`).join('')}</select>
    </div>
    <label class="admin-switch">
      <input type="checkbox" class="js-visible" ${item.hidden ? '' : 'checked'}>
      <span class="admin-switch__track" aria-hidden="true"></span>
      <span><strong>Mostrar no site</strong><small>Desligue para esconder sem apagar (ex.: peça em manutenção).</small></span>
    </label>
  `;
}

function getItemPhotos(item) {
  return item.photos && item.photos.length ? item.photos.slice() : (item.imageUrl ? [item.imageUrl] : []);
}

function setupCenarios() {
  document.getElementById('new-cenario-btn').addEventListener('click', () => openNewCenario());
  document.getElementById('cenarios-search').addEventListener('input', renderList);
  document.querySelector('.admin-filter').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    renderFilterButtons();
    renderList();
  });
}

function openNewCenario() {
  const body = openDrawer('Novo cenário');
  const defaultCategory = currentFilter;
  const pendingFiles = [];

  body.innerHTML = `
    <form class="admin-form js-form">
      <div class="admin-field">
        <label for="cenario-title">Título (aparece no site)</label>
        <input type="text" id="cenario-title" required placeholder="Ex.: Fadinhas">
      </div>
      ${categoryFieldsHtml(defaultCategory)}
      ${badgeFieldsHtml()}
      <div class="admin-field">
        <span class="admin-label">Fotos</span>
        <label class="admin-dropzone admin-dropzone--compact">
          <input type="file" accept="image/*" multiple class="admin-file-input">
          ${icon('upload')}
          <strong>Escolher ou arrastar fotos</strong>
          <span>A primeira foto será a capa do cenário.</span>
        </label>
      </div>
      <div class="admin-thumbs js-thumbs"></div>
      <div class="admin-drawer__actions">
        <button type="button" class="btn btn--outline js-cancel">Cancelar</button>
        <button type="submit" class="btn btn--primary">Salvar cenário</button>
      </div>
    </form>
  `;

  const getCategory = setupCategoryToggle(body);
  const thumbsEl = body.querySelector('.js-thumbs');

  function renderPending() {
    thumbsEl.innerHTML = pendingFiles.map((f, i) => `
      <div class="admin-thumb">
        <img src="${f.preview}" alt="">
        ${i === 0 ? '<span class="admin-thumb__cover">Capa</span>' : ''}
        <button type="button" class="admin-thumb__remove" data-index="${i}" aria-label="Remover foto">${icon('close')}</button>
      </div>
    `).join('');
    thumbsEl.querySelectorAll('.admin-thumb__remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [removed] = pendingFiles.splice(Number(btn.dataset.index), 1);
        URL.revokeObjectURL(removed.preview);
        renderPending();
      });
    });
  }

  setupDropzone(body.querySelector('.admin-dropzone'), (files) => {
    files.forEach((file) => pendingFiles.push({ file, preview: URL.createObjectURL(file) }));
    renderPending();
  });

  body.querySelector('.js-cancel').addEventListener('click', closeDrawer);
  body.querySelector('#cenario-title').focus();

  body.querySelector('.js-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = body.querySelector('#cenario-title').value.trim();
    const category = getCategory();
    if (!title || !category) return;
    if (!pendingFiles.length) {
      showToast('Escolha pelo menos uma foto para o cenário.', 'error');
      return;
    }

    const submit = e.target.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      const photos = await uploadMany(pendingFiles.map((p) => p.file), 'cenarios', (done, total) => {
        submit.textContent = done < total ? `Enviando foto ${done + 1} de ${total}...` : 'Salvando...';
      });
      const data = {
        title,
        category,
        photos,
        imageUrl: photos[0],
        badge: body.querySelector('.js-badge').value,
        hidden: !body.querySelector('.js-visible').checked,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // Se a categoria já foi ordenada no painel, o novo cenário entra no fim dela
      const orders = cachedItems.filter((i) => i.category === category).map((i) => i.order).filter(Number.isFinite);
      if (orders.length) data.order = Math.max(...orders) + 1;
      await window.db.collection('cenarios').add(data);
      pendingFiles.forEach((p) => URL.revokeObjectURL(p.preview));
      showToast(`Cenário “${title}” salvo!`);
      currentFilter = category;
      closeDrawer();
      loadList();
    } catch (err) {
      showToast('Ocorreu um erro ao salvar. Tente novamente.', 'error');
      console.error(err);
      submit.disabled = false;
      submit.textContent = 'Salvar cenário';
    }
  });
}

function openEditCenario(item) {
  const body = openDrawer('Editar cenário');
  const photos = getItemPhotos(item);

  body.innerHTML = `
    <form class="admin-form js-form">
      <div class="admin-field">
        <span class="admin-label">Fotos <small class="admin-hint">— a primeira é a capa</small></span>
        <div class="admin-thumbs js-thumbs"></div>
        <label class="admin-dropzone admin-dropzone--compact">
          <input type="file" accept="image/*" multiple class="admin-file-input">
          ${icon('upload')}
          <strong>Adicionar mais fotos</strong>
          <span class="admin-dropzone__progress" aria-hidden="true"><span></span></span>
        </label>
      </div>
      <div class="admin-field">
        <label for="cenario-title">Título</label>
        <input type="text" id="cenario-title" value="${escapeHtml(item.title)}" required>
      </div>
      ${categoryFieldsHtml(item.category)}
      ${badgeFieldsHtml(item)}
      <div class="admin-drawer__actions">
        <button type="button" class="btn admin-btn-danger js-delete">${icon('trash')}Excluir</button>
        <button type="submit" class="btn btn--primary">Salvar alterações</button>
      </div>
    </form>
  `;

  const getCategory = setupCategoryToggle(body);
  const thumbsEl = body.querySelector('.js-thumbs');

  function renderPhotos() {
    thumbsEl.innerHTML = photos.map((url, i) => `
      <div class="admin-thumb">
        <img src="${escapeHtml(url)}" alt="Foto ${i + 1}">
        ${i === 0
          ? '<span class="admin-thumb__cover">Capa</span>'
          : `<button type="button" class="admin-thumb__star" data-index="${i}" aria-label="Usar como capa" title="Usar como capa">${icon('star')}</button>`}
        <button type="button" class="admin-thumb__remove" data-index="${i}" aria-label="Remover foto" ${photos.length <= 1 ? 'disabled' : ''}>${icon('close')}</button>
      </div>
    `).join('');
    thumbsEl.querySelectorAll('.admin-thumb__remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (photos.length <= 1) return;
        photos.splice(Number(btn.dataset.index), 1);
        renderPhotos();
      });
    });
    thumbsEl.querySelectorAll('.admin-thumb__star').forEach((btn) => {
      btn.addEventListener('click', () => {
        const [cover] = photos.splice(Number(btn.dataset.index), 1);
        photos.unshift(cover);
        renderPhotos();
      });
    });
  }
  renderPhotos();

  const zone = body.querySelector('.admin-dropzone');
  setupDropzone(zone, async (files) => {
    try {
      photos.push(...await uploadMany(files, 'cenarios', (done, total) => setDropzoneBusy(zone, done, total)));
      renderPhotos();
    } catch (err) {
      showToast('Não foi possível enviar as fotos.', 'error');
      console.error(err);
    } finally {
      setDropzoneBusy(zone, 0, 0);
    }
  });

  body.querySelector('.js-delete').addEventListener('click', async () => {
    if (await deleteItem(item.id)) closeDrawer();
  });

  body.querySelector('.js-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = body.querySelector('#cenario-title').value.trim();
    const category = getCategory();
    if (!title || !category || !photos.length) return;

    const submit = e.target.querySelector('[type="submit"]');
    submit.disabled = true;
    try {
      await window.db.collection('cenarios').doc(item.id).update({
        title,
        category,
        photos,
        imageUrl: photos[0],
        badge: body.querySelector('.js-badge').value,
        hidden: !body.querySelector('.js-visible').checked,
      });
      showToast('Alterações salvas!');
      closeDrawer();
      loadList();
    } catch (err) {
      showToast('Erro ao salvar as alterações.', 'error');
      console.error(err);
      submit.disabled = false;
    }
  });
}

function setupImport() {
  const btn = document.getElementById('import-btn');
  btn.addEventListener('click', async () => {
    const confirmed = await showModal({
      title: 'Importar cenários do site',
      text: 'Isso importa os cenários fixos do site para o painel. Confirme apenas se ainda não fez isso antes — repetir duplica os itens.',
      confirmLabel: 'Importar',
    });
    if (!confirmed) return;

    btn.disabled = true;
    try {
      // Agrupa fotos com o mesmo título e categoria em um único cenário com várias fotos
      const grouped = new Map();
      EXISTING_SITE_ITEMS.forEach((item) => {
        const key = `${item.category}::${item.title}`;
        if (!grouped.has(key)) grouped.set(key, { title: item.title, category: item.category, photos: [] });
        grouped.get(key).photos.push(item.imageUrl);
      });

      const batch = window.db.batch();
      grouped.forEach((group) => {
        batch.set(window.db.collection('cenarios').doc(), {
          ...group,
          imageUrl: group.photos[0],
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
      await batch.commit();
      showToast('Cenários importados!');
      loadList();
    } catch (err) {
      showToast('Ocorreu um erro ao importar.', 'error');
      console.error(err);
    } finally {
      btn.disabled = false;
    }
  });
}

async function loadList() {
  try {
    const snapshot = await window.db.collection('cenarios').get();
    cachedItems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })).sort(byOrder);
    renderFilterButtons();
    renderList();
    updateStats();
    document.getElementById('admin-import-box').classList.toggle('admin-hidden', cachedItems.length > 0);
  } catch (err) {
    document.getElementById('admin-list').innerHTML = '<p class="admin-empty">Não foi possível carregar os cenários.</p>';
    console.error(err);
  }
}

function renderFilterButtons() {
  const filterEl = document.querySelector('.admin-filter');
  const categories = getKnownCategories();
  if (!categories.includes(currentFilter)) currentFilter = categories[0];

  filterEl.innerHTML = categories.map((cat) => {
    const count = cachedItems.filter((i) => i.category === cat).length;
    const active = cat === currentFilter;
    return `<button type="button" role="tab" aria-selected="${active}" class="${active ? 'is-active' : ''}" data-filter="${escapeHtml(cat)}">${escapeHtml(CATEGORY_LABELS[cat] || cat)}<span>${count}</span></button>`;
  }).join('');
}

function renderList() {
  const listEl = document.getElementById('admin-list');
  const query = normalizeText(document.getElementById('cenarios-search').value);
  const items = cachedItems.filter((i) => i.category === currentFilter && (!query || normalizeText(i.title).includes(query)));

  if (!items.length) {
    listEl.innerHTML = `<p class="admin-empty">${query ? 'Nenhum cenário encontrado com essa busca.' : 'Nenhum cenário cadastrado nessa categoria ainda.'}</p>`;
    return;
  }

  // Durante uma busca a lista fica incompleta, então não dá para reordenar
  const canReorder = !query;
  const last = items.length - 1;

  listEl.innerHTML = `
    ${canReorder && items.length > 1 ? '<p class="admin-hint admin-reorder-hint">Arraste os cards ou use as setas para escolher a ordem em que aparecem no site.</p>' : ''}
    <div class="admin-cards">${items.map((item, i) => {
    const photos = getItemPhotos(item);
    const badge = BADGE_OPTIONS[item.badge] && item.badge ? BADGE_OPTIONS[item.badge] : '';
    return `
      <article class="admin-cenario ${item.hidden ? 'is-hidden' : ''}" data-id="${escapeHtml(item.id)}" data-index="${i}" ${canReorder ? 'draggable="true"' : ''}>
        <button type="button" class="admin-cenario__media js-edit" aria-label="Editar ${escapeHtml(item.title)}">
          <img src="${escapeHtml(photos[0] || '')}" alt="" loading="lazy" draggable="false">
          ${canReorder ? `<span class="admin-cenario__pos">${i + 1}</span>` : ''}
          ${badge ? `<span class="admin-cenario__badge admin-cenario__badge--${item.badge}">${badge}</span>` : ''}
          ${item.hidden ? `<span class="admin-cenario__hidden">${icon('eye-off')}Oculto no site</span>` : ''}
          ${photos.length > 1 ? `<span class="admin-cenario__count">${icon('camera')}${photos.length}</span>` : ''}
        </button>
        <div class="admin-cenario__body">
          <div>
            <p class="admin-cenario__title">${escapeHtml(item.title)}</p>
            <p class="admin-cenario__category">${escapeHtml(CATEGORY_LABELS[item.category] || item.category)}</p>
          </div>
          <div class="admin-cenario__actions">
            ${canReorder ? `
              <button type="button" class="admin-icon-btn js-move" data-dir="-1" aria-label="Mover para antes" title="Mover para antes" ${i === 0 ? 'disabled' : ''}>${icon('left')}</button>
              <button type="button" class="admin-icon-btn js-move" data-dir="1" aria-label="Mover para depois" title="Mover para depois" ${i === last ? 'disabled' : ''}>${icon('right')}</button>` : ''}
            <span class="admin-spacer"></span>
            <button type="button" class="admin-icon-btn js-toggle-hidden" aria-label="${item.hidden ? 'Mostrar no site' : 'Esconder do site'}" title="${item.hidden ? 'Mostrar no site' : 'Esconder do site'}">${icon(item.hidden ? 'eye-off' : 'eye')}</button>
            <button type="button" class="admin-icon-btn js-edit" aria-label="Editar" title="Editar">${icon('edit')}</button>
            <button type="button" class="admin-icon-btn admin-icon-btn--danger js-delete" aria-label="Excluir" title="Excluir">${icon('trash')}</button>
          </div>
        </div>
      </article>
    `;
  }).join('')}</div>`;

  let dragIndex = null;
  listEl.querySelectorAll('.admin-cenario').forEach((card) => {
    const item = cachedItems.find((i) => i.id === card.dataset.id);
    const index = Number(card.dataset.index);
    card.querySelectorAll('.js-edit').forEach((btn) => btn.addEventListener('click', () => openEditCenario(item)));
    card.querySelector('.js-delete').addEventListener('click', () => deleteItem(item.id));
    card.querySelector('.js-toggle-hidden').addEventListener('click', () => toggleCenarioHidden(item));
    card.querySelectorAll('.js-move').forEach((btn) => {
      btn.addEventListener('click', () => moveCenario(items, index, index + Number(btn.dataset.dir)));
    });

    if (!canReorder) return;
    card.addEventListener('dragstart', (e) => {
      dragIndex = index;
      card.classList.add('is-dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', String(index));
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('is-dragging');
      listEl.querySelectorAll('.is-over').forEach((el) => el.classList.remove('is-over'));
    });
    card.addEventListener('dragover', (e) => {
      if (dragIndex === null) return;
      e.preventDefault();
      card.classList.add('is-over');
    });
    card.addEventListener('dragleave', () => card.classList.remove('is-over'));
    card.addEventListener('drop', (e) => {
      e.preventDefault();
      card.classList.remove('is-over');
      if (dragIndex !== null) moveCenario(items, dragIndex, index);
      dragIndex = null;
    });
  });
}

/* Reordena os cenários de uma categoria e grava a posição de todos eles */
async function moveCenario(items, from, to) {
  if (from === to || to < 0 || to >= items.length) return;
  const ordered = items.slice();
  const [moved] = ordered.splice(from, 1);
  ordered.splice(to, 0, moved);
  ordered.forEach((item, i) => { item.order = i; });
  cachedItems.sort(byOrder);
  renderList();

  try {
    const batch = window.db.batch();
    ordered.forEach((item) => batch.update(window.db.collection('cenarios').doc(item.id), { order: item.order }));
    await batch.commit();
    showToast('Nova ordem salva!');
  } catch (err) {
    showToast('Não foi possível salvar a nova ordem.', 'error');
    console.error(err);
    loadList();
  }
}

async function toggleCenarioHidden(item) {
  const hidden = !item.hidden;
  try {
    await window.db.collection('cenarios').doc(item.id).update({ hidden });
    item.hidden = hidden;
    renderList();
    showToast(hidden ? `“${item.title}” está oculto no site.` : `“${item.title}” voltou a aparecer no site.`);
  } catch (err) {
    showToast('Não foi possível alterar a visibilidade.', 'error');
    console.error(err);
  }
}

async function deleteItem(id) {
  const item = cachedItems.find((i) => i.id === id);
  if (!item) return false;

  const confirmed = await showModal({
    title: 'Excluir cenário',
    text: `Excluir "${item.title}"? Essa ação não pode ser desfeita.`,
    confirmLabel: 'Excluir',
    danger: true,
  });
  if (!confirmed) return false;

  try {
    await window.db.collection('cenarios').doc(id).delete();
    showToast(`Cenário “${item.title}” excluído.`);
    loadList();
    return true;
  } catch (err) {
    showToast('Não foi possível excluir este cenário.', 'error');
    console.error(err);
    return false;
  }
}

/* =========================================================
   MONTAGEM DE FESTA
   ========================================================= */
function setupMontagem() {
  const zone = document.querySelector('[data-dropzone="montagem"]');
  setupDropzone(zone, async (files) => {
    try {
      const urls = await uploadMany(files, 'montagem', (done, total) => setDropzoneBusy(zone, done, total));
      const batch = window.db.batch();
      urls.forEach((imageUrl) => {
        batch.set(window.db.collection('montagem').doc(), {
          imageUrl,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });
      await batch.commit();
      showToast(urls.length > 1 ? `${urls.length} fotos adicionadas!` : 'Foto adicionada!');
      loadMontagemList();
    } catch (err) {
      showToast('Ocorreu um erro ao salvar. Tente novamente.', 'error');
      console.error(err);
    } finally {
      setDropzoneBusy(zone, 0, 0);
    }
  });
}

function setupMontagemImport() {
  const btn = document.getElementById('montagem-import-btn');
  btn.addEventListener('click', async () => {
    const confirmed = await showModal({
      title: 'Importar fotos da montagem',
      text: 'Isso importa as fotos fixas do site para o painel. Confirme apenas se ainda não fez isso antes — repetir duplica as fotos.',
      confirmLabel: 'Importar',
    });
    if (!confirmed) return;

    btn.disabled = true;
    try {
      const batch = window.db.batch();
      EXISTING_MONTAGEM_PHOTOS.forEach((imageUrl) => {
        batch.set(window.db.collection('montagem').doc(), { imageUrl, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
      });
      await batch.commit();
      showToast('Fotos importadas!');
      loadMontagemList();
    } catch (err) {
      showToast('Ocorreu um erro ao importar.', 'error');
      console.error(err);
    } finally {
      btn.disabled = false;
    }
  });
}

async function loadMontagemList() {
  try {
    const snapshot = await window.db.collection('montagem').orderBy('createdAt', 'asc').get();
    cachedMontagemPhotos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    renderMontagemList();
    updateStats();
    document.getElementById('montagem-import-box').classList.toggle('admin-hidden', cachedMontagemPhotos.length > 0);
  } catch (err) {
    document.getElementById('montagem-list').innerHTML = '<p class="admin-empty">Não foi possível carregar as fotos.</p>';
    console.error(err);
  }
}

function renderMontagemList() {
  const listEl = document.getElementById('montagem-list');

  if (!cachedMontagemPhotos.length) {
    listEl.innerHTML = '<p class="admin-empty">Nenhuma foto cadastrada ainda.</p>';
    return;
  }

  listEl.innerHTML = `<div class="admin-photos">${cachedMontagemPhotos.map((photo) => `
    <div class="admin-photo" data-id="${escapeHtml(photo.id)}">
      <img src="${escapeHtml(photo.imageUrl)}" alt="Foto da montagem de festa" loading="lazy">
      <div class="admin-photo__actions">
        <label class="admin-icon-btn admin-icon-btn--glass" title="Trocar foto">
          ${icon('upload')}<span class="admin-sr">Trocar foto</span>
          <input type="file" accept="image/*" class="admin-file-input js-montagem-replace">
        </label>
        <button type="button" class="admin-icon-btn admin-icon-btn--glass admin-icon-btn--danger js-montagem-delete" aria-label="Excluir foto" title="Excluir">${icon('trash')}</button>
      </div>
    </div>
  `).join('')}</div>`;

  listEl.querySelectorAll('.admin-photo').forEach((card) => {
    const id = card.dataset.id;
    const input = card.querySelector('.js-montagem-replace');
    input.addEventListener('change', async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      card.classList.add('is-busy');
      try {
        const imageUrl = await uploadToCloudinary(file, 'montagem');
        await window.db.collection('montagem').doc(id).update({ imageUrl });
        showToast('Foto trocada!');
        loadMontagemList();
      } catch (err) {
        showToast('Não foi possível trocar essa foto.', 'error');
        console.error(err);
        card.classList.remove('is-busy');
      }
    });
    card.querySelector('.js-montagem-delete').addEventListener('click', () => deleteMontagemPhoto(id));
  });
}

async function deleteMontagemPhoto(id) {
  const confirmed = await showModal({
    title: 'Excluir foto',
    text: 'Excluir esta foto da montagem de festa? Essa ação não pode ser desfeita.',
    confirmLabel: 'Excluir',
    danger: true,
  });
  if (!confirmed) return;

  try {
    await window.db.collection('montagem').doc(id).delete();
    showToast('Foto excluída.');
    loadMontagemList();
  } catch (err) {
    showToast('Não foi possível excluir esta foto.', 'error');
    console.error(err);
  }
}

/* =========================================================
   SITE: TEXTOS E CONTATO (documento config/site)
   ========================================================= */
function cloneConfig(config) {
  return JSON.parse(JSON.stringify(config));
}

/* "61 99237-8041" -> "5561992378041" */
function normalizeWhatsapp(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length === 10 || digits.length === 11 ? `55${digits}` : digits;
}

/* "5561992378041" -> "(61) 99237-8041" */
function formatPhone(digits) {
  const local = String(digits || '').replace(/\D/g, '').replace(/^55/, '');
  if (local.length < 10) return local;
  const rest = local.slice(2);
  return `(${local.slice(0, 2)}) ${rest.slice(0, rest.length - 4)}-${rest.slice(-4)}`;
}

async function loadSiteConfig() {
  try {
    const doc = await window.db.collection('config').doc('site').get();
    siteConfig = { ...cloneConfig(DEFAULT_SITE_CONFIG), ...(doc.exists ? doc.data() : {}) };
  } catch (err) {
    siteConfig = cloneConfig(DEFAULT_SITE_CONFIG);
    showToast('Não foi possível carregar os textos do site. Confira se as regras do Firestore liberam a coleção “config”.', 'error');
    console.error(err);
  }
  renderSiteForm();
  renderHeroPreviews();
}

function setSiteDirty(dirty) {
  siteDirty = dirty;
  const status = document.getElementById('site-status');
  status.textContent = dirty ? 'Alterações não salvas' : 'Tudo salvo';
  status.classList.toggle('is-dirty', dirty);
}

function renderSiteForm() {
  const form = document.getElementById('site-form');
  form.querySelectorAll('[data-field]').forEach((input) => {
    const value = siteConfig[input.dataset.field] || '';
    input.value = input.dataset.field === 'whatsapp' ? formatPhone(value) : value;
  });
  ['locamos', 'steps', 'montagemBenefits'].forEach(renderSiteRows);
  setSiteDirty(false);
}

function renderSiteRows(list) {
  const container = document.querySelector(`.admin-rows[data-list="${list}"]`);
  const rows = siteConfig[list] || [];

  if (!rows.length) {
    container.innerHTML = '<p class="admin-empty">Nenhum item. Use o botão acima para adicionar.</p>';
    return;
  }

  container.innerHTML = rows.map((row, i) => {
    let fields;
    if (list === 'locamos') {
      fields = `
        <select data-key="icon" aria-label="Ícone">${Object.entries(ICON_OPTIONS).map(([key, label]) =>
          `<option value="${key}" ${row.icon === key ? 'selected' : ''}>${label}</option>`).join('')}</select>
        <input type="text" data-key="title" value="${escapeHtml(row.title)}" placeholder="Título" aria-label="Título">
        <textarea data-key="text" rows="2" placeholder="Descrição" aria-label="Descrição">${escapeHtml(row.text)}</textarea>`;
    } else if (list === 'steps') {
      fields = `
        <input type="text" data-key="title" value="${escapeHtml(row.title)}" placeholder="Título do passo" aria-label="Título do passo">
        <textarea data-key="text" rows="2" placeholder="Descrição" aria-label="Descrição">${escapeHtml(row.text)}</textarea>`;
    } else {
      fields = `<input type="text" value="${escapeHtml(row)}" placeholder="Benefício" aria-label="Benefício">`;
    }
    return `
      <div class="admin-row admin-row--${list}" data-index="${i}">
        ${list === 'steps' ? `<span class="admin-row__num">${i + 1}</span>` : ''}
        <div class="admin-row__fields">${fields}</div>
        <div class="admin-row__actions">
          <button type="button" class="admin-icon-btn js-row-move" data-dir="-1" aria-label="Mover para cima" ${i === 0 ? 'disabled' : ''}>${icon('up')}</button>
          <button type="button" class="admin-icon-btn js-row-move" data-dir="1" aria-label="Mover para baixo" ${i === rows.length - 1 ? 'disabled' : ''}>${icon('down')}</button>
          <button type="button" class="admin-icon-btn admin-icon-btn--danger js-row-remove" aria-label="Remover">${icon('trash')}</button>
        </div>
      </div>
    `;
  }).join('');
}

function setupSiteForm() {
  const form = document.getElementById('site-form');

  form.addEventListener('input', (e) => {
    const el = e.target;
    if (el.dataset.field) {
      siteConfig[el.dataset.field] = el.value;
    } else {
      const row = el.closest('.admin-row');
      if (!row) return;
      const list = row.closest('.admin-rows').dataset.list;
      const index = Number(row.dataset.index);
      if (list === 'montagemBenefits') siteConfig[list][index] = el.value;
      else siteConfig[list][index][el.dataset.key] = el.value;
    }
    setSiteDirty(true);
  });

  form.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.classList.contains('js-row-add')) {
      const list = btn.dataset.list;
      const empty = { locamos: { icon: 'estrela', title: '', text: '' }, steps: { title: '', text: '' }, montagemBenefits: '' }[list];
      siteConfig[list] = [...(siteConfig[list] || []), empty];
      renderSiteRows(list);
      const rows = form.querySelectorAll(`.admin-rows[data-list="${list}"] .admin-row`);
      const last = rows[rows.length - 1];
      if (last) last.querySelector('input').focus();
      setSiteDirty(true);
      return;
    }

    const row = btn.closest('.admin-row');
    if (!row) return;
    const list = row.closest('.admin-rows').dataset.list;
    const index = Number(row.dataset.index);
    const rows = siteConfig[list];

    if (btn.classList.contains('js-row-remove')) {
      rows.splice(index, 1);
    } else if (btn.classList.contains('js-row-move')) {
      const to = index + Number(btn.dataset.dir);
      if (to < 0 || to >= rows.length) return;
      [rows[index], rows[to]] = [rows[to], rows[index]];
    } else {
      return;
    }
    renderSiteRows(list);
    setSiteDirty(true);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const whatsapp = normalizeWhatsapp(siteConfig.whatsapp);
    if (whatsapp.length < 12) {
      showToast('Confira o número do WhatsApp: coloque o DDD e o número completo.', 'error');
      document.getElementById('cfg-whatsapp').focus();
      return;
    }

    const trim = (s) => String(s || '').trim();
    const data = {
      ...Object.fromEntries(Object.keys(DEFAULT_SITE_CONFIG)
        .filter((key) => !Array.isArray(DEFAULT_SITE_CONFIG[key]))
        .map((key) => [key, trim(siteConfig[key])])),
      whatsapp,
      instagram: trim(siteConfig.instagram).replace(/^@/, ''),
      locamos: siteConfig.locamos
        .map((r) => ({ icon: r.icon, title: trim(r.title), text: trim(r.text) }))
        .filter((r) => r.title),
      steps: siteConfig.steps
        .map((r) => ({ title: trim(r.title), text: trim(r.text) }))
        .filter((r) => r.title),
      montagemBenefits: siteConfig.montagemBenefits.map(trim).filter(Boolean),
    };

    const submit = document.getElementById('site-save');
    submit.disabled = true;
    try {
      await window.db.collection('config').doc('site').set({
        ...data,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      siteConfig = data;
      renderSiteForm();
      renderHeroPreviews();
      refreshSitePreview();
      showToast('Textos do site salvos!');
    } catch (err) {
      showToast('Não foi possível salvar. Confira se as regras do Firestore liberam a coleção “config”.', 'error');
      console.error(err);
    } finally {
      submit.disabled = false;
    }
  });

  window.addEventListener('beforeunload', (e) => {
    if (!siteDirty) return;
    e.preventDefault();
    e.returnValue = '';
  });
}

/* =========================================================
   ABAS DA TELA "TEXTOS E CONTATO"
   ========================================================= */
function setupSiteTabs() {
  const tabs = document.querySelectorAll('.admin-tabs button');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      document.querySelectorAll('.admin-site-section').forEach((section) => {
        section.classList.toggle('is-active', section.dataset.tab === tab.dataset.tab);
      });
    });
  });
}

/* =========================================================
   TUTORIAL GUIADO (destaca cada parte da tela, passo a passo)
   ========================================================= */
const TOURS = {
  inicio: [
    { target: '.admin-nav', title: 'Este é o menu', text: 'Por aqui você navega pelo painel. Em “Conteúdo do site” ficam as fotos; em “Configurações”, os textos e o contato.' },
    { target: '.admin-stats', title: 'Resumo do site', text: 'Quantas fotos e cenários estão no site agora. Clique em um quadrinho para ir direto àquela parte.' },
    { target: '.admin-overview', title: 'Topo do site', text: 'Uma amostra do carrossel, a primeira coisa que as clientes veem. Clique em “Gerenciar carrossel” para trocar as fotos.' },
    { target: '.admin-quick', title: 'Atalhos', text: 'Caminhos rápidos para as tarefas mais comuns: novo cenário, foto no carrossel e foto de montagem.' },
    { target: '.admin-help-btn', title: 'Ajuda sempre à mão', text: 'Toda tela tem um botão “Como usar”. Clique nele sempre que quiser rever este tutorial.' },
  ],
  carrossel: [
    { target: '#site-preview', title: 'Prévia real do site', text: 'É exatamente o que as clientes veem. Use “Computador” e “Celular” para ver nos dois tamanhos. Ela se atualiza sozinha depois de cada mudança.' },
    { target: '[data-dropzone="carrossel"]', title: 'Adicionar fotos', text: 'Arraste fotos para cá ou clique para escolher. Prefira fotos deitadas (horizontais), elas ficam melhores no topo do site.' },
    { target: '#carrossel-list', title: 'Suas fotos', text: 'A foto 1 é a capa. Arraste os cards ou use as setas ‹ › para mudar a ordem. O lápis troca a foto ou a descrição, e a lixeira exclui.' },
    { target: '.admin-help-btn', title: 'Pronto!', text: 'Se tiver dúvida, clique em “Como usar” para ver este passo a passo de novo.' },
  ],
  cenarios: [
    { target: '#new-cenario-btn', title: 'Novo cenário', text: 'Cadastre um cenário com título, categoria e fotos. A primeira foto vira a capa.' },
    { target: '.admin-toolbar', title: 'Buscar e filtrar', text: 'Procure um cenário pelo nome ou troque de categoria (Nossos cenários, Chá de Bebê…).' },
    { target: '#admin-list', title: 'Seus cenários', text: 'Arraste os cards ou use as setas para escolher a ordem no site. O olho esconde ou mostra o cenário sem apagar. O lápis edita fotos, título e a etiqueta “Novo” ou “Mais pedido”.' },
    { target: '.admin-help-btn', title: 'Pronto!', text: 'Clique em “Como usar” quando quiser rever este passo a passo.' },
  ],
  montagem: [
    { target: '[data-dropzone="montagem"]', title: 'Adicionar fotos', text: 'Arraste fotos de montagens para cá ou clique para escolher — pode ser várias de uma vez.' },
    { target: '#montagem-list', title: 'Suas fotos', text: 'Passe o mouse sobre uma foto (ou toque, no celular) para trocá-la ou excluí-la.' },
    { target: '.admin-help-btn', title: 'Pronto!', text: 'Clique em “Como usar” quando quiser rever este passo a passo.' },
  ],
  site: [
    { target: '.admin-tabs', title: 'Escolha o que editar', text: 'Cada aba é uma parte do site: contato e horários, topo, “O que locamos”, “Como funciona” e montagem.' },
    { target: '.admin-site-section.is-active', title: 'Edite os campos', text: 'Mude os textos à vontade. Nas listas, use as setas para reordenar, a lixeira para remover e o botão “Adicionar” para criar itens novos.' },
    { target: '.admin-savebar', title: 'Salvar', text: 'Quando terminar, clique em “Salvar alterações”. O aviso à esquerda mostra se ainda tem algo sem salvar.' },
  ],
};

let tourState = null;

function tourSeenKey(view) {
  return `tj-admin-tour-${view}`;
}

function tourWasSeen(view) {
  try { return localStorage.getItem(tourSeenKey(view)) === '1'; } catch (err) { return true; }
}

function markTourSeen(view) {
  try { localStorage.setItem(tourSeenKey(view), '1'); } catch (err) { /* sem armazenamento: só não lembra */ }
}

function currentView() {
  const active = document.querySelector('.admin-view.is-active');
  return active ? active.dataset.view : 'inicio';
}

function setupTours() {
  // Botão "Como usar" no cabeçalho de cada tela
  document.querySelectorAll('.admin-view').forEach((view) => {
    const header = view.querySelector('.admin-view__header');
    let actions = header.querySelector('.admin-view__actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'admin-view__actions';
      header.querySelectorAll(':scope > .btn').forEach((btn) => actions.appendChild(btn));
      header.appendChild(actions);
    }
    const help = document.createElement('button');
    help.type = 'button';
    help.className = 'admin-help-btn';
    help.innerHTML = `${icon('help')}Como usar`;
    help.addEventListener('click', () => startTour(view.dataset.view));
    actions.prepend(help);
  });

  document.getElementById('tour-sidebar-btn').addEventListener('click', () => startTour(currentView()));

  const tour = document.createElement('div');
  tour.className = 'admin-tour admin-hidden';
  tour.id = 'admin-tour';
  tour.innerHTML = `
    <div class="admin-tour__spot"></div>
    <div class="admin-tour__card" role="dialog" aria-modal="true" aria-labelledby="admin-tour-title">
      <div class="admin-tour__progress"></div>
      <h3 class="admin-tour__title" id="admin-tour-title"></h3>
      <p class="admin-tour__text"></p>
      <div class="admin-tour__actions">
        <button type="button" class="admin-tour__skip">Pular tutorial</button>
        <span class="admin-spacer"></span>
        <button type="button" class="btn btn--outline admin-tour__back">Voltar</button>
        <button type="button" class="btn btn--primary admin-tour__next">Próximo</button>
      </div>
    </div>
  `;
  document.body.appendChild(tour);

  tour.querySelector('.admin-tour__skip').addEventListener('click', endTour);
  tour.querySelector('.admin-tour__back').addEventListener('click', () => showTourStep(tourState.index - 1));
  tour.querySelector('.admin-tour__next').addEventListener('click', () => {
    if (tourState.index >= tourState.steps.length - 1) endTour();
    else showTourStep(tourState.index + 1);
  });
  document.addEventListener('keydown', (e) => {
    if (!tourState) return;
    if (e.key === 'Escape') endTour();
    if (e.key === 'ArrowRight') tour.querySelector('.admin-tour__next').click();
    if (e.key === 'ArrowLeft' && tourState.index > 0) showTourStep(tourState.index - 1);
  });
  window.addEventListener('resize', () => { if (tourState) positionTour(); });
}

/* Na primeira vez que cada tela é aberta, o tutorial começa sozinho */
function maybeAutoStartTour(view) {
  if (tourWasSeen(view)) return;
  setTimeout(() => {
    const drawerOpen = document.getElementById('admin-drawer-overlay').classList.contains('is-open');
    if (!tourState && !drawerOpen && currentView() === view) startTour(view);
  }, 900);
}

function findTourTarget(selector) {
  const view = document.querySelector('.admin-view.is-active');
  const candidates = [...(view ? view.querySelectorAll(selector) : []), ...document.querySelectorAll(selector)];
  return candidates.find((el) => el.getClientRects().length > 0) || null;
}

function startTour(view) {
  const steps = (TOURS[view] || []).filter((step) => findTourTarget(step.target));
  if (!steps.length) return;
  tourState = { view, steps, index: 0 };
  document.getElementById('admin-tour').classList.remove('admin-hidden');
  document.body.classList.add('admin-no-scroll');
  showTourStep(0);
}

function showTourStep(index) {
  const { steps } = tourState;
  tourState.index = Math.max(0, Math.min(index, steps.length - 1));
  const step = steps[tourState.index];
  const tour = document.getElementById('admin-tour');

  tour.querySelector('.admin-tour__progress').innerHTML =
    `<span>Passo ${tourState.index + 1} de ${steps.length}</span>${steps.map((_, i) => `<i class="${i <= tourState.index ? 'is-done' : ''}"></i>`).join('')}`;
  tour.querySelector('.admin-tour__title').textContent = step.title;
  tour.querySelector('.admin-tour__text').textContent = step.text;
  tour.querySelector('.admin-tour__back').style.visibility = tourState.index === 0 ? 'hidden' : '';
  tour.querySelector('.admin-tour__next').textContent = tourState.index === steps.length - 1 ? 'Concluir' : 'Próximo';

  const target = findTourTarget(step.target);
  tourState.target = target;
  if (target) {
    document.body.classList.remove('admin-no-scroll');
    target.scrollIntoView({ block: 'center', behavior: 'auto' });
    document.body.classList.add('admin-no-scroll');
  }
  positionTour();
  tour.querySelector('.admin-tour__next').focus();
}

function positionTour() {
  const tour = document.getElementById('admin-tour');
  const spot = tour.querySelector('.admin-tour__spot');
  const card = tour.querySelector('.admin-tour__card');
  const target = tourState.target;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 8;
  const gap = 16;

  if (!target) {
    spot.style.cssText = 'top:50%;left:50%;width:0;height:0;';
    card.style.left = `${(vw - card.offsetWidth) / 2}px`;
    card.style.top = `${(vh - card.offsetHeight) / 2}px`;
    return;
  }

  const r = target.getBoundingClientRect();
  const top = Math.max(r.top - pad, 8);
  const bottom = Math.min(r.bottom + pad, vh - 8);
  spot.style.cssText = `top:${top}px;left:${r.left - pad}px;width:${r.width + pad * 2}px;height:${Math.max(bottom - top, 0)}px;`;

  const cw = card.offsetWidth;
  const ch = card.offsetHeight;
  let cardTop;
  let cardLeft;
  if (bottom + gap + ch <= vh) {
    cardTop = bottom + gap; // abaixo
    cardLeft = r.left;
  } else if (top - gap - ch >= 0) {
    cardTop = top - gap - ch; // acima
    cardLeft = r.left;
  } else if (r.right + pad + gap + cw <= vw) {
    cardTop = top; // à direita (ex.: menu lateral)
    cardLeft = r.right + pad + gap;
  } else {
    cardTop = vh - ch - gap; // sem espaço: fica no rodapé da tela, por cima
    cardLeft = (vw - cw) / 2;
  }
  card.style.top = `${Math.max(gap, Math.min(cardTop, vh - ch - gap))}px`;
  card.style.left = `${Math.max(gap, Math.min(cardLeft, vw - cw - gap))}px`;
}

function endTour() {
  if (!tourState) return;
  markTourSeen(tourState.view);
  tourState = null;
  document.getElementById('admin-tour').classList.add('admin-hidden');
  document.body.classList.remove('admin-no-scroll');
}
