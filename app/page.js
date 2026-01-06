'use client';
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function IronmanRaceSelector() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selections, setSelections] = useState({
    distance: '', goal: '', swimStrength: 5, bikeStrength: 5, runStrength: 5,
    swimType: '', bikeTerrain: '', runTerrain: '', climate: ''
  });

  const TOTAL_STEPS = 8;
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xykzlvpo';
  const LOGO_PATH = "/logo.png";

  const races = [
    { date: "Apr 18, 2026", name: "IRONMAN Texas", distance: "140.6", wetsuit: "Doubtful", bike: "Flat", run: "Flat", climate: "Heat/Humidity", water: "Fresh", tags: ["Power", "PR"] },
    { date: "May 16, 2026", name: "IRONMAN Jacksonville", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Rolling", climate: "Moderate", water: "Brackish", tags: ["Downriver", "First-Timer"] },
    { date: "Jul 19, 2026", name: "IRONMAN Lake Placid", distance: "140.6", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate", water: "Fresh", tags: ["Climber", "WC"] },
    { date: "Aug 2, 2026", name: "IRONMAN Canada – Ottawa", distance: "140.6", wetsuit: "Probable", bike: "Rolling", run: "Flat", climate: "Moderate", water: "Fresh", tags: ["First-Timer", "WC"] },
    { date: "Sep 13, 2026", name: "IRONMAN Wisconsin", distance: "140.6", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate", water: "Fresh", tags: ["Climber", "Redemption"] },
    { date: "Sep 19, 2026", name: "IRONMAN Maryland", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", water: "Salt", tags: ["Power", "PR"] },
    { date: "Sep 27, 2026", name: "IRONMAN Chattanooga", distance: "140.6", wetsuit: "Maybe", bike: "Rolling", run: "Hilly", climate: "Heat/Humidity", water: "Fresh", tags: ["Downriver", "Redemption"] },
    { date: "Oct 18, 2026", name: "IRONMAN California", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", water: "Fresh", tags: ["Downriver", "PR", "First-Timer"] },
    { date: "Oct 31, 2026", name: "IRONMAN Florida", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", water: "Salt", tags: ["Power", "PR"] },
    { date: "Mar 29, 2026", name: "70.3 Texas (Galveston)", distance: "70.3", wetsuit: "Doubtful", bike: "Flat", run: "Flat", climate: "Heat/Humidity", water: "Salt", tags: ["PR", "Power"] },
    { date: "May 17, 2026", name: "70.3 Chattanooga", distance: "70.3", wetsuit: "Probable", bike: "Rolling", run: "Rolling", climate: "Moderate/Humid", water: "Fresh", tags: ["Downriver"] },
    { date: "Jun 14, 2026", name: "70.3 Eagleman", distance: "70.3", wetsuit: "Maybe", bike: "Flat", run: "Flat", climate: "Heat/Humidity", water: "Salt", tags: ["PR", "Power", "WC"] },
    { date: "Jun 14, 2026", name: "70.3 Pennsylvania Happy Valley", distance: "70.3", wetsuit: "Probable", bike: "Hilly", run: "Rolling", climate: "Moderate", water: "Fresh", tags: ["Climber"] },
    { date: "Jul 19, 2026", name: "70.3 Oregon", distance: "70.3", wetsuit: "Probable", bike: "Rolling", run: "Flat", climate: "Moderate", water: "Fresh", tags: ["Downriver", "PR", "First-Timer"] },
    { date: "Jul 19, 2026", name: "70.3 Ohio", distance: "70.3", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", water: "Fresh", tags: ["PR"] },
    { date: "Jul 26, 2026", name: "70.3 Maine", distance: "70.3", wetsuit: "Probable", bike: "Hilly", run: "Rolling", climate: "Cold/Moderate", water: "Fresh", tags: ["Downriver", "Climber"] },
    { date: "Sep 20, 2026", name: "70.3 Michigan", distance: "70.3", wetsuit: "Probable", bike: "Rolling", run: "Flat", climate: "Moderate", water: "Fresh", tags: ["PR"] },
    { date: "Sep 26, 2026", name: "70.3 Jones Beach", distance: "70.3", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", water: "Salt", tags: ["PR", "Power"] },
    { date: "Sep 27, 2026", name: "70.3 Augusta", distance: "70.3", wetsuit: "Doubtful", bike: "Flat", run: "Flat", climate: "Heat/Humidity", water: "Fresh", tags: ["Downriver"] },
    { date: "Oct 17, 2026", name: "70.3 North Carolina", distance: "70.3", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", water: "Salt", tags: ["Downriver", "PR", "Weak-Swim"] },
    { date: "Dec 6, 2026", name: "70.3 La Quinta", distance: "70.3", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Cold/Moderate", water: "Fresh", tags: ["PR", "First-Timer"] }
  ];

  const handleSelection = (field, value) => {
    setSelections({ ...selections, [field]: value });
    setStep(step + 1);
  };

  useEffect(() => {
    if (step === 8) {
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, ...selections }),
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });
    }
  }, [step]);

  const getRankedRaces = () => {
    let filtered = races.filter(r => r.distance === selections.distance);
    return filtered.sort((a, b) => {
      const calcScore = (race) => {
        let s = 0;
        const swimMult = Math.max(0, 1 + (5 - selections.swimStrength) * 0.2);
        const bikeImpact = Math.max(0.1, 1 + (5 - selections.bikeStrength) * 0.2);
        const runImpact = Math.max(0.1, 1 + (5 - selections.runStrength) * 0.2);
        if (race.water === "Salt" || race.water === "Brackish") s += 5;
        if (selections.swimType === 'Weak') {
          if (race.wetsuit === "Probable" && race.tags.includes("Downriver")) s += 40;
          else if (race.wetsuit === "Probable") s += 20;
          if (race.wetsuit === "Doubtful") s -= (50 * swimMult);
        } else if (selections.swimType === 'Strong') {
          if (race.wetsuit === "Doubtful") s += 35;
          if (race.tags.includes("Downriver")) s -= 15;
        }
        if (selections.bikeTerrain === race.bike) s += 25;
        else if (selections.bikeTerrain === 'Flat' && race.bike === 'Hilly') s -= (50 * bikeImpact);
        if (selections.runTerrain === race.run) s += 25;
        else if (selections.runTerrain === 'Flat' && race.run === 'Hilly') s -= (50 * runImpact);
        if (selections.climate === 'Heat/Humidity' && race.climate.includes('Heat')) s += 20;
        if (race.tags.includes(selections.goal)) s += 20;
        return s;
      };
      return calcScore(b) - calcScore(a);
    }).slice(0, 10);
  };

  const exportResults = () => {
    const data = getRankedRaces().map((r, i) => `#${i+1}: ${r.name}\n- Date: ${r.date}\n- Swim: ${r.water} (Wetsuit ${r.wetsuit})\n- Bike: ${r.bike}\n- Run: ${r.run}`).join('\n\n');
    const blob = new Blob([`Ranked Race Report for ${firstName} ${lastName}\n\n${data}`], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Keystone_2026_Selections.txt`;
    link.click();
  };

  const btnStyle = { display: 'block', width: '100%', padding: '15px', margin: '10px 0', backgroundColor: 'white', color: '#231F20', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', textAlign: 'center', fontSize: '16px' };
  const inputStyle = { padding: '15px', borderRadius: '8px', color: 'black', border: 'none', width: '100%', fontSize: '16px' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#231F20', color: 'white', fontFamily: 'Inter, sans-serif', padding: '20px' }}>
      <Analytics /><SpeedInsights />
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* LOGO HEADER */}
        <div style={{ marginBottom: '15px' }}>
          <img src={LOGO_PATH} alt="Keystone Endurance" style={{ maxWidth: '100%', width: '380px', height: 'auto' }} />
          <h2 style={{ letterSpacing: '4px', marginTop: '5px', fontSize: '0.9rem', color: '#D62027', fontWeight: '900' }}>RACE SELECTOR 2026</h2>
        </div>
        
        {step < TOTAL_STEPS && (
          <div style={{ width: '100%', backgroundColor: '#444', height: '6px', borderRadius: '3px', marginBottom: '25px', overflow: 'hidden' }}>
            <div style={{ width: `${(step / TOTAL_STEPS) * 100}%`, backgroundColor: '#D62027', height: '100%', transition: 'width 0.3s ease' }}></div>
          </div>
        )}

        {step === 1 && (
          <div style={{ padding: '0 10px' }}>
            <h3 style={{fontSize: '1.4rem', marginBottom: '10px'}}>Athlete Profile</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '20px', fontStyle: 'italic', opacity: '0.9' }}>
              On a scale of 1-10 (1=lowest, 10=elite), select where you stand.
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 45%' }}><input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First" style={inputStyle} /></div>
              <div style={{ flex: '1 1 45%' }}><input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last" style={inputStyle} /></div>
            </div>
            <div style={{ marginBottom: '20px' }}><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={inputStyle} /></div>
            {['swimStrength', 'bikeStrength', 'runStrength'].map(field => (
              <div key={field} style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label style={{ fontWeight: '700', fontSize: '0.95rem' }}>{field.replace('Strength', ' ')} Strength: {selections[field]}/10</label>
                <input type="range" min="1" max="10" value={selections[field]} onChange={(e) => setSelections({...selections, [field]: parseInt(e.target.value)})} style={{ width: '100%', accentColor: '#D62027', marginTop: '10px', cursor: 'pointer' }} />
              </div>
            ))}
            <button onClick={() => setStep(2)} style={btnStyle}>Next</button>
          </div>
        )}

        {step > 1 && step < 8 && (
            <div style={{ padding: '0 10px' }}>
              <h3 style={{fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '20px'}}>
                {step === 2 && "Distance Selection"}
                {step === 3 && "Swim Type"}
                {step === 4 && "Primary Goal"}
                {step === 5 && "Bike Terrain Preference"}
                {step === 6 && "Run Terrain Preference"}
                {step === 7 && "Climate Preference"}
              </h3>
              {step === 2 && ['70.3', '140.6'].map(d => <button key={d} onClick={() => handleSelection('distance', d)} style={btnStyle}>{d === '70.3' ? '70.3 (Half)' : '140.6 (Full)'}</button>)}
              {step === 3 && ['Weak', 'Intermediate', 'Strong'].map(t => <button key={t} onClick={() => handleSelection('swimType', t)} style={btnStyle}>{t}</button>)}
              {step === 4 && ['First-Timer', 'Step-Up', 'Redemption', 'PR', 'WC'].map(g => <button key={g} onClick={() => handleSelection('goal', g)} style={btnStyle}>{g}</button>)}
              {step === 5 && ['Flat', 'Rolling', 'Hilly'].map(t => <button key={t} onClick={() => handleSelection('bikeTerrain', t)} style={btnStyle}>{t}</button>)}
              {step === 6 && ['Flat', 'Rolling', 'H
