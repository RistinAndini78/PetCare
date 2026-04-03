'use client';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  type?: 'default' | 'red' | 'green' | 'blue' | 'yellow';
  gridSpan?: number;
}

export default function StatCard({ label, value, sub, type = 'default', gridSpan = 1 }: StatCardProps) {
  const typeClasses: Record<string, string> = {
    default: 'border-t-[var(--pr)]',
    red: 'border-t-[var(--red)] s-red',
    green: 'border-t-[var(--green)] s-green',
    blue: 'border-t-[var(--blue)] s-blue',
    yellow: 'border-t-[var(--yellow)] s-yellow',
  };

  return (
    <div className={`stat-card ${typeClasses[type]}`} style={{ gridColumn: gridSpan > 1 ? `span ${gridSpan}` : 'span 1' }}>
      <style jsx>{`
        .stat-card { background:var(--white); border-radius:13px; padding:16px 18px; border:1.5px solid var(--border); position:relative; overflow:hidden; border-top-width: 4px; }
        .stat-val { font-size:26px; font-weight:800; color:var(--ink); }
        .stat-label { font-size:10.5px; color:var(--muted); font-weight:600; text-transform:uppercase; letter-spacing:.4px; }
        .stat-sub { font-size:11px; color:var(--muted); margin-top:4px; }
      `}</style>
      <div className="stat-label">{label}</div>
      <div className="stat-val">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}
