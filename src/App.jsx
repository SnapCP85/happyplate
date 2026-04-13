import { useState, useEffect, useRef } from 'react';
import { supabase, loadUserData, saveUserData } from './lib/supabase';
import AuthScreen from './AuthScreen';
import FamilyFoodApp from './FamilyFoodApp';

export default function App() {
  const [session, setSession]       = useState(undefined);  // undefined = loading
  const [savedData, setSavedData]   = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);
  const saveTimerRef                = useRef(null);

  /* ── Watch auth state ── */
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) { setSavedData(null); setDataLoaded(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  /* ── Load data when user logs in ── */
  useEffect(() => {
    if (session?.user && !dataLoaded) {
      loadUserData(session.user.id).then(data => {
        setSavedData(data);
        setDataLoaded(true);
      });
    }
  }, [session, dataLoaded]);

  /* ── Debounced save triggered by FamilyFoodApp ── */
  function handleStateChange(appState) {
    if (!session?.user) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveUserData(session.user.id, appState);
    }, 2000);
  }

  /* ── Sign out helper (passed down as prop) ── */
  function handleSignOut() {
    supabase.auth.signOut();
  }

  /* ── Loading splash ── */
  if (session === undefined) {
    return (
      <div style={{
        maxWidth: 390, margin: '0 auto', height: '100dvh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#FEFCF7', boxShadow: '0 0 120px rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontSize: 52, animation: 'spin 1.2s linear infinite' }}>🍽️</div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  /* ── Auth gate ── */
  if (!session) return <AuthScreen />;

  /* ── Wait for data to load before rendering app ── */
  if (!dataLoaded) {
    return (
      <div style={{
        maxWidth: 390, margin: '0 auto', height: '100dvh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
        background: '#FEFCF7', boxShadow: '0 0 120px rgba(0,0,0,0.2)',
        fontFamily: "'Baloo 2', sans-serif",
      }}>
        <div style={{ fontSize: 48, animation: 'pulse 1s ease-in-out infinite' }}>🥞</div>
        <p style={{ fontSize: 15, fontWeight: 700, color: '#6B5E52' }}>Loading your family's menu…</p>
        <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }`}</style>
      </div>
    );
  }

  return (
    <FamilyFoodApp
      savedData={savedData}
      onStateChange={handleStateChange}
      onSignOut={handleSignOut}
      userEmail={session.user.email}
    />
  );
}
