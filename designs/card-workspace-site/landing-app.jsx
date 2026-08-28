/* Canvas + Tweaks for the landing revisions: the header first, then the same
   vertical slice under each of the three boundary treatments. */

function LandingTweaks({ state, set }) {
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
    </TwPanel>
  );
}

function LandingApp() {
  const [state, setState] = React.useState({ theme: 'light', face: 'serif' });
  const set = (patch) => setState((prev) => Object.assign({}, prev, patch));

  React.useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.theme);
    root.style.setProperty(
      '--cw-font-reading',
      state.face === 'serif' ? 'var(--cw-font-serif)' : 'var(--cw-font-sans)'
    );
  }, [state]);

  return (
    <React.Fragment>
      <LandingTweaks state={state} set={set} />
      <DesignCanvas>
        <DCSection
          id="header"
          title="Header"
          subtitle="Version number loses its v and gains the live dot; the three in-page anchors go; Docs joins the tools; Install becomes the repo."
        >
          <DCArtboard id="header-current" label="Today" width={1280} height={64}>
            <HeaderBoard header="current" />
          </DCArtboard>
          <DCArtboard id="header-next" label="Proposed" width={1280} height={64}>
            <HeaderBoard header="next" />
          </DCArtboard>
        </DCSection>

        <DCSection
          id="bounds"
          title="Section boundaries"
          subtitle="The same four bands — feature, proof, call to action, footer — under each treatment."
        >
          <DCArtboard id="bounds-current" label="Today · rules + tint" width={1280} height={1720}>
            <LandingBoard bounds="current" header="current" />
          </DCArtboard>
          <DCArtboard id="bounds-space" label="A · Distance only" width={1280} height={1900}>
            <LandingBoard bounds="space" header="next" />
          </DCArtboard>
          <DCArtboard id="bounds-inset" label="B · Inset hairline" width={1280} height={1780}>
            <LandingBoard bounds="inset" header="next" />
          </DCArtboard>
        </DCSection>
      </DesignCanvas>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LandingApp />);
