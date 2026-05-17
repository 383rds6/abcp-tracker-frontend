import { useState } from 'react';
import { Logs } from '../lib/api.js';

export default function BodyLogCard({ summary, onRefresh }) {
  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!weight && !waist) return;
    setSaving(true);
    try {
      await Logs.logBody({ weight: weight || undefined, waist: waist || undefined });
      setSaved(true);
      setWeight(''); setWaist('');
      onRefresh();
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  }

  const currentWaist = summary?.currentWaist;
  const waistGoal = 36.5;
  const daysLeft = summary?.daysToWaistGoal;
  const trend = summary?.waistTrendPerWeek;
  const passDate = daysLeft != null ? new Date(Date.now() + daysLeft * 86400000) : null;

  return (
    <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
      <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '14px' }}>
        Body Measurements
      </div>

      {/* Current stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '16px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '26px', color: 'var(--white)', lineHeight: 1 }}>
            {summary?.currentWeight ?? '--'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>lbs</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '26px', color: currentWaist > waistGoal ? 'var(--orange)' : 'var(--green)', lineHeight: 1 }}>
            {currentWaist ?? '--'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>waist (in)</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Bebas Neue', fontSize: '26px', color: 'var(--green)', lineHeight: 1 }}>
            {summary?.currentWeight ? (230 - summary.currentWeight).toFixed(1) : '--'}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>lbs lost</div>
        </div>
      </div>

      {/* Tape test predictor */}
      {currentWaist != null && (
        <div style={{
          background: '#111', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '8px' }}>
            Tape Test Predictor
          </div>
          <div style={{ fontSize: '13px', color: 'var(--gray)', lineHeight: 1.6 }}>
            <div>Current waist: <strong style={{ color: 'var(--white)' }}>{currentWaist}"</strong></div>
            <div>Goal: <strong style={{ color: 'var(--green)' }}>{waistGoal}"</strong> (to pass WHtR at 5'7")</div>
            {trend != null && <div>Weekly rate: <strong style={{ color: trend < 0 ? 'var(--green)' : 'var(--red)' }}>{trend > 0 ? '+' : ''}{trend}"/week</strong></div>}
            {passDate && trend < 0 && (
              <div style={{ marginTop: '6px', color: 'var(--green)', fontWeight: 500 }}>
                📅 Projected to pass: <strong>{passDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>
              </div>
            )}
            {trend >= 0 && currentWaist > waistGoal && (
              <div style={{ marginTop: '6px', color: 'var(--red)' }}>
                ⚠️ Waist not decreasing — tighten the diet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Log form */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--gray)', marginBottom: '5px' }}>Weight (lbs)</div>
          <input value={weight} onChange={e => setWeight(e.target.value)} type="number" placeholder="230"
            style={{ width: '100%', background: '#111', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--white)', fontSize: '14px' }} />
        </div>
        <div>
          <div style={{ fontSize: '11px', color: 'var(--gray)', marginBottom: '5px' }}>Waist (inches)</div>
          <input value={waist} onChange={e => setWaist(e.target.value)} type="number" placeholder="36.5" step="0.5"
            style={{ width: '100%', background: '#111', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--white)', fontSize: '14px' }} />
        </div>
      </div>
      <button onClick={handleSave} disabled={saving || (!weight && !waist)} style={{
        width: '100%', background: saved ? 'rgba(57,255,20,0.15)' : 'var(--green-bg)',
        border: '1px solid var(--green-dim)', color: 'var(--green)',
        borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 500,
        opacity: (!weight && !waist) ? 0.4 : 1
      }}>
        {saving ? 'Saving...' : saved ? '✓ Saved!' : 'Save Measurements'}
      </button>
    </div>
  );
}
