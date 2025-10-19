// Config
const BRANCH = 'main'; // adjust if needed
const POSTS_INDEX = 'Data/posts.json'; // JSON describing categories & docs

// State
let indexData = null;
let fuse = null;

// UI helpers
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function setExpanded(item, expanded) {
  item.setAttribute('aria-expanded', String(expanded));
  const trigger = item.querySelector(':scope > .accordion-trigger');
  const panel = item.querySelector(':scope > .accordion-panel');
  if (trigger) trigger.setAttribute('aria-expanded', String(expanded));
  if (panel) panel.style.maxHeight = expanded ? panel.scrollHeight + 'px' : '0px';
}

// Init accordion default open
document.addEventListener('DOMContentLoaded', () => {
  // Syntax highlight
  hljs.highlightAll();

  // Home link behavior
  $('#home-link').addEventListener('click', (e) => {
    e.preventDefault();
    showHome();
  });

  // Accordion expand
  $all('.accordion-item').forEach((item) => {
    const trigger = item.querySelector(':scope > .accordion-trigger');
    const panel = item.querySelector(':scope > .accordion-panel');
    if (panel) panel.style.maxHeight = '0px';
    if (trigger) {
      trigger.addEventListener('click', () => {
        const expanded = item.getAttribute('aria-expanded') === 'true';
        setExpanded(item, !expanded);
      });
    }
  });

  // Load categories + build search
  loadIndex().then(() => {
    buildCategories();
    buildSearch();
  });
});

// Load JSON index
async function loadIndex() {
  const res = await fetch(POSTS_INDEX);
  indexData = await res.json();
}

// Build categories (level-2)
function buildCategories() {
  const panel = $('#panel-devnotes');
  panel.innerHTML = '';

  const devNotes = indexData['开发笔记'];
  const categories = Object.keys(devNotes);

  categories.forEach((cat) => {
    const catItem = document.createElement('div');
    catItem.className = 'category-item';
    catItem.innerHTML = `
      <span>📂 ${cat}</span>
      <span class="muted">(${devNotes[cat].length})</span>
    `;
    catItem.addEventListener('click', () => buildDocs(cat));
    panel.appendChild(catItem);
  });

  // Expand the first category by default
  if (categories.length) buildDocs(categories[0]);
}

// Build docs (level-3)
function buildDocs(category) {
  const panel = $('#panel-devnotes');

  // Remove existing doc lists
  $all('.doc-list', panel).forEach(ul => ul.remove());

  // Create list for selected category
  const ul = document.createElement('ul');
  ul.className = 'doc-list';

  const docs = indexData['开发笔记'][category];
  docs.forEach((docPath) => {
    const name = docPath.replace(/\.md$/i, '').split('/').pop();
    const li = document.createElement('li');
    li.textContent = `📄 ${name}`;
    li.title = docPath;
    li.addEventListener('click', () => loadMarkdown(docPath));
    ul.appendChild(li);
  });

  panel.appendChild(ul);
}

// Show home view
function showHome() {
  $('#doc-view').classList.add('hidden');
  $('#home-view').classList.remove('hidden');
}

// Load & render MD to content
async function loadMarkdown(docPath) {
  $('#home-view').classList.add('hidden');
  const article = $('#doc-view');
  article.classList.remove('hidden');

  // Render loading skeleton
  article.innerHTML = `
    <div class="muted" style="margin-bottom:10px;">加载中… ${docPath}</div>
    <div class="skeleton">
      <div style="height:18px;width:60%;background:#12161d;border-radius:8px;margin:8px 0;"></div>
      <div style="height:14px;width:95%;background:#12161d;border-radius:8px;margin:6px 0;"></div>
      <div style="height:14px;width:85%;background:#12161d;border-radius:8px;margin:6px 0;"></div>
      <div style="height:14px;width:90%;background:#12161d;border-radius:8px;margin:6px 0;"></div>
    </div>
  `;

  // Fetch markdown (supports local folder posts/)
  const res = await fetch(docPath.startsWith('posts/') ? docPath : `posts/${docPath}`);
  const text = await res.text();

  // Render
  article.innerHTML = marked.parse(text);

  // Re-run highlight for newly inserted code blocks
  $all('pre code', article).forEach(block => hljs.highlightElement(block));

  // Scroll to top smoothly
  article.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Build fuzzy search (Fuse.js)
function buildSearch() {
  const devNotes = indexData['开发笔记'];
  const docs = [];

  Object.keys(devNotes).forEach(cat => {
    devNotes[cat].forEach(path => {
      docs.push({
        title: path.replace(/\.md$/i, '').split('/').pop(),
        category: cat,
        path
      });
    });
  });

  fuse = new Fuse(docs, {
    keys: ['title', 'category'],
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 1
  });

  const input = $('#search-input');
  const list = $('#search-results');

  input.addEventListener('input', (e) => {
    const q = e.target.value.trim();
    if (!q) { list.classList.remove('active'); list.innerHTML = ''; return; }
    const results = fuse.search(q).slice(0, 10);

    list.innerHTML = '';
    results.forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${r.item.title}</strong> <span class="muted">(${r.item.category})</span>`;
      li.addEventListener('click', () => {
        input.value = '';
        list.classList.remove('active');
        list.innerHTML = '';
        loadMarkdown(r.item.path);
      });
      list.appendChild(li);
    });

    list.classList.toggle('active', results.length > 0);
  });

  // Close results on blur
  input.addEventListener('blur', () => {
    setTimeout(() => { list.classList.remove('active'); }, 150);
  });
}
