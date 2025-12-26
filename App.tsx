import React, { useEffect, useRef, useState } from 'react';
import { 
  motion, 
  useScroll, 
  useTransform, 
  useInView, 
  useMotionValue, 
  useSpring,
  animate,
  AnimatePresence,
  MotionValue
} from 'framer-motion';
import { 
  Bot, 
  Zap, 
  Monitor, 
  ArrowRight, 
  MessageCircle, 
  Cpu,
  BarChart3,
  Layers,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

// --- TYPES ---

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  delay: number;
  className?: string;
}

interface CounterProps {
  from: number;
  to: number;
  suffix?: string;
  prefix?: string;
  label: string;
  color: string;
}

interface Project {
  name: string;
  category: string;
  url: string;
  image: string;
  mobileImage: string;
  description: string;
}

// --- CONSTANTS ---
const WHATSAPP_LINK = "http://wa.me/5531986669917";

const PROJECTS: Project[] = [
  { 
    name: "Bilu Smart Forms", 
    category: "Intelligent Data Capture", 
    url: "https://bilu-form.vercel.app/",
    image: "https://i.imgur.com/KUuLn9H.png",
    mobileImage: "https://i.imgur.com/2cz3Uqx.png",
    description: "Sistema inteligente de captura de dados com validação em tempo real."
  },
  { 
    name: "Covered Bridge", 
    category: "Infrastructure Audit", 
    url: "https://covered-bridge-form.vercel.app/",
    image: "https://i.imgur.com/bYpBYAw.png",
    mobileImage: "https://i.imgur.com/SHEMMPl.png",
    description: "Plataforma de auditoria de infraestrutura para inspeções complexas."
  },
  { 
    name: "Dr. Douglas Alerrander", 
    category: "Mental Health Platform", 
    url: "https://psi-douglas-alerrander.vercel.app",
    image: "https://i.imgur.com/o3WLowO.png",
    mobileImage: "https://i.imgur.com/LwdoShJ.png",
    description: "Landing page de alta conversão para profissional de saúde mental."
  },
  { 
    name: "Star Cleaning Tech", 
    category: "Service Automation", 
    url: "https://starcleaning-ten.vercel.app/",
    image: "https://i.imgur.com/NZGOgev.png",
    mobileImage: "https://i.imgur.com/ASRzssV.png",
    description: "Solução automatizada para agendamento e gestão de serviços de limpeza."
  },
  { 
    name: "Remaking Digital", 
    category: "Creative Rebranding", 
    url: "https://remaking.vercel.app/",
    image: "https://i.imgur.com/DBgr0yr.png",
    mobileImage: "https://i.imgur.com/vz5DC0h.png",
    description: "Hub criativo com animações fluídas e design de impacto."
  },
];

// --- COMPONENTS ---

/**
 * Background Blobs Animation
 * Adds ambient neon glow behind the content
 */
const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full mix-blend-screen filter blur-[128px] opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-neon-green/10 rounded-full mix-blend-screen filter blur-[128px] opacity-20 animate-blob animation-delay-4000" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
    </div>
  );
};

/**
 * Parallax Wrapper
 * Adds subtle scroll-based vertical movement to create depth
 */
const Parallax = ({ children, offset = 50, className = "" }: { children: React.ReactNode, offset?: number, className?: string }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  const y = useTransform(scrollYProgress, [0, 1], [-offset, offset]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>
        {children}
      </motion.div>
    </div>
  );
};

/**
 * Animated Counter
 */
const Counter: React.FC<CounterProps> = ({ from, to, suffix = "", prefix = "", label, color }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });
  
  useEffect(() => {
    const node = nodeRef.current;
    if (!node || !isInView) return;

    const controls = animate(from, to, {
      duration: 2.5,
      ease: "easeOut",
      onUpdate(value) {
        node.textContent = `${prefix}${value.toFixed(0)}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [from, to, isInView, prefix, suffix]);

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group">
      <motion.span 
        ref={nodeRef} 
        className={`text-5xl md:text-6xl font-display font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r ${color}`}
      >
        0
      </motion.span>
      <span className="text-gray-400 font-sans tracking-wide uppercase text-sm">{label}</span>
    </div>
  );
};

/**
 * Bento Grid Service Card
 */
const ServiceCard: React.FC<ServiceCardProps> = ({ title, description, icon, color, delay, className }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect) {
      x.set(e.clientX - rect.left);
      y.set(e.clientY - rect.top);
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      onMouseMove={handleMouseMove}
      className={`relative group overflow-hidden rounded-3xl bg-white/5 border border-white/10 p-8 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [x, y],
            ([latestX, latestY]) =>
              `radial-gradient(600px circle at ${latestX}px ${latestY}px, ${color}15, transparent 40%)`
          ),
        }}
      />
      
      <div className="relative z-10 flex flex-col h-full">
        <div className={`mb-6 p-3 w-fit rounded-xl bg-white/5 border border-white/10 text-${color.split('-')[1]}-400 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
          {icon}
        </div>
        <h3 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
          {title}
        </h3>
        <p className="text-gray-400 font-sans leading-relaxed flex-grow">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

/**
 * Single Card for the Sticky Scroll
 */
const ProjectCard = ({ 
  project, 
  index, 
  targetScale, 
  progress, 
  range 
}: { 
  project: Project; 
  index: number; 
  targetScale: number; 
  progress: MotionValue<number>; 
  range: number[] 
}) => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start']
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.1, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div ref={container} className="h-[90vh] md:h-screen flex items-center justify-center sticky top-0 px-2 md:px-4">
      <motion.div 
        style={{ scale, top: `calc(5vh + ${index * 25}px)` }} 
        className="relative flex flex-col w-full max-w-5xl h-[65vh] md:h-[80vh] bg-[#09090b] rounded-2xl md:rounded-3xl border border-white/10 overflow-hidden shadow-2xl origin-top"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-6 border-b border-white/5 bg-[#09090b] z-20">
          <div className="flex items-center gap-3 md:gap-4">
             <div className="flex gap-1.5 md:gap-2">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/20 border border-green-500/50" />
             </div>
             <h3 className="text-sm md:text-2xl font-display font-bold text-white ml-2 truncate max-w-[150px] md:max-w-none">{project.name}</h3>
          </div>
          
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-neon-cyan hover:text-white transition-colors border border-neon-cyan/20 px-2 py-1 rounded-full"
          >
            Visit <span className="hidden sm:inline">Site</span> <ExternalLink size={14} className="md:w-4 md:h-4" />
          </a>
        </div>

        {/* Content Container */}
        <div className="relative flex-grow overflow-hidden group">
           {/* Responsive Images */}
           <div className="w-full h-full overflow-hidden">
             <motion.div style={{ scale: imageScale }} className="w-full h-full">
                {/* Desktop Image */}
                <img 
                  src={project.image} 
                  alt={project.name} 
                  className="hidden md:block w-full h-full object-cover object-top opacity-90 group-hover:opacity-100 transition-opacity duration-500" 
                />
                {/* Mobile Image (Vertical) */}
                <img 
                  src={project.mobileImage} 
                  alt={project.name} 
                  className="block md:hidden w-full h-full object-cover object-top opacity-90 transition-opacity duration-500" 
                />
             </motion.div>
           </div>
           
           {/* Info Overlay (Bottom) */}
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent pt-24 pb-6 px-5 md:px-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
             <div className="mb-2 md:mb-0">
                <span className="inline-block px-2 py-1 md:px-3 md:py-1 mb-2 rounded-full bg-neon-purple/20 border border-neon-purple/30 text-neon-purple text-[10px] md:text-xs font-mono uppercase tracking-wider">
                  {project.category}
                </span>
                <p className="text-gray-300 max-w-lg text-sm md:text-base leading-snug">{project.description}</p>
             </div>
             
             {/* Functional Link Button */}
             <motion.a 
               href={project.url}
               target="_blank"
               rel="noopener noreferrer"
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               className="self-end md:self-auto flex items-center justify-center bg-white hover:bg-neon-cyan text-black p-3 md:p-4 rounded-full transition-colors duration-300 shadow-lg cursor-pointer"
             >
                <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6" />
             </motion.a>
           </div>
        </div>
      </motion.div>
    </div>
  );
};

/**
 * Sticky Scroll Portfolio Section
 */
const StickyPortfolio = () => {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  });

  return (
    <section ref={container} className="relative z-10 bg-black pt-20 pb-40">
      <div className="container mx-auto max-w-6xl px-4 mb-12 md:mb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center md:text-left"
        >
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-4">Selected Works</h2>
          <p className="text-gray-400 max-w-xl text-sm md:text-base">
             Uma galeria dos projetos mais recentes combinando design de alta fidelidade e arquitetura de dados complexa.
          </p>
        </motion.div>
      </div>

      <div className="flex flex-col">
        {PROJECTS.map((project, i) => {
          const targetScale = 1 - ((PROJECTS.length - i) * 0.05);
          return (
            <ProjectCard 
              key={i} 
              index={i} 
              project={project} 
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
            />
          );
        })}
      </div>
    </section>
  );
};


// --- MAIN APP COMPONENT ---

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="relative min-h-screen selection:bg-neon-cyan/30 text-white font-sans">
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-green origin-left z-50"
        style={{ scaleX }}
      />

      <AmbientBackground />

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center px-4 overflow-hidden py-12 md:py-20">
        <div className="container mx-auto max-w-6xl relative z-10 flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neon-cyan/30 bg-neon-cyan/10 text-neon-cyan text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-6 sm:mb-8 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse"></span>
            AI Solutions Workflows
          </motion.div>

          {/* FOUNDER IMAGE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 mb-8 sm:mb-10 group"
          >
             <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_10s_linear_infinite]" />
             <div className="absolute -inset-4 rounded-full border border-neon-cyan/20 border-dashed animate-[spin_15s_linear_infinite_reverse]" />
             
             <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_50px_rgba(6,182,212,0.2)]">
                <div className="absolute inset-0 bg-neon-purple/20 mix-blend-overlay z-10"></div>
                <img 
                  src="https://i.imgur.com/G0I5MmY.jpeg" 
                  alt="Founder" 
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 z-20"></div>
             </div>
             
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 bg-black/80 backdrop-blur border border-white/20 px-4 py-1 rounded-full text-[10px] sm:text-xs font-display tracking-widest text-white shadow-lg z-30 whitespace-nowrap">
               FOUNDER & SPECIALIST
             </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight mb-4 sm:mb-6 leading-[1.1]"
          >
            Escalando Negócios com <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-white to-neon-purple animate-gradient-x">
              Inteligência Artificial
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm sm:text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8 sm:mb-12 font-light px-2"
          >
            Especialista em Automação de Fluxos <span className="text-neon-cyan mx-1 sm:mx-2">•</span> 
            Tráfego Pago de Alta Conversão <span className="text-neon-purple mx-1 sm:mx-2">•</span> 
            Web Design Premium
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col md:flex-row gap-6 justify-center items-center w-full sm:w-auto"
          >
            <a 
              href={WHATSAPP_LINK}
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group w-full sm:w-auto text-center px-8 py-4 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Agendar Consultoria <Zap className="w-5 h-5" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan to-neon-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-color-burn"></div>
            </a>
          </motion.div>

        </div>

        {/* Decorative Grid Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[linear-gradient(to_bottom,transparent,rgba(6,182,212,0.05))] [mask-image:linear-gradient(to_bottom,transparent,black)] pointer-events-none transform perspective-[2000px] rotate-x-[60deg]">
           <div className="absolute inset-0 bg-[size:40px_40px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"></div>
        </div>
      </section>

      {/* --- SERVICES SECTION (BENTO GRID) --- */}
      <section className="relative py-24 md:py-32 px-4 z-10">
        <div className="container mx-auto max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">O Futuro é Automático</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Design de ponta combinado com a potência dos modelos LLM mais avançados. <br/>
              Um especialista focado na sua escala, sem burocracia de grandes agências.
            </p>
          </motion.div>

          <Parallax offset={40}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)]">
              
              {/* Service 1: Automation */}
              <ServiceCard 
                title="Automação com IA"
                description="Transformo horas de trabalho manual em segundos de execução automática. Integrações complexas com n8n, Zapier e APIs personalizadas."
                icon={<Bot size={32} />}
                color="#06b6d4" // cyan
                delay={0.1}
                className="md:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02]"
              />

              {/* Service 2: Paid Traffic */}
              <ServiceCard 
                title="Tráfego Pago Cirúrgico"
                description="Gestão de tráfego focada em ROI e LTV. Algoritmos preditivos para encontrar seu cliente ideal."
                icon={<BarChart3 size={32} />}
                color="#8b5cf6" // purple
                delay={0.2}
                className="md:col-span-1"
              />

              {/* Service 3: Landing Pages */}
              <ServiceCard 
                title="Web Design Premium"
                description="Landing Pages que convertem. Design persuasivo alinhado à tecnologia React para velocidade instantânea."
                icon={<Monitor size={32} />}
                color="#10b981" // green
                delay={0.3}
                className="md:col-span-1"
              />
              
              {/* Feature 4: Custom Logic */}
              <ServiceCard 
                title="Engenharia de Prompt"
                description="Treinamento de modelos para atendimento ao cliente e vendas 24/7 com tom de voz humano e personalizado."
                icon={<Cpu size={32} />}
                color="#f43f5e" // rose
                delay={0.4}
                className="md:col-span-2"
              />
            </div>
          </Parallax>
        </div>
      </section>

      {/* --- NEW STICKY PORTFOLIO SECTION --- */}
      <StickyPortfolio />

      {/* --- RESULTS SECTION --- */}
      <section className="relative py-24 bg-black/50 backdrop-blur-sm border-y border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold mb-2">Impacto Real</h2>
              <p className="text-gray-400">Resultados comprovados e dedicação exclusiva.</p>
            </div>
            <div className="hidden md:block h-px bg-white/10 flex-grow ml-8 mb-4"></div>
          </div>

          <Parallax offset={30}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Counter 
                from={0} 
                to={1} 
                prefix="+R$ " 
                suffix="M" 
                label="Faturamento Gerado" 
                color="from-green-400 to-emerald-600"
              />
              <Counter 
                from={0} 
                to={15000} 
                suffix="+" 
                label="Leads Qualificados" 
                color="from-cyan-400 to-blue-600"
              />
              <Counter 
                from={0} 
                to={300} 
                suffix="+" 
                label="Automações Ativas" 
                color="from-purple-400 to-fuchsia-600"
              />
            </div>
          </Parallax>
        </div>
      </section>

      {/* --- FOOTER / BIO LINK --- */}
      <footer className="relative py-20 px-4 overflow-hidden">
        {/* Animated Glow behind footer */}
        <motion.div 
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-80 bg-gradient-to-t from-neon-purple/30 via-neon-cyan/5 to-transparent blur-[120px] pointer-events-none"
        />

        <div className="container mx-auto max-w-md relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="w-24 h-24 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-purple p-1 mb-8"
          >
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
               <Layers className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          <h2 className="text-3xl font-display font-bold mb-2">Vamos escalar seu negócio?</h2>
          <p className="text-gray-400 mb-8">Atendimento direto e personalizado. Sem intermediários.</p>

          <div className="w-full space-y-4">
            <a 
              href={WHATSAPP_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-6 bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-xl rounded-2xl shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:shadow-[0_0_30px_rgba(37,211,102,0.5)] transition-all transform hover:-translate-y-1 group"
            >
              <MessageCircle className="w-8 h-8 fill-black" />
              <span>Chamar no WhatsApp</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="mt-16 text-sm text-gray-600">
            © 2024 AI Solutions Workflows. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}