import { Link } from "./router-link.tsx";

export function ServiceRow({ number, title, detail, palette, expanded = false }: { number: string; title: string; detail: string; palette: string; expanded?: boolean }) {
  return <Link to="/services" className={`service-row ${expanded ? "is-expanded" : ""}`} data-cursor="VIEW"><span className="service-number">{number}</span><span className="service-title">{title}</span><span className={`service-preview ${palette}`}><i /></span><span className="service-detail">{detail}</span><b className="arrow-icon" aria-hidden="true" /></Link>;
}
