import {
  AlertCircle,
  Award,
  BookOpen,
  Bookmark,
  CheckCircle,
  Clapperboard,
  Crown,
  Flame,
  Footprints,
  Globe,
  GraduationCap,
  Hash,
  Heart,
  Layers,
  Library,
  MessageCircle,
  Moon,
  PartyPopper,
  RotateCw,
  ShoppingBag,
  ShoppingCart,
  Skull,
  Sparkles,
  SpellCheck,
  Star,
  Sun,
  Target,
  Trophy,
  Type,
  User,
  XCircle,
  type LucideProps,
} from "lucide-react";
import type { ComponentType } from "react";

const ICONS: Record<string, ComponentType<LucideProps>> = {
  "alert-circle": AlertCircle,
  award: Award,
  "book-open": BookOpen,
  bookmark: Bookmark,
  "check-circle": CheckCircle,
  clapperboard: Clapperboard,
  crown: Crown,
  flame: Flame,
  footprints: Footprints,
  globe: Globe,
  "graduation-cap": GraduationCap,
  hash: Hash,
  heart: Heart,
  layers: Layers,
  library: Library,
  "message-circle": MessageCircle,
  moon: Moon,
  "party-popper": PartyPopper,
  "rotate-cw": RotateCw,
  "shopping-bag": ShoppingBag,
  "shopping-cart": ShoppingCart,
  skull: Skull,
  sparkles: Sparkles,
  "spell-check": SpellCheck,
  star: Star,
  sunrise: Sun,
  target: Target,
  trophy: Trophy,
  type: Type,
  user: User,
  "x-circle": XCircle,
};

interface AchievementIconProps {
  name?: string | null;
  size?: number;
}

export default function AchievementIcon({
  name,
  size = 20,
}: AchievementIconProps) {
  const Icon = (name && ICONS[name]) || Trophy;
  return <Icon size={size} aria-hidden="true" />;
}
