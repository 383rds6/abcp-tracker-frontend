import { Auth } from '../lib/api.js';

export default function LoginPage() {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--black)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '24px', textAlign: 'center'
    }}>
      <div style={{ marginBottom: '8px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--green)' }}>
        AR 600-9 ABCP Tracker
      </div>
      <h1 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(52px,14vw,90px)', lineHeight: 0.9, marginBottom: '24px' }}>
        CONNECT<br /><span style={{ color: 'var(--green)' }}>WHOOP</span>
      </h1>
      <p style={{ color: 'var(--gray)', fontSize: '15px', lineHeight: 1.6, maxWidth: '300px', marginBottom: '40px' }}>
        Connect your Whoop to track recovery, calories burned, sleep, and your real-time ABCP readiness score.
      </p>

      <a href={Auth.loginUrl()} style={{
        display: 'block', background: 'var(--green)', color: 'var(--black)',
        fontFamily: 'Bebas Neue', fontSize: '22px', letterSpacing: '0.1em',
        padding: '16px 48px', borderRadius: '10px', textDecoration: 'none',
        marginBottom: '16px', transition: 'opacity 0.15s'
      }}>
        CONNECT WHOOP
      </a>

      <p style={{ fontSize: '11px', color: '#444', maxWidth: '260px', lineHeight: 1.5 }}>
        You'll be redirected to Whoop to authorize. We only read your data — we never write to it.
      </p>

      <div style={{
        marginTop: '60px', background: 'var(--card)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '20px', maxWidth: '320px', textAlign: 'left'
      }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '12px' }}>
          What we track
        </div>
        {[
          ['⚡', 'Recovery score → adjusts your daily workout'],
          ['🔥', 'Calories burned → shows your real deficit'],
          ['😴', 'Sleep performance → flags cortisol risk days'],
          ['📏', 'Waist + weight logs → projects your tape test date'],
          ['🎯', 'ABCP readiness score → are you on pace to pass?'],
        ].map(([icon, text]) => (
          <div key={text} style={{ display: 'flex', gap: '10px', marginBottom: '10px', fontSize: '13px', color: 'var(--gray)', lineHeight: 1.4 }}>
            <span>{icon}</span><span>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
