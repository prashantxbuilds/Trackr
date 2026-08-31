import {
  UtensilsCrossed, Car, ShoppingBag, Tv, Heart, Zap, Home,
  MoreHorizontal, Briefcase, Laptop, TrendingUp, Gift, PlusCircle,
  Coffee, Plane, Music, Book, Camera, Dumbbell, Package,
} from "lucide-react";
import type { LucideProps } from "lucide-react";

type IconComponent = React.ComponentType<LucideProps>;

export const ICON_MAP: Record<string, IconComponent> = {
  UtensilsCrossed, Car, ShoppingBag, Tv, Heart, Zap, Home,
  MoreHorizontal, Briefcase, Laptop, TrendingUp, Gift, PlusCircle,
  Coffee, Plane, Music, Book, Camera, Dumbbell, Package,
};

export function CategoryIcon({
  iconName,
  size = 18,
  className,
}: {
  iconName: string;
  size?: number;
  className?: string;
}) {
  const Icon = ICON_MAP[iconName] || MoreHorizontal;
  return <Icon size={size} strokeWidth={1.75} className={className} />;
}
