export default function RecoveryCard({ data }) {
  if (!data) return null;
  const { recoveryScore, hrv, restingHR, sleepPerf, strain, workoutNote, workoutRec } = data;

  const recColor = recoveryScore >= 67 ? 'var(--green)' : recoveryScore >= 34 ? 'var(--orange)' : 'var(--red)';
  const recLabel = recoveryScore >= 67 ? 'GREEN' : recoveryScore >= 34 ? 'YELLOW' : 'RED';

  const sleepColor = sleepPerf >= 70 ? 'var(--green)' : sleepPerf >= 50 ? 'var(--orange)' : 'var(--red)';
  const lowSleep = sleepPerf != null && sleepPerf < 60;

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ background: '#1f1f1f', borderBottom: '1px solid var(--border)', padding: '12px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)' }}>Whoop Today</div>
        {recoveryScore != null && (
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '14px', letterSpacing: '0.1em', color: recColor }}>{recLabel} DAY</div>
        )}
      </div>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '14px' }}>
          {[
            { label: 'Recovery', val: recoveryScore != null ? `${recoveryScore}%` : '--', color: recColor },
            { label: 'HRV', val: hrv != null ? `${Math.round(hrv)}ms` : '--', color: 'var(--white)' },
            { label: 'Resting HR', val: restingHR != null ? `${restingHR}bpm` : '--', color: 'var(--white)' },
            { label: 'Strain', val: strain != null ? strain.toFixed(1) : '--', color: 'var(--white)' },
          ].map(m => (
            <div key={m.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Bebas Neue', fontSize: '22px', color: m.color, lineHeight: 1 }}>{m.val}</div>
              <div style={{ fontSize: '10px', color: 'var(--gray)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '4px' }}>{m.label}</div>
            </div>
          ))}
        </div>

        {/* Sleep */}
        <div style={{ background: '#111', borderRadius: '8px', padding: '10px 12px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: 'var(--gray)' }}>Sleep Performance</span>
          <span style={{ fontSize: '14px', fontWeight: 500, color: sleepColor }}>{sleepPerf != null ? `${sleepPerf}%` : '--'}</span>
        </div>

        {/* Low sleep cortisol warning */}
        {lowSleep && (
          <div style={{ background: 'rgba(255,159,10,0.1)', border: '1px solid rgba(255,159,10,0.3)', borderRadius: '8px', padding: '10px 12px', marginBottom: '10px', fontSize: '13px', color: 'var(--orange)', lineHeight: 1.5 }}>
            ⚠️ <strong>Cortisol Warning:</strong> Poor sleep spikes cortisol which causes belly fat retention. Your waist progress may stall this week. Prioritize sleep tonight.
          </div>
        )}

        {/* Workout recommendation */}
        <div style={{
          background: workoutRec === 'full' ? 'rgba(57,255,20,0.06)' : workoutRec === 'reduced' ? 'rgba(255,159,10,0.06)' : 'rgba(255,59,59,0.06)',
          border: `1px solid ${workoutRec === 'full' ? 'var(--green-dim)' : workoutRec === 'reduced' ? 'rgba(255,159,10,0.3)' : 'rgba(255,59,59,0.3)'}`,
          borderRadius: '8px', padding: '10px 12px', fontSize: '13px',
          color: workoutRec === 'full' ? 'var(--green)' : workoutRec === 'reduced' ? 'var(--orange)' : 'var(--red)',
          lineHeight: 1.5
        }}>
          💪 <strong>Today:</strong> {workoutNote}
        </div>
      </div>
    </div>
  );
}
