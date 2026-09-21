/* =========================================================
   Très Jolie Festas — admin.js
   Painel para adicionar, editar e excluir cenários (fotos + título)
   exibidos nas seções "Nossos cenários" e "Chá de Bebê" do site.
   ========================================================= */

/* Cenários que já estão fixos no HTML do site, usados apenas pelo
   botão "Importar cenários já existentes" para trazê-los para o
   Firebase na primeira vez que o painel for usado. */
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

document.addEventListener('DOMContentLoaded', () => {
  if (!window.auth || !window.db) {
    document.getElementById('login-msg').textContent =
      'O Firebase ainda não foi configurado (arquivo firebase-config.js). Preencha as chaves do seu projeto antes de usar o painel.';
    return;
  }
  if (!window.CLOUDINARY_CLOUD_NAME || window.CLOUDINARY_CLOUD_NAME === 'SEU_CLOUD_NAME') {
    document.getElementById('login-msg').textContent =
      'O Cloudinary ainda não foi configurado (arquivo firebase-config.js). Preencha CLOUDINARY_CLOUD_NAME e CLOUDINARY_UPLOAD_PRESET antes de usar o painel.';
    return;
  }

  const loginSection = document.getElementById('admin-login');
  const dashboard = document.getElementById('admin-dashboard');
  const loginForm = document.getElementById('login-form');
  const loginMsg = document.getElementById('login-msg');
  const logoutBtn = document.getElementById('logout-btn');

  window.auth.onAuthStateChanged((user) => {
    if (user) {
      loginSection.classList.add('admin-hidden');
      dashboard.classList.remove('admin-hidden');
      loadList();
    } else {
      loginSection.classList.remove('admin-hidden');
      dashboard.classList.add('admin-hidden');
    }
  });

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginMsg.textContent = '';
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
      loginMsg.textContent = messages[err.code] || `Não foi possível entrar (${err.code || err.message}).`;
    }
  });

  const passwordInput = document.getElementById('login-password');
  const passwordToggle = document.getElementById('login-password-toggle');
  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener('click', () => {
      const isVisible = passwordInput.type === 'text';
      passwordInput.type = isVisible ? 'password' : 'text';
      passwordToggle.classList.toggle('is-visible', !isVisible);
      passwordToggle.setAttribute('aria-label', isVisible ? 'Mostrar senha' : 'Ocultar senha');
    });
  }

  logoutBtn.addEventListener('click', () => window.auth.signOut());

  setupAddForm();
  setupImport();
  setupFilters();
  setupAddToggle();
});

/* ---------- Colapsar/expandir "Adicionar cenário" ---------- */
function setupAddToggle() {
  const toggle = document.getElementById('add-cenario-toggle');
  const content = document.getElementById('add-cenario-content');
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    content.classList.toggle('admin-hidden', isOpen);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

/* ---------- Modal de confirmação/alerta ---------- */
function showModal({ title, text, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar', danger = false, alertOnly = false }) {
  return new Promise((resolve) => {
    const overlay = document.getElementById('admin-modal-overlay');
    const modal = document.getElementById('admin-modal');
    const titleEl = document.getElementById('admin-modal-title');
    const textEl = document.getElementById('admin-modal-text');
    const confirmBtn = document.getElementById('admin-modal-confirm');
    const cancelBtn = document.getElementById('admin-modal-cancel');

    titleEl.textContent = title;
    textEl.textContent = text;
    confirmBtn.textContent = alertOnly ? 'OK' : confirmLabel;
    cancelBtn.textContent = cancelLabel;
    modal.classList.toggle('admin-modal--danger', danger);
    modal.classList.toggle('admin-modal--alert', alertOnly);
    overlay.classList.remove('admin-hidden');

    function cleanup(result) {
      overlay.classList.add('admin-hidden');
      confirmBtn.removeEventListener('click', onConfirm);
      cancelBtn.removeEventListener('click', onCancel);
      overlay.removeEventListener('click', onOverlay);
      resolve(result);
    }
    function onConfirm() { cleanup(true); }
    function onCancel() { cleanup(false); }
    function onOverlay(e) { if (e.target === overlay) cleanup(false); }

    confirmBtn.addEventListener('click', onConfirm);
    cancelBtn.addEventListener('click', onCancel);
    overlay.addEventListener('click', onOverlay);
  });
}

function showAlert(title, text) {
  return showModal({ title, text, alertOnly: true });
}

/* ---------- Categorias ---------- */
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

function refreshAddCategoryOptions() {
  const select = document.getElementById('add-category');
  const current = select.value;
  select.innerHTML = categoryOptionsHtml();
  if (Array.from(select.options).some((o) => o.value === current)) select.value = current;
}

function setupCategoryToggle(selectEl, newCategoryWrap, newCategoryInput) {
  selectEl.addEventListener('change', () => {
    const isNew = selectEl.value === '__new__';
    newCategoryWrap.classList.toggle('admin-hidden', !isNew);
    if (isNew) newCategoryInput.focus();
  });
}

function resolveCategory(selectEl, newCategoryInput) {
  if (selectEl.value === '__new__') return newCategoryInput.value.trim();
  return selectEl.value;
}

/* ---------- Adicionar cenário ---------- */
function setupAddForm() {
  const form = document.getElementById('add-form');
  const titleInput = document.getElementById('add-title');
  const categoryInput = document.getElementById('add-category');
  const newCategoryWrap = document.getElementById('add-new-category-wrap');
  const newCategoryInput = document.getElementById('add-new-category');
  const filesInput = document.getElementById('add-photos');
  const submitBtn = document.getElementById('add-submit');
  const progress = document.getElementById('add-progress');
  const msg = document.getElementById('add-msg');
  const filesLabel = document.getElementById('add-photos-label');

  setupCategoryToggle(categoryInput, newCategoryWrap, newCategoryInput);

  filesInput.addEventListener('change', () => {
    const count = filesInput.files.length;
    if (!count) {
      filesLabel.textContent = 'Clique para escolher as fotos';
    } else if (count === 1) {
      filesLabel.textContent = filesInput.files[0].name;
    } else {
      filesLabel.textContent = `${count} fotos selecionadas`;
    }
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = titleInput.value.trim();
    const category = resolveCategory(categoryInput, newCategoryInput);
    const files = Array.from(filesInput.files || []);

    if (!title || !category || !files.length) return;

    submitBtn.disabled = true;
    msg.textContent = '';
    msg.className = 'admin-msg';

    try {
      const photos = [];
      for (let i = 0; i < files.length; i += 1) {
        progress.textContent = `Enviando foto ${i + 1} de ${files.length}...`;
        photos.push(await uploadToCloudinary(files[i]));
      }

      await window.db.collection('cenarios').add({
        title,
        category,
        photos,
        imageUrl: photos[0],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      progress.textContent = '';
      msg.textContent = 'Cenário salvo com sucesso!';
      msg.classList.add('admin-msg--success');
      form.reset();
      filesLabel.textContent = 'Clique para escolher as fotos';
      newCategoryWrap.classList.add('admin-hidden');
      loadList();
    } catch (err) {
      progress.textContent = '';
      msg.textContent = 'Ocorreu um erro ao salvar. Tente novamente.';
      msg.classList.add('admin-msg--error');
      console.error(err);
    } finally {
      submitBtn.disabled = false;
    }
  });
}

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', window.CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', 'cenarios');

  const res = await fetch(`https://api.cloudinary.com/v1_1/${window.CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });
  const json = await res.json();
  if (!json.secure_url) throw new Error('Falha no upload da imagem para o Cloudinary');
  return json.secure_url;
}

/* ---------- Importar cenários já existentes no site ---------- */
function setupImport() {
  const btn = document.getElementById('import-btn');
  const msg = document.getElementById('import-msg');

  btn.addEventListener('click', async () => {
    const confirmed = await showModal({
      title: 'Importar cenários do site',
      text: 'Isso importa os cenários fixos do site para o painel. Confirme apenas se ainda não fez isso antes — clicar de novo depois duplica os itens.',
      confirmLabel: 'Importar',
    });
    if (!confirmed) return;

    btn.disabled = true;
    msg.textContent = 'Importando...';
    msg.className = 'admin-msg';

    try {
      // Agrupa fotos com o mesmo título e categoria em um único cenário com várias fotos
      const grouped = new Map();
      EXISTING_SITE_ITEMS.forEach((item) => {
        const key = `${item.category}::${item.title}`;
        if (!grouped.has(key)) grouped.set(key, { title: item.title, category: item.category, photos: [] });
        grouped.get(key).photos.push(item.imageUrl);
      });
      const groups = Array.from(grouped.values());

      const batchSize = 400; // limite de segurança por lote
      for (let i = 0; i < groups.length; i += batchSize) {
        const batch = window.db.batch();
        groups.slice(i, i + batchSize).forEach((group) => {
          const ref = window.db.collection('cenarios').doc();
          batch.set(ref, {
            title: group.title,
            category: group.category,
            photos: group.photos,
            imageUrl: group.photos[0],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          });
        });
        await batch.commit();
      }
      msg.textContent = 'Cenários importados com sucesso!';
      msg.classList.add('admin-msg--success');
      loadList();
    } catch (err) {
      msg.textContent = 'Ocorreu um erro ao importar.';
      msg.classList.add('admin-msg--error');
      console.error(err);
    } finally {
      btn.disabled = false;
    }
  });
}

/* ---------- Lista, edição e exclusão ---------- */
let currentFilter = 'cenarios';
let cachedItems = [];

function renderFilterButtons() {
  const filterEl = document.querySelector('.admin-filter');
  const categories = getKnownCategories();
  if (!categories.includes(currentFilter)) currentFilter = categories[0];

  const buttons = categories.map((c) => ({ key: c, label: CATEGORY_LABELS[c] || c }));
  filterEl.innerHTML = buttons.map((b) =>
    `<button type="button" class="${b.key === currentFilter ? 'is-active' : ''}" data-filter="${escapeHtml(b.key)}">${escapeHtml(b.label)}</button>`
  ).join('');
}

function setupFilters() {
  document.querySelector('.admin-filter').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    document.querySelectorAll('.admin-filter button').forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    currentFilter = btn.dataset.filter;
    renderList();
  });
}

async function loadList() {
  const listEl = document.getElementById('admin-list');
  listEl.innerHTML = '<p class="admin-empty">Carregando...</p>';

  try {
    const snapshot = await window.db.collection('cenarios').orderBy('createdAt', 'desc').get();
    cachedItems = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    renderFilterButtons();
    renderList();
    refreshAddCategoryOptions();
    document.getElementById('admin-import-box').classList.toggle('admin-hidden', cachedItems.length > 0);
  } catch (err) {
    listEl.innerHTML = '<p class="admin-empty">Não foi possível carregar os cenários.</p>';
    console.error(err);
  }
}

const CATEGORY_LABELS = { cenarios: 'Nossos cenários', 'cha-de-bebe': 'Chá de Bebê' };

function getItemPhotos(item) {
  return item.photos && item.photos.length ? item.photos : (item.imageUrl ? [item.imageUrl] : []);
}

function renderItemCard(item) {
  const photos = getItemPhotos(item);
  return `
    <div class="admin-item" data-id="${item.id}">
      <div class="admin-item__thumb">
        <img src="${photos[0] || ''}" alt="${escapeHtml(item.title)}">
        ${photos.length > 1 ? `<span class="admin-item__count">${photos.length} fotos</span>` : ''}
      </div>
      <p class="admin-item__category">${CATEGORY_LABELS[item.category] || item.category}</p>
      <p class="admin-item__title">${escapeHtml(item.title)}</p>
      <div class="admin-item__actions">
        <button type="button" class="admin-btn-edit js-edit">Editar</button>
        <button type="button" class="admin-btn-delete js-delete">Excluir</button>
      </div>
    </div>
  `;
}

function wireItemButtons(container) {
  container.querySelectorAll('.js-edit').forEach((btn) => {
    btn.addEventListener('click', () => {
      const itemEl = btn.closest('.admin-item');
      const item = cachedItems.find((i) => i.id === itemEl.dataset.id);
      if (item) showEditOnly(item);
    });
  });
  container.querySelectorAll('.js-delete').forEach((btn) => {
    btn.addEventListener('click', () => deleteItem(btn.closest('.admin-item').dataset.id));
  });
}

function showEditOnly(item) {
  const listEl = document.getElementById('admin-list');
  listEl.innerHTML = `<div class="admin-item admin-item--editing" data-id="${item.id}"></div>`;
  openEdit(listEl.querySelector('.admin-item'), item);
}

function renderList() {
  const listEl = document.getElementById('admin-list');
  const items = cachedItems.filter((i) => i.category === currentFilter);

  if (!items.length) {
    listEl.innerHTML = '<p class="admin-empty">Nenhum cenário cadastrado nessa categoria ainda.</p>';
    return;
  }

  listEl.innerHTML = `<div class="admin-list-grid">${items.map(renderItemCard).join('')}</div>`;
  wireItemButtons(listEl);
}

function openEdit(itemEl, item) {
  const photos = getItemPhotos(item);

  itemEl.innerHTML = `
    <p class="admin-edit-label">Editando:</p>
    <div class="admin-edit-photos js-edit-photos"></div>
    <label class="admin-file-picker admin-file-picker--sm">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M12 4l-4 4M12 4l4 4"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>
      <span class="js-edit-add-label">Adicionar mais fotos</span>
      <input type="file" class="js-edit-add-photos admin-file-input" accept="image/*" multiple>
    </label>
    <form class="admin-edit-form js-edit-form">
      <div class="admin-field">
        <label>Título</label>
        <input type="text" class="js-edit-title" value="${escapeHtml(item.title)}" required>
      </div>
      <div class="admin-field">
        <label>Onde aparece</label>
        <select class="js-edit-category">${categoryOptionsHtml(item.category)}</select>
      </div>
      <div class="admin-field admin-hidden js-edit-new-category-wrap">
        <label>Nome da nova categoria</label>
        <input type="text" class="js-edit-new-category" placeholder="Ex.: Aniversário Adulto">
      </div>
      <div class="admin-item__actions">
        <button type="submit" class="admin-btn-edit">Salvar</button>
        <button type="button" class="admin-btn-delete js-cancel">Cancelar</button>
      </div>
      <p class="admin-msg js-edit-msg"></p>
    </form>
  `;

  function renderPhotosStrip() {
    const stripEl = itemEl.querySelector('.js-edit-photos');
    stripEl.innerHTML = photos.map((url, i) => `
      <div class="admin-edit-photo">
        <img src="${url}" alt="Foto ${i + 1} de ${escapeHtml(item.title)}">
        <button type="button" class="admin-edit-photo__remove js-remove-photo" data-index="${i}" aria-label="Remover esta foto" ${photos.length <= 1 ? 'disabled' : ''}>&times;</button>
      </div>
    `).join('');
    stripEl.querySelectorAll('.js-remove-photo').forEach((btn) => {
      btn.addEventListener('click', () => {
        if (photos.length <= 1) return;
        photos.splice(Number(btn.dataset.index), 1);
        renderPhotosStrip();
      });
    });
  }
  renderPhotosStrip();

  const addPhotosInput = itemEl.querySelector('.js-edit-add-photos');
  const addLabel = itemEl.querySelector('.js-edit-add-label');
  addPhotosInput.addEventListener('change', async () => {
    const files = Array.from(addPhotosInput.files || []);
    if (!files.length) return;

    addPhotosInput.disabled = true;
    try {
      for (let i = 0; i < files.length; i += 1) {
        addLabel.textContent = `Enviando ${i + 1} de ${files.length}...`;
        photos.push(await uploadToCloudinary(files[i]));
      }
      renderPhotosStrip();
    } catch (err) {
      console.error(err);
    } finally {
      addLabel.textContent = 'Adicionar mais fotos';
      addPhotosInput.value = '';
      addPhotosInput.disabled = false;
    }
  });

  const categorySelect = itemEl.querySelector('.js-edit-category');
  const newCategoryWrap = itemEl.querySelector('.js-edit-new-category-wrap');
  const newCategoryInput = itemEl.querySelector('.js-edit-new-category');
  setupCategoryToggle(categorySelect, newCategoryWrap, newCategoryInput);

  itemEl.querySelector('.js-cancel').addEventListener('click', () => renderList());

  itemEl.querySelector('.js-edit-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const msgEl = itemEl.querySelector('.js-edit-msg');
    const newTitle = itemEl.querySelector('.js-edit-title').value.trim();
    const newCategory = resolveCategory(categorySelect, newCategoryInput);

    if (!newTitle || !newCategory || !photos.length) return;

    try {
      await window.db.collection('cenarios').doc(item.id).update({
        title: newTitle,
        category: newCategory,
        photos,
        imageUrl: photos[0],
      });
      loadList();
    } catch (err) {
      msgEl.textContent = 'Erro ao salvar as alterações.';
      msgEl.classList.add('admin-msg--error');
      console.error(err);
    }
  });
}

async function deleteItem(id) {
  const item = cachedItems.find((i) => i.id === id);
  if (!item) return;

  const confirmed = await showModal({
    title: 'Excluir cenário',
    text: `Excluir "${item.title}"? Essa ação não pode ser desfeita.`,
    confirmLabel: 'Excluir',
    danger: true,
  });
  if (!confirmed) return;

  try {
    await window.db.collection('cenarios').doc(id).delete();
    loadList();
  } catch (err) {
    await showAlert('Erro ao excluir', 'Não foi possível excluir este cenário. Tente novamente.');
    console.error(err);
  }
}
