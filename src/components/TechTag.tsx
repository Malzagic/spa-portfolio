/**
 * TechTag Component
 * Uses theme-aware 'tag' property for consistent borders and backgrounds.
 */
import { useTheme } from "@/context/ThemeContext";

export const TechTag = ({ label }: { label: string }) => {
  const { themeConfig: T } = useTheme();

  return <span className={`px-3 py-1 text-xs font-mono rounded-full border transition-all ${T.tag}`}>{label}</span>;
};
