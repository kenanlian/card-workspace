/* Canvas + Tweaks for the docs page. The three directions sit side by side as
   artboards; every knob writes to the document root so all three move together
   and stay comparable. */

const { useState, useEffect } = React;

/* Heights are the measured natural height of each direction plus headroom for
   the Tweaks sliders, which can only make the page taller. */
const DIRECTIONS = [
  { id: 'air', label: 'A · Air', height: 2800 },
  { id: 'structure', label: 'B · Structure', height: 3000 },
  { id: 'magazine', label: 'C · Magazine', height: 2880 },
];

function DocsTweaks({ state, set }) {
  return (
    <TwPanel>
      <TwRow label="Theme">
        <TwSeg
          value={state.theme}
          onChange={(v) => set({ theme: v })}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
        />
      </TwRow>

      <TwRow label="Language">
        <TwSeg
          value={state.locale}
          onChange={(v) => set({ locale: v })}
          options={[
            { value: 'en', label: 'EN' },
            { value: 'zh', label: '中文' },
          ]}
        />
      </TwRow>

      <TwRow label="Body face">
        <TwSeg
          value={state.face}
          onChange={(v) => set({ face: v })}
          options={[
            { value: 'serif', label: 'Serif' },
            { value: 'sans', label: 'Sans' },
          ]}
        />
      </TwRow>

      <TwRow label="Section divider">
        <TwSeg
          value={state.divider}
          onChange={(v) => set({ divider: v })}
          options={[
            { value: 'variant', label: 'Own' },
            { value: 'none', label: 'None' },
            { value: 'hairline', label: 'Line' },
            { value: 'block', label: 'Block' },
          ]}
        />
      </TwRow>

      <TwRow label={'Body size · ' + state.size.toFixed(3) + 'rem'}>
        <input
          type="range"
          min="0.9375"
          max="1.1875"
          step="0.0125"
          value={state.size}
          onChange={(e) => set({ size: Number(e.target.value) })}
        />
      </TwRow>

      <TwRow label={'Line height · ' + state.leading.toFixed(2)}>
        <input
          type="range"
          min="1.5"
          max="1.95"
          step="0.01"
          value={state.leading}
          onChange={(e) => set({ leading: Number(e.target.value) })}
        />
      </TwRow>

      <TwRow label={'Measure · ' + state.measure + 'ch'}>
        <input
          type="range"
          min="52"
          max="88"
          step="1"
          value={state.measure}
          onChange={(e) => set({ measure: Number(e.target.value) })}
        />
      </TwRow>
    </TwPanel>
  );
}

function App() {
  const [state, setState] = useState({
    theme: 'light',
    locale: 'en',
    face: 'serif',
    divider: 'variant',
    size: 1.0625,
    leading: 1.72,
    measure: 68,
  });

  const set = (patch) => setState((prev) => Object.assign({}, prev, patch));

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.theme);
    if (state.divider === 'variant') {
      root.removeAttribute('data-divider');
    } else {
      root.setAttribute('data-divider', state.divider);
    }
    root.style.setProperty(
      '--cw-font-reading',
      state.face === 'serif' ? 'var(--cw-font-serif)' : 'var(--cw-font-sans)'
    );
    root.style.setProperty('--doc-body', state.size + 'rem');
    root.style.setProperty('--doc-leading', String(state.leading));
    root.style.setProperty('--doc-measure', state.measure + 'ch');
  }, [state]);

  return (
    <React.Fragment>
      <DocsTweaks state={state} set={set} />
      <DesignCanvas>
        <DCSection
          id="docs"
          title="Docs page — three directions"
          subtitle="Real content: reference/settings.md. A drops every rule; B keeps structure with inset hairlines; C sets the text as a magazine."
        >
          {DIRECTIONS.map((dir) => (
            <DCArtboard key={dir.id} id={dir.id} label={dir.label} width={1280} height={dir.height}>
              <DocsPage variant={dir.id} locale={state.locale} />
            </DCArtboard>
          ))}
        </DCSection>
      </DesignCanvas>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
