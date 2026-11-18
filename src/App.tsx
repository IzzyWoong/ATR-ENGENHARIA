import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowUpRight,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Cog,
  Factory,
  FerrisWheel,
  FileText,
  HardHat,
  Instagram,
  Mail,
  Menu,
  MessageCircle,
  Plus,
  Scale,
  Send,
  ShieldCheck,
  Forklift,
  Wind,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
const logoImage = `${import.meta.env.BASE_URL}atr-eng-logo-atr-engenharia.avif`;
const logoImageFallback = `${import.meta.env.BASE_URL}atr-eng-logo-atr-engenharia.png`;
const heroImage = `${import.meta.env.BASE_URL}gallery/atr-eng-playground-area-infantil-hero.avif`;
const heroImageFallback = `${import.meta.env.BASE_URL}gallery/atr-eng-playground-area-externa.webp`;
const profileImage = `${import.meta.env.BASE_URL}atr-eng-andre-engenheiro-mecanico.avif`;
const profileImageFallback = `${import.meta.env.BASE_URL}atr-eng-andre-engenheiro-mecanico.webp`;
const chatBubbleImage = `${import.meta.env.BASE_URL}atr-eng-andre-whatsapp.avif`;
const chatBubbleImageFallback = `${import.meta.env.BASE_URL}atr-eng-andre-whatsapp.webp`;
const galleryBase = `${import.meta.env.BASE_URL}gallery/`;
const clientLogoBase = `${import.meta.env.BASE_URL}clients/`;
const whatsappMessage = 'Olá! Encontrei a ATR Engenharia pelo site e gostaria de falar sobre uma avaliação técnica.';
const whatsappHref = `https://wa.me/5511918497505?text=${encodeURIComponent(whatsappMessage)}`;

const services = [
  {
    code: '01',
    title: 'Playgrounds de Buffets e Condomínios',
    description: 'Manutenção, inspeções e auditorias técnicas para avaliar segurança, conservação e funcionamento dos equipamentos.',
    details: `Realizamos inspeções e auditorias técnicas em playgrounds instalados em buffets, condomínios e outros estabelecimentos, avaliando as condições de segurança, conservação e funcionamento dos equipamentos.

O serviço inclui a análise da manutenção preventiva e corretiva, identificação de possíveis riscos e elaboração de Laudo Técnico de Segurança e ART.

Também apresentamos recomendações e sugestões de melhorias, priorizando o que realmente é necessário para garantir a segurança dos usuários e o bom funcionamento dos equipamentos.`,
    icon: FerrisWheel,
  },
  {
    code: '02',
    title: 'Elevadores',
    description: 'Inspeção técnica para avaliar integridade, segurança, conservação e desempenho dos elevadores e instalações.',
    details: `Inspeção técnica em elevadores para avaliar as condições de integridade, segurança, conservação e desempenho dos equipamentos e de suas instalações.

O serviço inclui a elaboração de laudo técnico descritivo e ilustrado com registros fotográficos, apontando eventuais irregularidades, necessidades de reparos, substituição de componentes e demais medidas necessárias.

Também realizamos a análise e os comentários técnicos sobre o RIA (Relatório de Inspeção Anual), auxiliando na identificação de problemas e na avaliação das condições do equipamento.`,
    icon: Building2,
  },
  {
    code: '03',
    title: 'NR-12',
    description: 'Avaliações de máquinas e equipamentos para identificar riscos, não conformidades e caminhos de adequação.',
    details: `Avaliações técnicas de máquinas e equipamentos industriais e comerciais, verificando as condições de segurança e os riscos envolvidos na operação.

A partir da inspeção, identificamos possíveis não conformidades e apresentamos soluções para adequação dos equipamentos aos requisitos aplicáveis da NR-12 e às normas técnicas pertinentes.

Quando necessário, são indicadas medidas de proteção, adequações e melhorias para reduzir os riscos aos trabalhadores e proporcionar maior segurança na operação das máquinas.`,
    icon: ShieldCheck,
  },
  {
    code: '04',
    title: 'NR-11',
    description: 'Avaliações de equipamentos usados na movimentação e no transporte de cargas, com laudo técnico e ART.',
    details: `Inspeções e avaliações técnicas em empilhadeiras, pontes rolantes, caminhões Munck, monta-cargas, talhas elétricas e outros equipamentos utilizados na movimentação e transporte de cargas.

A vistoria verifica as condições de funcionamento, conservação e segurança dos equipamentos, permitindo identificar eventuais problemas ou necessidades de manutenção.

Ao final, emitimos Laudo Técnico e ART, documentando as condições encontradas e as recomendações necessárias para manter os equipamentos aptos para utilização.`,
    icon: Forklift,
  },
  {
    code: '05',
    title: 'Exaustão de Cozinhas',
    description: 'Projetos e avaliações de ventilação e exaustão para cozinhas profissionais, com foco em eficiência e segurança.',
    details: `Projetamos e avaliamos sistemas de ventilação e exaustão para cozinhas profissionais, considerando as características do ambiente, os equipamentos instalados e as necessidades de operação.

Os projetos e avaliações levam em consideração aspectos de segurança, renovação do ar, controle de fumaça, calor, vapores e demais condições relacionadas ao funcionamento da cozinha.

Também orientamos quanto à instalação, operação e manutenção dos sistemas, buscando maior eficiência e segurança para o estabelecimento.`,
    icon: Factory,
  },
  {
    code: '06',
    title: 'Máquinas Pesadas',
    description: 'Inspeção de máquinas de grande porte para avaliar funcionamento, conservação, segurança e necessidades de adequação.',
    details: `Realizamos inspeção e avaliação técnica de máquinas de grande porte, como escavadeiras, retroescavadeiras, pás carregadeiras, rolos compactadores, Bobcat, recicladoras de asfalto, tratores agrícolas, implementos agrícolas e outros equipamentos.

Avaliamos as condições de funcionamento, conservação e segurança dos equipamentos, identificando possíveis problemas e necessidades de manutenção ou adequação.

Após a inspeção, emitimos Laudo Técnico e ART, comprovando as condições avaliadas e indicando as medidas necessárias para manter o equipamento em condições adequadas de uso.`,
    icon: Cog,
  },
  {
    code: '07',
    title: 'Ar-Condicionado (PMOC)',
    description: 'Elaboração e avaliação de PMOC para sistemas de climatização.',
    details: `Elaboramos o PMOC para sistemas de climatização de edifícios de uso público, coletivo ou restrito, conforme os requisitos da legislação aplicável.

O plano estabelece procedimentos para manutenção, operação e controle dos sistemas de climatização, contribuindo para a qualidade do ar interior e para a redução de riscos à saúde dos ocupantes.

Também realizamos a avaliação das características dos ambientes, considerando o número de ocupantes, a carga térmica dos equipamentos e o tipo de atividade desenvolvida em cada espaço.`,
    icon: Wind,
  },
  {
    code: '08',
    title: 'Perito e Assistente Técnico Judicial',
    description: 'Atuação técnica em perícias, quesitos, análise de documentos, pareceres e relatórios para processos judiciais.',
    details: `Atuamos como engenheiro mecânico em perícias judiciais e como assistente técnico em processos que envolvam questões mecânicas, estruturais e relacionadas a veículos e equipamentos.

Realizamos perícias e avaliações técnicas para identificação de problemas mecânicos ou estruturais, adulterações, fraudes, impedimentos de funcionamento e condições de recuperabilidade.

Como assistente técnico judicial, acompanhamos perícias, elaboramos quesitos, analisamos documentos e laudos, realizamos avaliações técnicas e elaboramos pareceres e relatórios para subsidiar processos judiciais.`,
    icon: Scale,
  },
];

const faqs = [
  { question: 'A ATR atende quais tipos de empresa?', answer: 'A ATR Engenharia apoia condomínios e empresas que precisam transformar requisitos técnicos em decisões claras, documentação e segurança para o dia a dia.' },
  { question: 'O atendimento começa por uma visita técnica?', answer: 'Cada demanda começa com uma conversa de entendimento. A partir do escopo, definimos a melhor combinação entre visita técnica, análise documental, inspeção, projeto ou relatório.' },
  { question: 'Vocês trabalham com quais normas?', answer: 'Atuamos na tradução prática das normas técnicas brasileiras (ABNT) e das normas regulamentadoras (NR).' },
  { question: 'Posso solicitar apenas um laudo ou parecer?', answer: 'Sim. A ATR realiza laudos técnicos, relatórios, pareceres, assistência técnica e perícia judicial conforme a natureza e a finalidade da demanda.' },
  { question: 'Como envio as informações do formulário?', answer: 'Ao enviar o formulário, seus dados serão preparados em uma mensagem para o WhatsApp da ATR. Revise as informações e toque em Enviar para encaminhar sua solicitação.' },
];

type FormState = { nome: string; email: string; telefone: string; mensagem: string };
type FormErrors = Partial<Record<keyof FormState, string>>;

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        node.classList.add('is-visible');
        observer.disconnect();
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

function SectionHeading({ eyebrow, title, description, light = false }: { eyebrow?: string; title: ReactNode; description?: ReactNode; light?: boolean }) {
  return (
    <div className={`section-heading mx-auto max-w-[860px] text-center ${light ? 'section-heading-light' : ''}`}>
      <Reveal>
        {eyebrow && <div className="eyebrow mb-5">{eyebrow}</div>}
        <h2 className="section-heading-title">{title}</h2>
        {description && <p className="section-heading-description">{description}</p>}
      </Reveal>
    </div>
  );
}

function Logo() {
  return (
    <a href="#inicio" className="focus-ring inline-flex items-center" data-testid="link-logo" aria-label="ATR Engenharia, voltar ao início">
      <picture>
        <source srcSet={logoImage} type="image/avif" />
        <img src={logoImageFallback} alt="ATR Engenharia" width={120} height={62} decoding="async" className="header-logo h-[62px] w-[120px] object-contain" />
      </picture>
    </a>
  );
}

function ContactPopover({ children, message, position = 'center' }: { children: ReactNode; message: string; position?: 'center' | 'right' }) {
  return (
    <span className={`contact-popover-wrap group relative inline-flex ${position === 'right' ? 'contact-popover-right' : ''}`}>
      {children}
      <span className="contact-popover" role="tooltip">{message}</span>
    </span>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ['Serviços', '#servicos'],
    ['Como atuamos', '#metodo'],
    ['Sobre a ATR', '#sobre'],
    ['Dúvidas', '#duvidas'],
  ];
  return (
    <header className="site-header fixed inset-x-0 top-0 z-40">
      <div className="container-atr flex h-[78px] items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="header-link focus-ring text-[14px] font-medium text-[#4f657a]" data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>
          ))}
        </nav>
        <ContactPopover message="Conversa inicial clara e sem complicação." position="right">
          <a href="#contato" className="header-contact focus-ring hidden items-center gap-2 rounded-full bg-[#0853a1] px-5 py-3 text-[13px] font-semibold text-white" data-testid="link-header-contato">
            Falar com a ATR <ArrowUpRight size={15} strokeWidth={2.2} />
          </a>
        </ContactPopover>
          <button type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)} className="header-menu focus-ring grid h-11 w-11 place-items-center rounded-full border border-[#cbd8e2] bg-white text-[#0853a1] md:hidden" data-testid="button-mobile-menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-navigation" className="mx-4 rounded-2xl border border-[#cbd8e2] bg-white p-3 shadow-[0_18px_40px_rgba(8,53,101,.14)] md:hidden" aria-label="Navegação móvel">
          {links.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="focus-ring block rounded-xl px-4 py-3 text-[15px] font-medium text-[#2b4861] hover:bg-[#edf4f9]" data-testid={`link-mobile-${label.toLowerCase().replaceAll(' ', '-')}`}>{label}</a>
          ))}
          <a href="#contato" onClick={() => setOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#0853a1] px-4 py-3 text-[15px] font-semibold text-white" data-testid="link-mobile-contato">Falar com a ATR <ArrowUpRight size={16} /></a>
        </nav>
      )}
    </header>
  );
}

function TechnicalVisual() {
  return (
    <div className="relative mx-auto h-[380px] w-full max-w-[560px] lg:h-[490px]" role="img" aria-label="Diagrama visual de análise técnica da ATR Engenharia">
      <div className="absolute inset-[8%] rounded-[36px] border border-[#8eb2d0]/60 bg-[#eaf2f8]/70" />
      <div className="absolute inset-[17%] rounded-[26px] border border-dashed border-[#6c9bc1]/70" />
      <div className="absolute left-[17%] top-[31%] h-[40%] w-[66%] rounded-[8px] border-2 border-[#0853a1] bg-[#d9e8f3]/60 shadow-[8px_8px_0_#b7d0e4]">
        <div className="absolute inset-[13%] border border-[#5685ad]">
          <div className="absolute left-[12%] top-[18%] h-10 w-[58%] border border-[#0853a1]" />
          <div className="absolute bottom-[18%] left-[12%] h-12 w-[26%] border border-[#0853a1]" />
          <div className="absolute bottom-[18%] right-[12%] h-12 w-[22%] border border-[#0853a1]" />
          <span className="absolute -right-2 -top-2 h-4 w-4 rounded-full bg-[#e7a13c]" />
        </div>
        <span className="absolute -bottom-8 left-1/2 h-8 border-l border-[#0853a1]" />
      </div>
      <div className="absolute left-[9%] top-[18%] rounded-md bg-[#fff7e9] px-3 py-2 font-mono text-[10px] text-[#875d1c] shadow-[0_7px_20px_rgba(135,93,28,.12)]">NBR / NR · análise</div>
      <div className="absolute bottom-[18%] right-[7%] rounded-md bg-[#0853a1] px-3 py-2 font-mono text-[10px] text-white shadow-[0_9px_22px_rgba(8,83,161,.22)]">ATR / campo</div>
      <div className="hero-orbit absolute inset-[3%] rounded-full border border-[#e7a13c]/60 border-dashed" />
      <div className="float-slow absolute bottom-[7%] left-[16%] flex h-12 w-12 items-center justify-center rounded-full border border-[#e7a13c] bg-[#fff7e9] text-[#a56e19] shadow-[0_8px_18px_rgba(165,110,25,.12)]"><ClipboardCheck size={19} /></div>
      <div className="absolute right-[13%] top-[9%] h-3 w-3 rounded-full bg-[#e7a13c]" />
      <div className="absolute bottom-[7%] right-[28%] h-2 w-2 rounded-full bg-[#0853a1]" />
      <span className="absolute bottom-0 left-0 font-mono text-[9px] uppercase tracking-[.16em] text-[#668098]">visual técnico · imagem a substituir</span>
    </div>
  );
}

function Hero() {
  return (
    <section id="inicio" className="hero-surface relative overflow-hidden pt-[112px]">
      <picture className="hero-media" aria-hidden="true">
        <source srcSet={heroImage} type="image/avif" />
        <img src={heroImageFallback} alt="" width={1600} height={1200} fetchPriority="high" decoding="async" />
      </picture>
      <div className="hero-surface-overlay absolute inset-0" aria-hidden="true" />
      <div className="hero-surface-grid absolute inset-0" aria-hidden="true" />
      <div className="container-atr relative flex min-h-[720px] items-center pb-20 lg:min-h-[780px] lg:pb-24">
        <div className="max-w-none">
          <Reveal><h1 className="hero-title hero-title-interactive font-medium text-white" tabIndex={0}>Clareza técnica para a <span className="serif font-normal italic text-[#f2bc60]">segurança</span> da sua empresa.</h1></Reveal>
          <Reveal className="reveal-delay-2"><p className="hero-subtitle mt-8 max-w-[700px]">A ATR Engenharia possui uma equipe altamente especializada em traduzir requisitos de engenharia mecânica das normas técnicas brasileiras em orientações de segurança aplicáveis no campo.</p></Reveal>
          <Reveal className="reveal-delay-3">
            <div className="hero-proof mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
              <span className="flex items-center gap-2"><Check size={16} className="text-[#f2bc60]" /> Rigor técnico</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-[#f2bc60]" /> Comunicação clara</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-[#f2bc60]" /> Responsabilidade</span>
              <span className="flex items-center gap-2"><Check size={16} className="text-[#f2bc60]" /> Inovação</span>
            </div>
          </Reveal>
        </div>
      </div>
      <div className="hero-instrument-panel bg-[#071d31]/55 backdrop-blur-sm">
        <div className="container-atr flex flex-wrap items-center justify-between gap-4 py-5">
          <span className="hero-instrument-id">ATR / ENGENHARIA MECÂNICA</span>
          <div className="flex flex-wrap items-center gap-3">
            <span className="hero-instrument-tag"><Cog size={15} /> NBR / NR</span>
            <span className="hero-instrument-tag"><ClipboardCheck size={15} /> Laudos e inspeções</span>
            <span className="hero-instrument-tag"><ShieldCheck size={15} /> ART e responsabilidade</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const featuredCodes = new Set(['01', '02', '03']);
  const featuredServices = services.filter((service) => featuredCodes.has(service.code));
  const additionalServices = services.filter((service) => !featuredCodes.has(service.code));
  return (
    <section id="servicos" className="section-pad bg-white">
      <div className="container-atr">
        <SectionHeading title="O QUE RESOLVEMOS" />
        <Reveal className="reveal-delay-1">
          <div className="mt-14">
            <div className="service-group-label">Principais serviços</div>
            <div className="mt-4 grid gap-5 lg:grid-cols-3">
              {featuredServices.map((service) => <ServiceCard key={service.code} service={service} featured />)}
            </div>
            <div className="service-group-label mt-12">Outras frentes de atuação</div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {additionalServices.map((service) => <ServiceCard key={service.code} service={service} />)}
            </div>
          </div>
        </Reveal>
        <Reveal className="reveal-delay-2"><div className="mt-9 text-center"><a href="#contato" className="focus-ring section-cta group inline-flex items-center gap-2 rounded-full border border-[#b9ccda] px-5 py-3 text-[15px] font-semibold text-[#28516f]" data-testid="link-services-contato">Falar sobre um serviço <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a></div></Reveal>
      </div>
    </section>
  );
}

function ServiceCard({ service, featured = false }: { service: typeof services[number]; featured?: boolean }) {
  const Icon = service.icon;
  return (
    <article className={`service-card group flex flex-col justify-between rounded-[20px] border border-[#d7e3ec] bg-[#f9fbfc] p-5 text-left ${featured ? 'service-card-featured min-h-[310px] border-[#b9cede] bg-[#f4f9fc] p-6' : 'min-h-[238px]'}`} data-testid={`card-service-${service.code}`}>
      <span className="service-card-grid" aria-hidden="true" />
      <span className="service-card-sheen" aria-hidden="true" />
      <span className="relative z-[1] flex items-start justify-between">
        <span className={`service-icon grid place-items-center rounded-xl ${featured ? 'h-12 w-12 bg-[#0853a1] text-white' : 'h-10 w-10 bg-[#e6f0f6] text-[#0853a1]'}`}><Icon size={featured ? 21 : 18} /></span>
        <span className="service-number font-mono text-[12px] text-[#9aafbd]">{service.code}</span>
      </span>
      <span className="relative z-[1]">
        <span className={`${featured ? 'mt-8 text-[21px] leading-6' : 'mt-6 text-[16px] leading-5'} flex items-start justify-between gap-3 font-semibold text-[#173d5b]`}>
          <span>{service.title}</span>
          <ArrowUpRight className="service-arrow mt-0.5 shrink-0 text-[#9ab0be]" size={featured ? 18 : 16} />
        </span>
        <span className={`${featured ? 'mt-4 text-[15px] leading-7' : 'mt-3 text-[14px] leading-6'} block text-[#6b8294]`}>{service.description}</span>
      </span>
    </article>
  );
}

type GalleryCategory = 'Playgrounds' | 'Elevadores' | 'NR-12';
type GalleryItem = {
  src: string;
  avifSrc: string;
  title: string;
  description: string;
  category: GalleryCategory;
  width: number;
  height: number;
  variant?: 'engineer' | 'before' | 'after';
  badge?: string;
};

const galleryAsset = (filename: string) => ({
  src: `${galleryBase}${filename}.webp`,
  avifSrc: `${galleryBase}${filename}.avif`,
});

const galleryItems: GalleryItem[] = [
  { ...galleryAsset('atr-eng-playground-circuito-equilibrio'), title: 'Circuito de equilíbrio', description: 'Equipamentos e áreas de recreação infantil.', category: 'Playgrounds', width: 1792, height: 2400 },
  { ...galleryAsset('atr-eng-playground-area-externa'), title: 'Playground em área externa', description: 'Conjunto de brinquedos e circulação de usuários.', category: 'Playgrounds', width: 1600, height: 1200 },
  { ...galleryAsset('atr-eng-playground-inspecao-buffet'), title: 'Inspeção em playground de buffet', description: 'Registro técnico em área recreativa interna.', category: 'Playgrounds', width: 1200, height: 1600 },
  { ...galleryAsset('atr-eng-playground-area-recreativa'), title: 'Avaliação de área recreativa', description: 'Verificação de rede, cama elástica e proteção lateral.', category: 'Playgrounds', width: 1200, height: 1600 },
  { ...galleryAsset('atr-eng-playground-estrutura-infantil'), title: 'Análise de estrutura infantil', description: 'Inspeção visual de módulos, redes e acessos.', category: 'Playgrounds', width: 1200, height: 1600 },
  { ...galleryAsset('atr-eng-playground-inspecao-externa'), title: 'Inspeção de playground externo', description: 'Estruturas, escadas, escorregadores e guarda-corpos.', category: 'Playgrounds', width: 1200, height: 1600 },
  { ...galleryAsset('atr-eng-playground-acesso-circulacao'), title: 'Detalhe de acesso e circulação', description: 'Avaliação de rampa e condições de passagem.', category: 'Playgrounds', width: 1200, height: 1600 },
  { ...galleryAsset('atr-eng-playground-balanco-piso'), title: 'Avaliação de balanço e piso', description: 'Equipamento de balanço e área de amortecimento.', category: 'Playgrounds', width: 1200, height: 1600 },
  { ...galleryAsset('atr-eng-playground-assento-fixacao'), title: 'Verificação de assento e fixação', description: 'Detalhes de assento infantil, correntes e estrutura.', category: 'Playgrounds', width: 1200, height: 1600 },
  { ...galleryAsset('atr-eng-elevador-casa-maquinas'), title: 'Casa de máquinas de elevador', description: 'Equipamentos, polias e componentes da instalação.', category: 'Elevadores', width: 2400, height: 1792 },
  { ...galleryAsset('atr-eng-elevador-sala-tecnica'), title: 'Sala técnica de elevadores', description: 'Conjunto motriz, proteções e painel de comando.', category: 'Elevadores', width: 2400, height: 1792 },
  { ...galleryAsset('atr-eng-nr12-prensas-industriais'), title: 'Prensas industriais', description: 'Máquinas e dispositivos de segurança em ambiente fabril.', category: 'NR-12', width: 2400, height: 1792 },
];

const featuredGalleryItems: GalleryItem[] = [
  { ...galleryAsset('atr-eng-andre-engenheiro-playground'), title: 'Engenheiro mecânico da ATR Engenharia em campo', description: 'Acompanhamento técnico durante a inspeção de um playground.', category: 'Playgrounds', width: 1254, height: 1254, variant: 'engineer', badge: 'ENGENHEIRO EM CAMPO' },
  { ...galleryAsset('atr-eng-playground-antes-manutencao'), title: 'Playground antes da manutenção', description: 'Condição da área recreativa antes do serviço realizado.', category: 'Playgrounds', width: 1633, height: 963, variant: 'before', badge: 'ANTES' },
  { ...galleryAsset('atr-eng-playground-depois-manutencao'), title: 'Playground depois da manutenção', description: 'Área recreativa após a conclusão do serviço.', category: 'Playgrounds', width: 1630, height: 965, variant: 'after', badge: 'DEPOIS' },
];

const allGalleryItems = [...featuredGalleryItems, ...galleryItems];

const clientLogos = [
  { name: 'Condomínio Quality House Sacomã', src: `${clientLogoBase}atr-eng-cliente-quality-house-sacoma.webp` },
  { name: 'Manutenção de Playgrounds', src: `${clientLogoBase}atr-eng-parceiro-manutencao-playgrounds.webp` },
  { name: "St. Paul's School", src: `${clientLogoBase}atr-eng-cliente-st-pauls-school.webp` },
  { name: 'Condomínio Residencial Max Vittai', src: `${clientLogoBase}atr-eng-cliente-condominio-max-vittai.webp` },
  { name: 'Condomínio Clima do Parque', src: `${clientLogoBase}atr-eng-cliente-clima-do-parque.webp` },
  { name: 'Vale Alimentação Animal', src: `${clientLogoBase}atr-eng-cliente-vale-alimentacao-animal.webp` },
  { name: 'Tower Elevadores', src: `${clientLogoBase}atr-eng-cliente-tower-elevadores.webp` },
  { name: 'Escola Koala', src: `${clientLogoBase}atr-eng-cliente-koala.webp` },
];

const galleryGroups = [
  { category: 'Playgrounds' as const, description: 'Inspeções de segurança, conservação e funcionamento em áreas infantis.' },
  { category: 'Elevadores' as const, description: 'Registros de salas técnicas, equipamentos e instalações de transporte vertical.' },
  { category: 'NR-12' as const, description: 'Avaliações de máquinas, proteções e condições de operação.' },
];

function Gallery() {
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const showPrevious = () => {
    if (!selected) return;
    const selectedIndex = allGalleryItems.indexOf(selected);
    setSelected(allGalleryItems[(selectedIndex - 1 + allGalleryItems.length) % allGalleryItems.length]);
  };

  const showNext = () => {
    if (!selected) return;
    const selectedIndex = allGalleryItems.indexOf(selected);
    setSelected(allGalleryItems[(selectedIndex + 1) % allGalleryItems.length]);
  };

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        showPrevious();
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        showNext();
      }
    };
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [selected]);

  return (
    <section id="galeria" className="section-pad bg-[#f4f8fb]">
      <div className="container-atr">
        <SectionHeading
          title="GALERIA"
          description="Registros reais de inspeções e avaliações técnicas realizadas pela ATR Engenharia."
        />
        <Reveal className="reveal-delay-1">
          <div className="featured-gallery-grid mt-14">
            {featuredGalleryItems.map((item) => (
              <figure key={item.title} className={`gallery-card group featured-gallery-card featured-gallery-card--${item.variant}`}>
                <button type="button" className="gallery-trigger featured-gallery-trigger focus-ring" onClick={() => setSelected(item)} aria-label={`Ampliar foto: ${item.title}`}>
                  <picture className="gallery-picture">
                    <source srcSet={item.avifSrc} type="image/avif" />
                    <img src={item.src} alt={item.title} className="gallery-image" width={item.width} height={item.height} loading="lazy" decoding="async" />
                  </picture>
                  {item.badge && <span className={`featured-gallery-badge featured-gallery-badge--${item.variant}`}>{item.badge}</span>}
                  <span className="gallery-zoom-hint"><Plus size={16} /> Ampliar</span>
                </button>
                <figcaption className="gallery-caption">
                  <span className="gallery-category">{item.category}</span>
                  <strong>{item.title}</strong>
                  <span>{item.description}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
        <Reveal className="reveal-delay-1">
          <div className="gallery-groups mt-20">
            {galleryGroups.map((group) => {
              const items = galleryItems.filter((item) => item.category === group.category);
              return (
                <div key={group.category} className="gallery-group">
                  <div className="gallery-group-header">
                    <h3>{group.category}</h3>
                    <p>{group.description}</p>
                  </div>
                  <div className="gallery-group-grid">
                    {items.map((item) => (
                      <figure key={item.title} className="gallery-card group">
                        <button type="button" className="gallery-trigger focus-ring" onClick={() => setSelected(item)} aria-label={`Ampliar foto: ${item.title}`}>
                          <picture className="gallery-picture">
                            <source srcSet={item.avifSrc} type="image/avif" />
                            <img src={item.src} alt={item.title} className="gallery-image" width={item.width} height={item.height} loading="lazy" decoding="async" />
                          </picture>
                          <span className="gallery-zoom-hint"><Plus size={16} /> Ampliar</span>
                        </button>
                        <figcaption className="gallery-caption">
                          <span className="gallery-category">{group.category}</span>
                          <strong>{item.title}</strong>
                          <span>{item.description}</span>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
      {selected && createPortal(
        <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-labelledby="gallery-lightbox-title" onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
          <div className="gallery-lightbox-dialog">
            <button ref={closeButtonRef} type="button" className="gallery-lightbox-close focus-ring" onClick={() => setSelected(null)} aria-label="Fechar imagem ampliada"><X size={22} /></button>
            <div className="gallery-lightbox-media">
              <picture>
                <source srcSet={selected.avifSrc} type="image/avif" />
                <img src={selected.src} alt={selected.title} width={selected.width} height={selected.height} decoding="async" />
              </picture>
              <button type="button" className="gallery-lightbox-nav gallery-lightbox-nav--previous focus-ring" onClick={showPrevious} aria-label="Ver foto anterior">
                <ChevronLeft size={26} />
              </button>
              <button type="button" className="gallery-lightbox-nav gallery-lightbox-nav--next focus-ring" onClick={showNext} aria-label="Ver próxima foto">
                <ChevronRight size={26} />
              </button>
            </div>
            <div className="gallery-lightbox-copy">
              <span className="gallery-category">{selected.category}</span>
              <h2 id="gallery-lightbox-title">{selected.title}</h2>
              <p>{selected.description}</p>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </section>
  );
}

function ClientsPartners() {
  return (
    <section id="clientes-parceiros" className="section-pad border-y border-[#e1ebf1] bg-white">
      <div className="container-atr">
        <SectionHeading
          title="CLIENTES E PARCEIROS"
          description="Empresas e instituições que fazem parte da trajetória da ATR Engenharia."
        />
        <Reveal className="reveal-delay-1">
          <ul className="client-logo-grid mt-14" aria-label="Clientes e parceiros da ATR Engenharia">
            {clientLogos.map((client) => (
              <li key={client.name} className="client-logo-card">
                <figure className="client-logo-figure">
                  <img src={client.src} alt={`Logotipo de ${client.name}`} className="client-logo-image" width={280} height={140} loading="lazy" decoding="async" />
                  <figcaption className="client-logo-name">{client.name}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

function Method() {
  const steps = [
    ['01', 'Entender o cenário', 'Ouvimos a operação, os riscos percebidos e o que precisa ser decidido.'],
    ['02', 'Conectar com as Normas Técnicas', 'Conectamos documentos, requisitos e evidências com a realidade da instalação.'],
    ['03', 'Entregar a solução', 'Apresentamos conclusão, prioridade e próximos passos em uma linguagem acionável.'],
  ];
  const stepDetails = [
    'Fazemos uma visita inicial para avaliação do local, através de análises visuais, dimensionamentos e registros fotográficos.',
    'Conectamos as evidências registradas com as normas técnicas aplicáveis, traduzindo o requisito em aplicação real.',
    'Definimos as adequações necessárias, provendo todo o suporte para facilitar o entendimento da equipe.',
  ];
  return (
    <section id="metodo" className="section-pad grid-lines relative overflow-hidden bg-[#eaf3f8]">
      <div className="container-atr">
        <SectionHeading
          title="COMO ATUAMOS"
          description="O trabalho da ATR Engenharia é transformar os requisitos das normas técnicas em uma sequência de ações simples, para que sua equipe possa compreender, priorizar e colocar em prática."
        />
        <div className="mt-14 grid gap-4 md:grid-cols-3">
          {steps.map(([number, title, text], index) => (
            <Reveal key={number} className={index ? `reveal-delay-${index}` : ''}>
              <article className="method-card group relative min-h-[260px] rounded-[20px] border border-[#bfd3e1] bg-white/75 p-7 shadow-[0_12px_30px_rgba(8,53,101,.05)]">
                <span className="method-card-number font-mono text-[13px] text-[#e09a2c]">{number}</span><h3 className="mt-12 text-[21px] font-semibold tracking-[-.025em] text-[#173d5b]">{title}</h3><p className="mt-3 max-w-[300px] text-[16px] leading-7 text-[#5e778b]">{text}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {stepDetails.map((detail, index) => (
            <Reveal key={detail} className={index ? `reveal-delay-${index}` : ''}>
              <p className="px-1 text-[15px] leading-7 text-[#5e778b]">{detail}</p>
            </Reveal>
          ))}
        </div>
        <Reveal className="reveal-delay-2"><div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[13px] font-medium uppercase tracking-[.12em] text-[#58748a]"><span className="flex items-center gap-2"><FileText size={15} className="text-[#0853a1]" /> Documento que orienta</span><span className="flex items-center gap-2"><HardHat size={15} className="text-[#0853a1]" /> Visão de campo</span><span className="flex items-center gap-2"><MessageCircle size={15} className="text-[#0853a1]" /> Conversa sem tradução</span></div></Reveal>
        <Reveal className="reveal-delay-3"><div className="mt-8 text-center"><a href="#contato" className="focus-ring section-cta group inline-flex items-center gap-2 rounded-full border border-[#b9ccda] px-5 py-3 text-[15px] font-semibold text-[#28516f]" data-testid="link-metodo-contato">Conversar sobre o cenário <ArrowUpRight size={17} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></a></div></Reveal>
      </div>
    </section>
  );
}

function Standards() {
  return (
    <section className="standards-band relative overflow-hidden bg-[#0853a1] py-20 text-white">
      <div className="absolute right-[-4%] top-[-45%] h-[520px] w-[520px] rounded-full border border-white/10" /><div className="absolute right-[4%] top-[-35%] h-[390px] w-[390px] rounded-full border border-[#e7a13c]/50" />
      <div className="container-atr relative flex flex-col items-center text-center">
        <Reveal><p className="mx-auto max-w-[820px] text-[clamp(1.8rem,3.6vw,3.35rem)] leading-[1.03] tracking-[-.045em]">Quando a exigência técnica é clara, a operação ganha <span className="serif font-normal italic text-[#f2bc60]">espaço para avançar.</span></p></Reveal>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="sobre" className="section-pad bg-[#f4f8fb]">
      <div className="container-atr">
        <SectionHeading
          title="SOBRE A ATR"
          description="A empresa ATR Engenharia surgiu da necessidade do mercado brasileiro em possuir engenheiros parceiros que sejam especializados em Normas Técnicas (NBR) e Normas Regulamentadoras (NR), tornando a engenharia compreensível e aplicável, aproximando norma, operação e responsabilidade."
        />
        <div className="mt-14 grid items-center gap-14 lg:grid-cols-[.87fr_1.13fr]">
          <Reveal className="reveal-delay-1">
            <div className="profile-frame relative mx-auto aspect-[.76] max-w-[430px] overflow-hidden rounded-[26px] border border-[#c7d9e6] bg-[#dfeef6] shadow-[0_20px_45px_rgba(8,53,101,.08)]">
              <picture className="profile-picture">
                <source srcSet={profileImage} type="image/avif" />
                <img src={profileImageFallback} alt="André, engenheiro mecânico da ATR Engenharia" width={1045} height={1400} loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover object-center" />
              </picture>
            </div>
        </Reveal>
        <Reveal className="reveal-delay-2">
          <div className="about-copy-card rounded-[24px] border border-[#cbdce7] bg-white p-7 shadow-[0_16px_38px_rgba(8,53,101,.06)] md:p-9">
            <div className="grid gap-7 border-t border-[#cbdce7] pt-7 sm:grid-cols-2">
              <div><span className="font-mono text-[11px] uppercase tracking-[.15em] text-[#e09a2c]">Missão</span><p className="mt-2 text-[15px] leading-7 text-[#34556e]">Traduzir a complexidade técnica em soluções de segurança, com base na inovação.</p></div>
              <div><span className="font-mono text-[11px] uppercase tracking-[.15em] text-[#e09a2c]">Visão</span><p className="mt-2 text-[15px] leading-7 text-[#34556e]">Ser referência em conhecimento, confiança, clareza e responsabilidade, respeitando as normas vigentes e o meio ambiente.</p></div>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">{['Ética', 'Transparência', 'Integridade', 'Eficiência', 'Gratidão', 'Respeito'].map((value) => <span key={value} className="rounded-full border border-[#bcd2e0] bg-[#f8fbfd] px-3 py-2 text-[13px] font-medium text-[#41657c]" data-testid={`text-valor-${value.toLowerCase()}`}>{value}</span>)}</div>
          </div>
        </Reveal>
        </div>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" className="section-pad bg-white">
      <div className="container-atr">
        <SectionHeading
          eyebrow="Perguntas frequentes"
          title={<>Antes da <span className="serif font-normal italic text-[#0853a1]">primeira conversa.</span></>}
          description="Se a sua dúvida não estiver aqui, explique o cenário. A conversa começa pelo contexto."
        />
        <Reveal className="reveal-delay-1">
          <div className="faq-panel mx-auto mt-14 max-w-[920px] rounded-[24px] border border-[#d5e1e9] bg-[#f9fbfc] px-6 md:px-10">
            {faqs.map((faq, index) => { const isOpen = open === index; return <div key={faq.question} className="faq-item border-b border-[#d5e1e9] last:border-b-0" data-open={isOpen}><button type="button" onClick={() => setOpen(isOpen ? null : index)} aria-expanded={isOpen} className="focus-ring flex w-full items-center justify-between gap-5 py-5 text-left" data-testid={`button-faq-${index}`}><span className="text-[17px] font-semibold text-[#274c67]">{faq.question}</span><span className="faq-plus shrink-0 text-[#0853a1]"><Plus size={21} /></span></button><div className="faq-answer"><div><p className="max-w-[720px] pb-5 pr-8 text-[16px] leading-7 text-[#647c8f]">{faq.answer}</p></div></div></div>; })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Contact() {
  const [form, setForm] = useState<FormState>({ nome: '', email: '', telefone: '', mensagem: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [submissionHref, setSubmissionHref] = useState('');
  const update = (field: keyof FormState, value: string) => { setSubmitted(false); setSubmissionHref(''); setForm((current) => ({ ...current, [field]: value })); };
  const validate = () => {
    const next: FormErrors = {};
    if (!form.nome.trim()) next.nome = 'Informe seu nome.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Informe um e-mail válido.';
    if (!form.telefone.trim()) next.telefone = 'Informe um telefone para contato.';
    if (form.mensagem.trim().length < 12) next.mensagem = 'Conte um pouco mais sobre a demanda.';
    return next;
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (!Object.keys(next).length) {
      const message = [
        'Olá! Encontrei a ATR Engenharia pelo site e gostaria de solicitar uma avaliação técnica.',
        '',
        `Nome: ${form.nome.trim()}`,
        `E-mail: ${form.email.trim()}`,
        `Telefone: ${form.telefone.trim()}`,
        `Área de interesse: ${selectedService || 'Não informada'}`,
        `O que precisa ser avaliado: ${form.mensagem.trim()}`,
      ].join('\n');
      const href = `https://wa.me/5511918497505?text=${encodeURIComponent(message)}`;
      setSubmissionHref(href);
      setSubmitted(true);
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  };
  return (
    <section id="contato" className="relative overflow-hidden bg-[#102b46] py-20 text-white md:py-28">
      <div className="absolute -left-44 bottom-[-260px] h-[560px] w-[560px] rounded-full border border-white/10" /><div className="absolute right-[-110px] top-[-160px] h-[410px] w-[410px] rounded-full border border-[#e7a13c]/30" />
      <div className="container-atr relative">
        <div className="grid items-start gap-14 lg:grid-cols-[.84fr_1.16fr]">
          <Reveal className="reveal-delay-1"><div className="pt-2 text-left"><div className="eyebrow mb-6 text-[#f2bc60]">Vamos conversar</div><h2 className="max-w-[550px] text-[clamp(3rem,6vw,5.8rem)] font-medium leading-[.9] tracking-[-.065em] text-white">Qual ponto da sua operação precisa de <span className="serif font-normal italic text-[#f2bc60]">clareza?</span></h2><p className="mt-7 max-w-[430px] text-[16px] leading-7 text-[#b6cbd9]">Envie um breve contexto. A ATR Engenharia retorna com uma conversa inicial sobre o melhor caminho técnico.</p><div className="contact-links mt-10 flex flex-wrap items-center gap-3"><ContactPopover message="Abre o WhatsApp com uma mensagem pronta."><a href={whatsappHref} target="_blank" rel="noreferrer" className="contact-link focus-ring flex items-center gap-3 text-[15px] text-white transition-colors hover:text-[#f2bc60]" data-testid="link-footer-whatsapp"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1c4564] text-[#f2bc60]"><MessageCircle size={17} /></span> (11) 91849-7505</a></ContactPopover><ContactPopover message="Envie um e-mail para a ATR."><a href="mailto:atr_engenharia@hotmail.com" className="contact-link focus-ring flex items-center gap-3 text-[15px] text-white transition-colors hover:text-[#f2bc60]" data-testid="link-footer-email"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1c4564] text-[#f2bc60]"><Mail size={17} /></span> atr_engenharia@hotmail.com</a></ContactPopover><ContactPopover message="Acompanhe a ATR Engenharia no Instagram."><a href="https://www.instagram.com/atr_engenharia" target="_blank" rel="noreferrer" className="contact-link focus-ring flex items-center gap-3 text-[15px] text-white transition-colors hover:text-[#f2bc60]" data-testid="link-footer-instagram"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#1c4564] text-[#f2bc60]"><Instagram aria-hidden="true" size={17} /></span> Instagram</a></ContactPopover></div></div></Reveal>
          <Reveal className="reveal-delay-2"><form onSubmit={submit} noValidate className="rounded-[22px] border border-white/15 bg-white p-6 text-[#102b46] shadow-[0_20px_55px_rgba(0,0,0,.12)] md:p-8" aria-label="Formulário de avaliação técnica"><div className="mb-7 flex items-start justify-between gap-5"><div><h3 className="text-xl font-semibold tracking-[-.03em]">Solicite uma avaliação</h3><p className="mt-1 text-[15px] leading-6 text-[#668095]">Preencha os dados para enviar sua solicitação pelo WhatsApp.</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf5fa] text-[#0853a1]"><Send size={17} /></span></div><div className="grid gap-5 sm:grid-cols-2"><Field id="nome" label="Nome" value={form.nome} error={errors.nome} onChange={(v) => update('nome', v)} placeholder="Como podemos chamar você?" /><Field id="email" label="E-mail" type="email" value={form.email} error={errors.email} onChange={(v) => update('email', v)} placeholder="seu@email.com" /><Field id="telefone" label="Telefone" value={form.telefone} error={errors.telefone} onChange={(v) => update('telefone', v)} placeholder="(11) 00000-0000" /><div><label htmlFor="assunto" className="mb-2 block text-[13px] font-semibold text-[#36566e]">Área de interesse <span className="font-normal text-[#8498a8]">(opcional)</span></label><select id="assunto" value={selectedService} onChange={(event) => { setSelectedService(event.target.value); setSubmitted(false); setSubmissionHref(''); }} className="focus-ring h-11 w-full rounded-lg border border-[#cfdee8] bg-[#f9fbfc] px-3 text-[15px] text-[#36566e]" data-testid="select-assunto"><option value="">Selecione uma área</option>{services.map((service) => <option key={service.code} value={service.title}>{service.title}</option>)}</select></div></div><div className="mt-5"><label htmlFor="mensagem" className="mb-2 block text-[13px] font-semibold text-[#36566e]">O que precisa ser avaliado?</label><textarea id="mensagem" value={form.mensagem} onChange={(event) => update('mensagem', event.target.value)} placeholder="Descreva brevemente sua instalação, equipamento ou necessidade." className={`focus-ring min-h-[115px] w-full resize-y rounded-lg border bg-[#f9fbfc] px-3 py-3 text-[15px] leading-6 text-[#36566e] placeholder:text-[#9aaab6] ${errors.mensagem ? 'border-[#c64e4e]' : 'border-[#cfdee8]'}`} data-testid="textarea-mensagem" aria-invalid={Boolean(errors.mensagem)} />{errors.mensagem && <p className="mt-1 text-[13px] text-[#b63d3d]" role="alert">{errors.mensagem}</p>}</div><button type="submit" className="cta-button mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#0853a1] px-5 py-3.5 text-[15px] font-semibold text-white transition-transform hover:-translate-y-0.5" data-testid="button-submit-form">Enviar pelo WhatsApp <ArrowUpRight size={16} /></button>{submitted && <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#e9f6ec] px-3 py-3 text-[14px] leading-6 text-[#24633a]" role="status" aria-live="polite" data-testid="status-form-success"><Check size={17} className="mt-0.5 shrink-0" /><span>Revise os dados na conversa do WhatsApp e toque em Enviar para encaminhar sua solicitação. Se a conversa não abrir, <a className="font-semibold underline" href={submissionHref} target="_blank" rel="noreferrer">abra pelo link</a>.</span></div>}</form></Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({ id, label, value, error, onChange, placeholder, type = 'text' }: { id: string; label: string; value: string; error?: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return <div><label htmlFor={id} className="mb-2 block text-[13px] font-semibold text-[#36566e]">{label}</label><input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className={`focus-ring h-11 w-full rounded-lg border bg-[#f9fbfc] px-3 text-[15px] text-[#36566e] placeholder:text-[#9aaab6] ${error ? 'border-[#c64e4e]' : 'border-[#cfdee8]'}`} data-testid={`input-${id}`} aria-invalid={Boolean(error)} />{error && <p className="mt-1 text-[13px] text-[#b63d3d]" role="alert">{error}</p>}</div>;
}

function Footer() {
  return (
    <footer className="site-footer bg-[#102b46] text-white">
      <div className="container-atr py-14 md:py-16">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-wrap"><picture><source srcSet={logoImage} type="image/avif" /><img src={logoImageFallback} alt="Logotipo da ATR Engenharia" width={112} height={68} loading="lazy" decoding="async" className="footer-logo" /></picture></div>
            <p className="mt-5 max-w-[330px] text-[15px] leading-7 text-[#b6cbd9]">Engenharia mecânica aplicada com clareza, responsabilidade e visão de campo.</p>
          </div>
          <div>
            <span className="footer-heading">Navegação</span>
            <nav className="footer-links mt-4" aria-label="Navegação do rodapé">
              <a href="#inicio" className="focus-ring" data-testid="link-footer-inicio">Início</a>
              <a href="#sobre" className="focus-ring" data-testid="link-footer-sobre">Sobre a ATR</a>
              <a href="#servicos" className="focus-ring" data-testid="link-footer-servicos">Serviços</a>
              <a href="#galeria" className="focus-ring" data-testid="link-footer-galeria">Galeria</a>
              <a href="#clientes-parceiros" className="focus-ring" data-testid="link-footer-clientes">Clientes e parceiros</a>
            </nav>
          </div>
          <div>
            <span className="footer-heading">Fale com a ATR</span>
            <div className="footer-links mt-4">
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="focus-ring" data-testid="link-footer-whatsapp-secondary">WhatsApp</a>
              <a href="mailto:atr_engenharia@hotmail.com" className="focus-ring" data-testid="link-footer-email-secondary">atr_engenharia@hotmail.com</a>
              <a href="https://www.instagram.com/atr_engenharia" target="_blank" rel="noreferrer" className="focus-ring" data-testid="link-footer-instagram-secondary">Instagram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom mt-12 flex flex-col gap-3 border-t border-white/10 pt-5 text-[13px] text-[#7590a4] sm:flex-row sm:items-center sm:justify-between">
          <span>ATR Engenharia · precisão que orienta.</span>
          <span>© {new Date().getFullYear()} ATR Engenharia</span>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppFloat() {
  const [showChatBubble, setShowChatBubble] = useState(false);

  useEffect(() => {
    let hideTimer: number | undefined;
    const showBubble = () => {
      setShowChatBubble(true);
      window.clearTimeout(hideTimer);
      hideTimer = window.setTimeout(() => setShowChatBubble(false), 5200);
    };

    const initialTimer = window.setTimeout(showBubble, 4500);
    const interval = window.setInterval(showBubble, 22000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
      window.clearTimeout(hideTimer);
    };
  }, []);

  return (
    <div className="whatsapp-float-wrap group fixed bottom-5 right-5 z-40 sm:bottom-7 sm:right-7">
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar com André pelo WhatsApp"
        aria-hidden={!showChatBubble}
        className={`whatsapp-chat-bubble focus-ring ${showChatBubble ? 'is-visible' : ''}`}
      >
        <picture><source srcSet={chatBubbleImage} type="image/avif" /><img src={chatBubbleImageFallback} alt="" width={600} height={600} loading="lazy" decoding="async" /></picture>
        <span>Posso ajudar?</span>
      </a>
      <a href={whatsappHref} target="_blank" rel="noreferrer" aria-label="Falar com a ATR Engenharia pelo WhatsApp" className="whatsapp-float focus-ring inline-flex items-center gap-2 rounded-full bg-[#15845c] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(10,96,65,.28)] transition-transform hover:-translate-y-1">
        <MessageCircle size={20} strokeWidth={2.2} />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  );
}

function Home() {
  return <div className="noise min-h-[100dvh] overflow-x-hidden"><Header /><main><Hero /><About /><Services /><Gallery /><ClientsPartners /><Method /><Standards /><FAQ /><Contact /></main><Footer /><WhatsAppFloat /></div>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route component={NotFound} /></Switch>;
}

function RoutedErrorBoundary() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Router /></ErrorBoundary>;
}

function App({ ssrPath }: { ssrPath?: string }) {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')} ssrPath={ssrPath}><RoutedErrorBoundary /></WouterRouter>;
}

export default App;