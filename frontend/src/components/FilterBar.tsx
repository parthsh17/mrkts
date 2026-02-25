import type { Sentiment } from '../lib/types';

type FilterValue = Sentiment | 'All';

interface FilterBarProps {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
}

const FILTERS: FilterValue[] = ['All', 'Bullish', 'Bearish', 'Neutral'];

const ACTIVE_STYLES: Record<FilterValue, string> = {
  All: 'bg-white text-black border-white shadow-none translate-x-[2px] translate-y-[2px]',
  Bullish: 'bg-bullish text-black border-bullish shadow-none translate-x-[2px] translate-y-[2px]',
  Bearish: 'bg-bearish text-white border-bearish shadow-none translate-x-[2px] translate-y-[2px]',
  Neutral: 'bg-neutral text-black border-neutral shadow-none translate-x-[2px] translate-y-[2px]',
};

const IDLE_STYLES: Record<FilterValue, string> = {
  All: 'bg-transparent text-white border-white neo-shadow hover:-translate-x-0.5 hover:-translate-y-0.5',
  Bullish: 'bg-transparent text-bullish border-bullish neo-shadow-bullish hover:-translate-x-0.5 hover:-translate-y-0.5',
  Bearish: 'bg-transparent text-bearish border-bearish neo-shadow-bearish hover:-translate-x-0.5 hover:-translate-y-0.5',
  Neutral: 'bg-transparent text-neutral border-neutral neo-shadow-neutral hover:-translate-x-0.5 hover:-translate-y-0.5',
};

export function FilterBar({ active, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-8">
      {FILTERS.map((f) => {
        const isActive = active === f;
        return (
          <button
            key={f}
            id={`filter-${f.toLowerCase()}`}
            onClick={() => onChange(f)}
            className={`
              px-5 py-2 font-black text-sm uppercase tracking-widest border-2
              transition-all duration-100 cursor-pointer
              ${isActive ? ACTIVE_STYLES[f] : IDLE_STYLES[f]}
            `}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}
