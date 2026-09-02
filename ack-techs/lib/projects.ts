/**
 * Proje içerikleri, depo kökündeki `contents/*.md` dosyalarındaki README
 * metinlerinden birebir aktarılmıştır. Kod blokları, dosya yolları, ortam
 * değişkeni adları ve komutlar özgün hâliyle korunur.
 */

export type Block =
  | { kind: 'text'; body: string[] }
  | { kind: 'heading'; text: string }
  | { kind: 'list'; items: string[]; ordered?: boolean }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'code'; code: string }
  | { kind: 'diagram'; code: string }
  | { kind: 'quote'; body: string }
  | { kind: 'links'; items: { label: string; href: string; note?: string }[] };

export type Section = {
  id: string;
  title: string;
  blocks: Block[];
};

export type Accent = 'lime' | 'blue' | 'peach' | 'yellow' | 'lilac';

export type Project = {
  slug: string;
  name: string;
  type: string;
  status: string;
  accent: Accent;
  cardDescription: string;
  cardClassName: string;
  tags: string[];
  lead: string[];
  sections: Section[];
};

export const projects: Project[] = [
  {
    slug: 'watchtower',
    name: 'Watchtower',
    type: 'Kapalı ağ UEBA platformu',
    status: 'Üretime hazır',
    accent: 'lime',
    cardClassName: 'project-card project-card--featured',
    cardDescription:
      'Kurum içi kullanıcı ve varlık davranışını izler, temel çizgileri öğrenir; kararı LLM’e bırakmadan deterministik motorlarla açıklanabilir alarm üretir.',
    tags: ['Python', 'LangGraph', 'UEBA', 'CLI'],
    lead: [
      'Kapalı ağ kurumsal ortamlar için CLI öncelikli UEBA platformu.',
      'Watchtower kurum içi kullanıcı ve varlık davranışını izler, temel çizgileri (baseline) öğrenir, aday anomalileri deterministik motorlarla skorlar ve çalışma moduna göre açıklanabilir alarmlar ya da sessiz bulgular açar.',
      'Logların dosya sunucularından, kimlik sistemlerinden, Elasticsearch/Wazuh’tan, uygulama denetim izlerinden veya ürünle birlikte gelen `server-stack/` kapalı laboratuvar replay ortamından gelebildiği özel LAN kurulumları için tasarlanmıştır.',
    ],
    sections: [
      {
        id: 'akis',
        title: 'İşleyiş',
        blocks: [
          {
            kind: 'diagram',
            code:
              'connectors -> raw events -> normalization -> candidate events -> policy / baseline / feedback / correlation / severity -> LangGraph mode routing -> silent finding | alert case | controlled learning update',
          },
        ],
      },
      {
        id: 'ne-yapar',
        title: 'Ne yapar',
        blocks: [
          {
            kind: 'list',
            items: [
              'Birden fazla kaynaktan salt-okunur güvenlik ve iş telemetrisini alır.',
              'Ham kayıtları birleşik bir olay şemasına normalize eder.',
              '81 özellikli Watchtower taksonomisine bağlı aday davranış olaylarını çıkarır.',
              'Kullanıcı, departman, rol, varlık ve zaman penceresi temel çizgilerini öğrenir.',
              'Deterministik politika, temel çizgi, geri bildirim, korelasyon ve önem derecesi motorlarını uygular.',
              'Sonuçları learn, run ve hybrid modları üzerinden yönlendirir.',
              'Alarm kayıtları, sessiz bulgular, geri bildirim kuralları, denetim kayıtları ve raporlar oluşturur.',
              'LLM sağlayıcılarını yalnızca açıklama ve taslak görevleri için kullanır, hiçbir zaman nihai karar için değil.',
            ],
          },
        ],
      },
      {
        id: 'tavizsiz-kurallar',
        title: 'Tavizsiz kurallar',
        blocks: [
          { kind: 'text', body: ['Watchtower bilinçli olarak muhafazakârdır:'] },
          {
            kind: 'list',
            items: [
              'Bir şeyin alarm olup olmadığına LLM’ler karar vermez.',
              'LangGraph akışı orkestre eder; skorlama matematiğinin sahibi değildir.',
              'Yönetici geri bildirimi doğrudan kalıcı bir kurala dönüşmez.',
              'Geri bildirim `pending_rule -> approve -> stable` yolunu izler.',
              'Politika kuralı davranışı sessizce normalize edilmez.',
              'Bağlayıcılar salt-okunurdur; Watchtower gözlemler, açıklar ve alarm üretir.',
              'Otomatik müdahale, engelleme, süreç sonlandırma, host karantinası veya kullanıcı kilitleme yoktur.',
            ],
          },
        ],
      },
      {
        id: 'calisma-modlari',
        title: 'Çalışma modları',
        blocks: [
          {
            kind: 'table',
            head: ['Mod', 'Alarm', 'Öğrenme', 'Kullanım'],
            rows: [
              ['learn', 'Dış alarm yok', 'Evet', 'Şirketi sessizce temel çizgiye oturtmak'],
              ['run', 'Evet', 'Hayır', 'Onaylı kural ve temel çizgilerle üretim izleme'],
              ['hybrid', 'Evet', 'Kontrollü', 'Onaylı sapmayı izlerken izlemeye devam etmek'],
            ],
          },
        ],
      },
      {
        id: 'temel-yetenekler',
        title: 'Temel yetenekler',
        blocks: [
          {
            kind: 'table',
            head: ['Alan', 'Durum'],
            rows: [
              ['Özellik taksonomisi', '81/81 özellik sınıflandırıldı ve doğrulandı'],
              ['Server-stack senaryoları', '83/83 senaryo kapsandı'],
              ['Bağlayıcılar', 'server-stack, JSONL dosya, Elasticsearch, Wazuh uyumlu'],
              ['Depolama', 'SQLite migration’ları, repository’ler, denetim kayıtları'],
              ['Temel çizgi', '45 günlük varsayılan öğrenme penceresi, güven, anlık görüntüler'],
              ['Geri bildirim', 'bekleyen kural, onay, kapsamlı kalıcı kural, süre sonu'],
              ['Karar', 'deterministik politika/temel çizgi/geri bildirim/korelasyon/önem derecesi'],
              ['Graph', 'LangGraph mod yönlendirmesi, denetim, interrupt/resume'],
              ['LLM', 'OpenAI, Anthropic, Gemini, Ollama, özel OpenAI uyumlu'],
              ['CLI', 'bootstrap, modlar, ingest, alarmlar, kurallar, sorgu, health, backup'],
              ['Üretim', 'Docker, backup/restore, saklama, migration’lar, health check’ler'],
            ],
          },
        ],
      },
      {
        id: 'depo-yapisi',
        title: 'Depo yapısı',
        blocks: [
          {
            kind: 'code',
            code: `watchtower-demo/
  watchtower/          # product package
  tests/               # unit, integration, graph, LLM, E2E, production tests
  docs/                # install and operations docs
  scripts/             # install, upgrade, soak, taxonomy tooling
  reports/watchtower/  # product evidence reports
  server-stack/        # closed-network lab used as test target`,
          },
          {
            kind: 'text',
            body: [
              '`server-stack/` ürün kodu değildir. Watchtower davranışını 81 özellik ve 83 senaryoya karşı kanıtlamak için kullanılan replay ve kanıt laboratuvarıdır.',
            ],
          },
        ],
      },
      {
        id: 'hizli-baslangic',
        title: 'Hızlı başlangıç',
        blocks: [
          { kind: 'heading', text: 'Bare metal' },
          {
            kind: 'code',
            code: `python3 -m venv .venv
source .venv/bin/activate
pip install -e ".[dev]"
cp .env.example .env
./scripts/fresh_install.sh
wt status
wt health`,
          },
          { kind: 'heading', text: 'Docker' },
          {
            kind: 'code',
            code: `cp .env.example .env
docker compose config
docker compose build
docker compose run --rm watchtower wt bootstrap -u admin -e admin@corp.local
docker compose up -d
docker compose exec watchtower wt health --json`,
          },
          { kind: 'heading', text: 'Temel CLI' },
          {
            kind: 'code',
            code: `wt bootstrap -u admin -e admin@corp.local
wt status
wt modes get
wt modes set learn
wt modes set run
wt modes set hybrid
wt sources register -t file_jsonl -n "AD JSONL" -c '{"file_path":"/data/ad.jsonl"}'
wt sources list
wt sources health
wt ingest once --source <source-id>
wt alerts list
wt alerts show <alert-id>
wt alerts ack <alert-id>
wt alerts close <alert-id> --outcome true_positive
wt alerts suppress <alert-id> --duration 7d
wt findings silent --last 7d
wt rules pending
wt rules approve <pending-rule-id>
wt rules reject <pending-rule-id> --comment "too broad"
wt query "critical backend alerts in the last 24 hours"`,
          },
        ],
      },
      {
        id: 'llm-saglayicilari',
        title: 'LLM sağlayıcıları',
        blocks: [
          {
            kind: 'text',
            body: [
              'LLM sağlayıcıları isteğe bağlıdır. Her sağlayıcı kapalı olsa da Watchtower çalışmaya devam eder.',
              'Desteklenen adaptörler:',
            ],
          },
          {
            kind: 'list',
            items: [
              'OpenAI',
              'Anthropic',
              'Gemini',
              'Ollama / OpenAI uyumlu yerel uç nokta',
              'Özel OpenAI uyumlu uç nokta',
            ],
          },
          { kind: 'text', body: ['Sağlayıcı sırası şu komutlarla yapılandırılır:'] },
          {
            kind: 'code',
            code: `wt providers list
wt providers set-chain gemini,ollama
wt providers clear-chain`,
          },
          {
            kind: 'text',
            body: [
              'Sağlayıcı sırları `.env` içinde durur ve asla commit edilmemelidir. LLM çıktısı şema ile doğrulanır ve açıklama, eşleme, özet ve taslak görevleriyle sınırlıdır.',
            ],
          },
        ],
      },
      {
        id: 'testler-ve-kanit',
        title: 'Testler ve kanıt',
        blocks: [
          { kind: 'text', body: ['Ürün test paketinin tamamını çalıştırma:'] },
          { kind: 'code', code: 'pytest tests/ -q' },
          { kind: 'text', body: ['Üretim geçitlerini çalıştırma:'] },
          {
            kind: 'code',
            code: `pytest tests/production tests/load -v
docker compose config
./scripts/fresh_install.sh
./scripts/upgrade.sh`,
          },
          { kind: 'text', body: ['Kapalı laboratuvar doğrulamasını çalıştırma:'] },
          {
            kind: 'code',
            code: `cd server-stack
make test-all
make test-real-all`,
          },
          { kind: 'text', body: ['Güncel kabul kanıtı:'] },
          {
            kind: 'table',
            head: ['Geçit', 'Kanıt'],
            rows: [
              ['Ürün test paketi', '454 passed'],
              ['Özellik taksonomisi', '81/81'],
              ['Server-stack senaryoları', '83/83'],
              ['E2E özeti', 'reports/watchtower/e2e_summary.json'],
              ['Üretim hazırlığı', 'reports/watchtower/production_readiness.json'],
              ['Nihai kabul', 'reports/watchtower/final_acceptance_report.md'],
            ],
          },
        ],
      },
      {
        id: 'operasyon',
        title: 'Operasyon',
        blocks: [
          { kind: 'heading', text: 'Health' },
          { kind: 'code', code: `wt health\nwt health --json` },
          { kind: 'heading', text: 'Migration’lar' },
          { kind: 'code', code: `wt migrate status\nwt migrate upgrade` },
          { kind: 'heading', text: 'Backup ve restore' },
          {
            kind: 'code',
            code: `wt backup create
wt backup list
wt backup restore /backups/watchtower-YYYYMMDDTHHMMSS.db --yes`,
          },
          { kind: 'heading', text: 'Saklama' },
          { kind: 'code', code: `wt retention apply --dry-run\nwt retention apply` },
          { kind: 'heading', text: 'Soak' },
          {
            kind: 'code',
            code: `./scripts/soak_short.sh
SOAK_HOURS=24 ./scripts/soak_24h.sh`,
          },
        ],
      },
      {
        id: 'uretim-notlari',
        title: 'Üretim notları',
        blocks: [
          {
            kind: 'list',
            items: [
              'Operasyonel alarmlamadan önce güven oluşturmak için önce learn modunu çalıştırın.',
              'Gerçek bir şirket geçişinden önce üretilen taksonomi sınıflandırmalarını gözden geçirin.',
              '`.env` dosyasını git dışında tutun; commit edilen tek şablon `.env.example`’dır.',
              'Açıklamalar için en az bir LLM sağlayıcısı yapılandırın veya fail-open notlarına güvenin.',
              'İlk kapalı ağ kurulumundan önce belgelenen 24 saatlik soak testini çalıştırın.',
              'Graph checkpoint’i varsayılan olarak kalıcı SQLite kullanır (`WATCHTOWER_GRAPH_CHECKPOINT_PATH`); yalnızca geliştirme/testte süreç içi MemorySaver için `WATCHTOWER_GRAPH_CHECKPOINT_USE_MEMORY=true` ayarlayın; uzun süre uçuşta kalan insan onayı iş akışlarına güvenmeden önce bu eklenmelidir.',
            ],
          },
        ],
      },
      {
        id: 'dokumantasyon',
        title: 'Dokümantasyon',
        blocks: [
          {
            kind: 'links',
            items: [
              {
                label: 'Kurulum kılavuzu',
                href: 'https://github.com/ACK-Techs/watchtower-demo/blob/main/docs/install.md',
              },
              {
                label: 'Operasyon kılavuzu',
                href: 'https://github.com/ACK-Techs/watchtower-demo/blob/main/docs/operations.md',
              },
              {
                label: 'Üretim hazırlık raporu',
                href: 'https://github.com/ACK-Techs/watchtower-demo/blob/main/docs/production-readiness-report.md',
              },
              {
                label: 'Nihai kabul raporu',
                href: 'https://github.com/ACK-Techs/watchtower-demo/blob/main/reports/watchtower/final_acceptance_report.md',
              },
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'sentinel-coming',
    name: 'Sentinel Coming',
    type: 'Gözlemlenebilirlik CLI’ı',
    status: 'Geliştiriliyor',
    accent: 'blue',
    cardClassName: 'project-card',
    cardDescription:
      'Metrik, log ve trace’i tek terminal akışında toplayan ajan tabanlı CLI ve salt-okunur gözlemlenebilirlik ağ geçidi.',
    tags: ['Python', 'FastAPI', 'Kubernetes', 'OpenTelemetry'],
    lead: [
      'Sentinel Coming; ajan tabanlı bir Python CLI’ı, salt-okunur bir gözlemlenebilirlik ağ geçidi ve gerçekçi bir çok servisli test platformu etrafında kurulmuş, portföy düzeyinde bir gözlemlenebilirlik ve altyapı otomasyonu projesidir. Operatörlerin metrik, log, trace, yapılandırma ve dağıtım durumunu tek bir terminal akışından daha güvenli biçimde incelemesi gereken yerel laboratuvarlar ve Kubernetes/COS tarzı ortamlar için tasarlanmıştır.',
      'Ürünün çekirdeği `sentinel-cli`’dır: tek seferlik istemler çalıştırabilen, REPL başlatabilen, yapılandırmayı inceleyebilen, health check yapabilen, yerel gözlemlenebilirlik yığınları kurabilen ve ağ geçidi destekli bir telemetri katmanını sorgulayabilen bir Python komut satırı asistanı. Ağ geçidi; Prometheus, Loki ve Tempo erişimini tek bir salt-okunur HTTP API’si arkasında tutar, böylece CLI her arka uç URL’ini doğrudan bilmek zorunda kalmaz.',
    ],
    sections: [
      {
        id: 'problem-ve-hedefler',
        title: 'Problem ve hedefler',
        blocks: [
          {
            kind: 'text',
            body: [
              'Modern gözlemlenebilirlik yığınları güçlüdür ama operasyonel olarak parçalıdır. Bir geliştirici ya da platform mühendisi çoğu zaman bir servisin sağlıklı olup olmadığını anlamak için Grafana, Prometheus, Loki, Tempo, shell komutları, Kubernetes araçları ve runbook’lar arasında gidip gelmek zorunda kalır.',
              'Bu proje o iş akışına pratik bir yanıt arıyor:',
            ],
          },
          {
            kind: 'list',
            items: [
              'Ajan destekli altyapı ve gözlemlenebilirlik çalışması için tek bir CLI yüzeyi sunmak.',
              'Telemetri erişimini bir ağ geçidi servisi üzerinden varsayılan olarak salt-okunur tutmak.',
              'Katmanlı bir yapılandırma modeliyle yerel ve bulut LLM sağlayıcılarını desteklemek.',
              'Oturumlar, trajectory’ler, bellek çıkarımı ve kontrollü dokümantasyon güncellemeleriyle işe yarar hata ayıklama bağlamını korumak.',
              'İş akışını; servisler, veritabanları, Redis Streams, yük üretimi, kaos profilleri, Kubernetes manifest’leri ve smoke script’leri olan gerçekçi bir hedef platforma karşı doğrulamak.',
            ],
          },
        ],
      },
      {
        id: 'temel-ozellikler',
        title: 'Temel özellikler',
        blocks: [
          {
            kind: 'list',
            items: [
              '`run`, `repl`, `config`, `doctor`, `obs`, `install` ve `version` komutlarıyla ajan tabanlı CLI.',
              'OpenAI uyumlu API’ler ve Anthropic için LLM sağlayıcı desteği; Ollama gibi yerel OpenAI uyumlu uç noktalar dâhil.',
              '`mcp` ekstrası üzerinden isteğe bağlı MCP istemci entegrasyonu.',
              'Varsayılanlardan, YAML dosyalarından, ortam değişkenlerinden ve CLI bayraklarından katmanlı yapılandırma.',
              'Bash, dosya sistemi erişimi, onay modları, zaman aşımları, çıktı limitleri ve salt-okunur bash modu için araç yürütme kontrolleri.',
              'Oturum kalıcılığı, trajectory kaydı, bağlam penceresi politikası ve isteğe bağlı tur sonu bellek işleme.',
              'Prometheus metrikleri, Loki log sorguları ve Tempo trace arama/detay çağrıları için salt-okunur FastAPI gözlemlenebilirlik ağ geçidi.',
              'Ağ geçidi destekli CLI gözlemlenebilirlik komutları: `obs metric`, `obs logs` ve `obs traces`.',
              'Sentinel gözlemlenebilirlik yığını için Docker Compose kurulum varlıkları ve Kubernetes Helm chart varlıkları.',
              'Gateway, orders, payments, inventory, worker servisleri; Postgres, Redis, OpenTelemetry Collector, Locust yük senaryoları, kaos profilleri ve Kubernetes manifest’leri içeren test platformu.',
              'GitHub Actions, Ruff ve Pytest kullanan CLI paketi CI’ı.',
              'Çok mimarili GHCR derlemeleri için ağ geçidi imaj iş akışı.',
            ],
          },
        ],
      },
      {
        id: 'mimari',
        title: 'Mimari',
        blocks: [
          {
            kind: 'diagram',
            code: `User
  |
  v
sentinel-cli
  |-- LLM provider adapters
  |-- tool registry: bash, filesystem, MCP, observability tools
  |-- session, trajectory, hooks, memory, and config layers
  |
  v
observability-gateway
  |-- Prometheus: instant metric queries
  |-- Loki: query_range log retrieval
  |-- Tempo: trace search and trace detail retrieval
  |
  v
Target platform and observability backends`,
          },
          {
            kind: 'text',
            body: ['Depo ayrıca farklı ortamlar için dağıtım yolları içerir:'],
          },
          {
            kind: 'list',
            items: [
              '`for-download/compose/` Prometheus, Loki, Tempo, Grafana ve Sentinel gateway imajını içeren bir Docker Compose gözlemlenebilirlik yığını barındırır.',
              '`charts/sentinel/` mevcut bir Kubernetes kümesine kube-prometheus-stack, Loki, Tempo, Grafana ve sentinel-gateway kuran bir Helm chart içerir.',
              '`test-platform/` Sentinel iş akışı için metrik, log ve trace üretmekte kullanılan gerçekçi bir hedef uygulama ağacı içerir.',
              '`skills/` ve `cli/skills/` proje bilgisi ve uygulama referansı olarak kullanılan yapılandırılmış operasyonel ve ajan tabanlı rehber dosyalarını içerir.',
            ],
          },
        ],
      },
      {
        id: 'teknoloji-yigini',
        title: 'Teknoloji yığını',
        blocks: [
          {
            kind: 'list',
            items: [
              'CLI, ağ geçidi ve test servisleri için Python 3.11+.',
              'HTTP servisleri için FastAPI ve Uvicorn.',
              'Tipli yapılandırma ve istek/yanıt modelleri için Pydantic ve pydantic-settings.',
              'Dış API ve arka uç çağrıları için HTTPX.',
              'Yapılandırma dosyaları ve ortam yüklemesi için PyYAML ve python-dotenv.',
              'CLI çıktısı ve ilerleme gösterimi için Rich.',
              'Test ve lint iş akışları için Pytest ve Ruff.',
              'Yerel gözlemlenebilirlik ve hedef platform çalıştırmaları için Docker Compose.',
              'Küme dağıtım yolları için Helm ve Kubernetes manifest’leri.',
              'Destekleyici laboratuvar platformunda Prometheus, Loki, Tempo, Grafana, OpenTelemetry Collector, Postgres, Redis ve Locust.',
            ],
          },
        ],
      },
      {
        id: 'depo-yapisi',
        title: 'Depo yapısı',
        blocks: [
          {
            kind: 'code',
            code: `sentinel-coming/
|-- cli/                         # Sentinel CLI Python package
|-- observability-gateway/       # Read-only FastAPI gateway for telemetry backends
|-- test-platform/               # Multi-service target app, load, chaos, and smoke scripts
|-- charts/sentinel/             # Helm chart for Kubernetes observability stack
|-- for-download/                # Compose bundle and operational setup scripts
|-- scripts/                     # MicroK8s/COS helper scripts and repo automation
|-- skills/                      # COS/Juju/MicroK8s operational skill documents
|-- documantations/              # Project and phase documentation
|-- .github/workflows/           # CLI CI and gateway image workflows
\`-- agentic/                     # External/reference agent projects, not the main product`,
          },
          {
            kind: 'quote',
            body:
              'Önemli not: `agentic/` bağımsız referans projeleri içerir. Ana Sentinel uygulaması `cli/`, `observability-gateway/`, `test-platform/`, `charts/`, `for-download/`, `scripts/`, `skills/` ve `documantations/` içindedir.',
          },
        ],
      },
      {
        id: 'ana-moduller',
        title: 'Ana modüller',
        blocks: [
          { kind: 'heading', text: 'cli/' },
          {
            kind: 'text',
            body: [
              '`cli/` ana kullanıcıya dönük pakettir. Kaynak kodu `cli/src/sentinel_cli/` altında yer alır.',
              'Ana alanlar:',
            ],
          },
          {
            kind: 'list',
            items: [
              '`cli/app.py`: argparse komut yüzeyi ve çalışma zamanı bağlantıları.',
              '`agent/`: ajan döngüsü, bağlam sıkıştırma ve tur sonu işleme.',
              '`llm/`: sağlayıcı fabrikası, Anthropic adaptörü, OpenAI uyumlu adaptör, streaming, yeniden denemeler ve paylaşılan tipler.',
              '`tools/`: bash, dosya sistemi, MCP, onay, registry ve gözlemlenebilirlik araçları.',
              '`observability/`: gateway ve Grafana bağlantı kontrolleri.',
              '`config/`: Pydantic yapılandırma modelleri ve katmanlı yükleyici.',
              '`memory/`: çıkarım, dreaming, magic docs, bellek yolu işleme ve redaksiyon farkındalıklı kalıcılık.',
              '`session/`: oturum deposu ve trajectory kaydı.',
              '`installers/`: Docker Compose, Kubernetes Helm ve COS keşif/kurulum arka uçları.',
              '`assets/`: install komutunun kullandığı paketlenmiş Compose ve Helm chart varlıkları.',
            ],
          },
          { kind: 'heading', text: 'observability-gateway/' },
          {
            kind: 'text',
            body: [
              '`observability-gateway/` bağımsız bir FastAPI servisidir. Küçük ve salt-okunur bir API sunar; istekleri Prometheus, Loki ve Tempo’ya uyarlar.',
              'Uç noktalar:',
            ],
          },
          {
            kind: 'list',
            items: [
              '`GET /health`',
              '`GET /api/v1/status`',
              '`POST /api/v1/metrics/query`',
              '`POST /api/v1/logs/query_range`',
              '`POST /api/v1/traces/search`',
              '`GET /api/v1/traces/{trace_id}`',
            ],
          },
          {
            kind: 'text',
            body: [
              'Ağ geçidi, `SENTINEL_OBSERVABILITY_GATEWAY_TOKEN` yapılandırıldığında bearer-token koruması destekler. Arka uç hataları, sırları sızdırmayan yapılandırılmış bir model üzerinden döner.',
            ],
          },
          { kind: 'heading', text: 'test-platform/' },
          {
            kind: 'text',
            body: [
              '`test-platform/` gerçekçi gözlemlenebilirlik testleri için bir hedef uygulama sağlar:',
            ],
          },
          {
            kind: 'list',
            items: [
              '`gateway`: genel API cephesi.',
              '`orders`: ödemeleri ve envanteri koordine eder, Postgres’e yazar ve Redis Stream olayları yayar.',
              '`payments`: Redis idempotency ile ödeme simülasyonu.',
              '`inventory`: Redis cache-through davranışıyla stok okuma/rezervasyon.',
              '`worker`: Redis Streams tüketici grubu işlemcisi.',
              '`load/`: steady, diurnal, flash crowd ve gradual degradation dâhil Locust senaryoları.',
              '`chaos/profiles/`: healthy, slow database, cache stampede, downstream outage, memory leak ve cascading profilleri.',
              '`k8s/`: namespace, servisler, deployment/stateful kaynaklar, OpenTelemetry Collector yapılandırması ve network policy manifest’leri.',
            ],
          },
          { kind: 'heading', text: 'charts/sentinel/' },
          {
            kind: 'text',
            body: [
              'Helm chart, mevcut bir Kubernetes kümesine Prometheus, Loki, Grafana, Tempo ve Sentinel ağ geçidini kurar. Chart, Prometheus Community ve Grafana Helm depolarındaki upstream bağımlılıkları kullanır ve servis adlarını CLI keşif koduyla hizalı tutar.',
            ],
          },
          { kind: 'heading', text: 'for-download/' },
          { kind: 'text', body: ['Bu klasör dağıtım odaklı varlıkları içerir:'] },
          {
            kind: 'list',
            items: [
              '`compose/docker-compose.yaml`: yerel gözlemlenebilirlik yığını.',
              '`compose/.env.example`: compose yığını için port ve ağ geçidi token varsayılanları.',
              '`prepare-env.sh`: MicroK8s, MetalLB ve Juju hazırlık yardımcısı.',
              '`my-product-bundle.yaml`: Prometheus, Loki, Alertmanager, Grafana, Traefik, Catalogue, Tempo ve OpenTelemetry Collector içeren COS Lite bundle’ı.',
              '`faz1-telemetry.sh` ve `faz4-5.sh`: telemetri kurulumu ve dağıtım sonrası kontroller için operasyonel script’ler.',
            ],
          },
        ],
      },
      {
        id: 'kurulum',
        title: 'Kurulum',
        blocks: [
          { kind: 'text', body: ['Depoyu klonlayın ve sanal ortam oluşturun:'] },
          {
            kind: 'code',
            code: `cd sentinel-coming
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip`,
          },
          { kind: 'text', body: ['CLI’ı yerel geliştirme için kurun:'] },
          {
            kind: 'code',
            code: `cd cli
python -m pip install -e ".[dev]"
python -m sentinel_cli --help`,
          },
          { kind: 'text', body: ['CLI’ı isteğe bağlı MCP desteğiyle kurun:'] },
          {
            kind: 'code',
            code: `cd cli
python -m pip install -e ".[dev,mcp]"
python -m sentinel_cli doctor --profile local`,
          },
          { kind: 'text', body: ['Gözlemlenebilirlik ağ geçidini yerelde kurun ve çalıştırın:'] },
          {
            kind: 'code',
            code: `cd observability-gateway
python -m pip install -e ".[dev]"
sentinel-observability-gateway`,
          },
          { kind: 'text', body: ['Alternatif ağ geçidi başlatma:'] },
          {
            kind: 'code',
            code: `cd observability-gateway
uvicorn observability_gateway.main:app --host 0.0.0.0 --port 8091`,
          },
        ],
      },
      {
        id: 'yapilandirma',
        title: 'Yapılandırma',
        blocks: [
          {
            kind: 'text',
            body: ['CLI, commit edilen şablonları yerel sırlardan ayrı tutar:'],
          },
          {
            kind: 'list',
            items: [
              '`cli/config/sentinel.example.yaml`: commit edilen YAML şablonu.',
              '`cli/.env.example`: commit edilen ortam şablonu.',
              '`cli/config/sentinel.yaml`: yerel çalışma zamanı yapılandırması, Git tarafından yok sayılır.',
              '`cli/.env`: yerel sırlar ve geçersiz kılmalar, Git tarafından yok sayılır.',
            ],
          },
          { kind: 'text', body: ['Yerel yapılandırma oluşturma:'] },
          {
            kind: 'code',
            code: `cd cli
cp config/sentinel.example.yaml config/sentinel.yaml
cp .env.example .env`,
          },
          {
            kind: 'text',
            body: ['`cli/.env.example` içindeki yaygın CLI ortam değişkenleri:'],
          },
          {
            kind: 'list',
            items: [
              '`SENTINEL_CONFIG`',
              '`SENTINEL_PROFILE`',
              '`SENTINEL_MODEL`',
              '`SENTINEL_OPENAI_BASE_URL`',
              '`SENTINEL_API_KEY`',
              '`SENTINEL_LOCAL_BASE_URL`',
              '`SENTINEL_LOCAL_MODEL`',
              '`ANTHROPIC_API_KEY`',
              '`SENTINEL_ANTHROPIC_MODEL`',
              '`SENTINEL_HTTP_CONNECT_TIMEOUT_SEC`',
              '`SENTINEL_HTTP_TIMEOUT_SEC`',
              '`SENTINEL_CONTEXT_WINDOW_TOKENS`',
              '`SENTINEL_LOG_LEVEL`',
              '`SENTINEL_MAX_TURNS`',
              '`SENTINEL_AUTO_APPROVE`',
              '`SENTINEL_SESSION_DIR`',
              '`SENTINEL_TRAJECTORY_DIR`',
              '`SENTINEL_EXPERIMENTAL_MCP`',
            ],
          },
          {
            kind: 'text',
            body: [
              'Ağ geçidiyle ilgili CLI ayarları `sentinel.yaml` içindeki `observability_gateway` altında yapılandırılır:',
            ],
          },
          {
            kind: 'code',
            code: `observability_gateway:
  enabled: true
  base_url: http://127.0.0.1:8091
  timeout_sec: 10
  token_env: SENTINEL_OBSERVABILITY_GATEWAY_TOKEN`,
          },
          {
            kind: 'text',
            body: [
              '`observability-gateway/README.md` içinde belgelenen ağ geçidi servisi ortam değişkenleri:',
            ],
          },
          {
            kind: 'list',
            items: [
              '`SENTINEL_OBSERVABILITY_CONFIG_PATH`',
              '`SENTINEL_OBSERVABILITY_GATEWAY_TOKEN`',
              '`SENTINEL_OBSERVABILITY_PROMETHEUS__BASE_URL`',
              '`SENTINEL_OBSERVABILITY_PROMETHEUS__TOKEN_ENV`',
              '`SENTINEL_OBSERVABILITY_LOKI__BASE_URL`',
              '`SENTINEL_OBSERVABILITY_TEMPO__BASE_URL`',
              '`SENTINEL_OBSERVABILITY_HTTP__TIMEOUT_SEC`',
              '`SENTINEL_OBSERVABILITY_HTTP__RETRY__MAX_ATTEMPTS`',
            ],
          },
          {
            kind: 'text',
            body: [
              '`for-download/compose/.env.example` içindeki compose paketi ayrıca Prometheus, Loki, Tempo, Grafana ve Sentinel ağ geçidi için portları tanımlar.',
            ],
          },
        ],
      },
      {
        id: 'kullanim',
        title: 'Kullanım',
        blocks: [
          { kind: 'text', body: ['Tek seferlik bir ajan istemi çalıştırma:'] },
          {
            kind: 'code',
            code: `cd cli
source .venv/bin/activate
python -m sentinel_cli run "Summarize the current observability gateway status"`,
          },
          { kind: 'text', body: ['Etkileşimli REPL başlatma:'] },
          {
            kind: 'code',
            code: `cd cli
source .venv/bin/activate
python -m sentinel_cli repl`,
          },
          { kind: 'text', body: ['Etkin yapılandırmayı inceleme:'] },
          { kind: 'code', code: `cd cli\npython -m sentinel_cli config` },
          { kind: 'text', body: ['Tanılama çalıştırma:'] },
          { kind: 'code', code: `cd cli\npython -m sentinel_cli doctor --profile local` },
          { kind: 'text', body: ['Ağ geçidi üzerinden telemetri sorgulama:'] },
          {
            kind: 'code',
            code: `cd cli
python -m sentinel_cli obs metric 'up'
python -m sentinel_cli obs logs --service gateway
python -m sentinel_cli obs traces --service orders`,
          },
          { kind: 'text', body: ['Compose kurulum akışını çalıştırma:'] },
          { kind: 'code', code: `cd cli\npython -m sentinel_cli install --mode compose` },
          { kind: 'text', body: ['Kubernetes Helm kurulum akışını çalıştırma:'] },
          { kind: 'code', code: `cd cli\npython -m sentinel_cli install --mode k8s` },
          {
            kind: 'text',
            body: [
              'COS kurulum arka ucu şu anda keşif/yapılandırma bağlantılarını içerir; preflight, install ve verify adımları kodda TODO olarak işaretlidir. Mevcut MicroK8s/Juju/COS operasyonel yolu için `scripts/` ve `for-download/` altındaki script’leri kullanın.',
            ],
          },
        ],
      },
      {
        id: 'yerel-hedef-platform',
        title: 'Yerel hedef platform',
        blocks: [
          { kind: 'text', body: ['Test platformu Docker Compose ile başlatılabilir:'] },
          { kind: 'code', code: `cd test-platform\ndocker compose up --build` },
          {
            kind: 'text',
            body: [
              '`test-platform/README.md` yerel veritabanı ortam değişkenlerini ve health check’leri belgeler:',
            ],
          },
          {
            kind: 'code',
            code: `export ORDERS_DB_URL=postgresql+asyncpg://sentinel:sentinel@localhost:5432/orders_db
export PAYMENTS_DB_URL=postgresql+asyncpg://sentinel:sentinel@localhost:5432/payments_db
export INVENTORY_DB_URL=postgresql+asyncpg://sentinel:sentinel@localhost:5432/inventory_db
export PAYMENTS_REDIS_URL=redis://localhost:6379/1
python scripts/seed_db.py
curl http://localhost:8080/health
curl http://localhost:8081/health
curl http://localhost:8082/health
curl http://localhost:8083/health`,
          },
          { kind: 'text', body: ['Ground-truth senaryosu çalıştırma:'] },
          {
            kind: 'code',
            code: `cd test-platform\npython scripts/scenario_runner.py run <scenario.yaml>`,
          },
          {
            kind: 'text',
            body: [
              'Uyumlu bir MicroK8s/Juju/COS laboratuvarı hazırsa COS smoke iş akışını çalıştırma:',
            ],
          },
          { kind: 'code', code: `cd test-platform\n./scripts/run_cos_stack_check.sh` },
          { kind: 'text', body: ['Yerel yığın smoke iş akışını çalıştırma:'] },
          { kind: 'code', code: `cd test-platform\n./scripts/run_local_stack_check.sh` },
          {
            kind: 'text',
            body: [
              'Bu smoke script’leri depo düzeyindeki `.venv`’in ve gerekli yerel altyapı komutlarının var olmasını bekler. Çalıştırma çıktılarını `test-platform/runs/...` altına yazarlar.',
            ],
          },
        ],
      },
      {
        id: 'test-ve-kalite',
        title: 'Test ve kalite',
        blocks: [
          { kind: 'text', body: ['CLI lint ve testleri:'] },
          { kind: 'code', code: `cd cli\npython -m ruff check .\npython -m pytest -q` },
          { kind: 'text', body: ['Ağ geçidi testleri:'] },
          { kind: 'code', code: `cd observability-gateway\npython -m pytest -q` },
          { kind: 'text', body: ['CLI wheel derleme:'] },
          { kind: 'code', code: `cd cli\npython -m build` },
          { kind: 'text', body: ['Ağ geçidi wheel derleme:'] },
          { kind: 'code', code: `cd observability-gateway\npython -m build` },
          {
            kind: 'text',
            body: [
              '`.github/workflows/cli-ci.yml` iş akışı CLI paketini Python 3.12 üzerinde editable dev kurulumu, Ruff ve Pytest ile çalıştırır. `.github/workflows/gateway-image.yml` iş akışı ise `gateway-v*` etiketleri veya manuel tetikleme için ağ geçidi imajını derleyip GHCR’a gönderir.',
            ],
          },
        ],
      },
      {
        id: 'dagitim-secenekleri',
        title: 'Dağıtım seçenekleri',
        blocks: [
          { kind: 'text', body: ['Ağ geçidi için Docker imajı:'] },
          { kind: 'code', code: 'docker pull ghcr.io/caglarkc/sentinel-gateway:latest' },
          { kind: 'text', body: ['Helm chart:'] },
          {
            kind: 'code',
            code: `helm dependency update ./charts/sentinel
helm upgrade --install sentinel ./charts/sentinel \\
  --create-namespace -n sentinel \\
  --set gateway.token=<token>`,
          },
          {
            kind: 'text',
            body: [
              'Yerel/laboratuvar Compose yığını varlıkları `for-download/compose/` altında bulunur ve CLI kurulum varlıklarına paketlenir.',
            ],
          },
        ],
      },
      {
        id: 'guvenlik-notlari',
        title: 'Güvenlik ve güvenilirlik notları',
        blocks: [
          {
            kind: 'list',
            items: [
              'Gözlemlenebilirlik ağ geçidi bilinçli olarak salt-okunurdur; alarm yönetimi, dashboard yönetimi, arka uç yazma işlemleri veya Grafana datasource proxy’si uygulamaz.',
              '`SENTINEL_OBSERVABILITY_GATEWAY_TOKEN` yapılandırıldığında ağ geçidi bearer kimlik doğrulaması etkinleşir.',
              'Ağ geçidi arka uç hataları, yeniden denenebilirlik meta verisi ve sır sızdırmayan mesajlar içeren yapılandırılmış bir yanıt modeli kullanır.',
              'CLI yapılandırma şablonları sırları commit edilen yapılandırma dosyalarında değil ortam değişkenlerinde tutar.',
              '`.gitignore`; `.env`, yerel Sentinel oturumları, kimlik bilgileri, anahtar materyali, derleme çıktıları, önbellekler, loglar ve yerel çalıştırma çıktılarını hariç tutar.',
              'CLI araçları onay modları, shell ve dosya yazma zaman aşımları, çıktı limitleri, isteğe bağlı salt-okunur bash davranışı ve isteğe bağlı bellek yazma hapsi içerir.',
              'Bellek yazmaları, kalıcılaştırılmadan önce yaygın sır desenleri için redaksiyon mantığından geçer.',
              'Ağ geçidi Dockerfile’ı servisi root olmayan `sentinel` kullanıcısı olarak çalıştırır.',
              'Helm chart root olmayan pod güvenlik bağlamı ayarlar, ayrıcalık yükseltmeyi devre dışı bırakır, Linux yeteneklerini düşürür ve ağ geçidi konteyneri için salt-okunur kök dosya sistemi kullanır.',
            ],
          },
        ],
      },
      {
        id: 'mevcut-sinirlar',
        title: 'Mevcut sınırlar',
        blocks: [
          {
            kind: 'list',
            items: [
              'Proje, CLI paket meta verisinde Pre-Alpha olarak işaretlidir.',
              'COS kurulum arka ucu henüz tam bir kurulumcu değildir; kod preflight, install ve verify adımlarını TODO olarak işaretler.',
              'TLS sonlandırma, süreç denetimi ve sır rotasyonu gibi üretim sıkılaştırması, mevcut ağ geçidi README kapsamının dışında belgelenmiştir.',
              'README hazırlığı sırasında ana Sentinel proje ağacında ekran görüntüsü veya UI varlığı bulunamamıştır.',
              '`agentic/` harici/referans projeler içerir ve teslim edilen Sentinel ürünü olarak sunulmamalıdır.',
            ],
          },
        ],
      },
      {
        id: 'sonraki-gelistirmeler',
        title: 'Sonraki geliştirmeler',
        blocks: [
          {
            kind: 'list',
            items: [
              'MicroK8s/Juju/COS kurulumunun CLI’dan tutarlı biçimde sürülebilmesi için COS kurulum arka ucunu tamamlamak.',
              'TLS, ingress, sır rotasyonu ve süreç denetimini kapsayan bir üretim dağıtım kılavuzu eklemek.',
              'Ağ geçidi destekli ajan run ve repl iş akışları etrafında uçtan uca testleri genişletmek.',
              '`scenario_runner.py` için keşfedilebilir bir konumda örnek senaryo dosyaları eklemek.',
              'Portföy sunumu için mimari diyagramlar ve üretilmiş ekran görüntüleri veya kavramsal görseller yayımlamak.',
              'Yerel demo, Kubernetes demo ve COS laboratuvar yollarını ayıran özlü bir genel hızlı başlangıç eklemek.',
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'demandrift',
    name: 'DemandRift',
    type: 'Pazar araştırma ajanı',
    status: 'Planlama',
    accent: 'peach',
    cardClassName: 'project-card',
    cardDescription:
      'Erken aşama bir fikri kanıta dayalı araştırma dosyasına çevirir ve savunulabilir bir yön önerir: Build, Modify, Kill veya Investigate More.',
    tags: ['TypeScript', 'Next.js', 'PostgreSQL', 'AI Agents'],
    lead: [
      'DemandRift — Startup Market Intelligence Agent.',
      'DemandRift, kanıt odaklı bir girişim araştırma ve karar platformudur. Erken aşamadaki bir fikri izlenebilir bir araştırma özetine dönüştürür, izin verilen pazar kanıtlarını toplayıp normalize eder, hâlâ bilinmeyenleri belirler ve savunulabilir bir yön üretir: Build, Modify, Kill veya Investigate More.',
    ],
    sections: [
      {
        id: 'vaat',
        title: 'Ürün vaadi',
        blocks: [
          {
            kind: 'quote',
            body:
              'Fikrinizi sadece doğrulamayın. Kurulmaya hazır bir MVP ile çıkın.',
          },
        ],
      },
      {
        id: 'depo-durumu',
        title: 'Depo durumu',
        blocks: [
          {
            kind: 'text',
            body: [
              'Bu depo şu anda Faz 1–7 için onaylanmış mimari ve uygulama planlarını içerir. Bir planlama temelidir; uygulama çalışma zamanının hâlihazırda uygulandığı iddiası değildir. Faz 8, açıkça onaylanana kadar bilinçli olarak kapsam dışıdır.',
            ],
          },
        ],
      },
      {
        id: 'yasam-dongusu',
        title: 'Araştırma yaşam döngüsü',
        blocks: [
          {
            kind: 'table',
            head: ['Faz', 'Sorumluluk', 'Ana çıktı'],
            rows: [
              [
                '1 — Intake',
                'Alan kökenlerini ve varsayımları koruyarak belirsiz bir fikri, kullanıcının onayladığı araştırılabilir bir özete dönüştürmek.',
                'IdeaBriefVersion',
              ],
              [
                '2 — Planning',
                'Araştırma sorularını, kaynak/sorgu kapsamını, pazar ve dil kapsamını ve bir bütçe sözleşmesini derlemek.',
                'ResearchPlanVersion',
              ],
              [
                '3 — Acquisition',
                'Politika onaylı kaynaklardan; köken, yürütme durumu, maliyet ve erişim meta verisiyle ham kanıt toplamak.',
                'RawArtifact set',
              ],
              [
                '4 — Normalization',
                'Değişmez artefaktları ayrıştırıp normalize etmek; segmentler, tekilleştirme ilişkileri, varlık adayları ve soy bilgisi üretmek.',
                'Normalized corpus',
              ],
              [
                '5 — Gap policy',
                'İkincil araştırma boşluklarını denetlemek ve politika ile bütçe izin verdiğinde boşluk odaklı işi Faz 3 toplama çalışma zamanına geri yönlendirmek.',
                'Gap-closure trace',
              ],
              [
                '6 — Analysis',
                'Atıfla bağlanmış iddialar, bağımsızlık grupları, kümeler, kanıt haritaları, karşı kanıt ve sınıflandırılmış araştırma boşlukları oluşturmak.',
                'AnalysisDossier',
              ],
              [
                '7 — Decision',
                'Deterministik yeterlilik ve karar geçitlerini uygulamak, ardından temellendirilmiş ve sürümlenmiş bir karar dosyası üretmek.',
                'DecisionDossier',
              ],
            ],
          },
          { kind: 'text', body: ['Çekirdek akış şudur:'] },
          {
            kind: 'diagram',
            code: `Intake -> Plan -> Acquire -> Normalize -> Analyze -> Decide
           ^                                |
           |                                v
           +-------------------------- Gap policy`,
          },
          {
            kind: 'text',
            body: [
              'Faz 5 ikinci bir toplama hattı oluşturmaz. Faz 3, 4 ve 6 üzerinden sınırlı bir gap_driven döngüyü kontrol eder. Birincil doğrulama boşlukları ayrı tutulur ve ek web araştırmasıyla kapatılamaz.',
            ],
          },
        ],
      },
      {
        id: 'platform-mimarisi',
        title: 'Planlanan platform mimarisi',
        blocks: [
          {
            kind: 'text',
            body: [
              'DemandRift, faz modülleri arasında açık ve sürümlenmiş sözleşmeleri olan bir TypeScript/Node.js modüler monoliti olarak tasarlanmıştır.',
            ],
          },
          {
            kind: 'list',
            items: [
              'Web ve API katmanı için Next.js',
              'Birincil işlemsel ve analitik depo olarak PostgreSQL',
              'Değişmez ham artefaktlar için S3 uyumlu nesne depolama',
              'Dayanıklı iş akışları için, bir adaptör sınırı arkasında Temporal',
              'Şema doğrulama, model yönlendirme, prompt sürümleme ve maliyet muhasebesi içeren, sağlayıcıdan bağımsız bir AI Gateway',
              'Paylaşılan bir Egress Gateway arkasında, politika denetimli bir bağlayıcı çalışma zamanı',
              'İsteğe bağlı izole Playwright ve Python analitik worker’ları',
              'OpenTelemetry tabanlı trace’ler, metrikler, yapılandırılmış loglar ve denetim kayıtları',
            ],
          },
          {
            kind: 'text',
            body: [
              'Kesişen platform modülleri; kiracı izolasyonu, kaynak politikası, iş akışı durumu, bütçe rezervasyonları, atıf bağlama, depolama ve gözlemlenebilirliğin sahibidir. Paylaşılan sözleşmelerin Zod ve JSON Schema kullanılarak `packages/contracts` altında yer alması planlanmaktadır.',
            ],
          },
        ],
      },
      {
        id: 'kanit-kurallari',
        title: 'Tavizsiz kanıt kuralları',
        blocks: [
          {
            kind: 'list',
            items: [
              'Doğrulanmamış bir yapay zekâ hipotezi araştırmayı başlatamaz.',
              'Bir arama sonucu getirilmiş kanıt değildir; erişilemeyen bir kaynak da “sonuç yok” bulgusu değildir.',
              'Kopyalar ve yeniden paylaşımlar bağımsız kanıt değildir.',
              'Bir atıf, tam alıntıyı offset’lere, içerik hash’lerine ve bir normalizasyon sürümüne bağlamalıdır.',
              'Beyan edilen ödeme isteği, gözlemlenmiş ödeme davranışı değildir.',
              'Şikâyetin yokluğu, memnuniyetin kanıtı değildir.',
              'Yeni bir pazarda kanıt kıtlığı, tek başına bir Kill sinyali değildir.',
              'Yapay zekâ; kaynak, kiracı, bütçe, atıf veya karar politikası geçitlerini atlayamaz.',
            ],
          },
        ],
      },
      {
        id: 'planlama-dokumanlari',
        title: 'Planlama dokümanları',
        blocks: [
          { kind: 'text', body: ['Proje dokümanlarını şu sırayla okuyun:'] },
          {
            kind: 'links',
            items: [
              {
                label: 'Ust-Yonetim-Ana-Mimari-Plani.md',
                href: 'https://github.com/ACK-Techs/DemandRift---Startup_Market_Intelligence_Agent/blob/main/Ust-Yonetim-Ana-Mimari-Plani.md',
                note: 'sistem kapsamı, faz sınırları ve entegrasyon sırası',
              },
              {
                label: 'Platform-Temeli.md',
                href: 'https://github.com/ACK-Techs/DemandRift---Startup_Market_Intelligence_Agent/blob/main/Platform-Temeli.md',
                note: 'paylaşılan teknik mimari ve değişmezler',
              },
              {
                label: 'Faz1-Plan.md — Faz7-Plan.md',
                href: 'https://github.com/ACK-Techs/DemandRift---Startup_Market_Intelligence_Agent/blob/main/Faz1-Plan.md',
                note: 'faza özgü planlar',
              },
              {
                label: '.orchestrator/SYSTEM.md',
                href: 'https://github.com/ACK-Techs/DemandRift---Startup_Market_Intelligence_Agent/blob/main/.orchestrator/SYSTEM.md',
                note: 'teslim kontrol düzlemi ve kanıta dayalı iş kalemi yaşam döngüsü',
              },
            ],
          },
        ],
      },
      {
        id: 'yerel-yapilandirma',
        title: 'Yerel yapılandırma',
        blocks: [
          {
            kind: 'text',
            body: [
              'Yalnızca güvenli şablonlar commit edilir. Uygun şablonu kopyalayın ve boş ya da replace-with-* değerlerini yerelde değiştirin:',
            ],
          },
          { kind: 'code', code: 'Copy-Item .env.example .env.local' },
          {
            kind: 'text',
            body: [
              'İzole test yapılandırması için temel olarak `.env.test.example` kullanın. Gerçek `.env` varyantları Git tarafından yok sayılır ve asla commit edilmemelidir.',
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'ev-karnesi',
    name: 'Ev Karnesi',
    type: 'Konut karar destek uygulaması',
    status: 'Keşif',
    accent: 'yellow',
    cardClassName: 'project-card',
    cardDescription:
      'Yapı, zemin, afet, çevre ve ulaşım verilerini kaynağı ve güven seviyesi görünen tek bir açıklanabilir konut raporunda birleştirir.',
    tags: ['Coğrafi Veri', 'Risk Analizi', 'Mobil', 'Web'],
    lead: [
      'Ev Karnesi, bir evi satın almadan veya kiralamadan önce yalnızca ilan sahibinin ya da emlak danışmanının verdiği bilgilerle yetinmek istemeyen kullanıcılar için tasarlanan konum tabanlı konut inceleme ve karar destek uygulamasıdır.',
      'Kullanıcı bir adres girerek, haritada binayı işaretleyerek veya bulunduğu konumda yapının dış cephesini görüntüleyerek inceleme başlatır. Uygulama; yapı, zemin, doğal afet, çevre, ulaşım, iklim ve günlük yaşam verilerini bir araya getirerek açıklanabilir bir Ev Karnesi oluşturur.',
      'Ev Karnesi bir mühendislik dayanıklılık raporu, ekspertiz raporu veya “güvenli bina” sertifikası değildir. Resmî ve güvenilir kaynaklardan elde edilebilen verileri anlaşılır risk göstergelerine dönüştüren bir ön değerlendirme ve karar destek ürünüdür.',
    ],
    sections: [
      {
        id: 'problem',
        title: 'Problem',
        blocks: [
          {
            kind: 'text',
            body: [
              'Konut satın alma ve kiralama kararlarında kritik bilgiler farklı kurumlarda, farklı formatlarda ve çoğu zaman teknik bir dille yayımlanır. Kullanıcılar genellikle:',
            ],
          },
          {
            kind: 'list',
            items: [
              'İlan açıklaması ve satıcı beyanıyla sınırlı kalır.',
              'Zeminin ve çevresel afet risklerinin ne anlama geldiğini bilemez.',
              'Binanın yaşı, ruhsatı veya konumu hakkındaki bilgileri doğrulamakta zorlanır.',
              'Ulaşım, güneş, rakım, eğim, gürültü ve günlük yaşam koşullarını ayrı ayrı araştırır.',
              'Bir evin kendi ihtiyaçlarına gerçekten uygun olup olmadığını ortak bir ölçekte karşılaştıramaz.',
              'Kritik veri eksikliği ile düşük risk sonucunu birbirinden ayıramaz.',
            ],
          },
          {
            kind: 'text',
            body: [
              'Ev Karnesi bu parçalı araştırmayı tek, kaynaklı ve açıklanabilir bir raporda toplar.',
            ],
          },
        ],
      },
      {
        id: 'urun-vaadi',
        title: 'Ürün vaadi',
        blocks: [
          { kind: 'text', body: ['Ev Karnesi şu soruya cevap vermeyi hedefler:'] },
          {
            kind: 'quote',
            body:
              '“Bu ev hakkında karar vermeden önce bilmem gereken önemli noktalar neler ve bu ev benim ihtiyaçlarıma ne kadar uygun?”',
          },
          {
            kind: 'text',
            body: [
              'Uygulama kullanıcıya yalnızca tek bir puan göstermez. Her sonucun dayandığı veri kaynağını, güncellik tarihini, güven seviyesini, veri eksiklerini ve gerekiyorsa uzman incelemesi önerisini de sunar.',
            ],
          },
        ],
      },
      {
        id: 'hedef-kullanicilar',
        title: 'Hedef kullanıcılar',
        blocks: [
          {
            kind: 'list',
            items: [
              'İlk kez ev satın alacak kişiler',
              'Kiralık ev arayanlar',
              'Çocuklu aileler',
              'Deprem ve doğal afet riskine öncelik verenler',
              'Başka bir şehir veya mahalleye taşınacak kişiler',
              'Araç kullanmadan yaşamak isteyenler',
              'Gayrimenkul yatırımcıları',
              'Gayrimenkul danışmanları ve bağımsız ekspertiz uzmanları',
            ],
          },
        ],
      },
      {
        id: 'kullanici-akisi',
        title: 'Temel kullanıcı akışı',
        blocks: [
          {
            kind: 'list',
            ordered: true,
            items: [
              'Kullanıcı adres arar, haritada bir bina/parsel seçer veya mevcut konumunu kullanır.',
              'Gerekirse binanın dış cephe fotoğrafını ekler; fotoğraf tek başına kesin bina kimliği veya dayanıklılık kanıtı sayılmaz.',
              'Sistem seçilen konumun adres, bina ve parsel eşleşmesini kullanıcıya doğrulatır.',
              'Kullanıcı önceliklerini belirler: güvenlik, ulaşım, aile yaşamı, iklim konforu, yatırım veya kişisel ağırlıklar.',
              'Sistem yetkili/açık veri kaynaklarından ilgili verileri toplar ve veri kalitesini değerlendirir.',
              'Açıklanabilir skorlar, riskler, olumlu yönler, bilinmeyenler ve önerilen kontrollerle Ev Karnesi üretilir.',
              'Kullanıcı evleri yan yana karşılaştırabilir, raporu paylaşabilir veya daha sonra tekrar inceleyebilir.',
            ],
          },
        ],
      },
      {
        id: 'rapor',
        title: 'Ev Karnesi raporu',
        blocks: [
          {
            kind: 'text',
            body: [
              'İlk sürüm gösterim ve veri dalgaları `docs/report-field-priority.md` içindedir. Gösterim önceliği ile veri çekim sırası aynı şey değildir.',
            ],
          },
          {
            kind: 'links',
            items: [
              {
                label: 'docs/report-field-priority.md',
                href: 'https://github.com/ACK-Techs/house-report-card/blob/main/docs/report-field-priority.md',
              },
            ],
          },
          { kind: 'heading', text: '1. Bina ve yapı bilgileri' },
          {
            kind: 'list',
            items: [
              'Tahmini veya doğrulanmış bina yaşı',
              'Yapım yılı ve geçerli deprem yönetmeliği dönemi',
              'Yapı kullanım amacı ve kat sayısı',
              'Yapı tipi ve taşıyıcı sistem bilgisi, erişilebildiği ölçüde',
              'Ruhsat, yapı kullanma izin belgesi ve resmî kayıt durumu, erişilebildiği ölçüde',
              'Geçmiş hasar, güçlendirme veya kentsel dönüşüm bilgileri, doğrulanabilir kaynak varsa',
              'Güncel imar durumu (askıdaki plan değişikliğinden ayrı)',
              'Bina/parsel/adres eşleşmesinin güven seviyesi',
              'Yerinde mühendislik incelemesi gerektiren bilinmeyenler',
            ],
          },
          { kind: 'heading', text: '2. Deprem ve zemin' },
          {
            kind: 'list',
            items: [
              'Deprem tehlike düzeyi',
              'Aktif faylara göre bölgesel konum',
              'Zemin sınıfı veya jeolojik yapı',
              'Sıvılaşma ve zemin büyütmesi göstergeleri',
              'Dolgu alanı veya alüvyon zemin göstergeleri',
              'Resmî mikrobölgeleme verileri, mevcutsa',
              'DASK prim grubu (yalnız sigorta bağlamı; tehlike veya dayanım değildir)',
              'Verinin çözünürlüğü: bina, parsel, mahalle veya bölge düzeyi',
            ],
          },
          {
            kind: 'quote',
            body:
              'Deprem tehlikesi, zemin etkisi ve gerçek bina dayanımı ayrı kavramlar olarak gösterilir. Bölgesel düşük tehlike, bir binanın yapısal olarak güvenli olduğu anlamına gelmez. DASK prim grubu AFAD tehlike katmanı ile karıştırılmaz.',
          },
          { kind: 'heading', text: '3. Diğer doğal afet ve çevresel riskler' },
          {
            kind: 'list',
            items: [
              'Sel ve su baskını',
              'Heyelan ve kaya düşmesi',
              'Çığ',
              'Kıyı taşkını ve tsunami',
              'Orman yangınına maruz kalma',
              'Aşırı sıcak, fırtına ve benzeri iklim kaynaklı riskler',
              'Arazi eğimi ve yüzey akışı',
            ],
          },
          {
            kind: 'quote',
            body:
              'Yalnızca konum için anlamlı risk türleri gösterilir; kıyıdan uzak bir konutta tsunami gibi ilgisiz başlıklar raporu gereksiz biçimde etkilemez.',
          },
          { kind: 'heading', text: '4. Konum, iklim ve fiziksel konfor' },
          {
            kind: 'list',
            items: [
              'Rakım',
              'Arazi eğimi ve bakı',
              'Dairenin veya binanın cephesi',
              'Mevsimlere göre yaklaşık güneş alma süresi',
              'Hâkim rüzgâr ve rüzgâra açıklık',
              'Sıcaklık, nem ve hissedilen iklim koşulları',
              'Hava kalitesi',
              'Gürültü kaynaklarına yakınlık',
              'Gölgeleme yaratabilecek çevre yapılar',
            ],
          },
          {
            kind: 'quote',
            body:
              'Cephe değerlendirmesi şehir, iklim, kat, çevredeki yapılar ve kullanıcının sıcaklık/güneş tercihleriyle birlikte yapılır; tek bir yön herkes için otomatik olarak “iyi” veya “kötü” sayılmaz.',
          },
          { kind: 'heading', text: '5. Ulaşım ve erişilebilirlik' },
          {
            kind: 'list',
            items: [
              'Metro, metrobüs, tramvay, tren ve otobüs durakları',
              'Duraklara gerçek yürüme mesafesi ve tahmini süre',
              'Toplu taşıma sıklığı ve aktarma gereksinimi, veri varsa',
              'Ana yollara erişim',
              'Yaya ve bisiklet erişilebilirliği',
              'Otopark durumu hakkında mevcut göstergeler',
              'Engelli ve bebek arabalı kullanıcılar için erişilebilirlik göstergeleri',
            ],
          },
          { kind: 'heading', text: '6. Günlük yaşam ve mahalle' },
          {
            kind: 'list',
            items: [
              'Hastane, aile sağlığı merkezi ve eczane',
              'Okul, kreş ve üniversite',
              'Market, pazar ve alışveriş alanları',
              'Park, yeşil alan ve spor alanları',
              'Acil toplanma alanları',
              'Mahalle bina stoku yaş dağılımı (bölge bağlamı; seçilen binanın yaşı değildir)',
              'İnternet ve mobil bağlantı altyapısı, erişilebildiği ölçüde',
              'Sanayi, yüksek gerilim hattı, yoğun trafik veya benzeri çevresel etkiler',
              'Planlanan yol, yapılaşma ve imar değişiklikleri, doğrulanabilir veri varsa',
            ],
          },
          { kind: 'heading', text: '7. Kişiselleştirilmiş uygunluk' },
          {
            kind: 'text',
            body: [
              'Ayrı bir veri kaynağı değildir; kullanıcı profilinin kategori sonuçlarına uygulanmasıdır. İlk sürümde durur. Aynı ev farklı kullanıcılar için farklı sonuç verebilir. Kullanıcı profiline göre kategori ağırlıkları değiştirilebilir:',
            ],
          },
          {
            kind: 'list',
            items: [
              'Çocuklu aile',
              'Öğrenci',
              'Uzaktan çalışan',
              'Araçsız yaşayan',
              'Yaşlı veya hareket kısıtlı birey',
              'Yatırım amaçlı alıcı',
              'Kullanıcının belirlediği özel profil',
            ],
          },
        ],
      },
      {
        id: 'skorlama',
        title: 'Skorlama ve açıklanabilirlik',
        blocks: [
          {
            kind: 'text',
            body: [
              'Ana sonuç 0–100 arası bir uygunluk skoru ve kategori bazlı alt skorlar içerebilir. Ancak skorun yanında mutlaka şunlar bulunur:',
            ],
          },
          {
            kind: 'list',
            items: [
              'Skoru etkileyen olumlu ve olumsuz faktörler',
              'Her faktörün ağırlığı',
              'Kullanılan kaynağın adı ve tarihi',
              'Verinin coğrafi çözünürlüğü',
              'Veri güven seviyesi',
              'Eksik veya çelişkili veriler',
              'Uzman ya da yerinde kontrol gerektiren konular',
            ],
          },
          {
            kind: 'quote',
            body:
              'Risk seviyesi ile veri güven seviyesi birbirinden ayrılır. Örneğin “düşük sel riski / düşük veri güveni” ile “düşük sel riski / yüksek veri güveni” aynı sonuç değildir.',
          },
        ],
      },
      {
        id: 'veri-ilkeleri',
        title: 'Veri ilkeleri',
        blocks: [
          {
            kind: 'list',
            items: [
              'Mümkün olduğunda resmî, güncel ve coğrafi çözünürlüğü bilinen kaynaklar tercih edilir.',
              'Her türetilmiş sonuç kaynak, tarih, yöntem ve veri sürümüyle izlenebilir olmalıdır.',
              'Mahalle düzeyindeki veri bina düzeyinde kesin gerçek gibi sunulmaz.',
              'Veri bulunamaması “risk yok” şeklinde yorumlanmaz.',
              'Çelişkili kaynaklar gizlenmez; kullanıcıya belirsizlik olarak gösterilir.',
              'Fotoğraf ve yapay zekâ çıkarımları doğrulanmış resmî veri yerine geçmez.',
              'Hassas konum, kullanıcı hesabı ve fotoğraflar veri minimizasyonu ilkesiyle işlenir.',
              'Verinin kullanım lisansı, saklama süresi ve yeniden dağıtım hakkı kayıt altına alınır.',
            ],
          },
        ],
      },
      {
        id: 'hukuki-sinirlar',
        title: 'Güvenlik ve hukuki sınırlar',
        blocks: [
          {
            kind: 'list',
            items: [
              'Uygulama kesin “güvenli/güvensiz bina” hükmü vermez.',
              'Yapısal dayanım için yetkili inşaat/deprem mühendisinin yerinde incelemesi gerekir.',
              'Skorlar resmî ekspertiz, değerleme, sigorta veya belediye/afet kurumu kararı değildir.',
              'Kullanıcı tarafından yüklenen fotoğraflarda yüz, plaka ve kişisel alan gibi unsurlar için gizlilik önlemleri uygulanmalıdır.',
              'Konum ve ev arama geçmişi hassas veri kabul edilmelidir.',
              'Suç ve demografik veriler ayrımcılık, damgalama ve hatalı çıkarım riskleri nedeniyle özel ürün/hukuk incelemesi olmadan skora eklenmemelidir.',
            ],
          },
        ],
      },
      {
        id: 'mvp',
        title: 'İlk sürüm (MVP)',
        blocks: [
          {
            kind: 'text',
            body: ['İlk sürümün tek şehirde, tercihen İstanbul’da doğrulanması planlanır.'],
          },
          { kind: 'heading', text: 'MVP kapsamı' },
          {
            kind: 'list',
            items: [
              'Adres arama ve haritadan bina/konum seçimi',
              'Adres-konum doğrulama',
              'Deprem tehlikesi, erişilebilir zemin verisi, sel ve heyelan göstergeleri',
              'Bina yaşı gibi erişilebilir temel yapı bilgileri',
              'Rakım, eğim ve yaklaşık güneş/cephe analizi',
              'Metro, metrobüs, raylı sistem, otobüs ve temel günlük ihtiyaç noktalarına erişim',
              'Kategori bazlı açıklanabilir skor',
              'Kaynak, güncellik, çözünürlük ve güven seviyesi gösterimi',
              '“Dikkat edilmesi gerekenler” ve “uzmana sorulacaklar” listesi',
              'En az iki evi karşılaştırma',
            ],
          },
          { kind: 'heading', text: 'MVP dışında bırakılabilecek ilk alanlar' },
          {
            kind: 'list',
            items: [
              'Fotoğraftan otomatik yapısal kusur teşhisi',
              'Kesin bina dayanıklılık değerlendirmesi',
              'Türkiye’nin tamamında aynı veri kapsaması',
              'Otomatik gayrimenkul fiyat tahmini',
              'Kullanıcı yorumlarına dayalı mahalle puanı',
              'Resmî belgeye erişim garantisi',
            ],
          },
        ],
      },
      {
        id: 'sonraki-asamalar',
        title: 'Sonraki aşamalar',
        blocks: [
          { kind: 'heading', text: 'Aşama 1 — Ürün ve veri doğrulama' },
          {
            kind: 'list',
            items: [
              'Kullanıcı görüşmeleri ve problem doğrulama',
              'İstanbul için veri kaynakları ve lisans envanteri',
              'Risk sözlüğü, metodoloji ve açıklama dili',
              'Harita üzerinde örnek rapor prototipi',
            ],
          },
          { kind: 'heading', text: 'Aşama 2 — MVP' },
          {
            kind: 'list',
            items: [
              'Konum seçimi',
              'Veri toplama ve normalizasyon',
              'Temel risk/yaşam kategorileri',
              'Açıklanabilir rapor ve karşılaştırma',
            ],
          },
          { kind: 'heading', text: 'Aşama 3 — Güven ve kişiselleştirme' },
          {
            kind: 'list',
            items: [
              'Kullanıcı profilleri ve ağırlıklar',
              'Veri güven/çelişki motoru',
              'Rapor sürümleme ve değişiklik bildirimleri',
              'Uzman kontrol listeleri',
            ],
          },
          { kind: 'heading', text: 'Aşama 4 — Ölçekleme' },
          {
            kind: 'list',
            items: [
              'Yeni şehirler',
              'Daha fazla belediye ve veri sağlayıcı entegrasyonu',
              'Kurumsal/API ürünü',
              'Emlak danışmanı, ekspertiz ve finans kuruluşu iş akışları',
            ],
          },
        ],
      },
      {
        id: 'gelir-modelleri',
        title: 'Olası gelir modelleri',
        blocks: [
          {
            kind: 'list',
            items: [
              'Ücretsiz özet, ücretli ayrıntılı rapor',
              'Belirli sayıda karşılaştırma içeren abonelik',
              'Gayrimenkul profesyonelleri için ekip paketi',
              'Kurumsal API ve toplu analiz',
              'Kullanıcı onayı ve tarafsızlık ilkeleri korunarak uzman/ekspertiz yönlendirmesi',
            ],
          },
          {
            kind: 'quote',
            body:
              'Gelir modeli skorları veya risk sonuçlarını ticari ortak lehine değiştiremez. Sponsorlu içerik ile bağımsız analiz açıkça ayrılmalıdır.',
          },
        ],
      },
      {
        id: 'basari-olcutleri',
        title: 'Başarı ölçütleri',
        blocks: [
          {
            kind: 'list',
            items: [
              'Başlatılan incelemelerin tamamlanma oranı',
              'Kullanıcının rapordan sonra daha bilinçli karar verdiğini belirtme oranı',
              'Karşılaştırılan ev sayısı',
              'Kaynaklı veri kapsamı ve güncelliği',
              'Yanlış bina/konum eşleşmesi oranı',
              'Bilinmeyen veya düşük güvenli verilerin doğru etiketlenme oranı',
              'Kullanıcının rapordaki kritik uyarıları anlama oranı',
              'Ücretli ayrıntılı rapora dönüşüm',
            ],
          },
        ],
      },
      {
        id: 'urun-ilkeleri',
        title: 'Temel ürün ilkeleri',
        blocks: [
          {
            kind: 'list',
            items: [
              '**Kaynak önce gelir:** Her önemli iddia kaynağına kadar izlenebilir olmalıdır.',
              '**Belirsizlik görünürdür:** Bilinmeyen veri, düşük risk gibi gösterilemez.',
              '**Açıklama puandan önemlidir:** Kullanıcı skorun nedenini anlayabilmelidir.',
              '**Tehlike ve dayanım ayrıdır:** Bölgesel risk, binanın gerçek yapısal performansı değildir.',
              '**Kişiye göre uygunluk değişir:** Tek bir ev puanı herkes için evrensel kabul edilmez.',
              '**Karar kullanıcıdadır:** Uygulama destekler; uzman veya kullanıcı kararının yerine geçmez.',
              '**Gizlilik varsayılandır:** Konum ve fotoğraf verileri gerektiğinden fazla toplanmaz veya saklanmaz.',
              '**Ticari tarafsızlık korunur:** Gelir modeli analiz sonuçlarını etkileyemez.',
            ],
          },
        ],
      },
      {
        id: 'acik-kararlar',
        title: 'Açık ürün kararları',
        blocks: [
          {
            kind: 'list',
            items: [
              'İlk pilot ilçeler ve kullanılabilecek resmî veri setleri',
              'Bina/parsel eşleştirmede kabul edilebilir doğruluk seviyesi',
              'Ana skorun sunulup sunulmayacağı ve kategori ağırlıkları',
              'Ücretsiz ve ücretli rapor arasındaki sınır',
              'Fotoğraf özelliğinin MVP’ye girip girmeyeceği',
              'Raporların ne sıklıkla yenileneceği',
              'Kullanıcıların hatalı veri bildirme ve düzeltme süreci',
              'Web, mobil veya ikisinin birlikte başlangıç sırası',
            ],
          },
        ],
      },
      {
        id: 'proje-durumu',
        title: 'Proje durumu',
        blocks: [
          {
            kind: 'text',
            body: [
              'Ev Karnesi şu anda fikir, ürün keşfi ve teknik planlama aşamasındadır. Bu depo; ürün belgeleri, mimari kararlar, veri sözleşmeleri, uygulama kodu, testler ve agent tabanlı geliştirme iş akışının ortak çalışma alanı olacaktır.',
            ],
          },
        ],
      },
    ],
  },

  {
    slug: 'steward',
    name: 'Steward',
    type: 'Şirket içi asistan',
    status: 'Şirket içi',
    accent: 'lilac',
    cardClassName: 'project-card',
    cardDescription:
      'Her çalışanın kendi bilgisayarında çalışan, yetkili kurulumla şirket sistemlerine bağlanan ve kendini güncelleyen kişiselleştirilmiş asistan.',
    tags: ['AI Agents', 'Kurumsal', 'Masaüstü'],
    lead: [
      'Şirket içi, her çalışanın kendi bilgisayarında kullandığı kişiselleştirilmiş asistan. Yetkili kişi ilk kurulumu ve sistem entegrasyonunu açar. Agent, şirketin işini gösterir ve yapmaya yetkilidir; kendini günceller.',
    ],
    sections: [
      {
        id: 'kapsam',
        title: 'Kapsam',
        blocks: [
          {
            kind: 'list',
            items: [
              'Watchtower ayrı durur; bu ürün ona dokunmaz.',
              'Şirket içi ürün kaydı `internal/` altındadır. O klasör yayına çıkmaz.',
            ],
          },
        ],
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
