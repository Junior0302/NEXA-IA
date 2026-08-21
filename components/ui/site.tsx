import { useEffect, useRef, useState } from "react";
import { Link } from "./router-link.tsx";

const interactiveSoundSelector = ".lime-button, .under-link, .back-link, .tool-row, .menu-trigger, .menu-close, .fullscreen-menu nav a, .site-logo, .footer-logo";

export function InteractionSounds() {
  useEffect(() => {
    const hoverSound = new Audio(new URL("sfx/ui-hover.wav", document.baseURI).href);
    const clickSound = new Audio(new URL("sfx/ui-click.wav", document.baseURI).href);
    hoverSound.preload = "auto";
    clickSound.preload = "auto";

    let lastHoverTarget: Element | null = null;
    let lastHoverAt = 0;

    const play = (source: HTMLAudioElement, volume: number) => {
      const sound = source.cloneNode(true) as HTMLAudioElement;
      sound.volume = volume;
      sound.currentTime = 0;
      void sound.play().catch(() => undefined);
    };

    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest(interactiveSoundSelector);
      if (!interactive) return;
      if (event.relatedTarget instanceof Node && interactive.contains(event.relatedTarget)) return;
      const now = performance.now();
      if (interactive === lastHoverTarget && now - lastHoverAt < 140) return;
      lastHoverTarget = interactive;
      lastHoverAt = now;
      play(hoverSound, 0.1);
    };

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element) || !target.closest(interactiveSoundSelector)) return;
      play(clickSound, 0.16);
    };

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return null;
}

export function LoadingScreen({ visible }: { visible: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!visible) return;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      setCount(Math.min(100, Math.round(((now - started) / 1050) * 100)));
      if (now - started < 1050) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible]);
  return <div className={`loading-screen ${visible ? "is-visible" : "is-hidden"}`} aria-hidden={!visible} aria-busy={visible} role="status"><div className="loading-corner loading-corner-top"><span>NEXA / SYSTÈME PRÊT</span><span>GUIDE DE TERRAIN / 2026</span></div><div className="loading-center"><div className="loading-orbit" aria-hidden="true"><i /><strong>NEXA</strong></div><span className="loading-status">CALIBRAGE DES SIGNAUX</span></div><div className="loading-progress"><i style={{ transform: `scaleX(${count / 100})` }} /></div><span className="loading-counter">{String(count).padStart(3, "0")}</span><div className="loading-corner loading-corner-bottom"><span>RENDEZ L&apos;IA UTILE.</span><span>CHARGEMENT DE L&apos;EXPÉRIENCE</span></div></div>;
}

export function Header({ onMenu, menuOpen }: { onMenu: () => void; menuOpen: boolean }) {
  return <header className="site-header"><Link to="/" className="site-logo" data-cursor="ACCUEIL"><b>NEXA</b><span>/ GUIDE DE TERRAIN IA</span></Link><div className="header-actions"><Link to="/contact" className="header-contact">Entamer une conversation <i>↗</i></Link><button className="menu-trigger" onClick={onMenu} aria-label="Ouvrir la navigation" aria-expanded={menuOpen} aria-controls="site-menu"><span /><span /></button></div></header>;
}

export function FullscreenMenu({ open, onClose, links }: { open: boolean; onClose: () => void; links?: string[][] }) {
  const menuLinks = links || [["01", "ACCUEIL", "/"], ["02", "NOTES DE TERRAIN", "/notes"], ["03", "OUTILS", "/tools"], ["04", "À PROPOS", "/about"], ["05", "CONTACT", "/contact"]];
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    (menu as HTMLDivElement & { inert: boolean }).inert = !open;
    if (open) {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
      previousFocusRef.current = null;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (open && event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return <div ref={menuRef} id="site-menu" className={`fullscreen-menu ${open ? "is-open" : ""}`} role="dialog" aria-modal="true" aria-label="Navigation principale" aria-hidden={!open}><div className="menu-top"><span>NEXA / GUIDE DE TERRAIN IA</span><button ref={closeButtonRef} className="menu-close" onClick={onClose} aria-label="Fermer la navigation"><i /><i /></button></div><nav>{menuLinks.map(([number, label, to]) => <Link key={to} to={to} onNavigate={onClose}><small>{number}</small><span>{label}</span><b aria-hidden="true">↗</b></Link>)}</nav><div className="menu-bottom"><span>RESTEZ CURIEUX</span><span>PARIS / MONDE</span></div></div>;
}

export function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const position = useRef({ x: -100, y: -100, tx: -100, ty: -100 });
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const canUse = window.matchMedia("(hover: hover) and (pointer: fine)");
    setEnabled(canUse.matches);
    if (!canUse.matches) return;
    const move = (event: MouseEvent) => { position.current.tx = event.clientX; position.current.ty = event.clientY; };
    const over = (event: MouseEvent) => { const target = (event.target as HTMLElement).closest("[data-cursor]"); const value = target?.getAttribute("data-cursor") || ""; label.current!.textContent = value; ring.current!.classList.toggle("is-active", Boolean(value)); document.body.classList.toggle("cursor-link", Boolean(target)); };
    const animate = () => { const p = position.current; p.x += (p.tx - p.x) * .18; p.y += (p.ty - p.y) * .18; if (dot.current) dot.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`; if (ring.current) { position.current.x += (p.tx - p.x) * .08; position.current.y += (p.ty - p.y) * .08; ring.current.style.transform = `translate3d(${position.current.x}px, ${position.current.y}px, 0)`; } frame.current = requestAnimationFrame(animate); };
    window.addEventListener("mousemove", move); document.addEventListener("mouseover", over); frame.current = requestAnimationFrame(animate);
    return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseover", over); cancelAnimationFrame(frame.current); };
  }, []);
  if (!enabled) return null;
  return <><div ref={dot} className="custom-cursor-dot" /><div ref={ring} className="custom-cursor-ring"><span ref={label} /></div></>;
}

export function PageTransition({ children }: { children: React.ReactNode }) { return <main className="page-transition">{children}</main>; }

export function Footer() {
  return <footer className="site-footer content-wrap"><div className="footer-top"><Link to="/" className="footer-logo">NEXA<span>/ GUIDE DE TERRAIN IA</span></Link><Link to="/contact" className="under-link">Entamer une conversation <span>↗</span></Link></div><div className="footer-bottom"><span>© {new Date().getFullYear()} NEXA</span><span>Paris / Monde</span><a href="mailto:hello@nexa.ai">hello@nexa.ai</a></div></footer>;
}
