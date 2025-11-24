(function () {
  const root = document.documentElement;

  // Theme setup: prefer saved theme, else default to dark
  const savedTheme = localStorage.getItem('theme');
  const initialTheme = savedTheme || 'dark';
  applyTheme(initialTheme);

  const themeSwitch = document.getElementById('theme-switch');
  if (themeSwitch) {
    // initialize switch position
    themeSwitch.checked = (initialTheme === 'dark');
    themeSwitch.addEventListener('change', () => {
      const next = themeSwitch.checked ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem('theme', next); } catch (e) {}
    });
  }

  // Image upload handler
  const uploadForm = document.getElementById('upload-form');
  const uploadInput = document.getElementById('upload-input');
  const profileImg = document.getElementById('profile-img');

  // Load saved profile image path if present
  try {
    const savedImg = localStorage.getItem('profile-img');
    if (savedImg && profileImg) { profileImg.src = savedImg; }
  } catch (e) {}

  if (uploadForm && uploadInput && profileImg) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const file = uploadInput.files && uploadInput.files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);
      try {
        // Use same-origin if running server directly, else fallback to localhost:3000
        const base = window.location.origin.includes('127.0.0.1') || window.location.origin.includes('localhost')
          ? window.location.origin
          : 'http://localhost:3000';
        const res = await fetch(`${base}/upload`, { method: 'POST', body: formData });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        const newUrl = data.absolute || data.path;
        if (newUrl) {
          profileImg.src = newUrl;
          try { localStorage.setItem('profile-img', newUrl); } catch (e) {}
        }
      } catch (err) {
        alert('Upload failed. Make sure the Node server is running.');
      }
    });
  }

  function applyTheme(theme) {
    // Sync CSS variables theme
    root.setAttribute('data-theme', theme);
    // Ensure no leftover dark-theme class
    document.body.classList.remove('dark-theme');
    // Update button label/accessibility
    if (themeSwitch) { 
      themeSwitch.checked = (theme === 'dark');
      themeSwitch.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  }

  // Editable About section with persistence
  const aboutContent = document.getElementById('about-content');
  const editBtn = document.getElementById('about-edit');
  const cancelBtn = document.getElementById('about-cancel');
  let originalHTML = '';

  // Load saved About HTML if available
  try {
    const savedAbout = localStorage.getItem('about-html');
    if (savedAbout && aboutContent) {
      aboutContent.innerHTML = savedAbout;
    }
  } catch (e) {}

  if (editBtn && aboutContent && cancelBtn) {
    editBtn.addEventListener('click', () => {
      const isEditing = aboutContent.getAttribute('contenteditable') === 'true';
      if (!isEditing) {
        // Enter edit mode
        originalHTML = aboutContent.innerHTML;
        aboutContent.setAttribute('contenteditable', 'true');
        aboutContent.focus();
        placeCursorAtEnd(aboutContent);
        editBtn.textContent = 'Save';
        cancelBtn.hidden = false;
      } else {
        // Save and exit edit mode
        aboutContent.setAttribute('contenteditable', 'false');
        editBtn.textContent = 'Edit';
        cancelBtn.hidden = true;
        try { localStorage.setItem('about-html', aboutContent.innerHTML); } catch (e) {}
      }
    });

    cancelBtn.addEventListener('click', () => {
      const isEditing = aboutContent.getAttribute('contenteditable') === 'true';
      if (isEditing) {
        aboutContent.innerHTML = originalHTML;
        aboutContent.setAttribute('contenteditable', 'false');
        editBtn.textContent = 'Edit';
        cancelBtn.hidden = true;
      }
    });
  }

  function placeCursorAtEnd(element) {
    try {
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    } catch (e) {}
  }
})();


