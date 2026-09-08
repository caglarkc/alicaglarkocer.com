export type TeamMember = {
  name: string;
  initials: string;
  role: string;
  company: string;
  bio: string;
  tags: string[];
  color: string;
  linkedin: string;
  photo: string;
};

export const team: TeamMember[] = [
  {
    name: 'Ali Çağlar Koçer',
    initials: 'AK',
    role: 'Founder · Backend & AI Lead',
    company: 'ACK Techs',
    bio: 'Local-first gözlemlenebilirlik (Sentinel, Watchtower), AI ajan sistemleri ve dağıtık mikroservis mimarileri geliştiriyor.',
    tags: ['Python', 'Go', 'LLMOps', 'Observability'],
    color: '#c9ff45',
    linkedin: 'https://www.linkedin.com/in/ali-caglar-kocer/',
    photo: 'ali-caglar-kocer.png',
  },
  {
    name: 'Doğukan Taha Tıraş',
    initials: 'DT',
    role: 'Co-Founder · Frontend & AI Lead',
    company: 'Turkish Airlines',
    bio: 'Modern React/Next.js arayüzleri, Haier Europe Datathon 4.lüğü ve Learning-to-Rank arama optimizasyonu.',
    tags: ['Next.js', 'React', 'Data Science', 'Semantic Search'],
    color: '#ffd84f',
    linkedin: 'https://www.linkedin.com/in/dogukantahatiras/',
    photo: 'dogukan-taha-tiras.png',
  },
  {
    name: 'Ayşenur Demezoğlu',
    initials: 'AD',
    role: 'Frontend Developer',
    company: 'Iceberg Digital',
    bio: 'Hızlı, erişilebilir ve karakterli arayüzler kuruyor; karmaşık ürün akışlarını sade bileşenlere indirgiyor.',
    tags: ['React', 'Next.js', 'TypeScript', 'CSS'],
    color: '#dcd0ff',
    linkedin: 'https://www.linkedin.com/in/aysenurdemezoglu/',
    photo: 'aysenur-demezoglu.jpeg',
  },
  {
    name: 'Sena Demirbaş',
    initials: 'SD',
    role: 'Data Engineer & AI',
    company: 'EPAM Systems',
    bio: 'LLM Context Engineering, veri boru hatları, AI destekli test mimarileri ve bağımsız oyun geliştirme.',
    tags: ['Context Eng', 'Data Eng', 'Python', 'C# / .NET'],
    color: '#ffd1b8',
    linkedin: 'https://www.linkedin.com/in/sena-demirbas/',
    photo: 'sena-demirbas.jpeg',
  },
  {
    name: 'Zeliha Kavak',
    initials: 'ZK',
    role: 'Backend & Cyber Security',
    company: 'ACK Techs',
    bio: 'Sentinel güvenlik testleri, açıklanabilir tehdit analizi ve kapalı ağlarda güvenilir backend servisleri üzerine çalışıyor.',
    tags: ['Cyber Security', 'Zero Trust', 'Post-Quantum', 'PenTest'],
    color: '#ff7f76',
    linkedin: 'https://www.linkedin.com/in/zelihakavak/',
    photo: 'zeliha-kavak.png',
  },
  {
    name: 'Ozan Berk Gökçe',
    initials: 'OG',
    role: 'UX/UI Designer',
    company: 'Freelance & Artist',
    bio: 'İnsan-makine etkileşimi, Figma tasarım sistemleri (Design Tokens), kullanıcı deneyimi araştırmaları ve prototipleme.',
    tags: ['Figma', 'Design Systems', 'UX Research', 'HCI'],
    color: '#dcd0ff',
    linkedin: 'https://www.linkedin.com/in/ozangkce/',
    photo: 'ozan-gokce.jpeg',
  },
  {
    name: 'Batuhan Evleksiz',
    initials: 'BE',
    role: 'Full-Stack Developer & AI',
    company: 'ACK Techs',
    bio: 'Modern web teknolojileriyle ölçeklenebilir ve kullanıcı odaklı ürünler geliştiriyor. Frontend ve backend süreçlerini birlikte ele alırken yapay zekâ destekli çözümleri gerçek problemlere uyguluyor.',
    tags: ['React', 'TypeScript', 'Full-Stack', 'AI'],
    color: '#78c7ff',
    linkedin: 'https://www.linkedin.com/in/batuhanevleksiz/',
    photo: 'batuhan-evleksiz.jpeg',
  },
  {
    name: 'Ayselin Aydoğdu',
    initials: 'AA',
    role: 'AI Engineer',
    company: 'ACK Techs',
    bio: 'Dil modellerini ürünün içine gömüyor; ajan akışlarını, değerlendirme döngülerini ve gerçek kullanım senaryolarını tasarlıyor.',
    tags: ['LLM', 'AI Agents', 'Python', 'Eval'],
    color: '#c9ff45',
    linkedin: 'https://www.linkedin.com/in/ayselin-aydo%C4%9Fdu-b4a783293/',
    photo: 'ayselin-aydogdu.png',
  },
  {
    name: 'Ayşe Sena Bağdat',
    initials: 'AS',
    role: 'AI & Data | Cybersecurity',
    company: 'ACK Techs',
    bio: 'Yapay zekâ, veri ve siber güvenlik alanlarında çalışıyor. Araştırma ve analitik yaklaşımı teknolojiyle birleştirerek gerçek problemlere yönelik yenilikçi ve güvenli çözümler geliştiriyor.',
    tags: ['AI', 'Data', 'Cybersecurity', 'Research'],
    color: '#ffd84f',
    linkedin: 'https://www.linkedin.com/in/ay%C5%9Fe-sena-ba%C4%9Fdat/',
    photo: 'ayse-sena.png',
  },
  {
    name: 'Mehmet Yıldız',
    initials: 'MY',
    role: 'AI Engineer',
    company: 'ACK Techs',
    bio: 'Python, veri mühendisliği ve backend temelli bir AI engineer. Modelleri gerçek sistemlere bağlayan katmanı kuruyor; veri boru hatlarından ürün içi yapay zekâ akışlarına kadar uçtan uca düşünüyor.',
    tags: ['Python', 'SQL', 'Data Eng', 'ML'],
    color: '#ffd1b8',
    linkedin: 'https://www.linkedin.com/in/mehmetyildizbst/',
    photo: 'mehmet-yildiz.png',
  },
];
