/* The docs page itself. One presentational component; the direction is chosen
   with `variant`, which only ever switches CSS. */

/* The header the whole site shares — brand, live version pill, then Docs,
   language, theme and the repo, all seated to the right. */
function SiteHeader({ locale }) {
  const t = UI[locale];
  return (
    <header className="doc-header">
      <a className="doc-brand" href="#">
        <span className="doc-brand__mark" aria-hidden="true"></span>
        <span className="doc-brand__name">Card Workspace</span>
      </a>

      <a className="doc-ver" href="#" title="Card Workspace 1.1.5 on GitHub Releases">
        <span className="doc-ver__dot" aria-hidden="true"></span>
        <span>1.1.5</span>
      </a>

      <div className="doc-header__tools">
        <a className="doc-tool doc-tool--current" href="#">{t.docs}</a>
        <a className="doc-tool" href="#">{t.lang}</a>
        <button className="doc-tool" type="button" aria-label="Switch color theme">
          <SunMark />
        </button>
        <a className="doc-tool" href="#" aria-label="GitHub repository">
          <GithubMark />
        </a>
      </div>
    </header>
  );
}

function DocsSidebar({ locale }) {
  return (
    <nav className="doc-sidebar" aria-label="Docs">
      {SIDEBAR[locale].map((group) => (
        <div key={group.label}>
          <p className="doc-micro doc-sidebar__label">{group.label}</p>
          <ul>
            {group.items.map((item) => (
              <li key={item.label}>
                <a href={item.href} aria-current={item.current ? 'page' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function DocsToc({ locale }) {
  const t = UI[locale];
  return (
    <aside className="doc-toc">
      <p className="doc-micro doc-toc__label">{t.onThisPage}</p>
      <ul>
        {TOC[locale].map((item) => (
          <li key={item.label}>
            <a href="#" aria-current={item.current ? 'true' : undefined}>
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function DocsPager({ locale }) {
  const t = UI[locale];
  return (
    <nav className="doc-pager">
      <a className="doc-pager__link" href="#">
        <span className="doc-micro doc-pager__dir">{t.prev}</span>
        <span className="doc-pager__title">{t.prevTitle}</span>
      </a>
      <a className="doc-pager__link doc-pager__link--next" href="#">
        <span className="doc-micro doc-pager__dir">{t.next}</span>
        <span className="doc-pager__title">{t.nextTitle}</span>
      </a>
    </nav>
  );
}

function DocsPage({ variant, locale }) {
  const Article = locale === 'zh' ? ArticleZh : ArticleEn;
  return (
    <div className="doc" data-variant={variant} lang={locale === 'zh' ? 'zh-CN' : 'en'}>
      <SiteHeader locale={locale} />
      <div className="doc-body">
        <DocsSidebar locale={locale} />
        <main className="doc-main">
          <article className="doc-article">
            <Article />
          </article>
          <DocsPager locale={locale} />
        </main>
        <DocsToc locale={locale} />
      </div>
    </div>
  );
}

Object.assign(window, { SiteHeader, DocsPage });
