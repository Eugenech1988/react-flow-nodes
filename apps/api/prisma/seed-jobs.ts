import { PrismaPg } from '@prisma/adapter-pg';
import {
  PrismaClient,
  JobStatus,
  JobDepartment,
  JobLevel,
  JobType,
} from '@prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set. Add it to apps/api/.env');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type TSeedTranslation = {
  locale: 'en' | 'ua';
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  metaTitle?: string;
  metaDescription?: string;
};

type TSeedJob = {
  slug: string;
  department: JobDepartment;
  level: JobLevel;
  type: JobType;
  location: string;
  icon: string | null;
  translations: TSeedTranslation[];
};

const SEED_JOBS: TSeedJob[] = [
  {
    slug: 'senior-frontend',
    department: 'ENGINEERING',
    level: 'SENIOR',
    type: 'FULL_TIME',
    location: 'Remote',
    icon: 'code-2',
    translations: [
      {
        locale: 'en',
        title: 'Senior Frontend Engineer',
        description:
          'We are looking for a Senior Frontend Engineer to lead the development of our visual pipeline editor. You will work closely with designers and backend engineers to build highly interactive, performant, and accessible interfaces.',
        responsibilities: [
          'Architect and build complex React components for the visual canvas.',
          'Optimize application for maximum speed and scalability.',
          'Collaborate with backend engineers to define API contracts.',
          'Mentor junior developers and conduct code reviews.',
        ],
        requirements: [
          '5+ years of experience with React and TypeScript.',
          'Deep understanding of state management (Zustand, Redux, or similar).',
          'Experience with canvas/WebGL (React Flow, D3, etc.) is a huge plus.',
          'Strong eye for design and attention to detail.',
        ],
        metaTitle: 'Senior Frontend Engineer',
        metaDescription:
          'Lead the development of our visual pipeline editor. Build highly interactive, performant, and accessible interfaces.',
      },
      {
        locale: 'ua',
        title: 'Senior Frontend інженер',
        description:
          'Ми шукаємо Senior Frontend інженера, який очолить розробку нашого візуального редактора пайплайнів. Ви будете тісно співпрацювати з дизайнерами та бекенд-інженерами для створення високоінтерактивних та доступних інтерфейсів.',
        responsibilities: [
          'Проєктувати та створювати складні React-компоненти для візуального полотна.',
          'Оптимізувати додаток для максимальної швидкості та масштабованості.',
          'Співпрацювати з бекенд-інженерами для визначення контрактів API.',
          "Наставляти молодших розробників та проводити код-рев'ю.",
        ],
        requirements: [
          '5+ років досвіду з React та TypeScript.',
          'Глибоке розуміння управління станом (Zustand, Redux тощо).',
          'Досвід роботи з canvas/WebGL (React Flow, D3 тощо) буде великим плюсом.',
          'Гарний смак та увага до деталей.',
        ],
        metaTitle: 'Senior Frontend інженер',
        metaDescription:
          'Очолюйте розробку нашого візуального редактора пайплайнів. Створюйте високоінтерактивні та доступні інтерфейси.',
      },
    ],
  },
  {
    slug: 'backend-engineer',
    department: 'ENGINEERING',
    level: 'MID',
    type: 'FULL_TIME',
    location: 'Remote',
    icon: 'cpu',
    translations: [
      {
        locale: 'en',
        title: 'Backend Engineer',
        description:
          'Design and scale the core infrastructure that powers our data pipelines.',
        responsibilities: [
          'Build high-throughput APIs.',
          'Optimize database queries.',
          'Ensure system reliability.',
        ],
        requirements: [
          '3+ years of backend experience.',
          'Proficiency in Node.js/Go.',
          'Deep knowledge of PostgreSQL.',
        ],
        metaTitle: 'Backend Engineer',
        metaDescription:
          'Design and scale the core infrastructure that powers our data pipelines.',
      },
      {
        locale: 'ua',
        title: 'Backend інженер',
        description:
          'Проєктуйте та масштабуйте базову інфраструктуру, що забезпечує роботу наших пайплайнів даних.',
        responsibilities: [
          'Створювати високонавантажені API.',
          'Оптимізувати запити до бази даних.',
          'Забезпечувати надійність системи.',
        ],
        requirements: [
          '3+ роки досвіду в бекенд-розробці.',
          'Володіння Node.js/Go.',
          'Глибокі знання PostgreSQL.',
        ],
      },
    ],
  },
  {
    slug: 'product-designer',
    department: 'DESIGN',
    level: 'MID',
    type: 'FULL_TIME',
    location: 'London',
    icon: 'palette',
    translations: [
      {
        locale: 'en',
        title: 'Product Designer',
        description:
          'Craft intuitive and beautiful user experiences for our data engineering platform.',
        responsibilities: [
          'Design end-to-end user flows.',
          'Create high-fidelity mockups and prototypes.',
          'Conduct user research.',
        ],
        requirements: [
          '3+ years of product design experience.',
          'Strong portfolio.',
          'Proficiency in Figma.',
        ],
      },
      {
        locale: 'ua',
        title: 'Продуктовий дизайнер',
        description:
          'Створюйте інтуїтивний та красивий досвід користувачів для нашої платформи.',
        responsibilities: [
          'Проєктувати наскрізні сценарії користувачів.',
          'Створювати детальні макети та прототипи.',
          'Проводити дослідження користувачів.',
        ],
        requirements: [
          '3+ роки досвіду в продуктовому дизайні.',
          'Сильне портфоліо.',
          'Володіння Figma.',
        ],
      },
    ],
  },
  {
    slug: 'ml-researcher',
    department: 'RESEARCH',
    level: 'SENIOR',
    type: 'FULL_TIME',
    location: 'Remote',
    icon: 'flask-conical',
    translations: [
      {
        locale: 'en',
        title: 'ML Researcher',
        description:
          'Explore and implement state-of-the-art machine learning models to enhance our data pipelines.',
        responsibilities: [
          'Research and develop new ML models.',
          'Collaborate with engineering to deploy models.',
          'Publish findings.',
        ],
        requirements: [
          "PhD or Master's in CS/Math.",
          'Experience with PyTorch/TensorFlow.',
          'Strong publication record.',
        ],
      },
      {
        locale: 'ua',
        title: 'ML дослідник',
        description:
          'Досліджуйте та впроваджуйте найсучасніші моделі машинного навчання для покращення пайплайнів.',
        responsibilities: [
          'Досліджувати та розробляти нові ML-моделі.',
          'Співпрацювати з інженерами для розгортання моделей.',
          'Публікувати результати.',
        ],
        requirements: [
          'Ступінь PhD або магістра з CS/Математики.',
          'Досвід з PyTorch/TensorFlow.',
          'Сильний список публікацій.',
        ],
      },
    ],
  },
  {
    slug: 'devops-engineer',
    department: 'ENGINEERING',
    level: 'MID',
    type: 'FULL_TIME',
    location: 'Remote',
    icon: 'cog',
    translations: [
      {
        locale: 'en',
        title: 'DevOps Engineer',
        description:
          'Maintain and scale our cloud infrastructure, ensuring high availability and security.',
        responsibilities: [
          'Manage AWS/GCP infrastructure.',
          'Automate deployments.',
          'Monitor system health.',
        ],
        requirements: [
          '3+ years of DevOps experience.',
          'Proficiency with Kubernetes and Terraform.',
          'Strong scripting skills.',
        ],
      },
      {
        locale: 'ua',
        title: 'DevOps інженер',
        description:
          'Підтримуйте та масштабуйте нашу хмарну інфраструктуру, забезпечуючи високу доступність та безпеку.',
        responsibilities: [
          'Керувати інфраструктурою AWS/GCP.',
          'Автоматизувати розгортання.',
          'Моніторити стан системи.',
        ],
        requirements: [
          '3+ роки досвіду в DevOps.',
          'Володіння Kubernetes та Terraform.',
          'Сильні навички скриптингу.',
        ],
      },
    ],
  },
  {
    slug: 'talent-partner',
    department: 'OPERATIONS',
    level: 'MID',
    type: 'FULL_TIME',
    location: 'London',
    icon: 'briefcase',
    translations: [
      {
        locale: 'en',
        title: 'Talent Partner',
        description:
          'Help us find exceptional craftspeople to join our workshop and drive our mission forward.',
        responsibilities: [
          'Source and screen candidates.',
          'Manage the full recruitment cycle.',
          'Build employer brand.',
        ],
        requirements: [
          '3+ years of technical recruiting.',
          'Excellent communication skills.',
          'Passion for tech.',
        ],
      },
      {
        locale: 'ua',
        title: 'Партнер з талантів',
        description:
          'Допоможіть нам знайти виняткових майстрів для нашої майстерні.',
        responsibilities: [
          'Шукати та відбирати кандидатів.',
          'Керувати повним циклом рекрутингу.',
          'Розбудовувати бренд роботодавця.',
        ],
        requirements: [
          '3+ роки досвіду в технічному рекрутингу.',
          'Відмінні комунікативні навички.',
          'Пристрасть до технологій.',
        ],
      },
    ],
  },
  {
    slug: 'data-engineer',
    department: 'ENGINEERING',
    level: 'MID',
    type: 'FULL_TIME',
    location: 'Remote',
    icon: 'database',
    translations: [
      {
        locale: 'en',
        title: 'Data Engineer',
        description:
          'Build robust data pipelines and architectures that empower our engineering teams.',
        responsibilities: [
          'Design data architectures.',
          'Build ETL pipelines.',
          'Ensure data quality.',
        ],
        requirements: [
          '3+ years of data engineering.',
          'Experience with Airflow/Spark.',
          'Strong SQL skills.',
        ],
      },
      {
        locale: 'ua',
        title: 'Data інженер',
        description:
          'Створюйте надійні пайплайни та архітектури даних, що розширюють можливості інженерних команд.',
        responsibilities: [
          'Проєктувати архітектуру даних.',
          'Створювати ETL-пайплайни.',
          'Забезпечувати якість даних.',
        ],
        requirements: [
          '3+ роки досвіду в Data Engineering.',
          'Досвід з Airflow/Spark.',
          'Сильні навички SQL.',
        ],
      },
    ],
  },
  {
    slug: 'ux-writer',
    department: 'DESIGN',
    level: 'MID',
    type: 'FULL_TIME',
    location: 'London',
    icon: 'pen-tool',
    translations: [
      {
        locale: 'en',
        title: 'UX Writer',
        description:
          'Craft clear, concise, and helpful product copy that guides our users through complex workflows.',
        responsibilities: [
          'Write clear UI copy.',
          'Maintain content style guide.',
          'Collaborate with designers.',
        ],
        requirements: [
          '3+ years of UX writing.',
          'Strong portfolio of product copy.',
          'Native English speaker.',
        ],
      },
      {
        locale: 'ua',
        title: 'UX-райтер',
        description:
          'Створюйте чіткий, лаконічний та корисний текст для продукту.',
        responsibilities: [
          'Писати чіткий текст інтерфейсу.',
          'Підтримувати стайлгайд контенту.',
          'Співпрацювати з дизайнерами.',
        ],
        requirements: [
          '3+ роки досвіду в UX-райтингу.',
          'Сильне портфоліо продуктових текстів.',
          'Носій англійської мови.',
        ],
      },
    ],
  },
  {
    slug: 'security-engineer',
    department: 'ENGINEERING',
    level: 'SENIOR',
    type: 'FULL_TIME',
    location: 'Remote',
    icon: 'shield-check',
    translations: [
      {
        locale: 'en',
        title: 'Security Engineer',
        description:
          'Safeguard our platform and user data, implementing robust security protocols and practices.',
        responsibilities: [
          'Conduct security audits.',
          'Implement secure coding practices.',
          'Respond to incidents.',
        ],
        requirements: [
          '5+ years of security engineering.',
          'Knowledge of OWASP top 10.',
          'Experience with cloud security.',
        ],
      },
      {
        locale: 'ua',
        title: 'Security інженер',
        description:
          'Захищайте нашу платформу та дані користувачів, впроваджуючи надійні протоколи безпеки.',
        responsibilities: [
          'Проводити аудит безпеки.',
          'Впроваджувати практики безпечного кодування.',
          'Реагувати на інциденти.',
        ],
        requirements: [
          '5+ років досвіду в security engineering.',
          'Знання OWASP top 10.',
          'Досвід з хмарною безпекою.',
        ],
      },
    ],
  },
  {
    slug: 'growth-manager',
    department: 'OPERATIONS',
    level: 'MID',
    type: 'FULL_TIME',
    location: 'London',
    icon: 'trending-up',
    translations: [
      {
        locale: 'en',
        title: 'Growth Manager',
        description:
          'Drive user acquisition and engagement strategies to scale our product reach.',
        responsibilities: [
          'Develop growth strategies.',
          'Run A/B tests.',
          'Analyze funnel metrics.',
        ],
        requirements: [
          '3+ years of growth marketing.',
          'Data-driven mindset.',
          'Experience with B2B SaaS.',
        ],
      },
      {
        locale: 'ua',
        title: 'Growth-менеджер',
        description:
          'Керуйте стратегіями залучення та утримання користувачів для масштабування продукту.',
        responsibilities: [
          'Розробляти стратегії зростання.',
          'Проводити A/B тестування.',
          'Аналізувати метрики воронки.',
        ],
        requirements: [
          '3+ роки досвіду в growth marketing.',
          'Підхід, заснований на даних.',
          'Досвід з B2B SaaS.',
        ],
      },
    ],
  },
];

async function seedJobs() {
  console.log('🌱 Seeding jobs…');

  for (const job of SEED_JOBS) {
    const existing = await prisma.job.findUnique({
      where: { slug: job.slug },
      select: { id: true, publishedAt: true },
    });

    let jobId: string;

    if (existing) {
      await prisma.job.update({
        where: { id: existing.id },
        data: {
          department: job.department,
          level: job.level,
          type: job.type,
          location: job.location,
          icon: job.icon,
          status: JobStatus.PUBLISHED,
          publishedAt: existing.publishedAt ?? new Date(),
        },
      });
      jobId = existing.id;
      console.log(`  ↻ updated ${job.slug}`);
    } else {
      const created = await prisma.job.create({
        data: {
          slug: job.slug,
          department: job.department,
          level: job.level,
          type: job.type,
          location: job.location,
          icon: job.icon,
          status: JobStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      });
      jobId = created.id;
      console.log(`  + created ${job.slug}`);
    }

    for (const tr of job.translations) {
      await prisma.jobTranslation.upsert({
        where: {
          // имя compound unique-ключа из @@unique([jobId, locale])
          jobId_locale: { jobId, locale: tr.locale },
        },
        update: {
          title: tr.title,
          description: tr.description,
          responsibilities: tr.responsibilities,
          requirements: tr.requirements,
          metaTitle: tr.metaTitle ?? null,
          metaDescription: tr.metaDescription ?? null,
        },
        create: {
          jobId,
          locale: tr.locale,
          title: tr.title,
          description: tr.description,
          responsibilities: tr.responsibilities,
          requirements: tr.requirements,
          metaTitle: tr.metaTitle ?? null,
          metaDescription: tr.metaDescription ?? null,
        },
      });
    }
  }

  console.log(`✅ Done. ${SEED_JOBS.length} jobs.`);
}

seedJobs()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });