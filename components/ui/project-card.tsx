import { Link } from "./router-link.tsx";

type Project = { slug: string; number: string; title: string; category: string; year: string; description: string; palette: string };

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return <Link to={`/work/${project.slug}`} className={`project-card ${featured ? "is-featured" : ""}`} data-cursor="OPEN">
    <div className={`project-art ${project.palette}`}><div className="art-shape art-shape-a" /><div className="art-shape art-shape-b" /><span>{project.number}</span></div>
    <div className="project-card-meta"><div><small>{project.category}</small><h3>{project.title}</h3></div><span>{project.year} <b className="arrow-icon" aria-hidden="true" /></span></div>
  </Link>;
}
