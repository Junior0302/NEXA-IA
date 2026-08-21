import { StrictMode, useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { RobotScene } from "./components/ui/robot-hero.tsx";
import { CustomCursor, Footer, FullscreenMenu, Header, InteractionSounds, LoadingScreen, PageTransition } from "./components/ui/site.tsx";
import { Link } from "./components/ui/router-link.tsx";

const robotSettings = {
  color: "#d5d9e4",
  scale: 1.28,
  pantallaColor: "#c9ff45",
  pantallaBrillo: 1.25,
  blinkCycle: 3.8,
  metalness: 0.15,
};

const toolsets = [
  { number: "01", name: "DISCUTER / RÉFLÉCHIR", detail: "Systèmes de prompts, méthodes de raisonnement et conversations plus riches.", tags: ["ChatGPT", "Claude", "Perplexity"], tone: "lime" },
  { number: "02", name: "CRÉER / VOIR", detail: "Transformer une idée floue en direction visuelle en quelques minutes.", tags: ["Midjourney", "Runway", "Sora"], tone: "violet" },
  { number: "03", name: "BÂTIR / DÉPLOYER", detail: "De petites automatisations qui éliminent les tâches répétitives.", tags: ["Agents", "n8n", "API"], tone: "blue" },
  { number: "04", name: "SAVOIR / DÉCIDER", detail: "Recherche, synthèse et signaux sur lesquels vous pouvez vraiment agir.", tags: ["RAG", "NotebookLM", "Données"], tone: "orange" },
];

const visualAssets = {
  orb: new URL("./assets/visuals/neural-orb.png", import.meta.url).href,
  signal: new URL("./assets/visuals/human-signal.png", import.meta.url).href,
  flow: new URL("./assets/visuals/flow-field.png", import.meta.url).href,
};

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

function SignalIcon({ type }: { type: "observe" | "choose" | "test" | "unlock" | "structure" | "explore" }) {
  const paths = {
    observe: <><circle cx="12" cy="12" r="6" /><path d="M12 3v3M12 18v3M3 12h3M18 12h3" /></>,
    choose: <><path d="M12 3 20 7.5v9L12 21 4 16.5v-9L12 3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>,
    test: <><path d="M5 5h14v14H5z" /><path d="M8 15l2.2-3 2.1 2 3.7-5" /></>,
    unlock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 7.2-2.4" /></>,
    structure: <><rect x="9" y="3" width="6" height="5" rx="1" /><rect x="3" y="16" width="6" height="5" rx="1" /><rect x="15" y="16" width="6" height="5" rx="1" /><path d="M12 8v4M6 16v-2h12v2" /></>,
    explore: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4M9 11h4M11 9v4" /></>,
  };
  return <svg className="signal-icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
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
      <div className="hero-visual" role="img" aria-label="Robot NEXA"><RobotScene {...robotSettings} /></div>
    </section>

    <section className="manifesto content-wrap section-space">
      <Reveal className="section-index">01 / L&apos;APPROCHE</Reveal>
      <Reveal className="manifesto-grid" delay={80}><h2>L&apos;IA n&apos;est pas le but.<br /><em>Votre prochain pas, si.</em></h2><div><p className="large-copy">Je transforme le bruit en systèmes concrets — le bon outil, le bon prompt, au bon moment.</p><p className="muted-copy">Pas de tour de magie. Juste une façon plus précise de penser, créer et avancer.</p></div></Reveal>
    </section>

    <section className="tool-section content-wrap section-space" id="tools">
      <div className="section-heading"><Reveal className="section-index">02 / LA BOÎTE À OUTILS</Reveal><Reveal delay={80}><h2>Trouvez votre <em>avantage.</em></h2></Reveal></div>
      <div className="tool-list">{toolsets.map((tool, index) => <ToolRow key={tool.number} delay={index * 80} {...tool} />)}</div>
      <Reveal className="section-foot" delay={100}><span>Mis à jour pour accompagner l&apos;évolution du travail.</span><Link to="/tools" className="under-link">Voir toute la boîte à outils <span>↗</span></Link></Reveal>
    </section>

    <section className="signal-section section-space" id="notes"><div className="content-wrap signal-layout"><div><Reveal className="section-index">03 / NOTES DE TERRAIN</Reveal><Reveal delay={80}><h2>Des signaux à<br /><em>suivre.</em></h2></Reveal><Reveal className="signal-intro" delay={140}><p>Une sélection vivante d&apos;idées, d&apos;outils et de tendances qui rendent l&apos;avenir un peu moins abstrait.</p></Reveal><Link to="/notes" className="under-link">Lire les notes <span>↗</span></Link></div><div className="note-card"><div className="note-top"><Tag tone="orange">NOTE DE TERRAIN 014</Tag><span>28.04.26</span></div><h3>Le meilleur outil d&apos;IA est celui qui change votre façon d&apos;agir.</h3><div className="note-line"><span>TEMPS DE LECTURE</span><strong>04:12</strong><i /></div><div className="note-orbit">✳</div></div></div></section>

    <section className="closing content-wrap section-space"><Reveal className="section-index">04 / COMMENCEZ ICI</Reveal><Reveal delay={80}><h2>Apportez une question.<br /><em>Repartez avec un système.</em></h2></Reveal><Link to="/contact" className="lime-button" data-cursor="PARLER">Entamer une conversation <span>↗</span></Link><div className="closing-orb" /></section>
  </>;
}

function ToolRow({ number, name, detail, tags, tone, delay = 0 }: { number: string; name: string; detail: string; tags: string[]; tone: string; delay?: number }) {
  return <Link to="/tools" className={`tool-row tool-${tone}`} style={{ "--row-delay": `${delay}ms` } as CSSProperties} data-cursor="OUVRIR"><span className="tool-number">{number}</span><div className="tool-name"><h3>{name}</h3><p>{detail}</p></div><div className="tool-tags">{tags.map((tag) => <Tag key={tag} tone={tone}>{tag}</Tag>)}</div><span className="tool-arrow">↗</span></Link>;
}

function InnerPage({ eyebrow, title, description, children }: { eyebrow: string; title: ReactNode; description: string; children: ReactNode }) {
  return <div className="inner-page"><section className="inner-hero content-wrap"><div className="inner-hero-top"><Reveal className="section-index">{eyebrow}</Reveal><Reveal delay={80}><Link to="/" className="back-link" data-cursor="RETOUR" aria-label="Retour à l’accueil"><span>←</span> RETOUR À L&apos;ACCUEIL</Link></Reveal></div><Reveal delay={80}><h1>{title}</h1></Reveal><Reveal className="inner-description" delay={140}><p>{description}</p></Reveal></section>{children}</div>;
}

function ToolsPage() {
  return <InnerPage eyebrow="BOÎTE À OUTILS / 02" title={<>LA BOÎTE<br /><em>À OUTILS.</em></>} description="Une carte pratique des modèles, méthodes et petits systèmes qui méritent vraiment votre temps.">
    <section className="inner-tools content-wrap">{toolsets.map((tool, index) => <ToolRow key={tool.number} delay={index * 80} {...tool} />)}</section>
    <div className="text-scan" aria-hidden="true"><div>PENSER <i>✳</i> TESTER <i>✳</i> MESURER <i>✳</i> AMÉLIORER <i>✳</i> PENSER <i>✳</i> TESTER <i>✳</i> MESURER <i>✳</i> AMÉLIORER <i>✳</i></div></div>
    <section className="tool-method content-wrap">
      <Reveal className="section-index">03 / LA MÉTHODE</Reveal>
      <div className="method-grid">
        <Reveal delay={80}><h2>Un bon système<br /><em>reste simple.</em></h2></Reveal>
        <Reveal className="method-steps" delay={140}>
          <div className="method-step"><span>01</span><SignalIcon type="observe" /><p><strong>Observer.</strong> Repérer ce qui ralentit vraiment votre travail.</p></div>
          <div className="method-step"><span>02</span><SignalIcon type="choose" /><p><strong>Choisir.</strong> Donner à chaque tâche l&apos;outil qui lui ressemble.</p></div>
          <div className="method-step"><span>03</span><SignalIcon type="test" /><p><strong>Tester.</strong> Garder ce qui aide, retirer ce qui complique.</p></div>
        </Reveal>
      </div>
    </section>
    <section className="tool-visual content-wrap">
      <div className="image-panel image-panel-lime"><img src={visualAssets.orb} alt="Orbite lumineuse contenant un réseau neural" /><span className="image-stamp">SIGNAL / 01</span></div>
      <Reveal className="image-copy" delay={120}><span className="section-index">LE BON SIGNAL</span><h2>Un peu de lumière<br /><em>dans le système.</em></h2><p>Quand la structure devient lisible, les outils cessent de prendre toute la place.</p></Reveal>
    </section>
    <section className="tools-quote content-wrap"><span>LA RÈGLE</span><p>Commencez par le problème, pas par l&apos;outil.</p></section>
  </InnerPage>;
}

function NotesPage() {
  return <InnerPage eyebrow="NOTES DE TERRAIN / 01" title={<>DES SIGNAUX POUR<br /><em>LES CURIEUX.</em></>} description="De courtes observations pour avancer dans un monde façonné par l&apos;IA avec un peu plus de clarté.">
    <section className="notes-grid content-wrap">
      <Note number="014" title="Le meilleur outil d&apos;IA est celui qui change votre façon d&apos;agir." date="28.04.26" tone="orange" image={visualAssets.signal} />
      <Note number="013" title="Le prompting est un problème de design." date="15.04.26" tone="violet" image={visualAssets.orb} />
      <Note number="012" title="Qu&apos;automatiser, que garder humain." date="02.04.26" tone="blue" image={visualAssets.flow} />
      <Note number="011" title="La vitesse ne remplace pas la direction." date="19.03.26" tone="lime" />
      <Note number="010" title="Un bon contexte vaut parfois mille instructions." date="05.03.26" tone="violet" />
      <Note number="009" title="L&apos;attention est la nouvelle matière première." date="21.02.26" tone="orange" />
    </section>
    <div className="text-scan text-scan-light" aria-hidden="true"><div>REGARDER <i>✳</i> COMPRENDRE <i>✳</i> RELIER <i>✳</i> AGIR <i>✳</i> REGARDER <i>✳</i> COMPRENDRE <i>✳</i> RELIER <i>✳</i> AGIR <i>✳</i></div></div>
    <section className="notes-practice content-wrap">
      <Reveal className="section-index">LE SIGNAL DU MOMENT</Reveal>
      <div className="notes-practice-grid">
        <Reveal delay={80}><h2>La clarté n&apos;arrive pas<br /><em>par accident.</em></h2></Reveal>
        <Reveal className="notes-practice-copy" delay={140}><p>Elle se construit en posant de meilleures questions, en laissant de la place au doute et en revenant au réel.</p><p className="muted-copy">Une note à la fois. Un test à la fois. Le reste peut attendre.</p></Reveal>
      </div>
    </section>
  </InnerPage>;
}

function Note({ number, title, date, tone, image }: { number: string; title: string; date: string; tone: string; image?: string }) {
  return <article className={`note-list-card note-${tone} ${image ? "has-note-image" : ""}`}>{image && <div className="note-image"><img src={image} alt="" /></div>}<div className="note-top"><Tag tone={tone}>NOTE DE TERRAIN {number}</Tag><span>{date}</span></div><h3>{title}</h3><div className="note-line"><span>LIRE LE SIGNAL</span><strong>↗</strong><i /></div></article>;
}

function normalizePathname(pathname: string) {
  return pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
}

function AboutPage() {
  return <InnerPage eyebrow="À PROPOS / 03" title={<>PENSER<br /><em>EN PUBLIC.</em></>} description="NEXA est une pratique indépendante de l&apos;IA pour celles et ceux qui veulent moins de bruit et plus de possibilités.">
    <section className="about-body content-wrap"><div><span className="section-index">LA CONVICTION</span><p className="large-copy">L&apos;avenir appartient à celles et ceux qui apprennent à travailler avec l&apos;intelligence — humaine comme artificielle.</p></div><div className="about-aside"><span>01 / CLARTÉ</span><span>02 / CURIOSITÉ</span><span>03 / SAVOIR-FAIRE</span></div></section>
    <section className="about-journey content-wrap">
      <Reveal className="section-index">04 / LE GESTE</Reveal>
      <div className="journey-grid">
        <Reveal delay={80}><h2>Observer.<br /><em>Traduire.</em><br />Construire.</h2></Reveal>
        <Reveal className="journey-list" delay={140}>
          <div><span>01</span><p><strong>Observer</strong><br />Les habitudes, les frictions et les idées qui cherchent leur forme.</p></div>
          <div><span>02</span><p><strong>Traduire</strong><br />La complexité en mots, cartes et décisions faciles à partager.</p></div>
          <div><span>03</span><p><strong>Construire</strong><br />Des outils assez solides pour sortir du prototype.</p></div>
        </Reveal>
      </div>
    </section>
    <section className="about-visual content-wrap">
      <Reveal className="image-copy" delay={80}><span className="section-index">UNE PRATIQUE EN MOUVEMENT</span><h2>Les idées prennent<br /><em>leur forme.</em></h2><p>Un espace pour relier la curiosité, la technologie et les gestes qui font vraiment avancer.</p></Reveal>
      <div className="image-panel image-panel-violet"><img src={visualAssets.flow} alt="Flux de lignes lumineuses violettes, orange et lime" /><span className="image-stamp">FIELD NOTE / 03</span></div>
    </section>
    <section className="about-stats content-wrap"><strong>24<span>+</span></strong><p>outils testés, cartographiés et mis en pratique</p><strong>∞</strong><p>questions qui méritent encore d&apos;être posées</p></section>
  </InnerPage>;
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

  return <InnerPage eyebrow="CONTACT / 04" title={<>RENDEZ L&apos;IA<br /><em>UTILE.</em></>} description="Une question, un workflow désordonné ou une idée à mettre à l&apos;épreuve ? Commencez ici.">
    <section className="contact-layout content-wrap"><form onSubmit={handleSubmit}><label><span>VOTRE NOM</span><input name="name" autoComplete="name" placeholder="Comment dois-je vous appeler ?" required /></label><label><span>VOTRE EMAIL</span><input name="email" type="email" autoComplete="email" placeholder="vous@quelque-part.fr" required /></label><label><span>VOTRE QUESTION</span><textarea name="message" placeholder="Qu&apos;essayez-vous d&apos;éclaircir ?" rows={4} required /></label><button className="lime-button" type="submit">Envoyer le message <span>↗</span></button></form><aside><span className="section-index">CANAL OUVERT</span><a href="mailto:hello@nexa.ai">hello@nexa.ai</a><p>Basé à Paris.<br />À l&apos;écoute partout.</p></aside></section>
    <section className="contact-formats content-wrap">
      <Reveal className="section-index">CE QUE L&apos;ON PEUT FAIRE</Reveal>
      <div className="formats-grid">
        <Reveal delay={70}><div className="format-card"><span>01</span><SignalIcon type="unlock" /><h3>Débloquer</h3><p>Clarifier une question et trouver le prochain geste utile.</p></div></Reveal>
        <Reveal delay={140}><div className="format-card"><span>02</span><SignalIcon type="structure" /><h3>Structurer</h3><p>Transformer un workflow flou en système simple et transmissible.</p></div></Reveal>
        <Reveal delay={210}><div className="format-card"><span>03</span><SignalIcon type="explore" /><h3>Explorer</h3><p>Tester une idée avec assez de curiosité pour aller plus loin.</p></div></Reveal>
      </div>
    </section>
    <div className="text-scan text-scan-light" aria-hidden="true"><div>UNE BONNE QUESTION OUVRE UNE PORTE <i>✳</i> UNE BONNE QUESTION OUVRE UNE PORTE <i>✳</i></div></div>
  </InnerPage>;
}

function App() {
  const [path, setPath] = useState(normalizePathname(window.location.pathname));
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => { const update = () => setPath(normalizePathname(window.location.pathname)); window.addEventListener("popstate", update); return () => window.removeEventListener("popstate", update); }, []);
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
