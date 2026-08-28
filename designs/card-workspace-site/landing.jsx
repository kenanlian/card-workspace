/* Landing revisions. Copy is the live site's (src/content/landing.ts), so the
   spacing decisions are judged against real line counts. */

/* Today: `v1.1.5`, three in-page anchors centred, then language, theme and an
   Install button. */
function HeaderCurrent() {
  return (
    <header className="lp-header">
      <div className="lp-header__inner">
        <a className="lp-brand" href="#">
          <span className="lp-brand__mark" aria-hidden="true"></span>
          <span className="lp-brand__name">Card Workspace</span>
        </a>

        <a className="lp-ver" href="#">v1.1.5</a>

        <nav className="lp-nav" aria-label="Landing page">
          <a href="#">Card boxes</a>
          <a href="#">Browse</a>
          <a href="#">Drag to write</a>
          <a href="#">Docs</a>
        </nav>

        <div className="lp-tools">
          <a className="lp-tool" href="#">中文</a>
          <button className="lp-tool" type="button" aria-label="Switch color theme">
            <SunMark />
          </button>
          <a className="lp-btn lp-btn--compact lp-btn--primary" href="#">Install</a>
        </div>
      </div>
    </header>
  );
}

/* Next: the bare version number with a live dot, the in-page anchors dropped,
   and Docs seated with the other tools. Install becomes the repo. */
function HeaderNext() {
  return (
    <header className="lp-header">
      <div className="lp-header__inner">
        <a className="lp-brand" href="#">
          <span className="lp-brand__mark" aria-hidden="true"></span>
          <span className="lp-brand__name">Card Workspace</span>
        </a>

        <a className="lp-ver" href="#" title="Card Workspace 1.1.5 on GitHub Releases">
          <span className="lp-ver__dot" aria-hidden="true"></span>
          <span>1.1.5</span>
        </a>

        <div className="lp-tools">
          <a className="lp-tool" href="#">Docs</a>
          <a className="lp-tool" href="#">中文</a>
          <button className="lp-tool" type="button" aria-label="Switch color theme">
            <SunMark />
          </button>
          <a className="lp-tool" href="#" aria-label="GitHub repository">
            <GithubMark />
          </a>
        </div>
      </div>
    </header>
  );
}

function SectionRule() {
  return (
    <div className="lp-wrap">
      <div className="lp-section__rule"></div>
    </div>
  );
}

/* A vertical slice covering every boundary the page actually has:
   feature → proof → call to action → footer. */
function LandingSlice({ header }) {
  return (
    <React.Fragment>
      {header === 'current' ? <HeaderCurrent /> : <HeaderNext />}

      <section className="lp-section">
        <div className="lp-wrap lp-feature">
          <div className="lp-copy">
            <p className="lp-micro lp-kicker">Card boxes</p>
            <h2>Card boxes collect what folders can’t.</h2>
            <p className="lp-body">
              Save the current folder and tag scope as a card box, and matching notes keep appearing
              as the vault changes. Add individual notes when needed, remove the ones you do not
              want, and keep each box’s own sort and pins. The source files stay where they are.
            </p>
            <p className="lp-support">
              Made for research topics, long-running projects, reading lists, and any collection
              that crosses folder boundaries.
            </p>
          </div>
          <figure className="lp-media">
            <figcaption className="lp-micro lp-media__label">Rule model · accurate example</figcaption>
            <p className="lp-media__title">Field research</p>
          </figure>
        </div>
      </section>

      <SectionRule />

      <section className="lp-section lp-proof">
        <div className="lp-wrap">
          <div className="lp-proof__heading">
            <p className="lp-micro lp-kicker">Built for daily use</p>
            <h2>Quiet engineering where it matters.</h2>
          </div>
          <div className="lp-proof__list">
            <article>
              <span>01</span>
              <div>
                <h3>Chinese-aware local search</h3>
                <p>
                  Titles and Markdown bodies are indexed locally, with matches highlighted directly
                  on each card.
                </p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <h3>Only visible cards are rendered</h3>
                <p>The virtualized stream avoids mounting the full result set at once.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <h3>Processing stays on your device</h3>
                <p>
                  Card Workspace makes no network requests. Search indexing and file operations stay
                  local.
                </p>
              </div>
            </article>
          </div>
          <p className="lp-capabilities">
            Also included: favorites, pins, task counts, hover preview, sorting, bulk organization,
            complete file context menus, and Markdown, Base, Canvas, and Excalidraw cards.
          </p>
        </div>
      </section>

      <SectionRule />

      <section className="lp-section lp-final">
        <div className="lp-wrap lp-final__inner">
          <div className="lp-final__copy">
            <h2>Replace the file list with cards you can read.</h2>
            <p>
              Card Workspace is installed manually from GitHub Releases and supports Obsidian 1.9.0
              or later on desktop.
            </p>
          </div>
          <div className="lp-actions">
            <a className="lp-btn lp-btn--primary" href="#">Download from GitHub Releases</a>
            <a className="lp-btn" href="#">Read installation guide</a>
          </div>
        </div>
      </section>

      <SectionRule />

      <footer className="lp-footer">
        <div className="lp-wrap lp-footer__inner">
          <div className="lp-footer__brand">
            <a className="lp-brand" href="#">
              <span className="lp-brand__mark" aria-hidden="true"></span>
              <span className="lp-brand__name">Card Workspace</span>
            </a>
            <p>Readable notes, beside the note you are writing.</p>
          </div>
          <nav aria-label="Footer">
            <a href="#">Documentation</a>
            <a href="#">Installation</a>
            <a href="#">GitHub</a>
            <a href="#">Releases</a>
          </nav>
          <p className="lp-footer__legal">MIT licensed · Card Workspace 1.1.5</p>
        </div>
      </footer>
    </React.Fragment>
  );
}

function LandingBoard({ bounds, header }) {
  return (
    <div className="lp" data-bounds={bounds} data-header={header}>
      <LandingSlice header={header} />
    </div>
  );
}

function HeaderBoard({ header }) {
  return (
    <div className="lp" data-header={header}>
      {header === 'current' ? <HeaderCurrent /> : <HeaderNext />}
    </div>
  );
}

Object.assign(window, { LandingBoard, HeaderBoard });
