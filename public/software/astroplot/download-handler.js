/**
 * AstroPlot RAW - Seamless Direct Download Handler
 * Ensures clicking "Download Free Trial" directly downloads the Windows installer (.exe)
 * without sending users to GitHub release pages, and provides instant visual feedback.
 */
(function() {
  const FALLBACK_EXE_URL = 'https://github.com/ashtonsprunger/astroplot-releases/releases/download/v1.5.1/AstroPlot.RAW_1.5.1_x64-setup.exe';
  const STORE_URL = 'https://apps.microsoft.com/store/detail/9N8G64H77RW6';
  const REPO = 'ashtonsprunger/astroplot-releases';
  const WEB3FORMS_ACCESS_KEY = 'b9020144-972a-4641-8b91-24d96372ffd7';
  const NOTIFY_ENDPOINT = 'https://api.web3forms.com/submit';
  const LAST_DL_STORAGE_KEY = 'astroplot_dl_last_notify';
  const NOTIFY_COOLDOWN_MS = 60000; // 1 minute per session cooldown

  let currentExeUrl = FALLBACK_EXE_URL;
  let toastTimer = null;

  function isMacOS() {
    if (typeof navigator === 'undefined') return false;
    if (navigator.userAgentData && navigator.userAgentData.platform) {
      return /mac/i.test(navigator.userAgentData.platform);
    }
    return /Macintosh|Mac OS X|MacIntel|MacPPC/i.test(navigator.userAgent || navigator.platform || '');
  }

  function sendDownloadNotification(downloadUrl, triggerContext) {
    try {
      const now = Date.now();
      const lastNotify = sessionStorage.getItem(LAST_DL_STORAGE_KEY);
      if (lastNotify && (now - parseInt(lastNotify, 10)) < NOTIFY_COOLDOWN_MS) {
        return; // Prevent duplicate emails if user double-clicks or retries in under 1 minute
      }
      sessionStorage.setItem(LAST_DL_STORAGE_KEY, String(now));

      const cleanUrl = downloadUrl || currentExeUrl || '';
      const isDmg = /\.dmg($|\?)/i.test(cleanUrl) || /mac/i.test(triggerContext || '');
      const fileType = isDmg ? 'macOS (.dmg)' : 'Windows (.exe)';
      const filename = cleanUrl ? cleanUrl.split('/').pop().split('?')[0] : (isDmg ? 'AstroPlot.RAW_macOS.dmg' : 'AstroPlot.RAW_x64-setup.exe');

      const payload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `📥 New AstroPlot RAW Download (${fileType})`,
        from_name: 'AstroPlot RAW Website',
        'File Downloaded': filename,
        'Platform': fileType,
        'Trigger Location': triggerContext || 'Direct Download Button',
        'Download Link': cleanUrl,
        'Source Page': window.location.href,
        'Referrer': document.referrer || 'Direct / None',
        'Screen Resolution': `${window.screen.width}x${window.screen.height}`,
        'Language': navigator.language || 'Unknown',
        'User Agent': navigator.userAgent || 'Unknown',
        'Timestamp (UTC)': new Date().toUTCString()
      };

      fetch(NOTIFY_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function() {
        // Silently fail so downloads never break
      });
    } catch (_err) {
      // Fail silently to never interrupt user experience
    }
  }

  function updateDownloadLinks(url) {
    currentExeUrl = url;
    const isMac = isMacOS();
    document.querySelectorAll('a.btn-download-trial').forEach(el => {
      // Do not overwrite general trial buttons on macOS with the Windows .exe
      if (isMac && !el.classList.contains('btn-download-channel')) {
        return;
      }
      el.href = url;
      el.setAttribute('download', '');
    });
    const directRetryLink = document.getElementById('dlToastDirectLink');
    if (directRetryLink) {
      directRetryLink.href = url;
    }
  }

  function createToastElement() {
    if (document.getElementById('downloadToast')) return;

    const toast = document.createElement('div');
    toast.id = 'downloadToast';
    toast.className = 'download-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    toast.innerHTML = `
      <div class="download-toast-icon">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      </div>
      <div class="download-toast-content">
        <div class="download-toast-title">Installer Downloading...</div>
        <div class="download-toast-desc">
          Run the setup file (<code>.exe</code>) to start your 14-day free trial.
        </div>
        <div class="download-toast-links">
          <a id="dlToastDirectLink" href="${currentExeUrl}" class="download-toast-link" download>Didn't start? Click here</a>
          <span style="color: var(--border);">•</span>
          <a href="${STORE_URL}" class="download-toast-link" target="_blank" rel="noopener">Microsoft Store</a>
        </div>
      </div>
      <button type="button" class="download-toast-close" id="closeToastBtn" aria-label="Close">×</button>
    `;

    document.body.appendChild(toast);

    document.getElementById('closeToastBtn').addEventListener('click', hideToast);
  }

  function showToast() {
    createToastElement();
    const toast = document.getElementById('downloadToast');
    if (!toast) return;

    // Refresh href in case it was updated
    const retryLink = document.getElementById('dlToastDirectLink');
    if (retryLink) retryLink.href = currentExeUrl;

    toast.classList.add('visible');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      hideToast();
    }, 12000);
  }

  function hideToast() {
    const toast = document.getElementById('downloadToast');
    if (toast) {
      toast.classList.remove('visible');
    }
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
  }

  function initDownloadButtons() {
    const isMac = isMacOS();

    if (isMac) {
      // Customize general download buttons across navbar and hero for macOS visitors
      document.querySelectorAll('a.btn-download-trial:not(.btn-download-channel)').forEach(el => {
        el.removeAttribute('download');
        el.href = 'mailto:sprungerashton@gmail.com?subject=AstroPlot%20RAW%20macOS%20Waitlist&body=Hi%20Ashton,%20please%20notify%20me%20when%20the%20macOS%20version%20of%20AstroPlot%20RAW%20is%20ready!';
        el.classList.add('macos-waitlist-trigger');

        if (el.classList.contains('btn-nav')) {
          el.textContent = 'Join macOS Waitlist';
        } else {
          const span = el.querySelector('span');
          if (span) {
            span.textContent = 'Join macOS Waitlist';
          }
          const svg = el.querySelector('svg');
          if (svg) {
            svg.outerHTML = `
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2.02.6-2.66 1.34-.56.65-1.06 1.71-.93 2.74 1.01.08 2.06-.5 2.67-1.23z"/>
              </svg>
            `;
          }
        }
      });
    }

    createToastElement();
    document.querySelectorAll('a.btn-download-trial').forEach(el => {
      // If user is on Mac and this is not the explicit Windows channel download button, let the modal trigger handle it
      if (isMac && !el.classList.contains('btn-download-channel')) {
        return;
      }

      // Ensure download attribute is present for Windows
      el.setAttribute('download', '');
      // When clicked, show toast feedback and trigger notification
      el.addEventListener('click', () => {
        showToast();
        const context = el.classList.contains('btn-nav')
          ? 'Navbar Download Button'
          : (el.classList.contains('btn-download-channel') ? 'Platform Channel Button' : 'Hero Download Button');
        sendDownloadNotification(el.href || currentExeUrl, context);
      });
    });

    // Global listener for any .exe / .dmg link or retry link across the site
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = (link.getAttribute('href') || '').toLowerCase();
      if (href.endsWith('.exe') || href.endsWith('.dmg') || href.includes('.exe') || href.includes('.dmg')) {
        const isDmg = href.includes('.dmg');
        const context = link.id === 'dlToastDirectLink'
          ? 'Toast Retry Link'
          : (link.classList.contains('btn-download-trial')
              ? 'Download Button'
              : (isDmg ? 'Direct DMG Link' : 'Direct EXE Link'));
        sendDownloadNotification(link.href || currentExeUrl, context);
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideToast();
        const modal = document.getElementById('macosModal');
        if (modal && !modal.hasAttribute('hidden')) {
          closeMacosModal();
        }
      }
    });
  }

  // --- macOS Waitlist Modal Handler ---
  function fallbackCopy(text, cb) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(ta);
    if (cb) cb();
  }

  function createMacosModalElement() {
    let modal = document.getElementById('macosModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'macosModal';
      modal.className = 'macos-modal-backdrop';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'macosModalTitle');
      modal.setAttribute('hidden', '');

      modal.innerHTML = `
        <div class="macos-modal-dialog">
          <button type="button" class="macos-modal-close" id="closeMacosModalBtn" aria-label="Close modal">&times;</button>
          
          <div class="macos-modal-icon">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.85-.9.04-2.02.6-2.66 1.34-.56.65-1.06 1.71-.93 2.74 1.01.08 2.06-.5 2.67-1.23z"/>
            </svg>
          </div>

          <h3 id="macosModalTitle" class="macos-modal-title">macOS Launch Waitlist</h3>
          <p class="macos-modal-desc">
            AstroPlot RAW is currently in development for Apple Silicon (M1&ndash;M4) and Intel Macs. Send a quick note to get notified immediately on launch day:
          </p>

          <div class="macos-modal-actions">
            <!-- 1. Open in Gmail Web -->
            <a id="macGmailLink" href="https://mail.google.com/mail/?view=cm&fs=1&to=sprungerashton@gmail.com&su=AstroPlot%20RAW%20macOS%20Waitlist&body=Hi%20Ashton,%20please%20notify%20me%20when%20the%20macOS%20version%20of%20AstroPlot%20RAW%20is%20ready!" target="_blank" rel="noopener" class="macos-action-btn macos-action-gmail">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.263H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
              </svg>
              <span>Open in Gmail (Web)</span>
            </a>

            <!-- 2. Open in Default Mail App -->
            <a id="macMailtoLink" href="mailto:sprungerashton@gmail.com?subject=AstroPlot%20RAW%20macOS%20Waitlist&body=Hi%20Ashton,%20please%20notify%20me%20when%20the%20macOS%20version%20of%20AstroPlot%20RAW%20is%20ready!" class="macos-action-btn macos-action-client">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L1 7"></path>
              </svg>
              <span>Open in Default Mail App</span>
            </a>

            <!-- 3. Copy Email -->
            <button type="button" id="macCopyEmailBtn" class="macos-action-btn macos-action-copy">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
              </svg>
              <span id="macCopyText">Copy Email Address (sprungerashton@gmail.com)</span>
            </button>
          </div>

          <div class="macos-modal-footer">
            🔒 Zero spam. You'll only receive one notification when the macOS build is ready.
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    // Attach listeners if not already bound
    if (!modal.dataset.bound) {
      modal.dataset.bound = 'true';
      const closeBtn = modal.querySelector('#closeMacosModalBtn');
      if (closeBtn) {
        closeBtn.addEventListener('click', closeMacosModal);
      }
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeMacosModal();
      });

      const copyBtn = modal.querySelector('#macCopyEmailBtn');
      const copyText = modal.querySelector('#macCopyText');
      if (copyBtn && copyText) {
        copyBtn.addEventListener('click', () => {
          const email = 'sprungerashton@gmail.com';
          const originalText = copyText.textContent;
          const onCopied = () => {
            copyText.textContent = '✓ Copied sprungerashton@gmail.com!';
            copyBtn.classList.add('copied');
            setTimeout(() => {
              copyText.textContent = originalText;
              copyBtn.classList.remove('copied');
            }, 2500);
          };
          if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(email).then(onCopied).catch(() => fallbackCopy(email, onCopied));
          } else {
            fallbackCopy(email, onCopied);
          }
        });
      }
    }

    return modal;
  }

  function openMacosModal(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    const modal = createMacosModalElement();
    if (!modal) return;
    modal.removeAttribute('hidden');
    void modal.offsetWidth;
    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }

  function closeMacosModal() {
    const modal = document.getElementById('macosModal');
    if (!modal) return;
    modal.classList.remove('visible');
    setTimeout(() => {
      modal.setAttribute('hidden', '');
    }, 250);
    document.body.style.overflow = '';
  }

  function initMacosModal() {
    // Delegate click on any waitlist trigger
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('.macos-waitlist-trigger, .hero-badge-macos-link, .macos-link, .spec-macos-link');
      if (trigger) {
        e.preventDefault();
        openMacosModal(e);
      }
    });
  }

  function fetchLatestReleaseUrl() {
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`)
      .then(res => {
        if (!res.ok) throw new Error('API unavailable');
        return res.json();
      })
      .then(data => {
        if (data && Array.isArray(data.assets)) {
          // Look for setup executable (.exe, not .sig, not .zip)
          const setupExe = data.assets.find(a => 
            a.name.endsWith('.exe') && 
            !a.name.endsWith('.sig') && 
            !a.name.endsWith('.zip')
          );
          if (setupExe && setupExe.browser_download_url) {
            updateDownloadLinks(setupExe.browser_download_url);
          }
        }
      })
      .catch(() => {
        // Silently fallback to FALLBACK_EXE_URL
        updateDownloadLinks(FALLBACK_EXE_URL);
      });
  }

  function initAll() {
    initDownloadButtons();
    initMacosModal();
    fetchLatestReleaseUrl();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
