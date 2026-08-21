/* Presentational primitives for the v3 landing. Props in, callbacks out. */

const { useState, useRef, useEffect, useCallback } = React;

/* --- Uppercase mono micro-label ------------------------------------------ */
function Label({ children, accent = false, as = 'p' }) {
  const Tag = as;
  return <Tag className={accent ? 'cw-label cw-label--accent' : 'cw-label'}>{children}</Tag>;
}

/* --- Version pill with a live dot ----------------------------------------
   The dot pulses continuously (motion-safe only) so the header carries a small
   sign of life without anything moving on the reading surface. */
function VersionBadge({ version, title, href = '#install' }) {
  return (
    <a className="cw-ver" href={href} title={title} aria-label={title}>
      <span className="cw-ver__dot" aria-hidden="true"></span>
      <span className="cw-ver__num">{version}</span>
    </a>
  );
}

/* --- Button, with optional keyboard hint --------------------------------- */
function Btn({ children, primary = false, hint, href = '#', ...rest }) {
  return (
    <a className={primary ? 'cw-btn cw-btn--primary' : 'cw-btn'} href={href} {...rest}>
      <span>{children}</span>
      {hint ? <span className="cw-btn__key">{hint}</span> : null}
    </a>
  );
}

/* --- An indexed card ----------------------------------------------------
   Number and kicker share one metadata line inside the left gutter. The
   section title belongs to the copy column and is authored with its body. */
function SectionCard({ id, index, kicker, order = 0, children }) {
  const rot = order % 2 === 0 ? '-1.1deg' : '0.9deg';
  return (
    <section
      className="cw-card cw-deal"
      id={id}
      style={{ '--cw-deal-rot': rot }}
      data-screen-label={`${index} ${kicker}`}
    >
      <div className="cw-card__grid">
        <div className="cw-sec__meta">
          <span className="cw-card__index">{index}</span>
          <span className="cw-sec__divider" aria-hidden="true">·</span>
          <p className="cw-label">{kicker}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

/* --- Feature tiles ------------------------------------------------------- */
function Tiles({ items }) {
  return (
    <div className="cw-tiles">
      {items.map((it) => (
        <article className="cw-tile" key={it.term}>
          <span className="cw-tile__term">{it.term}</span>
          <span className="cw-tile__desc">{it.desc}</span>
        </article>
      ))}
    </div>
  );
}

/* --- Card-box rules as text ---------------------------------------------- */
function RulesPanel({ rules }) {
  const opText = { scope: 'scope', or: 'or', minus: 'except' };
  return (
    <div className="cw-rules">
      {rules.map((r, i) => (
        <div className="cw-rules__row" data-op={r.op} key={`${r.op}-${i}`}>
          <span className="cw-rules__op">{opText[r.op] || r.op}</span>
          <span className="cw-rules__value">{r.value}</span>
        </div>
      ))}
    </div>
  );
}

/* --- Card-box diagram ----------------------------------------------------
   Loose notes on the left, the saved box on the right. The sources drift in
   and straighten when the card is dealt, and again on hover — the whole point
   of a box is that scattered notes gather without moving files. */
function BoxViz({ rules, viz }) {
  const sources = rules.filter((r) => r.op !== 'minus');
  const excluded = rules.find((r) => r.op === 'minus');
  const rots = ['-3.2deg', '2.4deg', '-1.6deg', '3deg'];
  const lines = ['72%', '54%', '63%', '48%'];
  const opText = { scope: 'folder', or: 'tag' };

  return (
    <div className="cw-boxviz">
      <div className="cw-boxviz__sources">
        {sources.map((r, i) => (
          <article
            className="cw-mini"
            key={`${r.op}-${i}`}
            style={{ '--cw-rot': rots[i % rots.length], '--cw-i': i }}
          >
            <span className="cw-mini__op">{opText[r.op] || r.op}</span>
            <span className="cw-mini__value">{r.value}</span>
            <span className="cw-mini__line" style={{ '--cw-line-w': lines[i % lines.length] }}></span>
          </article>
        ))}
        {excluded ? (
          <article className="cw-mini cw-mini--out" style={{ '--cw-rot': '3.4deg' }}>
            <span className="cw-mini__op">{viz.excluded}</span>
            <span className="cw-mini__value">{excluded.value}</span>
          </article>
        ) : null}
      </div>

      <div className="cw-boxviz__deck">
        <div className="cw-deck__layer"></div>
        <div className="cw-deck__layer"></div>
        <div className="cw-deck__face">
          <span className="cw-deck__title">{viz.deckTitle}</span>
          <span className="cw-deck__label">{viz.deckLabel}</span>
        </div>
      </div>
    </div>
  );
}

/* --- Real product screenshot, matted like a card ------------------------- */
function Shot({ src, alt, caption }) {
  return (
    <figure className="cw-hero__shot cw-deal" style={{ '--cw-i': 2, '--cw-deal-rot': '0.7deg' }}>
      <div className="cw-shot">
        <img src={src} alt={alt} />
      </div>
      {caption ? <figcaption className="cw-caption">{caption}</figcaption> : null}
    </figure>
  );
}

/* --- User-fillable image slot -------------------------------------------
   Drop or click to pick an image; persists as a data URL in localStorage under
   its own id, so a dropped shot survives a reload. */
function ImageSlot({ id, label, desc, ui }) {
  const storageKey = `cw-slot-v3:${id}`;
  const [src, setSrc] = useState(null);
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setSrc(saved);
    } catch (e) {
      /* storage unavailable — the slot just stays empty */
    }
  }, [storageKey]);

  const ingest = useCallback(
    (file) => {
      if (!file || !file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = () => {
        const url = String(reader.result);
        setSrc(url);
        try {
          localStorage.setItem(storageKey, url);
        } catch (e) {
          /* too large to persist — still shown for this session */
        }
      };
      reader.readAsDataURL(file);
    },
    [storageKey]
  );

  const clear = (e) => {
    e.stopPropagation();
    setSrc(null);
    try {
      localStorage.removeItem(storageKey);
    } catch (e2) {
      /* nothing to clean up */
    }
  };

  return (
    <div
      className="cw-slot"
      data-over={over ? 'true' : 'false'}
      data-filled={src ? 'true' : 'false'}
      aria-label={src ? desc : `${label}: ${desc}`}
      onClick={() => inputRef.current && inputRef.current.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        ingest(e.dataTransfer.files && e.dataTransfer.files[0]);
      }}
    >
      {src ? (
        <React.Fragment>
          <img src={src} alt={desc} />
          <button type="button" className="cw-slot__clear" onClick={clear}>
            {ui.clear}
          </button>
        </React.Fragment>
      ) : (
        <div className="cw-slot__hint">
          <span className="cw-label cw-label--accent">{label}</span>
          <span className="cw-slot__desc">{desc}</span>
          <span className="cw-label">{ui.dropHint}</span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => ingest(e.target.files && e.target.files[0])}
      />
    </div>
  );
}

Object.assign(window, {
  Label,
  VersionBadge,
  Btn,
  SectionCard,
  Tiles,
  RulesPanel,
  BoxViz,
  Shot,
  ImageSlot,
});
