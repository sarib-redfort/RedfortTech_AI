import * as Icons from "lucide-react";

interface LucideIconProps {
  name: string;
  className?: string;
  key?: any;
}

export function LucideIcon({ name, className }: LucideIconProps) {
  // Dynamically resolve icon from lucide-react export names
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    // Return HelpCircle as a reliable visual fallback
    const Fallback = (Icons as any)["HelpCircle"] || Icons.HelpCircle;
    return <Fallback className={className} />;
  }
  return <IconComponent className={className} />;
}
