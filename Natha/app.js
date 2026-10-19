(() => {
  'use strict';
  const works = window.NATHA_WORKS || [];
  const gallery = document.getElementById('gallery');
  const artDialog = document.getElementById('art-dialog');
  const artImage = document.getElementById('art-full');
  const artCaption = document.getElementById('art-caption');
  let visibleWorks = [...works];
  let currentArtwork = 0;
  let toastTimer;

  function syncScrollLock() {
    document.body.classList.toggle('has-modal', Boolean(document.querySelector('dialog[open]')));
  }

  function openDialog(dialog) {
    if (!dialog || dialog.open) return;
    dialog.showModal();
    syncScrollLock();
  }

  document.querySelectorAll('[data-open]').forEach(button => {
    button.addEventListener('click', () => openDialog(document.getElementById(button.dataset.open)));
  });

  document.querySelectorAll('dialog').forEach(dialog => {
    dialog.querySelectorAll('[data-close]').forEach(button => {
      button.addEventListener('click', () => dialog.close());
    });
    dialog.addEventListener('close', syncScrollLock);
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
  });

  function showArtwork(index) {
    if (!visibleWorks.length) return;
    currentArtwork = (index + visibleWorks.length) % visibleWorks.length;
    const item = visibleWorks[currentArtwork];
    artImage.src = item.src;
    artImage.alt = item.alt;
    artCaption.textContent = `${item.title} · Natha.tat (${currentArtwork + 1} / ${visibleWorks.length})`;
  }

  function openArtwork(index) {
    showArtwork(index);
    openDialog(artDialog);
  }

  function renderGallery(filter = 'all') {
    visibleWorks = works.filter(item => filter === 'all' || item.category === filter);
    const fragment = document.createDocumentFragment();
    visibleWorks.forEach((item, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'work-item';
      button.setAttribute('aria-label', `Enlarge ${item.title}`);
      const frame = document.createElement('div');
      frame.className = 'work-image';
      const image = document.createElement('img');
      image.src = item.thumb;
      image.alt = item.alt;
      image.width = 480;
      image.height = 600;
      image.loading = 'lazy';
      image.decoding = 'async';
      frame.append(image);
      const title = document.createElement('span');
      title.className = 'work-title';
      title.textContent = item.title;
      const category = document.createElement('span');
      category.className = 'work-category';
      category.textContent = item.category === 'ink' ? 'Tattoo' : 'Art & illustration';
      button.append(frame, title, category);
      button.addEventListener('click', () => openArtwork(index));
      fragment.append(button);
    });
    gallery.replaceChildren(fragment);
    gallery.setAttribute('aria-label', `${visibleWorks.length} selected works`);
  }

  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-filter]').forEach(other => {
        const selected = other === button;
        other.classList.toggle('is-active', selected);
        other.setAttribute('aria-pressed', String(selected));
      });
      renderGallery(button.dataset.filter);
    });
  });

  document.querySelector('.art-prev').addEventListener('click', () => showArtwork(currentArtwork - 1));
  document.querySelector('.art-next').addEventListener('click', () => showArtwork(currentArtwork + 1));
  artDialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); showArtwork(currentArtwork - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); showArtwork(currentArtwork + 1); }
  });
  let touchStart = null;
  artImage.addEventListener('touchstart', event => {
    if (event.touches.length === 1) touchStart = {x: event.touches[0].clientX, y: event.touches[0].clientY};
    else touchStart = null;
  }, {passive: true});
  artImage.addEventListener('touchend', event => {
    if (!touchStart || !event.changedTouches.length) return;
    const deltaX = event.changedTouches[0].clientX - touchStart.x;
    const deltaY = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) showArtwork(currentArtwork + (deltaX < 0 ? 1 : -1));
    touchStart = null;
  }, {passive: true});

  function toast(message) {
    const element = document.getElementById('toast');
    clearTimeout(toastTimer);
    element.textContent = message;
    element.hidden = false;
    toastTimer = setTimeout(() => { element.hidden = true; }, 4200);
  }

  async function copyLink(url) {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      toast('Card link copied. Share a little art.');
    } catch {
      toast('Use your browser’s share button to send this card.');
    }
  }

  document.querySelector('.share-button').addEventListener('click', async () => {
    const url = /^https?:$/.test(location.protocol) ? location.href.split('#')[0] : 'https://nathatat.com/';
    if (navigator.share) {
      try {
        await navigator.share({title: 'Natha.tat — Ink & Art', text: 'Tattoos, illustration and original art by Nathaly.', url});
      } catch (error) {
        if (error.name !== 'AbortError') await copyLink(url);
      }
    } else await copyLink(url);
  });


  window.NathaGallery = {open(filter = 'all', src) {
    renderGallery(filter);
    document.querySelectorAll('[data-filter]').forEach(button => {
      const selected = button.dataset.filter === filter;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    if (src) openArtwork(Math.max(0, visibleWorks.findIndex(item => item.src === src)));
    else openDialog(document.getElementById('work-dialog'));
  }};
  renderGallery();
})();
