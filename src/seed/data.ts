/** Dados fixos da clínica para o seed. Nomes de pacientes e telefones são fictícios. */

export const DOCTORS = [
  {
    id: 'doc_fernando',
    name: 'Dr. Fernando Mutton',
    specialties: ['Catarata', 'Córnea', 'Ceratocone'],
    bio: 'Oftalmologista com foco em cirurgia de catarata, doenças da córnea e tratamento do ceratocone (crosslink e anel intraestromal).',
    avatarInitials: 'FM',
  },
  {
    id: 'doc_helena',
    name: 'Dra. Helena Barros',
    specialties: ['Retina clínica e cirúrgica', 'Exames de imagem'],
    bio: 'Especialista em retina: acompanha retinopatia diabética, degeneração macular e realiza exames como OCT e mapeamento de retina.',
    avatarInitials: 'HB',
  },
  {
    id: 'doc_rafael',
    name: 'Dr. Rafael Toledo',
    specialties: ['Plástica ocular', 'Superfície ocular', 'Lentes de contato'],
    bio: 'Cuida das pálpebras e da superfície ocular: plástica ocular, pterígio, olho seco e adaptação de lentes de contato.',
    avatarInitials: 'RT',
  },
] as const;

type DoctorId = (typeof DOCTORS)[number]['id'];

export const SERVICES: {
  slug: string;
  name: string;
  description: string;
  durationMin: number;
  icon: string;
  doctors: DoctorId[];
}[] = [
  {
    slug: 'consulta-oftalmologica',
    name: 'Consulta oftalmológica',
    description: 'Avaliação completa da visão, medida do grau e exame do fundo de olho.',
    durationMin: 20,
    icon: 'Eye',
    doctors: ['doc_fernando', 'doc_helena', 'doc_rafael'],
  },
  {
    slug: 'catarata',
    name: 'Catarata',
    description: 'Avaliação e planejamento da cirurgia de catarata, com escolha da lente intraocular.',
    durationMin: 40,
    icon: 'ScanEye',
    doctors: ['doc_fernando'],
  },
  {
    slug: 'ceratocone-crosslink',
    name: 'Ceratocone / Crosslink',
    description: 'Diagnóstico e acompanhamento do ceratocone e indicação de crosslink para estabilizar a córnea.',
    durationMin: 40,
    icon: 'Aperture',
    doctors: ['doc_fernando'],
  },
  {
    slug: 'anel-intraestromal',
    name: 'Anel intraestromal',
    description: 'Avaliação para implante de anel na córnea, que melhora a visão em casos de ceratocone.',
    durationMin: 40,
    icon: 'CircleDot',
    doctors: ['doc_fernando'],
  },
  {
    slug: 'retina',
    name: 'Retina clínica e cirúrgica',
    description: 'Cuidado com doenças da retina, como retinopatia diabética, descolamento e degeneração macular.',
    durationMin: 40,
    icon: 'Focus',
    doctors: ['doc_helena'],
  },
  {
    slug: 'olho-seco',
    name: 'Olho seco',
    description: 'Investigação da causa do ressecamento e tratamento para aliviar ardor e vermelhidão.',
    durationMin: 20,
    icon: 'Droplets',
    doctors: ['doc_rafael', 'doc_helena'],
  },
  {
    slug: 'lentes-de-contato',
    name: 'Lentes de contato',
    description: 'Adaptação de lentes de contato gelatinosas, rígidas e especiais para ceratocone.',
    durationMin: 40,
    icon: 'Circle',
    doctors: ['doc_rafael', 'doc_fernando'],
  },
  {
    slug: 'plastica-ocular',
    name: 'Plástica ocular',
    description: 'Avaliação de pálpebras caídas, bolsas e lesões ao redor dos olhos.',
    durationMin: 40,
    icon: 'Sparkles',
    doctors: ['doc_rafael'],
  },
  {
    slug: 'pterigio',
    name: 'Pterígio',
    description: 'Avaliação da "carne crescida" no olho e indicação de cirurgia com transplante de conjuntiva.',
    durationMin: 20,
    icon: 'Sun',
    doctors: ['doc_rafael'],
  },
  {
    slug: 'exames',
    name: 'Exames (OCT, campo visual, mapeamento de retina)',
    description: 'Exames de imagem e função visual com laudo pelo médico da clínica.',
    durationMin: 40,
    icon: 'Activity',
    doctors: ['doc_helena', 'doc_fernando'],
  },
];

export const INSURANCES = [
  { id: 'ins_a', name: 'Convênio A' },
  { id: 'ins_b', name: 'Convênio B' },
  { id: 'ins_c', name: 'Convênio C' },
  { id: 'ins_d', name: 'Convênio D' },
  { id: 'ins_particular', name: 'Particular' },
];

/** Dr. Fernando opera às terças e quintas; nos outros dias, consultório. */
export const WORKING_HOURS: Record<DoctorId, { weekday: number; start: string; end: string; breakStart?: string; breakEnd?: string }[]> = {
  doc_fernando: [1, 3, 5].map((weekday) => ({ weekday, start: '08:00', end: '18:00', breakStart: '12:00', breakEnd: '13:00' })),
  doc_helena: [1, 2, 3, 4].map((weekday) => ({ weekday, start: '08:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' })),
  doc_rafael: [2, 3, 4, 5].map((weekday) => ({ weekday, start: '09:00', end: '18:00', breakStart: '12:40', breakEnd: '13:40' })),
};

export const USERS = [
  { email: 'recepcao@mutton.demo', name: 'Recepção Mutton', role: 'RECEPTION' as const },
  { email: 'gerencia@mutton.demo', name: 'Gerência Mutton', role: 'MANAGER' as const },
];
export const DEMO_PASSWORD = 'demo123';

const FEMALE = ['Maria', 'Ana', 'Francisca', 'Antônia', 'Adriana', 'Juliana', 'Márcia', 'Fernanda', 'Patrícia', 'Aline', 'Sandra', 'Camila', 'Luciana', 'Cláudia', 'Beatriz', 'Larissa', 'Vanessa', 'Simone', 'Regina', 'Tereza', 'Rosângela', 'Helena', 'Débora', 'Letícia', 'Cristina', 'Lúcia', 'Sônia', 'Raquel', 'Gabriela', 'Mariana'];
const MALE = ['José', 'João', 'Antônio', 'Francisco', 'Carlos', 'Paulo', 'Pedro', 'Lucas', 'Luiz', 'Marcos', 'Luís', 'Gabriel', 'Rafael', 'Daniel', 'Marcelo', 'Bruno', 'Eduardo', 'Felipe', 'Rodrigo', 'Sérgio', 'Roberto', 'Jorge', 'Wagner', 'Ricardo', 'Fábio', 'Mauro', 'Valdir', 'Osvaldo', 'Benedito', 'Gustavo'];
const SURNAMES = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Nascimento', 'Andrade', 'Moreira', 'Nunes', 'Marques', 'Machado', 'Mendes', 'Freitas', 'Camargo', 'Proença', 'Moraes', 'Prestes', 'Arruda'];

export function makeRng(seed: number) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    int: (min: number, max: number) => min + Math.floor(next() * (max - min + 1)),
    pick: <T>(arr: readonly T[]) => arr[Math.floor(next() * arr.length)],
    chance: (p: number) => next() < p,
  };
}

export type Rng = ReturnType<typeof makeRng>;

export function fakePerson(rng: Rng) {
  const female = rng.chance(0.58);
  const first = rng.pick(female ? FEMALE : MALE);
  const s1 = rng.pick(SURNAMES);
  let s2 = rng.pick(SURNAMES);
  if (s2 === s1) s2 = rng.pick(SURNAMES);
  const name = rng.chance(0.4) ? `${first} ${s1}` : `${first} ${s1} ${s2}`;
  // +55 15 9xxxx-xxxx: DDD de Sorocaba, números fictícios
  const phone = `+55159${String(rng.int(0, 99_999_999)).padStart(8, '0')}`;
  const age = rng.int(18, 82);
  const birthDate = new Date(Date.UTC(new Date().getUTCFullYear() - age, rng.int(0, 11), rng.int(1, 28)));
  return { name, phone, birthDate };
}

export function randomPatient() {
  return fakePerson(makeRng(Math.floor(Math.random() * 2 ** 31)));
}

/** Feriados nacionais fixos + aniversário de Sorocaba (15/08). */
export const FIXED_HOLIDAYS: Record<string, string> = {
  '01-01': 'Confraternização Universal',
  '04-21': 'Tiradentes',
  '05-01': 'Dia do Trabalho',
  '08-15': 'Aniversário de Sorocaba',
  '09-07': 'Independência do Brasil',
  '10-12': 'Nossa Senhora Aparecida',
  '11-02': 'Finados',
  '11-15': 'Proclamação da República',
  '11-20': 'Dia da Consciência Negra',
  '12-25': 'Natal',
};
