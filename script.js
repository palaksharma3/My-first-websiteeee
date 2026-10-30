(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.add('js');
  const settings = window.PORTFOLIO || {};
  const setText = (selector, value) => {
    if (typeof value !== 'string') return;
    document.querySelectorAll(selector).forEach(node => { node.textContent = value; });
  };
  const safeUrl = (value, allowLocal = false) => {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, document.baseURI);
      if (url.protocol === 'https:' || url.protocol === 'http:') return url.href;
      if (allowLocal && url.protocol === 'file:' && !/^[a-z]+:/i.test(value)) return url.href;
    } catch { /* An incomplete edit must not break the rest of the page. */ }
    return null;
  };

  setText('[data-first-name]', settings.firstName);
  setText('[data-last-name]', settings.lastName);
  if (settings.firstName && settings.lastName) {
    setText('[data-full-name]', `${settings.firstName} ${settings.lastName}`);
  }
  setText('[data-role]', settings.role);
  setText('[data-description]', settings.description);
  setText('[data-year]', String(new Date().getFullYear()));
  if (Array.isArray(settings.about)) {
    document.querySelectorAll('[data-about]').forEach(container => {
      const paragraphs = settings.about.filter(text => typeof text === 'string').map(text => {
        const p = document.createElement('p');
        p.textContent = text;
        return p;
      });
      if (paragraphs.length) container.replaceChildren(...paragraphs);
    });
  }
  if (settings.socials) {
    document.querySelectorAll('[data-social]').forEach(link => {
      const url = safeUrl(settings.socials[link.dataset.social]);
      if (url) link.href = url;
      else link.hidden = true;
    });
  }
  document.querySelectorAll('[data-project]').forEach(article => {
    const project = settings.projects?.[article.dataset.project];
    if (!project) return;
    const title = article.querySelector('[data-project-title]');
    const description = article.querySelector('[data-project-description]');
    if (title && typeof project.title === 'string') title.textContent = project.title;
    if (description && typeof project.description === 'string') description.textContent = project.description;
    const period = article.querySelector('[data-project-period]');
    if (period && typeof project.period === 'string') period.textContent = project.period;
    const url = safeUrl(project.source);
    article.querySelectorAll('[data-project-source]').forEach(link => {
      link.hidden = !url;
      if (url) link.href = url;
    });
  });

  const cvUrl = safeUrl(settings.cvUrl, true);
  if (cvUrl) {
    document.querySelectorAll('[data-cv-download]').forEach(link => {
      link.href = cvUrl;
      link.hidden = false;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });
    document.querySelectorAll('[data-cv-pending]').forEach(node => { node.hidden = true; });
    setText('[data-cv-description]', 'Education, projects, and interests, in one place. Download a copy of my curriculum vitae.');
  }

  if (typeof settings.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
    setText('[data-email]', settings.email);
    document.querySelectorAll('[data-email-link]').forEach(link => { link.href = `mailto:${settings.email}`; });
    document.querySelectorAll('[data-email-copy]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', async () => {
        const status = button.closest('.copy-area')?.querySelector('[data-copy-status]');
        button.disabled = true;
        try {
          if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
          await navigator.clipboard.writeText(settings.email);
          if (status) status.textContent = 'Email copied.';
        } catch {
          if (status) status.textContent = 'Select and copy the address above.';
        } finally { button.disabled = false; }
      });
    });
  }

  if (Array.isArray(settings.achievements)) {
    document.querySelectorAll('[data-achievements]').forEach(list => {
      list.replaceChildren(...settings.achievements.map(item => {
        const row = document.createElement('li');
        row.className = 'achievement';
        const period = document.createElement('span');
        period.className = 'achievement-period';
        period.textContent = item.period || '';
        const main = document.createElement('div');
        main.className = 'achievement-main';
        const heading = document.createElement('h3');
        heading.textContent = item.title || '';
        const description = document.createElement('p');
        description.className = 'achievement-description';
        description.textContent = item.description || '';
        main.append(heading, description);
        const result = document.createElement('strong');
        result.className = 'achievement-result';
        result.textContent = item.result || '';
        row.append(period, main, result);
        return row;
      }));
    });
  }

  const writings = Array.isArray(settings.writings) ? settings.writings.filter(item => item && typeof item.title === 'string' && item.title.trim() && safeUrl(item.url, true)) : [];
  document.querySelectorAll('[data-writing-empty]').forEach(node => { node.hidden = writings.length > 0; });
  document.querySelectorAll('[data-writing-list]').forEach(list => {
    const limit = Number(list.dataset.writingLimit) || writings.length;
    list.hidden = writings.length === 0;
    list.replaceChildren(...writings.slice(0, limit).map(item => {
      const article = document.createElement('article');
      article.className = 'writing-entry';
      const link = document.createElement('a');
      link.href = safeUrl(item.url, true);
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      const text = document.createElement('div');
      const type = document.createElement('span');
      type.className = 'writing-type';
      type.textContent = item.type || 'Mathematical note';
      const title = document.createElement(document.body.dataset.page === 'writing' ? 'h2' : 'h3');
      title.textContent = item.title;
      text.append(type, title);
      if (typeof item.summary === 'string' && item.summary) {
        const summary = document.createElement('p');
        summary.textContent = item.summary;
        text.append(summary);
      }
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.classList.add('icon');
      svg.setAttribute('aria-hidden', 'true');
      const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      use.setAttribute('href', '#i-arrow');
      svg.append(use);
      link.append(text, svg);
      article.append(link);
      return article;
    }));
  });

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let savedMotion = null;
  try { savedMotion = sessionStorage.getItem('palak-motion'); } catch { /* Storage is optional for local previews. */ }
  let motionEnabled = savedMotion === null ? !reducedMotion.matches : savedMotion === 'on';
  const motionButtons = [...document.querySelectorAll('[data-motion-toggle]')];
  const updateMotion = () => {
    root.dataset.motion = motionEnabled ? 'on' : 'off';
    motionButtons.forEach(button => {
      const label = motionEnabled ? 'Pause animations' : 'Resume animations';
      button.hidden = false;
      button.setAttribute('aria-pressed', String(motionEnabled));
      button.setAttribute('aria-label', label);
      button.title = label;
      button.querySelector('use')?.setAttribute('href', motionEnabled ? '#i-pause' : '#i-play');
    });
    const hint = document.getElementById('study-hint');
    if (hint) hint.textContent = motionEnabled ? 'Move or touch to explore' : 'Still looks good standing still';
    document.dispatchEvent(new CustomEvent('portfolio:motionchange', { detail: { enabled: motionEnabled } }));
  };
  motionButtons.forEach(button => button.addEventListener('click', () => {
    motionEnabled = !motionEnabled;
    savedMotion = motionEnabled ? 'on' : 'off';
    try { sessionStorage.setItem('palak-motion', savedMotion); } catch { /* Keep the control usable without storage. */ }
    updateMotion();
  }));
  reducedMotion.addEventListener('change', event => {
    if (savedMotion === null) {
      motionEnabled = !event.matches;
      updateMotion();
    }
  });
  updateMotion();

  const navigation = document.getElementById('site-navigation');
  const menuButton = document.querySelector('.menu-toggle');
  if (navigation && menuButton) {
    const narrow = window.matchMedia('(max-width: 760px)');
    const closeMenu = () => {
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
    };
    const updateMenu = () => {
      menuButton.hidden = !narrow.matches;
      if (!narrow.matches) closeMenu();
    };
    updateMenu();
    narrow.addEventListener('change', updateMenu);
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      navigation.classList.toggle('is-open', open);
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuButton.focus();
      }
    });
    document.addEventListener('click', event => {
      if (!event.target.closest('.header-inner')) closeMenu();
    });
    if ('IntersectionObserver' in window) {
      const navLinks = [...navigation.querySelectorAll('[data-section-link]')];
      const sections = navLinks.map(link => document.getElementById(link.dataset.sectionLink)).filter(Boolean);
      const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          navLinks.forEach(link => {
            if (link.dataset.sectionLink === entry.target.id) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
          });
        });
      }, { rootMargin: '-15% 0px -55% 0px' });
      sections.forEach(section => sectionObserver.observe(section));
    }
  }

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const projects = [...document.querySelectorAll('[data-category]')];
  const filterStatus = document.getElementById('filter-status');
  if (filterButtons.length) {
    filterButtons.forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        filterButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        let count = 0;
        projects.forEach(project => {
          const show = filter === 'all' || project.dataset.category === filter;
          project.hidden = !show;
          if (show) count++;
        });
        if (filterStatus) filterStatus.textContent = filter === 'all' ? `Showing all ${count} projects` : `${count} project${count === 1 ? '' : 's'} in ${button.textContent.trim()}`;
      });
    });
  }

  const canvas = document.getElementById('motion-canvas');
  if (!canvas) return;
  const context = canvas.getContext('2d');
  if (!context) { canvas.hidden = true; return; }
  const surface = canvas.parentElement;
  const controls = document.querySelector('.study-controls');
  surface.classList.add('has-canvas');
  if (controls) controls.hidden = false;
  let width = 0;
  let height = 0;
  let frame = null;
  let visible = true;
  let previousTime = 0;
  let elapsed = 0;
  let lastPaint = 0;
  let shape = 'bloom';
  let previousShape = 'bloom';
  let morphStart = -2;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  const TAU = Math.PI * 2;

  const geometry = window.Geometry4D;
  if (!geometry) { canvas.hidden = true; surface.classList.remove('has-canvas'); if (controls) controls.hidden = true; return; }
  const models = {
    bloom: geometry.createTesseract(),
    orbit: geometry.create16Cell(),
    wave: geometry.createCliffordTorus(),
    waveSmall: geometry.createCliffordTorus(48, 20)
  };
  const modelFor = mode => mode === 'wave' && width < 430 ? models.waveSmall : models[mode];
  const updateDimensionLabel = () => {
    const model = modelFor(shape);
    setText('[data-dimension-name]', model.name);
    setText('[data-dimension-detail]', model.detail);
  };
  updateDimensionLabel();

  const paintModel = (model, opacity) => {
    if (opacity <= .001) return;
    const projected = model.vertices.map(vertex => geometry.project(vertex, elapsed, pointer.x, pointer.y));
    const extent = Math.max(1, ...projected.flatMap(point => [Math.abs(point[0]), Math.abs(point[1])]));
    const scale = Math.min(Math.min(width, height) * .22, Math.min(width, height) * .43 / extent);
    const points = projected.map(point => ({ x: width * .5 + point[0] * scale, y: height * .48 + point[1] * scale, z: point[2], factor: point[3] }));
    context.save();
    context.globalAlpha = opacity;

    if (model.kind === 'surface') {
      model.curves.forEach((curve, index) => {
        context.beginPath();
        curve.forEach((vertex, step) => { const p = points[vertex]; if (step === 0) context.moveTo(p.x, p.y); else context.lineTo(p.x, p.y); });
        context.strokeStyle = index < 28 ? 'rgba(216,175,255,.5)' : 'rgba(238,221,255,.22)';
        context.lineWidth = .8;
        context.stroke();
      });
      points.forEach((point, index) => {
        if (index % 4) return;
        context.beginPath();
        context.arc(point.x, point.y, .95 * point.factor, 0, TAU);
        context.fillStyle = `rgba(236,213,255,${Math.max(.25, .65 - point.z * .16)})`;
        context.fill();
      });
    } else {
      // Faces and edges come from the actual 4D polytope, not nested 3D cubes.
      const faces = model.faces.map(indices => ({ indices, depth: indices.reduce((sum, index) => sum + points[index].z, 0) / indices.length }));
      faces.sort((a, b) => b.depth - a.depth).forEach(face => {
        context.beginPath();
        face.indices.forEach((index, step) => { const p = points[index]; if (step === 0) context.moveTo(p.x, p.y); else context.lineTo(p.x, p.y); });
        context.closePath();
        const cell = model.name === 'Tesseract' && face.indices.every(index => model.vertices[index][3] > 0);
        context.fillStyle = cell ? 'rgba(196,148,255,.085)' : 'rgba(180,135,226,.025)';
        context.fill();
      });
      const edges = model.edges.map(([a, b], index) => ({ a, b, index, depth: (points[a].z + points[b].z) / 2 }));
      edges.sort((a, b) => b.depth - a.depth).forEach(edge => {
        const a = points[edge.a], b = points[edge.b];
        const cell = model.name === 'Tesseract' && model.vertices[edge.a][3] > 0 && model.vertices[edge.b][3] > 0;
        const alpha = Math.min(.95, Math.max(.3, .65 - edge.depth * .15));
        context.beginPath(); context.moveTo(a.x, a.y); context.lineTo(b.x, b.y);
        context.strokeStyle = cell ? `rgba(220,177,255,${alpha})` : `rgba(213,190,240,${alpha * .7})`;
        context.lineWidth = cell ? 1.5 : 1;
        context.stroke();
        for (let particle = 0; particle < 2; particle++) {
          const fraction = (elapsed * .12 + edge.index * .173 + particle * .5) % 1;
          const vertex = model.vertices[edge.a].map((value, axis) => value + (model.vertices[edge.b][axis] - value) * fraction);
          const p = geometry.project(vertex, elapsed, pointer.x, pointer.y);
          context.beginPath(); context.arc(width * .5 + p[0] * scale, height * .48 + p[1] * scale, 1.15, 0, TAU);
          context.fillStyle = 'rgba(244,230,255,.85)'; context.fill();
        }
      });
      points.map((point, index) => ({ ...point, index })).sort((a, b) => b.z - a.z).forEach(point => {
        context.beginPath(); context.arc(point.x, point.y, Math.max(1.7, 2.6 * point.factor), 0, TAU);
        context.fillStyle = model.vertices[point.index][3] > 0 ? '#dbb6ff' : '#f3e7ff'; context.fill();
      });
    }
    context.restore();
  };
  const paint = () => {
    if (!width || !height) return;
    context.clearRect(0, 0, width, height);
    const progress = Math.min(1, Math.max(0, (elapsed - morphStart) / .85));
    const blend = 1 - Math.pow(1 - progress, 3);
    if (blend < 1 && previousShape !== shape) paintModel(modelFor(previousShape), 1 - blend);
    paintModel(modelFor(shape), previousShape === shape ? 1 : blend);
  };
  const canAnimate = () => motionEnabled && visible && !document.hidden;
  const tick = now => {
    frame = null;
    if (!canAnimate()) return;
    const delta = previousTime ? Math.min((now - previousTime) / 1000, .05) : 0;
    previousTime = now;
    elapsed += delta;
    pointer.x += (pointer.targetX - pointer.x) * .055;
    pointer.y += (pointer.targetY - pointer.y) * .055;
    if (now - lastPaint > 31) { paint(); lastPaint = now; }
    frame = requestAnimationFrame(tick);
  };
  const syncAnimation = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    previousTime = 0;
    paint();
    if (canAnimate()) frame = requestAnimationFrame(tick);
  };
  const resize = () => {
    const rect = surface.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    paint();
  };
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(surface);
  else window.addEventListener('resize', resize, { passive: true });
  surface.addEventListener('pointermove', event => {
    if (!motionEnabled) return;
    const rect = surface.getBoundingClientRect();
    pointer.targetX = (event.clientX - rect.left) / rect.width * 2 - 1;
    pointer.targetY = (event.clientY - rect.top) / rect.height * 2 - 1;
  }, { passive: true });
  surface.addEventListener('pointerleave', () => { pointer.targetX = 0; pointer.targetY = 0; });
  document.querySelectorAll('[data-shape]').forEach(button => button.addEventListener('click', () => {
    if (shape === button.dataset.shape) return;
    previousShape = shape;
    shape = button.dataset.shape;
    morphStart = motionEnabled ? elapsed : elapsed - 2;
    document.querySelectorAll('[data-shape]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    const story = settings.stories?.[shape];
    if (story) {
      setText('[data-story-title]', story.title);
      setText('[data-story-text]', story.text);
      const panel = document.querySelector('.story-panel');
      if (panel) {
        panel.classList.remove('is-changing');
        void panel.offsetWidth;
        panel.classList.add('is-changing');
      }
      const status = document.getElementById('story-status');
      if (status) status.textContent = `${story.label}. ${story.title} ${story.text}`;
    }
    updateDimensionLabel();
    canvas.setAttribute('aria-label', `${modelFor(shape).name}, rotated in four-dimensional space, projected into three dimensions and onto the screen. ${motionEnabled ? 'Animation is playing.' : 'Animation is paused.'}`);
    paint();
  }));
  document.addEventListener('portfolio:motionchange', () => {
    if (!motionEnabled) morphStart = elapsed - 2;
    syncAnimation();
  });
  document.addEventListener('visibilitychange', syncAnimation);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      syncAnimation();
    }, { threshold: .02 }).observe(surface);
  }
  resize();
  syncAnimation();
})();
