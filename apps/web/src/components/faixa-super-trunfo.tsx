export function FaixaSuperTrunfo({ className }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none h-[92px] w-[92px] overflow-hidden ${className ?? ""}`}
      aria-hidden="true"
    >
      <div className="absolute right-[-38px] top-[20px] w-[150px] rotate-45 border-y border-[#8a5a00] bg-gradient-to-b from-[#fff1a8] via-[#f5c542] to-[#c8900f] py-[3px] shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
        <p className="text-center font-[Arial_Black,Impact,sans-serif] text-[13px] font-black italic leading-none tracking-[0.12em] text-[#0b1f5c] [text-shadow:0_1px_0_rgba(255,255,255,0.55)]">
          TRUNFO
        </p>
      </div>
    </div>
  );
}
