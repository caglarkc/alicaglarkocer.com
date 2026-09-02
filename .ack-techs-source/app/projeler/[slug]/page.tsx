import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

import { BlockView } from '@/components/rich-text';
import { ackPath } from '@/lib/paths';
import { getProject, projects } from '@/lib/projects';

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = 'force-static';

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(
  { params }: ProjectPageProps,
): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    return { title: 'Proje bulunamadı — ACK Techs' };
  }

  return {
    title: `${project.name} — ACK Techs`,
    description: project.cardDescription,
    openGraph: {
      title: `${project.name} — ACK Techs`,
      description: project.cardDescription,
      type: 'article',
      locale: 'tr_TR',
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const index = projects.findIndex((item) => item.slug === project.slug);
  const projectNumber = String(index + 1).padStart(2, '0');
  const previous = index > 0 ? projects[index - 1] : projects[projects.length - 1];
  const next = index < projects.length - 1 ? projects[index + 1] : projects[0];

  return (
    <main id="top" className="page-shell">
      <header className="site-header" aria-label="Site üst menüsü">
        <a href={ackPath('/')} className="brand-mark" aria-label="ACK Techs ana sayfa">
          ACK<span>.</span>
        </a>

        <nav className="main-nav" aria-label="Ana menü">
          <a className="nav-link" href={ackPath('/#urunler')}>
            Ürünler
          </a>
          <a className="nav-link" href={ackPath('/#ekip')}>
            Ekip
          </a>
        </nav>

        <span className="eyebrow">{project.status}</span>
      </header>

      <article className="project-detail">
        <section
          className={`project-hero tone-${project.accent}`}
          aria-labelledby="project-title"
        >
          <div className="project-hero-topline">
            <a className="back-link" href={ackPath('/#projeler')}>
              <ArrowLeft aria-hidden="true" /> Tüm projeler
            </a>
            <span className="section-number">{projectNumber}</span>
          </div>

          <div className="project-hero-main">
            <span className="project-hero-type">{project.type}</span>
            <h1 id="project-title">{project.name}</h1>
          </div>

          <div className="project-hero-footer">
            <div className="tag-list">
              {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
            <span className="status">
              <i />
              {project.status}
            </span>
          </div>
        </section>

        <div className="project-lead">
          {project.lead.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>{paragraph}</p>
          ))}
        </div>

        <div className="project-body">
          {project.sections.length > 1 && (
            <nav className="project-toc" aria-label="Bu sayfada">
              <span className="project-toc-label">Bu sayfada</span>
              <ol>
                {project.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="project-sections">
            {project.sections.map((section) => (
              <section
                className="doc-section"
                id={section.id}
                key={section.id}
                aria-labelledby={`${section.id}-title`}
              >
                <h2 className="doc-h2" id={`${section.id}-title`}>
                  {section.title}
                </h2>
                {section.blocks.map((block, blockIndex) => (
                  <BlockView block={block} key={blockIndex} />
                ))}
              </section>
            ))}
          </div>
        </div>

        <nav className="project-pager" aria-label="Diğer projeler">
          <a className={`pager-card tone-${previous.accent}`} href={ackPath(`/projeler/${previous.slug}/`)}>
            <span className="pager-label">Önceki</span>
            <strong>{previous.name}</strong>
            <span className="pager-type">{previous.type}</span>
          </a>
          <a className={`pager-card tone-${next.accent}`} href={ackPath(`/projeler/${next.slug}/`)}>
            <span className="pager-label">Sonraki</span>
            <strong>{next.name}</strong>
            <span className="pager-type">{next.type}</span>
          </a>
        </nav>
      </article>

      <footer className="site-footer">
        <div>
          <a href="#top" className="footer-logo" aria-label="Sayfanın başına dön">
            ACK<span>.</span>
          </a>
        </div>
        <div className="footer-contact">
          <a href="mailto:hello@example.com">
            hello@example.com <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="footer-meta">
          <span>© 2026 ACK TECHS</span>
          <a href={ackPath('/#urunler')}>ÜRÜNLERE DÖN ↑</a>
        </div>
      </footer>
    </main>
  );
}
