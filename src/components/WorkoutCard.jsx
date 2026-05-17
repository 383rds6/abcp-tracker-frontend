// Reuses the exercise modal system from the original plan
// Adjusts which exercises to show based on Whoop recovery

const DAYS = {
  2: { name: 'Tuesday', focus: 'Push — Chest / Shoulders / Triceps', exercises: ['bench-press','shoulder-press','incline-db-press','tricep-pushdowns','plank','ab-wheel'] },
  3: { name: 'Wednesday', focus: 'Pull — Back / Biceps', exercises: ['barbell-rows','lat-pulldowns','cable-rows','bicep-curls','hanging-leg-raises','russian-twists'] },
  4: { name: 'Thursday', focus: 'Legs', exercises: ['squats','rdl','leg-press','walking-lunges','leg-raises','plank'] },
  5: { name: 'Friday', focus: 'Full Body + Cardio', exercises: ['deadlifts','pull-ups','db-lunges','incline-walk','cable-crunches','side-planks'] },
};

const EX_NAMES = {
  'bench-press':'Bench Press','shoulder-press':'Shoulder Press','incline-db-press':'Incline DB Press',
  'tricep-pushdowns':'Tricep Pushdowns','plank':'Plank','ab-wheel':'Ab Wheel Rollouts',
  'barbell-rows':'Barbell Rows','lat-pulldowns':'Lat Pulldowns','cable-rows':'Cable Rows',
  'bicep-curls':'Bicep Curls','hanging-leg-raises':'Hanging Leg Raises','russian-twists':'Russian Twists',
  'squats':'Squats','rdl':'Romanian Deadlifts','leg-press':'Leg Press',
  'walking-lunges':'Walking Lunges','leg-raises':'Leg Raises',
  'deadlifts':'Deadlifts','pull-ups':'Pull-Ups / Assisted','db-lunges':'Dumbbell Lunges',
  'incline-walk':'Incline Treadmill Walk','cable-crunches':'Cable Crunches','side-planks':'Side Planks',
};

const EX_SETS = {
  'bench-press':'4 × 8','shoulder-press':'3 × 10','incline-db-press':'3 × 10',
  'tricep-pushdowns':'3 × 12','plank':'3 × 45 sec','ab-wheel':'3 × 12',
  'barbell-rows':'4 × 8','lat-pulldowns':'3 × 10','cable-rows':'3 × 10',
  'bicep-curls':'3 × 12','hanging-leg-raises':'3 × 15','russian-twists':'3 × 20',
  'squats':'4 × 8','rdl':'3 × 10','leg-press':'3 × 12',
  'walking-lunges':'3 × 12 each','leg-raises':'3 × 15',
  'deadlifts':'3 × 5','pull-ups':'3 × 8','db-lunges':'3 × 10',
  'incline-walk':'20 min','cable-crunches':'3 × 15','side-planks':'3 × 30 sec each',
};

export default function WorkoutCard({ whoopData }) {
  const today = new Date().getDay(); // 0=Sun, 1=Mon ... 6=Sat
  const todayPlan = DAYS[today];
  const recovery = whoopData?.recoveryScore;
  const workoutRec = whoopData?.workoutRec || 'full';

  // On red days, only show cardio
  const isRest = workoutRec === 'rest';
  // On yellow days, drop last compound set (visual indicator only)
  const isReduced = workoutRec === 'reduced';

  if (!todayPlan) {
    return (
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '32px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Bebas Neue', fontSize: '28px', color: 'var(--green)', marginBottom: '8px' }}>REST DAY</div>
        <div style={{ color: 'var(--gray)', fontSize: '14px' }}>
          {today === 6 ? 'Saturday — meal prep day. Cook your turkey bowls for the week.' : 'Monday — active rest. Walk 20 min if you feel like it.'}
        </div>
      </div>
    );
  }

  const exercises = isRest ? ['incline-walk'] : todayPlan.exercises;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Whoop adjustment banner */}
      {recovery != null && (
        <div style={{
          background: isRest ? 'rgba(255,59,59,0.08)' : isReduced ? 'rgba(255,159,10,0.08)' : 'rgba(57,255,20,0.08)',
          border: `1px solid ${isRest ? 'rgba(255,59,59,0.3)' : isReduced ? 'rgba(255,159,10,0.3)' : 'var(--green-dim)'}`,
          borderRadius: '10px', padding: '12px 14px', fontSize: '13px',
          color: isRest ? 'var(--red)' : isReduced ? 'var(--orange)' : 'var(--green)', lineHeight: 1.5
        }}>
          <strong>Whoop says ({recovery}% recovery):</strong> {whoopData.workoutNote}
        </div>
      )}

      {/* Today's workout */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
        <div style={{ background: '#1f1f1f', borderBottom: '1px solid var(--border)', padding: '12px 18px', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '22px', letterSpacing: '0.05em' }}>{todayPlan.name}</div>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green)', alignSelf: 'center' }}>
            {isRest ? 'CARDIO ONLY' : isReduced ? 'REDUCED' : todayPlan.focus}
          </div>
        </div>
        <div style={{ padding: '6px 18px 14px' }}>
          {exercises.map((id, i) => {
            const isDropped = isReduced && i === 0; // visual indicator first compound is reduced
            return (
              <div key={id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 0', borderBottom: i < exercises.length - 1 ? '1px solid var(--border)' : 'none',
                opacity: isDropped ? 0.5 : 1
              }}>
                <div style={{ fontSize: '14px', color: 'var(--white)' }}>
                  {EX_NAMES[id]}
                  {isDropped && <span style={{ fontSize: '11px', color: 'var(--orange)', marginLeft: '8px' }}>↓ 1 set (recovery)</span>}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--gray)', whiteSpace: 'nowrap' }}>{EX_SETS[id]}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--gray)', textAlign: 'center', padding: '4px' }}>
        Open the full plan for exercise breakdowns and muscle diagrams
      </div>
    </div>
  );
}
