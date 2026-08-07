/* Shared presentational primitives. Props in, callbacks out — no app state. */

const { useState, useRef, useEffect, useCallback } = React;

/* --- Full-bleed hairline, optionally with crop marks ---------------------- */
function Rule({ marks = false }) {
  return <hr className="cw-rule" {...(marks ? { 'data-marks': 'true' } : {})} />;
}

/* --- Uppercase mono micro-label ------------------------------------------ */
function Label({ children, accent = false, as = 'p' }) {
  const Tag = as;
  return <Tag className={accent ? 'cw-label cw-label--accent' : 'cw-label'}>{children}</Tag>;
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

/* --- Labelled axis line (blueprint direction only) ----------------------- */
function Axis({ left, right }) {
  return (
    <div className="cw-axis">
      <span className="cw-label">{left}</span>
      <span className="cw-axis__line" />
      <span className="cw-label">{right}</span>
    </div>
  );
}

/* --- Section header ------------------------------------------------------ */
function SectionHead({ index, kicker, title, lede, id }) {
  return (
    <header className="cw-section__head cw-reveal">
      <div className="cw-section__eyebrow">
        <span className="cw-index">§{index}</span>
        <Label as="span">{kicker}</Label>
      </div>
      <div>
        <h2 className="cw-h2" id={id}>
          {title}
        </h2>
        {lede ? <p className="cw-lede" style={{ marginTop: 'var(--cw-space-4)' }}>{lede}</p> : null}
      </div>
    </header>
  );
}

/* --- Hairline definition list -------------------------------------------- */
function DefList({ items }) {
  return (
    <dl className="cw-deflist">
      {items.map((it) => (
        <div className="cw-deflist__row" key={it.term}>
          <dt className="cw-deflist__term">{it.term}</dt>
          <dd className="cw-deflist__desc">{it.desc}</dd>
        </div>
      ))}
    </dl>
  );
}

/* --- Card-box rules panel ------------------------------------------------ */
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

/* --- Stats row ----------------------------------------------------------- */
function Stats({ items }) {
  return (
    <div className="cw-stats cw-reveal">
      {items.map((s) => (
        <div key={s.label}>
          <div className="cw-stat__value">{s.value}</div>
          <p className="cw-label cw-stat__label">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

/* --- Real product screenshot -------------------------------------------- */
function Shot({ src, alt, caption }) {
  return (
    <figure style={{ margin: 0 }} className="cw-reveal">
      <div className="cw-shot">
        <img src={src} alt={alt} loading="lazy" />
      </div>
      {caption ? <figcaption className="cw-caption">{caption}</figcaption> : null}
    </figure>
  );
}

/* --- User-fillable image slot -------------------------------------------
   Drop or click to pick an image; persists as a data URL in localStorage
   under its own id, so a dropped shot survives reload. */
function ImageSlot({ id, label, desc, minHeight = 240, ui }) {
  const storageKey = `cw-slot:${id}`;
  const [src, setSrc] = useState(null);
  const [over, setOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setSrc(saved);
    } catch (e) {
      /* storage unavailable — slot just stays empty */
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
      className="cw-slot cw-reveal"
      data-over={over ? 'true' : 'false'}
      style={{ minHeight }}
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
          <span className="cw-slot__label">{label}</span>
          <span className="cw-slot__desc">{desc}</span>
          <span className="cw-label" style={{ marginTop: 'var(--cw-space-2)' }}>
            {ui.dropHint}
          </span>
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
  Rule,
  Label,
  Btn,
  Axis,
  SectionHead,
  DefList,
  RulesPanel,
  Stats,
  Shot,
  ImageSlot,
});
