/* App shell for v3: owns theme + language, and the deal-in observer.
   The review chrome is deliberately styled apart from the design so it never
   reads as part of the page being evaluated. */

const { useState, useEffect } = React;

const STORE = 'cw-landing-v3-prefs';

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(STORE) || '{}');
  } catch (e) {
    return {};
  }
}

function App() {
  const saved = loadPrefs();
  // ?theme=dark&lang=zh lets a review link open straight into a given state.
  const params = new URLSearchParams(window.location.search);
  const [theme, setTheme] = useState(params.get('theme') || saved.theme || 'light');
  const [lang, setLang] = useState(params.get('lang') || saved.lang || 'en');
  // On a phone the panel would cover the hero it exists to evaluate.
  const [chromeOpen, setChromeOpen] = useState(
    typeof window === 'undefined' ? true : window.innerWidth > 700
  );

  const c = CONTENT[lang];

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;
    root.dataset.lang = lang;
    root.lang = lang === 'zh' ? 'zh-CN' : 'en';
    try {
      localStorage.setItem(STORE, JSON.stringify({ theme, lang }));
    } catch (e) {
      /* preferences just won't persist */
    }
  }, [theme, lang]);

  /* The React tree does not exist when the browser first resolves a URL hash.
     Re-apply it after mount (and after a language remount) so review links can
     open directly on a section. */
  useEffect(() => {
    if (!window.location.hash) return;
    const frame = window.requestAnimationFrame(() => {
      const target = document.querySelector(window.location.hash);
      if (target) target.scrollIntoView();
    });
    return () => window.cancelAnimationFrame(frame);
  }, [lang]);

  /* Deal-in on scroll. Re-runs when the language changes so freshly mounted
     nodes get observed too. */
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.cw-deal'));
    if (!('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.setAttribute('data-shown', 'true'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-shown', 'true');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.04 }
    );
    /* Anything already in view is dealt straight away rather than waiting on an
       observer callback — a delayed callback would leave the hero blank. */
    nodes.forEach((n) => {
      n.removeAttribute('data-shown');
      if (n.getBoundingClientRect().top < window.innerHeight * 0.94) {
        n.setAttribute('data-shown', 'true');
        return;
      }
      io.observe(n);
    });
    return () => io.disconnect();
  }, [lang]);

  return (
    <React.Fragment>
      <div className="cwx" data-open={chromeOpen ? 'true' : 'false'}>
        <button className="cwx__toggle" onClick={() => setChromeOpen((v) => !v)}>
          {chromeOpen ? '× Tweaks' : '⚙ Tweaks'}
        </button>

        {chromeOpen ? (
          <div className="cwx__panel">
            <div className="cwx__group">
              <span className="cwx__legend">{c.ui.theme}</span>
              <div className="cwx__row">
                <button
                  className="cwx__chip"
                  data-active={theme === 'light' ? 'true' : 'false'}
                  onClick={() => setTheme('light')}
                >
                  {c.ui.light}
                </button>
                <button
                  className="cwx__chip"
                  data-active={theme === 'dark' ? 'true' : 'false'}
                  onClick={() => setTheme('dark')}
                >
                  {c.ui.dark}
                </button>
              </div>
            </div>

            <div className="cwx__group">
              <span className="cwx__legend">{c.ui.language}</span>
              <div className="cwx__row">
                <button
                  className="cwx__chip"
                  data-active={lang === 'en' ? 'true' : 'false'}
                  onClick={() => setLang('en')}
                >
                  English
                </button>
                <button
                  className="cwx__chip"
                  data-active={lang === 'zh' ? 'true' : 'false'}
                  onClick={() => setLang('zh')}
                >
                  简体中文
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Landing c={c} key={lang} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
