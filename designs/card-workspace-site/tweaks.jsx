/* Shared in-page control shell. Both deliverables mount one of these; the
   controls themselves are declared by each app. */

function TwRow({ label, children }) {
  return (
    <label className="tw-row">
      <span className="tw-label">{label}</span>
      {children}
    </label>
  );
}

function TwSeg({ value, onChange, options }) {
  return (
    <span className="tw-seg">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={opt.value === value ? 'tw-seg__btn tw-seg__btn--on' : 'tw-seg__btn'}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </span>
  );
}

function TwPanel({ children }) {
  const [open, setOpen] = React.useState(true);
  return (
    <div className="tw">
      <button className="tw-toggle" type="button" onClick={() => setOpen(!open)}>
        {open ? 'Hide tweaks' : 'Tweaks'}
      </button>
      {open ? <div className="tw-panel">{children}</div> : null}
    </div>
  );
}

Object.assign(window, { TwRow, TwSeg, TwPanel });
