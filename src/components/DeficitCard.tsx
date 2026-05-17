export default function DeficitCard({ whoopData, summary, onFoodLog }) {
  const burned = whoopData?.caloriesBurned;
  const eaten = summary?.caloriesIn ?? 0;
  const deficit = burned != null ? burned - eaten : null;
  const target = 1750;
  const pct = deficit != null ? Math.min(Math.max(deficit / target, 0), 1) : 0;
  const onPace = deficit != null && deficit >= target;
  const remaining = deficit != null ? Math.max(target - deficit, 0) : null;

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
      <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '14px' }}>
        Today's Calorie Deficit
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '32px', color: 'var(--white)', lineHeight: 1 }}>{burned ?? '--'}</div>
          <div style={{ fontSize: '10px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Burned (Whoop)</div>
        </div>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: '28px', color: 'var(--border)', alignSelf: 'center' }}>−</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '32px', color: 'var(--white)', lineHeight: 1 }}>{eaten}</div>
          <div style={{ fontSize: '10px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Eaten (Logged)</div>
        </div>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: '28px', color: 'var(--border)', alignSelf: 'center' }}>=</div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '32px', color: onPace ? 'var(--green)' : 'var(--orange)', lineHeight: 1 }}>
            {deficit ?? '--'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Deficit</div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: '6px', background: 'var(--border)', borderRadius: '3px', marginBottom: '10px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', borderRadius: '3px', transition: 'width 0.6s ease',
          width: `${pct * 100}%`,
          background: onPace ? 'var(--green)' : 'var(--orange)'
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--gray)', marginBottom: '14px' }}>
        <span>Target: {target.toLocaleString()} cal deficit</span>
        {remaining != null && remaining > 0 && <span style={{ color: 'var(--orange)' }}>{remaining} more to go</span>}
        {onPace && <span style={{ color: 'var(--green)' }}>✓ On pace</span>}
      </div>

      <button onClick={onFoodLog} style={{
        width: '100%', background: 'var(--green-bg)', border: '1px solid var(--green-dim)',
        color: 'var(--green)', borderRadius: '8px', padding: '10px',
        fontSize: '13px', fontWeight: 500, letterSpacing: '0.05em'
      }}>
        + Log Food
      </button>
    </div>
  );
}
