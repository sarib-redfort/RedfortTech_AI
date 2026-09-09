interface SectionTitleProps {
  title: string; // Wrap words to highlight in braces: e.g., "We build {AI Solutions} that scale"
  subtitle?: string;
  centered?: boolean;
  light?: boolean; // If true, sets text color for dark backgrounds
  id?: string;
}

export function SectionTitle({ title, subtitle, centered = false, light = true, id }: SectionTitleProps) {
  const parseTitle = (text: string) => {
    const parts = text.split(/\{([^}]+)\}/g);
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className="text-red-600 font-extrabold drop-shadow-[0_0_15px_rgba(211,47,47,0.7)]">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div
      id={id}
      className={`mb-12 max-w-3xl ${centered ? "mx-auto text-center" : "text-left"}`}
    >
      {subtitle && (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-neutral-950 border border-neutral-800 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-red-600 uppercase font-bold">
            {subtitle}
          </span>
        </div>
      )}
      <h2
        data-animate="heading"
        className={`text-3xl md:text-5xl lg:text-6xl font-sans font-black tracking-tight leading-tight ${
          light ? "text-white" : "text-white"
        }`}
      >
        {parseTitle(title)}
      </h2>
      <div
        className={`h-1 w-20 bg-red-600 mt-5 rounded-full shadow-[0_0_12px_#D32F2F] ${centered ? "mx-auto" : "mr-auto"}`}
      />
    </div>
  );
}

