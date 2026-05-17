import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#1f1f1f', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '10px 14px', fontSize: '13px' }}>
      <div style={{ color: '#888', marginBottom: '4px' }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></div>
      ))}
    </div>
  );
};

export default function TrendChart({ bodyLogs }) {
  if (!bodyLogs?.length) return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '40px', textAlign: 'center', color: 'var(--gray)', fontSize: '14px' }}>
      No measurements logged yet.<br />Log your weight and waist weekly to see your trend.
    </div>
  );

  const data = bodyLogs.map(b => ({
    date: new Date(b.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weight: b.weight_lbs,
    waist: b.waist_inches,
  }));

  const startWeight = 230;
  const targetWeight = 210;
  const waistGoal = 36.5;

  const currentWeight = bodyLogs[bodyLogs.length - 1]?.weight_lbs;
  const currentWaist = bodyLogs[bodyLogs.length - 1]?.waist_inches;
  const lostLbs = currentWeight ? (startWeight - currentWeight).toFixed(1) : 0;
  const toGoLbs = currentWeight ? Math.max(currentWeight - targetWeight, 0).toFixed(1) : '--';
  const waistToGo = currentWaist ? Math.max(currentWaist - waistGoal, 0).toFixed(1) : '--';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Summary stats */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '14px' }}>8-Week Progress</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', textAlign: 'center' }}>
          <div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '32px', color: 'var(--green)', lineHeight: 1 }}>{lostLbs}</div>
            <div style={{ fontSize: '10px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>lbs lost</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '32px', color: 'var(--orange)', lineHeight: 1 }}>{toGoLbs}</div>
            <div style={{ fontSize: '10px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>lbs to go</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '32px', color: parseFloat(waistToGo) > 0 ? 'var(--orange)' : 'var(--green)', lineHeight: 1 }}>{waistToGo}"</div>
            <div style={{ fontSize: '10px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>waist to go</div>
          </div>
        </div>
      </div>

      {/* Weight chart */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '16px' }}>Weight (lbs)</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={targetWeight} stroke="#39ff14" strokeDasharray="4 4" label={{ value: 'Goal', fill: '#39ff14', fontSize: 11 }} />
            <Line type="monotone" dataKey="weight" name="Weight" stroke="#f0f0f0" strokeWidth={2} dot={{ fill: '#f0f0f0', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Waist chart */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '16px' }}>Waist (inches)</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
            <XAxis dataKey="date" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={waistGoal} stroke="#39ff14" strokeDasharray="4 4" label={{ value: '36.5" goal', fill: '#39ff14', fontSize: 11 }} />
            <Line type="monotone" dataKey="waist" name="Waist" stroke="#ff9f0a" strokeWidth={2} dot={{ fill: '#ff9f0a', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
