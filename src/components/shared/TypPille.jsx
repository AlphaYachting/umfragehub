import React from 'react';
import { ZIELGRUPPE_PILLE } from '@/lib/designTon';

// Typ-Pille — zeigt in jeder Zeile an derselben Stelle, um welche Zielgruppe es geht.
// Die Farbpaare sind feste Kategoriefarben und stehen an einer Stelle (lib/designTon).
export default function TypPille({ zielgruppe }) {
  const s = ZIELGRUPPE_PILLE[zielgruppe];
  if (!s) return <span className="w-[104px] shrink-0" />;
  return (
    <span
      className="inline-flex items-center justify-center w-[104px] shrink-0 h-6 rounded-full text-[11px] font-semibold uppercase tracking-[0.5px]"
      style={{ backgroundColor: s.pillBg, color: s.pillText }}
    >
      {s.short}
    </span>
  );
}
