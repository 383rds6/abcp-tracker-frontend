import { useState, useEffect } from 'react';
import { Logs } from '../lib/api.js';

const PRESET_MEALS = [
  { name: 'Eggs + Oats (Breakfast)', meal: 'breakfast', calories: 420 },
  { name: 'Chicken Rice Bowl (Lunch)', meal: 'lunch', calories: 450 },
  { name: 'Greek Yogurt (Snack)', meal: 'snack', calories: 160 },
  { name: 'Turkey Corn Bowl (Dinner)', meal: 'dinner', calories: 500 },
];

export default function FoodLogCard({ today, onLogged }) {
  const [logs, setLogs] = useState([]);
  const [custom, setCustom] = useState({ name: '', calories: '' });
  const [saving, setSaving] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try { setLogs(await Logs.getFood(today)); } catch {}
    setLoading(false);
  }

  useEffect(() => { load(); }, [today]);

  async function logMeal(meal, calories, name) {
    setSaving(name);
    try {
      await Logs.logFood({ meal, calories, date: today });
      await load();
      onLogged();
    } catch { alert('Failed to log. Try again.'); }
    setSaving(null);
  }

  const totalEaten = logs.reduce((s, r) => s + r.calories, 0);
  const remaining = 1530 - totalEaten;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* Today's total */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '12px' }}>
          Today's Food Log
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }}>
          <div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '48px', color: totalEaten > 1530 ? 'var(--red)' : 'var(--white)', lineHeight: 1 }}>{totalEaten}</div>
            <div style={{ fontSize: '12px', color: 'var(--gray)' }}>of 1,530 cal eaten</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '28px', color: remaining >= 0 ? 'var(--green)' : 'var(--red)', lineHeight: 1 }}>
              {remaining >= 0 ? remaining : `+${Math.abs(remaining)}`}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--gray)' }}>{remaining >= 0 ? 'remaining' : 'over limit'}</div>
          </div>
        </div>
        <div style={{ height: '5px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: totalEaten > 1530 ? 'var(--red)' : 'var(--green)', width: `${Math.min(totalEaten / 1530 * 100, 100)}%`, transition: 'width 0.4s' }} />
        </div>

        {/* Logged items */}
        {!loading && logs.length > 0 && (
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {logs.map((l, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--gray)' }}>{l.meal || 'meal'}</span>
                <span style={{ color: 'var(--white)' }}>{l.calories} cal</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick log — plan meals */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '12px' }}>
          Quick Log — Your Plan
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {PRESET_MEALS.map(m => (
            <div key={m.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', borderRadius: '8px', padding: '10px 14px' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--white)' }}>{m.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--gray)' }}>{m.calories} cal</div>
              </div>
              <button onClick={() => logMeal(m.meal, m.calories, m.name)} disabled={saving === m.name} style={{
                background: 'var(--green-bg)', border: '1px solid var(--green-dim)',
                color: 'var(--green)', borderRadius: '6px', padding: '6px 14px',
                fontSize: '12px', fontWeight: 500
              }}>
                {saving === m.name ? '...' : '+ Log'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Custom entry */}
      <div style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '14px', padding: '18px' }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '12px' }}>
          Custom Entry
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input value={custom.name} onChange={e => setCustom(p => ({ ...p, name: e.target.value }))} placeholder="What did you eat?"
            style={{ flex: 2, background: '#111', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--white)', fontSize: '13px' }} />
          <input value={custom.calories} onChange={e => setCustom(p => ({ ...p, calories: e.target.value }))} type="number" placeholder="Cal"
            style={{ flex: 1, background: '#111', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 12px', color: 'var(--white)', fontSize: '13px' }} />
        </div>
        <button onClick={() => logMeal('other', parseInt(custom.calories), custom.name)} disabled={!custom.calories || saving}
          style={{ marginTop: '10px', width: '100%', background: 'var(--green-bg)', border: '1px solid var(--green-dim)', color: 'var(--green)', borderRadius: '8px', padding: '10px', fontSize: '13px', fontWeight: 500, opacity: !custom.calories ? 0.4 : 1 }}>
          Log Custom Meal
        </button>
      </div>
    </div>
  );
}
