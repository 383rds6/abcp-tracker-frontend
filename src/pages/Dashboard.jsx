import { useState, useEffect } from 'react';
import { Whoop, Logs } from '../lib/api.js';
import RecoveryCard from '../components/RecoveryCard.jsx';
import DeficitCard from '../components/DeficitCard.jsx';
import ABCPScoreCard from '../components/ABCPScoreCard.jsx';
import BodyLogCard from '../components/BodyLogCard.jsx';
import FoodLogCard from '../components/FoodLogCard.jsx';
import TrendChart from '../components/TrendChart.jsx';
import WorkoutCard from '../components/WorkoutCard.jsx';

const tabs = ['Dashboard', 'Workout', 'Log Food', 'Progress'];

export default function Dashboard({ userId, onLogout }) {
  const [tab, setTab] = useState('Dashboard');
  const [whoopData, setWhoopData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [bodyLogs, setBodyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  async function loadData() {
    try {
      setLoading(true);
      const [wd, sum, body] = await Promise.all([
        Whoop.today(),
        Logs.summary(),
        Logs.getBody(),
      ]);
      setWhoopData(wd);
      setSummary(sum);
      setBodyLogs(body);
    } catch (e) {
      setError('Could not load data. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const s = { display: 'flex', flexDirection: 'column', gap: '12px' };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{ background: 'var(--dark)', borderBottom: '1px solid var(--border)', padding: '20px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '2px' }}>ABCP Tracker</div>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '24px', letterSpacing: '0.05em' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </div>
          </div>
          <button onClick={onLogout} style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--gray)', padding: '6px 12px', borderRadius: '6px', fontSize: '12px' }}>
            Logout
          </button>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid var(--border)', marginBottom: '-1px' }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, background: 'transparent', border: 'none',
              borderBottom: tab === t ? '2px solid var(--green)' : '2px solid transparent',
              color: tab === t ? 'var(--green)' : 'var(--gray)',
              fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '10px 4px', transition: 'all 0.15s'
            }}>{t}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '16px', maxWidth: '680px', margin: '0 auto' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--gray)' }}>
            <div style={{ fontFamily: 'Bebas Neue', fontSize: '24px', color: 'var(--green)', marginBottom: '8px' }}>SYNCING WHOOP...</div>
            <div style={{ fontSize: '13px' }}>Pulling your recovery and calorie data</div>
          </div>
        )}

        {error && !loading && (
          <div style={{ background: 'rgba(255,59,59,0.1)', border: '1px solid var(--red)', borderRadius: '10px', padding: '16px', color: 'var(--red)', fontSize: '14px', marginBottom: '12px' }}>
            {error}
          </div>
        )}

        {!loading && tab === 'Dashboard' && (
          <div style={s}>
            <ABCPScoreCard whoopData={whoopData} summary={summary} />
            <RecoveryCard data={whoopData} />
            <DeficitCard whoopData={whoopData} summary={summary} onFoodLog={() => setTab('Log Food')} />
            <BodyLogCard summary={summary} onRefresh={loadData} />
          </div>
        )}

        {!loading && tab === 'Workout' && (
          <WorkoutCard whoopData={whoopData} />
        )}

        {!loading && tab === 'Log Food' && (
          <FoodLogCard today={today} onLogged={loadData} />
        )}

        {!loading && tab === 'Progress' && (
          <TrendChart bodyLogs={bodyLogs} />
        )}
      </div>

      {/* Bottom nav hint */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'var(--dark)', borderTop: '1px solid var(--border)',
        display: 'flex'
      }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, background: 'transparent', border: 'none',
            color: tab === t ? 'var(--green)' : 'var(--gray)',
            fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '12px 4px 16px'
          }}>{t}</button>
        ))}
      </div>
    </div>
  );
}
