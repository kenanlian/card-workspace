/* App shell: owns all shared state (direction, theme, language, accent) and the
   scroll-reveal observer. The review chrome is deliberately styled apart from
   the design so it never reads as part of the page being evaluated. */

const { useState, useEffect, useRef } = React;

const STORE = 'cw-landing-prefs';

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(STORE) || '{}');
  } catch (e) {
    return {};
  }
}

function App() {
  const saved = loadPrefs();
  const [direction, setDirection] = useState(saved.direction || 'paper');
  const [theme, setTheme] = useState(saved.theme || 'light');
  const [lang, setLang] = useState(saved.lang || 'en');
  const [accent, setAccent] = useState(saved.accent || 'native');
  // On a phone the panel would cover the hero it exists to evaluate.
  const [chromeOpen, setChromeOpen] = useState(
    typeof window === 'undefined' ? true : window.innerWidth > 700
  );

  const c = CONTENT[lang];

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.direction = direction;
    root.dataset.theme = theme;
    root.dataset.lang = lang;
    root.lang = lang === 'zh' ? 'zh-CN' : 'en';
    if (accent === 'native') delete root.dataset.accent;
    else root.dataset.accent = accent;
    try {
      localStorage.setItem(STORE, JSON.stringify({ direction, theme, lang, accent }));
    } catch (e) {
      /* preferences just won't persist */
    }
  }, [direction, theme, lang, accent]);

  /* Reveal-on-scroll. Re-runs when the composition changes so freshly mounted
     nodes get observed too. */
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll('.cw-reveal'));
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
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    nodes.forEach((n) => {
      n.removeAttribute('data-shown');
      io.observe(n);
    });
    return () => io.disconnect();
  }, [direction, lang]);

  const active = DIRECTIONS.find((d) => d.id === direction);

  return (
    <React.Fragment>
      <div className="cwx" data-open={chromeOpen ? 'true' : 'false'}>
        <button className="cwx__toggle" onClick={() => setChromeOpen((v) => !v)}>
          {chromeOpen ? '× Tweaks' : '⚙ Tweaks'}
        </button>

        {chromeOpen ? (
          <div className="cwx__panel">
            <div className="cwx__group">
              <span className="cwx__legend">{c.ui.direction}</span>
              <div className="cwx__row">
                {DIRECTIONS.map((d) => (
                  <button
                    key={d.id}
                    className="cwx__chip"
                    data-active={d.id === direction ? 'true' : 'false'}
                    data-family={d.family}
                    onClick={() => setDirection(d.id)}
                    title={lang === 'zh' ? d.blurbZh : d.blurb}
                  >
                    {lang === 'zh' ? d.nameZh : d.name}
                  </button>
                ))}
              </div>
              <p className="cwx__blurb">{lang === 'zh' ? active.blurbZh : active.blurb}</p>
            </div>

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

            <div className="cwx__group">
              <span className="cwx__legend">Accent</span>
              <div className="cwx__row">
                <button
                  className="cwx__chip"
                  data-active={accent === 'native' ? 'true' : 'false'}
                  onClick={() => setAccent('native')}
                >
                  {lang === 'zh' ? '方向原色' : 'Direction’s own'}
                </button>
                <button
                  className="cwx__chip"
                  data-active={accent === 'violet' ? 'true' : 'false'}
                  onClick={() => setAccent('violet')}
                >
                  {lang === 'zh' ? '图标紫' : 'Icon violet'}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <Landing c={c} direction={direction} key={`${direction}-${lang}`} />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
