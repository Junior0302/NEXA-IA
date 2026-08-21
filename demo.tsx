import { RobotScene } from "./components/ui/robot-hero.tsx";

const settings = {
  color: "#c4c4c4",
  scale: 1.45,
  pantallaColor: "#00e6c3",
  pantallaBrillo: 1.1,
  blinkCycle: 3.0,
  metalness: 0.0,
};

export default function Demo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <div className="h-screen w-screen">
      <RobotScene {...s} />
    </div>
  );
}
