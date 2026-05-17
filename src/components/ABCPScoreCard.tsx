// Calculates a single 0-100 ABCP readiness score from all available data
export default function ABCPScoreCard({ whoopData, summary }) {
  const score = calcScore(whoopData, summary);
  const { color, label, desc } = scoreCategory(score);

  return (
    <div style={{
      background: 'var(--card)', border: `1px solid ${color}44`,
      borderRadius: '14px', padding: '20px', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute', top: '-40px', right: '-40px',
        width: '160px', height: '160px',
        background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />
      <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '12px' }}>
        ABCP Readiness Score
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', marginBottom: '8px' }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: '72px', color, lineHeight: 1 }}>
          {score ?? '--'}
        </div>
        <div style={{ paddingBottom: '10px' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '22px', color, letterSpacing: '0.05em' }}>{label}</div>
          <div style={{ fontSize: '12px', color: 'var(--gray)' }}>/100</div>
        </div>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: 1.5 }}>{desc}</div>

      {/* Score breakdown */}
      <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {getFactors(whoopData, summary).map(f => (
          <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--gray)' }}>{f.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '80px', height: '4px', background: 'var(--border)', borderRadius: '2px' }}>
                <div style={{ width: `${f.pct}%`, height: '100%', background: f.color, borderRadius: '2px', transition: 'width 0.5s' }} />
              </div>
              <span style={{ fontSize: '12px', color: f.color, fontWeight: 500, width: '28px', textAlign: 'right' }}>{f.val}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function calcScore(w, s) {
  if (!w && !s) return null;
  let total = 0, weight = 0;

  // Recovery score (30 pts max)
  if (w?.recoveryScore != null) {
    total += (w.recoveryScore / 100) * 30;
    weight += 30;
  }

  // Sleep (20 pts max)
  if (w?.sleepPerf != null) {
    total += (w.sleepPerf / 100) * 20;
    weight += 20;
  }

  // Deficit on track (30 pts max) — need ≥1,750 cal deficit
  if (w?.caloriesBurned && s?.caloriesIn) {
    const deficit = w.caloriesBurned - s.caloriesIn;
    const deficitPct = Math.min(Math.max(deficit / 1750, 0), 1);
    total += deficitPct * 30;
    weight += 30;
  }

  // Waist trend (20 pts max) — losing = good
  if (s?.waistTrendPerWeek != null) {
    const trend = s.waistTrendPerWeek;
    const trendPct = trend < 0 ? Math.min(Math.abs(trend) / 0.5, 1) : 0;
    total += trendPct * 20;
    weight += 20;
  }

  if (weight === 0) return null;
  return Math.round((total / weight) * 100);
}

function scoreCategory(score) {
  if (score == null) return { color: 'var(--gray)', label: 'NO DATA', desc: 'Log your food and body measurements to see your score.' };
  if (score >= 80) return { color: 'var(--green)', label: 'ON TRACK', desc: 'You are on pace to pass your tape test. Keep this up.' };
  if (score >= 60) return { color: 'var(--yellow)', label: 'CLOSE', desc: 'Mostly on track — tighten up your diet this week.' };
  if (score >= 40) return { color: 'var(--orange)', label: 'AT RISK', desc: 'You need to close the deficit gap. Hit your calorie targets.' };
  return { color: 'var(--red)', label: 'OFF PACE', desc: 'Current trajectory will not hit the tape test goal in time.' };
}

function getFactors(w, s) {
  return [
    {
      label: 'Recovery',
      val: w?.recoveryScore ?? '--',
      pct: w?.recoveryScore ?? 0,
      color: w?.recoveryScore >= 67 ? 'var(--green)' : w?.recoveryScore >= 34 ? 'var(--orange)' : 'var(--red)'
    },
    {
      label: 'Sleep',
      val: w?.sleepPerf ? `${w.sleepPerf}%` : '--',
      pct: w?.sleepPerf ?? 0,
      color: w?.sleepPerf >= 70 ? 'var(--green)' : 'var(--orange)'
    },
    {
      label: 'Daily Deficit',
      val: (w?.caloriesBurned && s?.caloriesIn) ? `${w.caloriesBurned - s.caloriesIn}` : '--',
      pct: (w?.caloriesBurned && s?.caloriesIn) ? Math.min((w.caloriesBurned - s.caloriesIn) / 1750 * 100, 100) : 0,
      color: 'var(--green)'
    },
    {
      label: 'Waist Trend',
      val: s?.waistTrendPerWeek ? `${s.waistTrendPerWeek}"/wk` : '--',
      pct: s?.waistTrendPerWeek < 0 ? Math.min(Math.abs(s.waistTrendPerWeek) / 0.5 * 100, 100) : 0,
      color: s?.waistTrendPerWeek < 0 ? 'var(--green)' : 'var(--red)'
    },
  ];
}
