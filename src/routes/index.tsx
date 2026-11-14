import { createFileRoute, Link } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { ArrowRight, KeyRound, Database, Code2 } from 'lucide-react';
import { baseOptions } from '@/lib/layout.shared';
import { pageHead } from '@/lib/shared';

export const Route = createFileRoute('/')({
  head: () =>
    pageHead(
      'Encrypted browser storage',
      'Practical documentation for encrypted localStorage and sessionStorage, with clear version and security boundaries.',
      '/',
    ),
  component: Home,
});

function Home() {
  return (
    <HomeLayout {...baseOptions()}>
      <main id="main-content" className="landing">
        <section className="hero-grid">
          <div>
            <p className="eyebrow">OSSAFRICA / DEVELOPER TOOLS</p>
            <h1>
              Your browser data.
              <br />
              <span>Under lock.</span>
            </h1>
            <p className="hero-description">
              Encrypted localStorage and sessionStorage, with a small API and clear limits. Start
              with the version your application actually runs.
            </p>
            <div className="hero-actions">
              <Link
                to="/docs/$"
                params={{ _splat: 'getting-started/quick-start' }}
                className="primary-link"
              >
                Read the docs <ArrowRight size={17} />
              </Link>
              <Link to="/docs/$" params={{ _splat: 'security' }} className="quiet-link">
                Understand the security model <ArrowRight size={16} />
              </Link>
            </div>
            <p className="release-note">
              Stable: 0.3.4 <span> / </span>{' '}
              <Link to="/docs/$" params={{ _splat: 'next' }}>
                Try the published 1.0 preview
              </Link>
            </p>
          </div>
          <div className="code-window" aria-label="Stable 0.3.4 usage example">
            <div className="code-title">
              <span className="status-dot" /> storage.ts <span>v0.3.4</span>
            </div>
            <pre>
              <code>{`import {
  initializeSecureStorage,
  secureLocalStorage,
} from 'bvault-js';

// 0.3.4 uses an application-supplied password.
await initializeSecureStorage(password);
await secureLocalStorage.setItem('theme', 'dark');

const theme = await secureLocalStorage.getItem('theme');`}</code>
            </pre>
            <div className="code-footer">
              <KeyRound size={15} /> Browser APIs. Asynchronous encryption.
            </div>
          </div>
        </section>
        <section className="principles" aria-label="Documentation topics">
          <article>
            <Code2 size={22} />
            <h2>A small surface</h2>
            <p>
              Install, initialize, and use the storage wrappers. Follow complete examples for your
              framework.
            </p>
          </article>
          <article>
            <Database size={22} />
            <h2>A clear lifecycle</h2>
            <p>
              Know where keys live, what happens on logout, and what clearing browser data means for
              your app.
            </p>
          </article>
          <article>
            <KeyRound size={22} />
            <h2>Explicit boundaries</h2>
            <p>
              Encryption does not prevent live XSS. Read the threat model before choosing what to
              store.
            </p>
          </article>
        </section>
        <footer className="landing-footer">
          <span>bVault-js · An OSSAfrica project</span>
          <a href="https://github.com/OSSAfrica/bvault-js-docs/issues">
            Improve these docs <ArrowRight size={14} />
          </a>
        </footer>
      </main>
    </HomeLayout>
  );
}
