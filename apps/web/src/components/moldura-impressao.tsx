import type { ReactNode } from "react";

export function MolduraImpressao({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-[88mm] w-[63mm]">
      <div className="absolute left-0 top-0 origin-top-left scale-[0.8504]">
        {children}
      </div>
      <div className="pointer-events-none absolute -inset-[0.3mm] rounded-[3mm] border-[0.3mm] border-dashed border-neutral-500" />
    </div>
  );
}
