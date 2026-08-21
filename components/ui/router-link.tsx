export function Link({ to, children, className = "", onNavigate, style }: { to: string; children: React.ReactNode; className?: string; onNavigate?: () => void; style?: React.CSSProperties }) {
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const isModifiedClick = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (to.startsWith("/") && !isModifiedClick) {
      event.preventDefault();
      const destination = to === "/" ? "/" : `${to.replace(/\/+$/, "")}/`;
      window.history.pushState({}, "", destination);
      window.dispatchEvent(new PopStateEvent("popstate"));
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    onNavigate?.();
  };
  const href = to === "/" || !to.startsWith("/") ? to : `${to.replace(/\/+$/, "")}/`;
  return <a href={href} className={className} style={style} onClick={handleClick}>{children}</a>;
}
