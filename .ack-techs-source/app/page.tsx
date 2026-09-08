import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CodeXml,
  Lightbulb,
  Megaphone,
  MoveRight,
  Palette,
  Sparkles,
  UsersRound,
  Zap,
} from 'lucide-react';
import { projects, type Accent } from '@/lib/projects';
import { ackPath } from '@/lib/paths';
import { team } from '@/lib/team';

const tickerItems = [
  'ÜRÜN TASARIMI',
  'WEB GELİŞTİRME',
  'YAPAY ZEKÂ',
  'MOBİL DENEYİM',
  'GÖZLEMLENEBİLİRLİK',
  'SİBER GÜVENLİK',
];

const productColors: Record<Accent, string> = {
  lime: '#c9ff45',
  blue: '#78c7ff',
  peach: '#ff7f76',
  yellow: '#ffd84f',
  lilac: '#dcd0ff',
};

const productMetrics: Record<string, { value: string; label: string }> = {
  watchtower: { value: '81', label: 'davranış özelliği' },
  'sentinel-coming': { value: 'CLI', label: 'öncelikli kurulum' },
  demandrift: { value: 'AI', label: 'pazar ajanı' },
  'ev-karnesi': { value: '1', label: 'konut raporu' },
  steward: { value: 'İÇ', label: 'şirket asistanı' },
};

export default function Home() {
  const ticker = [...tickerItems, ...tickerItems];

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="site-header site-shell" aria-label="Site üst menüsü">
        <a href="#top" className="brand-mark" aria-label="ACK Techs ana sayfa">
          ACK<span>.</span>
        </a>
        <nav className="main-nav" aria-label="Ana menü">
          <a className="nav-link" href="#ekip">
            Ekip
          </a>
          <a className="nav-link" href="#urunler">
            Ürünler
          </a>
          <a className="nav-link" href="#yaklasim">
            Yaklaşım
          </a>
          <a className="nav-link" href="#isbirligi">
            İş birliği
          </a>
        </nav>
        <a className="brutal-button brutal-button--small bg-accent" href="#katil">
          Bize katıl <ArrowUpRight aria-hidden="true" />
        </a>
      </header>

      <section id="top" className="site-shell hero-grid">
        <div className="hero-main">
          <div className="relative z-10 flex items-center justify-between">
            <span className="brutal-tag rotate-[-2deg] bg-pink">
              <Sparkles aria-hidden="true" /> Bağımsız teknoloji ekibi
            </span>
            <span className="hidden font-mono text-xs font-bold uppercase md:block">
              İstanbul · TR / 2026
            </span>
          </div>
          <div className="relative z-10 py-16">
            <p className="eyebrow mb-5">Kodun ötesinde fikir üretiyoruz.</p>
            <h1 className="hero-title">
              BİRLİKTE
              <br />
              <span className="highlight-word">ÜRETİYOR,</span>
              <br />
              BİRLİKTE BÜYÜYORUZ.
            </h1>
            <p className="mt-8 max-w-2xl text-lg font-semibold leading-relaxed sm:text-xl">
              ACK Techs olarak Watchtower, Sentinel, DemandRift ve Ev Karnesi
              gibi ürünleri tasarlayan, deneyen ve çalışan hale getiren çok
              disiplinli bir teknoloji ekibiyiz.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4">
            <a className="brutal-button brutal-button--ink" href="#urunler">
              Ürünleri keşfet <ArrowDownRight aria-hidden="true" />
            </a>
            <a className="brutal-button bg-white" href="#ekip">
              Ekiple tanış
            </a>
          </div>
          <span aria-hidden="true" className="hero-sticker">
            BUILD
            <br />
            BOLD.
          </span>
        </div>

        <aside className="hero-aside" aria-label="Ekip özeti">
          <div className="hero-aside-copy">
            <div className="hero-aside-copy-top">
              <span className="eyebrow">Biz ne yaparız?</span>
              <ArrowUpRight className="size-9" aria-hidden="true" />
            </div>
            <div className="hero-aside-heading">
              <h2 className="max-w-sm text-4xl font-black uppercase leading-[.98] sm:text-5xl">
                Fikirleri çalışan ürünlere dönüştürürüz.
              </h2>
              <div className="mt-8 flex flex-wrap gap-2">
                <span className="mini-pill">Web</span>
                <span className="mini-pill">Mobil</span>
                <span className="mini-pill">Yapay zekâ</span>
                <span className="mini-pill">Tasarım</span>
              </div>
            </div>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>10</strong>
              <span>kişilik ekip</span>
            </div>
            <div className="hero-stat">
              <strong>05</strong>
              <span>aktif ürün</span>
            </div>
            <div className="hero-stat">
              <strong>01</strong>
              <span>ortak vizyon</span>
            </div>
          </div>
        </aside>
      </section>

      <div className="ticker site-shell" aria-label="Uzmanlık alanları">
        <div className="ticker-track">
          {ticker.map((item, index) => (
            <span key={`${item}-${index}`}>
              {item} <Zap aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>

      <section id="ekip" className="site-shell section-frame bg-paper">
        <div className="section-heading">
          <div>
            <span className="section-index">01 / EKİP</span>
            <h2>
              EKRANIN
              <br />
              ARKASINDAKİLER.
            </h2>
          </div>
          <div className="section-intro">
            <UsersRound aria-hidden="true" />
            <p>
              Farklı disiplinlerden geliyoruz. Aynı masada buluşuyor,
              birbirimizin işini büyütüyoruz.
            </p>
          </div>
        </div>

        <div className="team-grid">
          {team.map((member, index) => (
            <a
              className="team-card"
              key={member.name}
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${member.name} LinkedIn profili`}
            >
              <div className="team-card-head">
                <span className="card-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="avatar-block">
                  <img
                    src={ackPath(`/profile-photos/${member.photo}`)}
                    alt={member.name}
                    width={148}
                    height={148}
                  />
                </span>
              </div>
              <div>
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-role">{member.company}</p>
                <p className="member-bio">{member.bio}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {member.tags.map((tag) => (
                  <span className="skill-chip" key={tag}>
                    #{tag}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </section>

      <section
        id="urunler"
        className="site-shell section-frame section-frame--dark"
      >
        <div className="section-heading">
          <div>
            <span className="section-index section-index--light">
              02 / ÜRÜNLER
            </span>
            <h2>
              ŞU AN NE
              <br />
              ÜRETİYORUZ?
            </h2>
          </div>
          <p className="section-copy">
            Watchtower, Sentinel, DemandRift, Ev Karnesi ve Steward. Her biri
            gerçek bir ihtiyacı daha iyi çözmek için var.
          </p>
        </div>

        <div className="products-list">
          {projects.map((project, index) => {
            const metric = productMetrics[project.slug] ?? {
              value: String(index + 1).padStart(2, '0'),
              label: project.type,
            };

            return (
              <a
                className="product-card"
                href={ackPath(`/projeler/${project.slug}/`)}
                key={project.slug}
                style={{ backgroundColor: productColors[project.accent] }}
                aria-label={`${project.name} detay sayfası`}
              >
                <div className="product-number">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="product-body">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="product-status">● {project.status}</span>
                    <span className="eyebrow">{project.type}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.cardDescription}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span className="mini-pill" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="product-metric">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                  <ArrowUpRight aria-hidden="true" />
                </div>
              </a>
            );
          })}
        </div>
      </section>

      <section id="yaklasim" className="site-shell goals-grid">
        <div className="goal-statement bg-pink">
          <span className="section-index">03 / AMACIMIZ</span>
          <blockquote>
            “Teknolojiyi daha fazla özellik için değil,{' '}
            <span>daha az sürtünme</span> için kullanıyoruz.”
          </blockquote>
          <div className="statement-footer">
            <span>ACK MANIFESTO · 2026</span>
            <MoveRight aria-hidden="true" />
          </div>
        </div>
        <div className="principles bg-yellow">
          <span className="section-index">ÇALIŞMA PRENSİPLERİ</span>
          <div className="principle-row">
            <span className="principle-icon">
              <Lightbulb aria-hidden="true" />
            </span>
            <div>
              <strong>01. Önce problemi anla</strong>
              <p>Çözümden önce doğru soruya zaman ayırırız.</p>
            </div>
          </div>
          <div className="principle-row">
            <span className="principle-icon">
              <CodeXml aria-hidden="true" />
            </span>
            <div>
              <strong>02. Küçük üret, hızlı öğren</strong>
              <p>Fikirleri erken test eder, gerçeğe göre şekillendiririz.</p>
            </div>
          </div>
          <div className="principle-row">
            <span className="principle-icon">
              <Palette aria-hidden="true" />
            </span>
            <div>
              <strong>03. İşlev kadar karakter</strong>
              <p>
                Kullanışlı olanın aynı zamanda akılda kalıcı olabileceğine
                inanırız.
              </p>
            </div>
          </div>
          <div className="principle-row">
            <span className="principle-icon">
              <BadgeCheck aria-hidden="true" />
            </span>
            <div>
              <strong>04. Sahiplen, paylaş</strong>
              <p>Başarıyı da hatayı da açıkça paylaşırız.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="isbirligi" className="site-shell partnership-section">
        <div className="partnership-copy">
          <span className="brutal-tag bg-blue">
            <Megaphone aria-hidden="true" /> MARKALAR & TOPLULUKLAR
          </span>
          <h2>
            REKLAM DEĞİL,
            <br />
            <span>DOĞRU BAĞLAM.</span>
          </h2>
          <p>
            Teknolojiye meraklı, üretken bir toplulukla markanızı anlamlı bir
            fikir etrafında buluşturalım.
          </p>
          <a className="brutal-button bg-accent" href="#iletisim">
            İş birliği konuşalım <ArrowRight aria-hidden="true" />
          </a>
        </div>
        <div className="partnership-options">
          <article className="partner-option">
            <span>01</span>
            <div>
              <h3>İçerik ortaklığı</h3>
              <p>
                Ürününüzü gerçek bir kullanım senaryosuyla, ekibin üretim
                dilinde anlatalım.
              </p>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </article>
          <article className="partner-option">
            <span>02</span>
            <div>
              <h3>Etkinlik desteği</h3>
              <p>
                Atölye, yayın ve buluşmalarda topluluğa birlikte değer katalım.
              </p>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </article>
          <article className="partner-option">
            <span>03</span>
            <div>
              <h3>Ürün entegrasyonu</h3>
              <p>
                Kâğıt üzerinde kalmayan, ölçülebilir ve doğal entegrasyonlar
                tasarlayalım.
              </p>
            </div>
            <ArrowUpRight aria-hidden="true" />
          </article>
        </div>
      </section>

      <section id="katil" className="site-shell join-section">
        <div className="join-main">
          <span className="section-index section-index--light">
            04 / AÇIK ÇAĞRI
          </span>
          <h2>
            BİZDE
            <br />
            BİR SANDALYE
            <br />
            <span>
              SANA AYRILMIŞ
              <br />
              OLABİLİR.
            </span>
          </h2>
          <p>
            Unvanından önce merakını, portföyünden önce nasıl düşündüğünü görmek
            istiyoruz.
          </p>
          <a className="brutal-button bg-pink" href="#iletisim">
            Kendini anlat <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="join-aside">
          <div>
            <span className="eyebrow">Şu alanlarda tanışmak isteriz</span>
            <div className="open-roles">
              <span>
                Frontend Developer
                <ArrowUpRight aria-hidden="true" />
              </span>
              <span>
                Product Designer
                <ArrowUpRight aria-hidden="true" />
              </span>
              <span>
                AI / ML Engineer
                <ArrowUpRight aria-hidden="true" />
              </span>
              <span>
                Community Lead
                <ArrowUpRight aria-hidden="true" />
              </span>
            </div>
          </div>
          <div className="join-steps">
            <span>01 — Kısaca kendini anlat</span>
            <span>02 — Ürettiğin bir şeyi paylaş</span>
            <span>03 — Birlikte kahve içelim</span>
          </div>
        </div>
      </section>

      <footer id="iletisim" className="site-shell site-footer">
        <div>
          <a href="#top" className="footer-logo" aria-label="Sayfanın başına dön">
            ACK<span>.</span>
          </a>
          <p>Fikirden çalışan ürüne.</p>
        </div>
        <div className="footer-contact">
          <span className="eyebrow">Bir şey mi konuşacağız?</span>
          <a href="mailto:hello@example.com">
            hello@example.com <ArrowUpRight aria-hidden="true" />
          </a>
        </div>
        <div className="footer-meta">
          <span>© 2026 ACK TECHS</span>
          <a href="#top">YUKARI DÖN ↑</a>
        </div>
      </footer>
    </main>
  );
}
