import {
  BadgeCheck,
  Bike,
  CircleDot,
  Package,
  Repeat,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIcon } from "@/lib/types";

const icons: Record<ServiceIcon, LucideIcon> = {
  wrench: Wrench,
  bike: Bike,
  wheel: CircleDot,
  sparkles: Sparkles,
  repeat: Repeat,
  badge: BadgeCheck,
  package: Package,
};

export function ServiceGlyph({
  icon,
  className,
}: {
  icon: ServiceIcon;
  className?: string;
}) {
  const Icon = icons[icon];
  return <Icon aria-hidden="true" className={className} strokeWidth={1.7} />;
}
