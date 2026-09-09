import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bookmark,
  Bot,
  Brain,
  Briefcase,
  Calendar,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Code,
  Coffee,
  Compass,
  Cpu,
  CreditCard,
  Factory,
  Github,
  GraduationCap,
  Hammer,
  Heart,
  HelpCircle,
  Home,
  Layers,
  Link,
  Linkedin,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  Quote,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Truck,
  Twitter,
  User,
  X,
  Zap,
} from 'lucide-react';
import { logger } from '../../lib/logger';

/**
 * Icon registry.
 *
 * Icon names arrive as strings — some hard-coded in the markup, others stored
 * as CMS content (a service or industry record names its own icon). That ruled
 * out plain named imports at each call site, and the previous implementation
 * used `import * as Icons from 'lucide-react'`, which defeats tree-shaking and
 * pulled the entire ~1500-icon set (852 kB) into the bundle.
 *
 * Listing the icons explicitly keeps the dynamic-by-name API while shipping
 * only what is used. To offer a new icon in the CMS, add it here.
 */
const ICONS = {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Bookmark,
  Bot,
  Brain,
  Briefcase,
  Calendar,
  Car,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  Code,
  Coffee,
  Compass,
  Cpu,
  CreditCard,
  Factory,
  Github,
  GraduationCap,
  Hammer,
  Heart,
  HelpCircle,
  Home,
  Layers,
  Link,
  Linkedin,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Menu,
  Phone,
  Plus,
  Quote,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  ShieldQuestion,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  Truck,
  Twitter,
  User,
  X,
  Zap,
} as const;

export type IconName = keyof typeof ICONS;

/** Names available to CMS content; useful for building a picker. */
export const ICON_NAMES = Object.keys(ICONS) as IconName[];

interface LucideIconProps {
  name: string;
  className?: string;
}

export function LucideIcon({ name, className }: LucideIconProps) {
  const IconComponent = ICONS[name as IconName];

  if (!IconComponent) {
    logger.warn(
      `[LucideIcon] Unknown icon "${name}". Add it to the registry in ` +
        'components/ui/LucideIcon.tsx to render it.',
    );
    return <HelpCircle className={className} />;
  }

  return <IconComponent className={className} />;
}
