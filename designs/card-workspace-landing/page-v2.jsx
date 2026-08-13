/* The v2 landing composition.
   Hero is stacked and centred on the bare canvas; everything after it is a
   stream of tabbed index cards, each holding the gutter + two-column
   letterpress structure. */

/* Two files rather than one: the accent flips lightness between themes, so the
   mark is graphite on light and pale blue on dark. CSS picks one off
   [data-theme]; assets/logo.svg is the light variant. */
function BrandMark() {
  return (
    <React.Fragment>
      <img className="cw-brand__mark cw-brand__mark--light" src="assets/logo.svg" alt="" />
      <img className="cw-brand__mark cw-brand__mark--dark" src="assets/logo-dark.svg" alt="" />
    </React.Fragment>
  );
}

function Landing({ c }) {
  const s = c.sections;

  /* Each authored line is its own block. Letting CSS wrap one long string
     breaks badly in Chinese, where nearly every character boundary is a legal
     break point. */
  const headline = c.hero.headline.map((line, i) => (
    <span className="cw-display__line" key={i}>
      {i === c.hero.headlineEmphasis ? <em>{line}</em> : line}
    </span>
  ));

  return (
    <div className="cw-page">
      <header className="cw-header">
        <div className="cw-wrap cw-header__inner">
          <a className="cw-brand" href="#top">
            <BrandMark />
            <span className="cw-brand__name">Card Workspace</span>
          </a>
          <VersionBadge version={c.version} title={c.versionTitle} />
          <nav className="cw-nav">
            {c.nav.map((n) => (
              <a href={n.href} key={n.label}>
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="cw-hero" id="top" data-screen-label="Hero">
        <div className="cw-wrap">
          <div className="cw-hero__copy cw-deal" style={{ '--cw-deal-rot': '0deg' }}>
            <Label accent>{c.hero.eyebrow}</Label>
            <h1 className="cw-display">{headline}</h1>
            <p className="cw-lede">{c.hero.tagline}</p>
            <div className="cw-actions">
              <Btn primary hint="↵">
                {c.hero.primaryCta}
              </Btn>
              <Btn href="#install">{c.hero.secondaryCta}</Btn>
            </div>
          </div>
          <Shot
            src="assets/card-workspace-hero.jpg"
            alt={c.hero.shotCaption}
            caption={c.hero.shotCaption}
          />
        </div>
      </section>

      {/* ---------------- Card stream ---------------- */}
      <div className="cw-wrap cw-stream">
        {/* 01 — the premise */}
        <SectionCard id="why" index={s.why.index} kicker={s.why.kicker} title={s.why.title} order={0}>
          <div className="cw-sec__text">
            <p className="cw-body">{s.why.body}</p>
            <Tiles items={s.why.points} />
          </div>
          <div className="cw-sec__media">
            <ImageSlot id="why-cards" label="cards" desc={s.why.slot} ui={c.ui} />
          </div>
        </SectionCard>

        {/* 02 — its own navigation */}
        <SectionCard id="nav" index={s.nav.index} kicker={s.nav.kicker} title={s.nav.title} order={1}>
          <div className="cw-sec__text">
            <p className="cw-body">{s.nav.body}</p>
            <Tiles items={s.nav.points} />
          </div>
          <div className="cw-sec__media">
            <ImageSlot id="nav-column" label="navigation" desc={s.nav.slot} ui={c.ui} />
          </div>
        </SectionCard>

        {/* 03 — card boxes */}
        <SectionCard
          id="boxes"
          index={s.boxes.index}
          kicker={s.boxes.kicker}
          title={s.boxes.title}
          order={2}
        >
          <div className="cw-sec__text">
            <p className="cw-body">{s.boxes.body}</p>
            <RulesPanel rules={s.boxes.rules} />
            <p className="cw-body cw-body--aside">{s.boxes.aside}</p>
          </div>
          <div className="cw-sec__media">
            <BoxViz rules={s.boxes.rules} viz={s.boxes.boxViz} />
            <p className="cw-caption" style={{ textAlign: 'left' }}>
              {s.boxes.boxViz.caption}
            </p>
          </div>
        </SectionCard>

        {/* 04 — stays in your flow */}
        <SectionCard
          id="flow"
          index={s.flow.index}
          kicker={s.flow.kicker}
          title={s.flow.title}
          order={3}
        >
          <div className="cw-sec__text">
            <p className="cw-body">{s.flow.body}</p>
            <Tiles items={s.flow.points} />
            <p className="cw-body cw-body--aside">{s.flow.aside}</p>
          </div>
          <div className="cw-sec__media">
            <ImageSlot id="drag-insert" label="drag to insert" desc={s.flow.slot} ui={c.ui} />
          </div>
        </SectionCard>

        {/* 05 — scale, with 06 privacy riding along in the media column */}
        <SectionCard
          id="scale"
          index={s.scale.index}
          kicker={s.scale.kicker}
          title={s.scale.title}
          order={4}
        >
          <div className="cw-sec__text">
            <p className="cw-body">{s.scale.body}</p>
            <Tiles items={s.scale.points} />
          </div>
          <div className="cw-sec__media">
            <div className="cw-subcard">
              <Label accent as="span">{`${s.privacy.index} · ${s.privacy.kicker}`}</Label>
              <h3 className="cw-h3">{s.privacy.title}</h3>
              <p className="cw-body">{s.privacy.body}</p>
              <span className="cw-badge">{s.privacy.badge}</span>
            </div>
          </div>
        </SectionCard>

        {/* 07 — install */}
        <SectionCard
          id="install"
          index={s.install.index}
          kicker={s.install.kicker}
          title={s.install.title}
          order={5}
        >
          <div className="cw-sec__text">
            <p className="cw-body">{s.install.body}</p>
            <div className="cw-actions">
              <Btn primary>{s.install.primaryCta}</Btn>
              <Btn href="https://github.com/kenanlian/obsidian-card-workspace">
                {s.install.secondaryCta}
              </Btn>
            </div>
            <span className="cw-todo">{s.install.note}</span>
          </div>
          <div className="cw-sec__media">
            <ol className="cw-steps">
              {s.install.steps.map((st) => (
                <li key={st}>
                  <span>{st}</span>
                </li>
              ))}
            </ol>
          </div>
        </SectionCard>
      </div>

      {/* ---------------- Footer ---------------- */}
      <footer className="cw-footer">
        <div className="cw-wrap">
          <div className="cw-footer__grid">
            <div className="cw-footer__col">
              <a className="cw-brand" href="#top" style={{ marginBottom: 'var(--cw-space-4)' }}>
                <BrandMark />
                <span className="cw-brand__name">Card Workspace</span>
              </a>
              <p className="cw-body" style={{ fontSize: '0.875rem', maxWidth: '34ch' }}>
                {c.footer.tagline}
              </p>
            </div>
            {c.footer.columns.map((col) => (
              <div className="cw-footer__col" key={col.title}>
                <h4 className="cw-label">{col.title}</h4>
                <ul>
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#install">{l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="cw-footer__legal">
            <Label as="span">{c.footer.legal}</Label>
            <Label as="span">{c.version}</Label>
          </div>
        </div>
      </footer>
    </div>
  );
}

Object.assign(window, { Landing });
