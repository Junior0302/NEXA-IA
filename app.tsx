import { StrictMode, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { RobotScene } from "./components/ui/robot-hero.tsx";
import { CustomCursor, Footer, FullscreenMenu, Header, InteractionSounds, LoadingScreen, PageTransition } from "./components/ui/site.tsx";
import { Link } from "./components/ui/router-link.tsx";

const robotSettings = {
  color: "#d5d9e4",
  scale: 1.35,
  pantallaColor: "#c9ff45",
  pantallaBrillo: 1.4,
  blinkCycle: 3.8,
  metalness: 0.15,
};

const toolsets = [
  { number: "01", name: "DISCUTER / RÉFLÉCHIR", detail: "Systèmes de prompts, méthodes de raisonnement et conversations plus riches.", tags: ["ChatGPT", "Claude", "Perplexity"], tone: "lime" },
  { number: "02", name: "CRÉER / VOIR", detail: "Transformer une idée floue en direction visuelle en quelques minutes.", tags: ["Midjourney", "Runway", "Sora"], tone: "violet" },
  { number: "03", name: "BÂTIR / DÉPLOYER", detail: "De petites automatisations qui éliminent les tâches répétitives.", tags: ["Agents", "n8n", "API"], tone: "blue" },
  { number: "04", name: "SAVOIR / DÉCIDER", detail: "Recherche, synthèse et signaux sur lesquels vous pouvez vraiment agir.", tags: ["RAG", "NotebookLM", "Données"], tone: "orange" },
];

const menuLinks = [
  ["01", "ACCUEIL", "/"],
  ["02", "NOTES DE TERRAIN", "/notes"],
  ["03", "OUTILS", "/tools"],
  ["04", "À PROPOS", "/about"],
  ["05", "CONTACT", "/contact"],
];

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={{ "--delay": `${delay}ms` } as CSSProperties}>{children}</div>;
}

function Tag({ children, tone = "lime" }: { children: ReactNode; tone?: string }) {
  return <span className={`tag tag-${tone}`}><i />{children}</span>;
}

function OrbitalPanel() {
  return <div className="orbital-panel" role="img" aria-label="Moniteur de signaux IA">
    <div className="orbital-grid" />
    <div className="orbit orbit-one" /><div className="orbit orbit-two" />
    <div className="orbit-core"><span>AI</span><i /></div>
    <div className="signal signal-a"><b />contexte</div>
    <div className="signal signal-b"><b />raisonnement</div>
    <div className="signal signal-c"><b />résultat</div>
    <div className="panel-label">EN DIRECT / 04.28.26</div>
    <div className="panel-readout"><span>SIGNAL DU MODÈLE</span><strong>98.4</strong><i><b /></i></div>
  </div>;
}

function HomePage() {
  return <>
    <section className="ai-hero" id="top">
      <div className="hero-noise" />
      <div className="hero-copy content-wrap">
        <Reveal className="hero-kicker eyebrow"><span className="eyebrow-dot" />INTELLIGENCE ARTIFICIELLE INDÉPENDANTE</Reveal>
        <Reveal className="hero-title-reveal" delay={80}><h1 id="hero-title" className="hero-title">RENDEZ L&apos;IA<br /><em>UTILE.</em></h1></Reveal>
        <Reveal className="hero-lead" delay={160}><p>Une pensée claire pour un monde en mouvement.<br />Outils, systèmes et signaux pour celles et ceux qui construisent.</p></Reveal>
        <Reveal className="hero-action" delay={220}><Link to="/tools" className="lime-button" data-cursor="EXPLORER">Explorer la boîte à outils <span>↗</span></Link></Reveal>
      </div>
      <div className="hero-visual"><div className="visual-halo" /><OrbitalPanel /><div className="hero-robot"><RobotScene {...robotSettings} /></div><div className="visual-caption"><span>OBJET 001</span><span>CURIEUX PAR DÉFAUT</span></div></div>
      <div className="hero-stamp">IA<br /><span>EST UNE<br />MATIÈRE</span></div>
      <div className="scroll-cue"><span>DÉFILEZ POUR EXPLORER</span><i /></div>
    </section>

    <div className="ticker" aria-hidden="true"><div><span>L&apos;IA POUR TOUT LE MONDE</span><b>✳</b><span>MOINS DE HYPE / PLUS D&apos;IMPACT</span><b>✳</b><span>PENSEZ MIEUX. CRÉEZ PLUS VITE.</span><b>✳</b><span>L&apos;IA POUR TOUT LE MONDE</span><b>✳</b></div></div>

    <section className="manifesto content-wrap section-space">
      <Reveal className="section-index">01 / L&apos;APPROCHE</Reveal>
      <Reveal className="manifesto-grid" delay={80}><h2>L&apos;IA n&apos;est pas le but.<br /><em>Votre prochain pas, si.</em></h2><div><p className="large-copy">Je transforme le bruit en systèmes concrets — le bon outil, le bon prompt, au bon moment.</p><p className="muted-copy">Pas de tour de magie. Juste une façon plus précise de penser, créer et avancer.</p></div></Reveal>
    </section>

    <section className="tool-section content-wrap section-space" id="tools">
      <div className="section-heading"><Reveal className="section-index">02 / LA BOÎTE À OUTILS</Reveal><Reveal delay={80}><h2>Trouvez votre <em>avantage.</em></h2></Reveal></div>
      <div className="tool-list">{toolsets.map((tool) => <ToolRow key={tool.number} {...tool} />)}</div>
      <Reveal className="section-foot" delay={100}><span>Mis à jour pour accompagner l&apos;évolution du travail.</span><Link to="/tools" className="under-link">Voir toute la boîte à outils <span>↗</span></Link></Reveal>
    </section>

    <section className="signal-section section-space" id="notes"><div className="content-wrap signal-layout"><div><Reveal className="section-index">03 / NOTES DE TERRAIN</Reveal><Reveal delay={80}><h2>Des signaux à<br /><em>suivre.</em></h2></Reveal><Reveal className="signal-intro" delay={140}><p>Une sélection vivante d&apos;idées, d&apos;outils et de tendances qui rendent l&apos;avenir un peu moins abstrait.</p></Reveal><Link to="/notes" className="under-link">Lire les notes <span>↗</span></Link></div><div className="note-card"><div className="note-top"><Tag tone="orange">NOTE DE TERRAIN 014</Tag><span>04.28.26</span></div><h3>Le meilleur outil d&apos;IA est celui qui change votre façon d&apos;agir.</h3><div className="note-line"><span>TEMPS DE LECTURE</span><strong>04:12</strong><i /></div><div className="note-orbit">✳</div></div></div></section>

    <section className="closing content-wrap section-space"><Reveal className="section-index">04 / COMMENCEZ ICI</Reveal><Reveal delay={80}><h2>Apportez une question.<br /><em>Repartez avec un système.</em></h2></Reveal><Link to="/contact" className="lime-button" data-cursor="PARLER">Entamer une conversation <span>↗</span></Link><div className="closing-orb" /></section>
  </>;
}

function ToolRow({ number, name, detail, tags, tone }: { number: string; name: string; detail: string; tags: string[]; tone: string }) {
  return <Link to="/tools" className={`tool-row tool-${tone}`} data-cursor="OUVRIR"><span className="tool-number">{number}</span><div className="tool-name"><h3>{name}</h3><p>{detail}</p></div><div className="tool-tags">{tags.map((tag) => <Tag key={tag} tone={tone}>{tag}</Tag>)}</div><span className="tool-arrow">↗</span></Link>;
}

function InnerPage({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: string; children: ReactNode }) {
  return <div className="inner-page"><section className="inner-hero content-wrap"><div className="inner-hero-top"><Reveal className="section-index">{eyebrow}</Reveal><Reveal delay={80}><Link to="/" className="back-link" data-cursor="RETOUR" aria-label="Retour à l’accueil"><span>←</span> RETOUR À L&apos;ACCUEIL</Link></Reveal></div><Reveal delay={80}><h1>{title}</h1></Reveal><Reveal className="inner-description" delay={140}><p>{description}</p></Reveal></section>{children}</div>;
}

function ToolsPage() {
  return <InnerPage eyebrow="BOÎTE À OUTILS / 02" title={<>LA BOÎTE<br /><em>À OUTILS.</em></>} description="Une carte pratique des modèles, méthodes et petits systèmes qui méritent vraiment votre temps."><section className="inner-tools content-wrap">{toolsets.map((tool) => <ToolRow key={tool.number} {...tool} />)}</section><section className="tools-quote content-wrap"><span>LA RÈGLE</span><p>Commencez par le problème, pas par l&apos;outil.</p></section></InnerPage>;
}

function NotesPage() {
  return <InnerPage eyebrow="NOTES DE TERRAIN / 01" title={<>DES SIGNAUX POUR<br /><em>LES CURIEUX.</em></>} description="De courtes observations pour avancer dans un monde façonné par l&apos;IA avec un peu plus de clarté."><section className="notes-grid content-wrap"><Note number="014" title="Le meilleur outil d&apos;IA est celui qui change votre façon d&apos;agir." date="04.28.26" tone="orange" /><Note number="013" title="Le prompting est un problème de design." date="04.15.26" tone="violet" /><Note number="012" title="Qu&apos;automatiser, que garder humain." date="04.02.26" tone="blue" /></section></InnerPage>;
}

function Note({ number, title, date, tone }: { number: string; title: string; date: string; tone: string }) {
  return <article className={`note-list-card note-${tone}`}><div className="note-top"><Tag tone={tone}>NOTE DE TERRAIN {number}</Tag><span>{date}</span></div><h3>{title}</h3><div className="note-line"><span>LIRE LE SIGNAL</span><strong>↗</strong><i /></div></article>;
}

function AboutPage() {
  return <InnerPage eyebrow="À PROPOS / 03" title={<>PENSER<br /><em>EN PUBLIC.</em></>} description="NEXA est une pratique indépendante de l&apos;IA pour celles et ceux qui veulent moins de bruit et plus de possibilités."><section className="about-body content-wrap"><div><span className="section-index">LA CONVICTION</span><p className="large-copy">L&apos;avenir appartient à celles et ceux qui apprennent à travailler avec l&apos;intelligence — humaine comme artificielle.</p></div><div className="about-aside"><span>01 / CLARTÉ</span><span>02 / CURIOSITÉ</span><span>03 / SAVOIR-FAIRE</span></div></section><section className="about-stats content-wrap"><strong>24<span>+</span></strong><p>outils testés, cartographiés et mis en pratique</p><strong>∞</strong><p>questions qui méritent encore d&apos;être posées</p></section></InnerPage>;
}

function ContactPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    const subject = encodeURIComponent(`NEXA — ${name || "Nouvelle question"}`);
    const body = encodeURIComponent(`Nom : ${name}\nEmail : ${email}\n\n${message}`);
    window.location.href = `mailto:hello@nexa.ai?subject=${subject}&body=${body}`;
  };

  return <InnerPage eyebrow="CONTACT / 04" title={<>RENDEZ L&apos;IA<br /><em>UTILE.</em></>} description="Une question, un workflow désordonné ou une idée à mettre à l&apos;épreuve ? Commencez ici."><section className="contact-layout content-wrap"><form onSubmit={handleSubmit}><label><span>VOTRE NOM</span><input name="name" autoComplete="name" placeholder="Comment dois-je vous appeler ?" required /></label><label><span>VOTRE EMAIL</span><input name="email" type="email" autoComplete="email" placeholder="vous@quelque-part.fr" required /></label><label><span>VOTRE QUESTION</span><textarea name="message" placeholder="Qu&apos;essayez-vous d&apos;éclaircir ?" rows={4} required /></label><button className="lime-button" type="submit">Envoyer le message <span>↗</span></button></form><aside><span className="section-index">CANAL OUVERT</span><a href="mailto:hello@nexa.ai">hello@nexa.ai</a><p>Basé à Paris.<br />À l&apos;écoute partout.</p></aside></section></InnerPage>;
}

function App() {
  const [path, setPath] = useState(window.location.pathname.replace(/\/+$/, "") || "/");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const update = () => setPath(window.location.pathname.replace(/\/+$/, "") || "/"); window.addEventListener("popstate", update); return () => window.removeEventListener("popstate", update); }, []);
  useEffect(() => { const timer = window.setTimeout(() => setLoading(false), window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 320 : 1050); return () => window.clearTimeout(timer); }, []);
  useEffect(() => { setMenuOpen(false); }, [path]);
  useEffect(() => {
    const pageMeta: Record<string, { title: string; description: string }> = {
      "/": { title: "NEXA IA", description: "Outils, systèmes et signaux pour celles et ceux qui construisent avec l’IA." },
      "/tools": { title: "Boîte à outils | NEXA", description: "Une carte pratique des modèles, méthodes et petits systèmes qui méritent vraiment votre temps." },
      "/notes": { title: "Notes de terrain | NEXA", description: "De courtes observations pour avancer dans un monde façonné par l’IA avec plus de clarté." },
      "/about": { title: "À propos | NEXA", description: "NEXA est une pratique indépendante de l’IA pour moins de bruit et plus de possibilités." },
      "/contact": { title: "Contact | NEXA", description: "Une question, un workflow désordonné ou une idée à mettre à l’épreuve ? Commencez ici." },
    };
    const meta = pageMeta[path] || pageMeta["/"];
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", meta.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", meta.description);
  }, [path]);
  let page: ReactNode = <HomePage />;
  if (path === "/tools") page = <ToolsPage />;
  if (path === "/notes") page = <NotesPage />;
  if (path === "/about") page = <AboutPage />;
  if (path === "/contact") page = <ContactPage />;
  return <><LoadingScreen visible={loading} /><InteractionSounds /><CustomCursor /><Header menuOpen={menuOpen} onMenu={() => setMenuOpen(true)} /><FullscreenMenu open={menuOpen} onClose={() => setMenuOpen(false)} links={menuLinks} /><PageTransition key={path}>{page}</PageTransition><Footer /></>;
}

createRoot(document.getElementById("root")!).render(<StrictMode><App /></StrictMode>);
