/* The landing page composition. One structure for all four directions; the
   tokens and a handful of direction-aware branches below do the differentiating. */

function Landing({ c, direction }) {
  const s = c.sections;
  const dense = direction === 'letterpress' || direction === 'blueprint';
  const technical = direction === 'blueprint';

  /* Each authored line is its own block. Relying on CSS to wrap one long string
     breaks badly in Chinese, where nearly every character boundary is a legal
     break point — it split 而不是 across two lines. */
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
            <img src="assets/logo.svg" alt="" />
            <span className="cw-brand__name">Card Workspace</span>
          </a>
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
      <section className="cw-hero" id="top">
        <div className="cw-wrap">
          {technical ? <Axis left="Card Workspace" right="Obsidian · 1.9+" /> : null}
          <div className="cw-hero__grid">
            <div className="cw-hero__copy cw-reveal">
              <Label accent>{c.hero.eyebrow}</Label>
              <h1 className="cw-display">{headline}</h1>
              <p className="cw-lede">{c.hero.tagline}</p>
              <div className="cw-actions">
                <Btn primary hint="↵">
                  {c.hero.primaryCta}
                </Btn>
                <Btn href="#install">{c.hero.secondaryCta}</Btn>
              </div>
              <div className="cw-hero__meta">
                <Label as="span">{c.hero.meta}</Label>
                <Label as="span">{c.hero.metaSoft}</Label>
              </div>
              <span className="cw-todo">{c.hero.installNote}</span>
            </div>
            <Shot
              src="assets/card-workspace-hero.jpg"
              alt={c.hero.shotCaption}
              caption={c.hero.shotCaption}
            />
          </div>
          {dense ? <Stats items={c.stats} /> : null}
        </div>
      </section>

      <Rule marks />

      {/* ---------------- 01 Why ---------------- */}
      <section className="cw-section" id="why">
        <div className="cw-wrap">
          <SectionHead index={s.why.index} kicker={s.why.kicker} title={s.why.title} />
          <div className="cw-section__body">
            <div className="cw-reveal" style={{ display: 'grid', gap: 'var(--cw-space-5)' }}>
              <p className="cw-body">{s.why.body}</p>
              <DefList items={s.why.points} />
            </div>
            <ImageSlot
              id="why-cards"
              label="01 · cards"
              desc={s.why.slot}
              ui={c.ui}
              minHeight={280}
            />
          </div>
        </div>
      </section>

      <Rule />

      {/* ---------------- 02 Navigation ---------------- */}
      <section className="cw-section" id="nav">
        <div className="cw-wrap">
          <SectionHead index={s.nav.index} kicker={s.nav.kicker} title={s.nav.title} />
          <div className="cw-section__body">
            <div className="cw-reveal" style={{ display: 'grid', gap: 'var(--cw-space-5)' }}>
              <p className="cw-body">{s.nav.body}</p>
              <DefList items={s.nav.points} />
            </div>
            <ImageSlot
              id="nav-column"
              label="02 · navigation"
              desc={s.nav.slot}
              ui={c.ui}
              minHeight={280}
            />
          </div>
        </div>
      </section>

      <Rule marks />

      {/* ---------------- 03 Card boxes ---------------- */}
      <section className="cw-section" id="boxes">
        <div className="cw-wrap">
          <SectionHead index={s.boxes.index} kicker={s.boxes.kicker} title={s.boxes.title} />
          <div className="cw-section__body">
            <div className="cw-reveal" style={{ display: 'grid', gap: 'var(--cw-space-5)' }}>
              <p className="cw-body">{s.boxes.body}</p>
              <RulesPanel rules={s.boxes.rules} />
              <p className="cw-body" style={{ color: 'var(--cw-ink-faint)', fontSize: '0.875rem' }}>
                {s.boxes.aside}
              </p>
            </div>
            <ImageSlot
              id="box-rules"
              label="03 · card box"
              desc={s.boxes.slot}
              ui={c.ui}
              minHeight={300}
            />
          </div>
        </div>
      </section>

      <Rule />

      {/* ---------------- 04 In flow ---------------- */}
      <section className="cw-section" id="flow">
        <div className="cw-wrap">
          <SectionHead index={s.flow.index} kicker={s.flow.kicker} title={s.flow.title} />
          <div className="cw-section__body">
            <div className="cw-reveal" style={{ display: 'grid', gap: 'var(--cw-space-5)' }}>
              <p className="cw-body">{s.flow.body}</p>
              <DefList items={s.flow.points} />
              <p className="cw-body" style={{ color: 'var(--cw-ink-faint)', fontSize: '0.875rem' }}>
                {s.flow.aside}
              </p>
            </div>
            <ImageSlot
              id="drag-insert"
              label="04 · drag to insert"
              desc={s.flow.slot}
              ui={c.ui}
              minHeight={300}
            />
          </div>
        </div>
      </section>

      <Rule marks />

      {/* ---------------- 05 Scale + 06 Privacy ---------------- */}
      <section className="cw-section" id="scale">
        <div className="cw-wrap">
          <SectionHead index={s.scale.index} kicker={s.scale.kicker} title={s.scale.title} />
          <div className="cw-section__body">
            <div className="cw-reveal" style={{ display: 'grid', gap: 'var(--cw-space-5)' }}>
              <p className="cw-body">{s.scale.body}</p>
              <DefList items={s.scale.points} />
            </div>
            <div className="cw-reveal" style={{ display: 'grid', gap: 'var(--cw-space-4)', alignContent: 'start' }}>
              <span className="cw-index">§{s.privacy.index}</span>
              <h3 className="cw-h2" style={{ fontSize: 'clamp(1.5rem, 2.4vw, 2.1rem)' }}>
                {s.privacy.title}
              </h3>
              <p className="cw-body">{s.privacy.body}</p>
              <span className="cw-badge">{s.privacy.badge}</span>
            </div>
          </div>
        </div>
      </section>

      <Rule />

      {/* ---------------- 07 Install ---------------- */}
      <section className="cw-section" id="install">
        <div className="cw-wrap">
          <SectionHead index={s.install.index} kicker={s.install.kicker} title={s.install.title} />
          <div className="cw-section__body">
            <div className="cw-reveal" style={{ display: 'grid', gap: 'var(--cw-space-5)' }}>
              <p className="cw-body">{s.install.body}</p>
              <div className="cw-actions">
                <Btn primary>{s.install.primaryCta}</Btn>
                <Btn href="https://github.com/kenanlian/obsidian-card-workspace">
                  {s.install.secondaryCta}
                </Btn>
              </div>
              <span className="cw-todo">{s.install.note}</span>
            </div>
            <ol className="cw-steps cw-reveal">
              {s.install.steps.map((st) => (
                <li key={st}>
                  <span>{st}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <Rule marks />

      {/* ---------------- Footer ---------------- */}
      <footer className="cw-footer">
        <div className="cw-wrap">
          <div className="cw-footer__grid">
            <div className="cw-footer__col">
              <a className="cw-brand" href="#top" style={{ marginBottom: 'var(--cw-space-4)' }}>
                <img src="assets/logo.svg" alt="" />
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
            <Label as="span">v1.0.2</Label>
          </div>
        </div>
      </footer>
    </div>
  );
}

Object.assign(window, { Landing });
