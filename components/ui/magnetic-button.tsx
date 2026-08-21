import { useRef } from "react";

export function MagneticButton({ to, label }: { to: string; label: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const move = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const node = ref.current;
    if (!node || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = node.getBoundingClientRect();
    node.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * 0.08}px, ${(event.clientY - rect.top - rect.height / 2) * 0.08}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = "translate(0, 0)"; };
  return <a ref={ref} href={to} className="magnetic-button" data-cursor="OPEN" onMouseMove={move} onMouseLeave={leave}>{label}<i className="arrow-icon" aria-hidden="true" /></a>;
}
