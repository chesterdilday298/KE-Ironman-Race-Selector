'use client';

import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function IronmanRaceSelector() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selections, setSelections] = useState({
    distance: '', goal: '', swimStrength: '', bikeTerrain: '', runTerrain: '', climate: ''
  });

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xykzlvpo';

  const races = [
    // FULL DISTANCE (140.6)
    { name: "IRONMAN Texas", distance: "140.6", wetsuit: "Doubtful", bike: "Flat/Rolling", run: "Flat", climate: "Heat/Humidity", tags: ["PR", "Power"] },
    { name: "IRONMAN Jacksonville", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Rolling", climate: "Moderate", tags: ["First-Timer", "Downriver", "Weak-Swim"] },
    { name: "IRONMAN Lake Placid", distance: "140.6", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate", tags: ["Climber", "WC Qualifier", "Strong-Swim"] },
    { name: "IRONMAN Canada-Ottawa", distance: "140.6", wetsuit: "Probable", bike: "Rolling", run: "Flat", climate: "Moderate", tags: ["First-Timer", "WC Qualifier"] },
    { name: "IRONMAN Wisconsin", distance: "140.6", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate", tags: ["Climber", "Redemption", "Cold-Weather"] },
    { name: "IRONMAN Maryland", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate/Windy", tags: ["PR", "Power", "Flat-Specialist"] },
    { name: "IRONMAN Chattanooga", distance: "140.6", wetsuit: "Maybe", bike: "Rolling", run: "Hilly/Brutal", climate: "Heat/Humidity", tags: ["Weak-Swim", "Downriver", "Redemption"] },
    { name: "IRONMAN California", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["PR", "First-Timer", "Weak-Swim", "Downriver"] },
    { name: "IRONMAN Florida", distance: "140.6", wetsuit: "Maybe", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["PR", "Power", "Flat-Specialist"] },

    // HALF DISTANCE (70.3)
    { name: "70.3 Oceanside", distance: "70.3", wetsuit: "Probable", bike: "Hilly", run: "Flat", climate: "Moderate", tags: ["Climber", "Strong-Swim"] },
    { name: "70.3 Texas (Galveston)", distance: "70.3", wetsuit: "Doubtful", bike: "Flat", run: "Flat", climate: "Heat/Humidity", tags: ["PR", "Power"] },
    { name: "70.3 Gulf Coast", distance: "70.3", wetsuit: "Maybe", bike: "Flat", run: "Flat", climate: "Heat/Humidity", tags: ["PR", "Power"] },
    { name: "70.3 Chattanooga", distance: "70.3", wetsuit: "Probable", bike: "Rolling", run: "Rolling", climate: "Moderate/Humid", tags: ["Weak-Swim", "Downriver"] },
    { name: "70.3 Boulder", distance: "70.3", wetsuit: "Maybe", bike: "Rolling", run: "Flat", climate: "Dry/Heat", tags: ["PR", "WC Qualifier"] },
    { name: "70.3 Eagleman", distance: "70.3", wetsuit: "Maybe", bike: "Flat", run: "Flat", climate: "Heat/Humidity", tags: ["PR", "Power", "Flat-Specialist"] },
    { name: "70.3 Mont-Tremblant", distance: "70.3", wetsuit: "Probable", bike: "Hilly", run: "Rolling", climate: "Moderate", tags: ["Climber", "WC Qualifier"] },
    { name: "70.3 Oregon", distance: "70.3", wetsuit: "Probable", bike: "Rolling", run: "Flat", climate: "Moderate", tags: ["Weak-Swim", "Downriver", "PR", "First-Timer"] },
    { name: "70.3 Maine", distance: "70.3", wetsuit: "Probable", bike: "Hilly", run: "Rolling", climate: "Cold/Moderate", tags: ["Downriver", "Weak-Swim", "Climber"] },
    { name: "70.3 St. George", distance: "70.3", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate/Dry", tags: ["Climber", "WC Qualifier"] },
    { name: "70.3 Wisconsin", distance: "70.3", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate", tags: ["Climber", "Redemption"] },
    { name: "70.3 Augusta", distance: "70.3", wetsuit: "Doubtful", bike: "Flat/Rolling", run: "Flat", climate: "Heat/Humidity", tags: ["Downriver", "Weak-Swim"] },
    { name: "70.3 North Carolina", distance: "70.3", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["Downriver", "Weak-Swim", "PR"] },
    { name: "70.3 Waco", distance: "70.3", wetsuit: "Doubtful", bike: "Flat", run: "Flat", climate: "Heat/Humidity", tags: ["PR", "Power"] }
  ];

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).toLowerCase());

  const handleSelection = (field, value) => {
    const updated = { ...selections, [field]: value };
    setSelections(updated);
    if (field === 'climate') {
      fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ email, ...updated }),
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
      });
    }
    setStep(step + 1);
  };

  const getRankedRaces = () => {
    let filtered = races.filter(r => r.distance === selections.distance);
    return filtered.sort((a, b) => {
      const calcScore = (race) => {
        let s = 0;
        // Swim Logic: Bonus for Downriver if Weak, Penalty for Non-Wetsuit if Weak
        if (selections.swimStrength === 'Weak') {
          if (race.tags.includes("Downriver")) s += 25;
          if (race.wetsuit === 'Doubtful') s -= 20;
        }
        // Bike Logic: Match +15, Big Penalty for Mismatch
        if (selections.bikeTerrain === 'Hilly' && race.bike.includes('Hilly')) s += 15;
        if (selections.bikeTerrain === 'Hilly' && race.bike === 'Flat') s -= 25;
        if (selections.bikeTerrain === 'Flat' && race.bike === 'Flat') s += 15;
        if (selections.bikeTerrain === 'Flat' && race.bike.includes('Hilly')) s -= 30;

        // Run Logic
        if (selections.runTerrain === 'Hilly' && race.run.includes('Hilly')) s += 15;
        if (selections.runTerrain === 'Hilly' && race.run === 'Flat') s -= 20;
        if (selections.runTerrain === 'Flat' && race.run === 'Flat') s += 15;

        // Climate Logic
        if (selections.climate === 'Cold/Moderate' && race.climate.includes('Moderate')) s += 10;
        if (selections.climate === 'Heat/Humidity' && race.climate.includes('Heat')) s += 10;
        if (selections.climate === 'Cold/Moderate' && race.climate.includes('Heat')) s -= 15;
        
        if (race.tags.includes(selections.goal)) s += 10;
        return s;
      };
      return calcScore(b) - calcScore(a);
    }).slice(0, 10);
  };

  const exportResults = () => {
    const data = getRankedRaces().map((r, i) => `#${i+1}: ${r.name}\n- Wetsuit: ${r.wetsuit}\n- Bike: ${r.bike}\n- Run: ${r.run}\n- Climate: ${r.climate}`).join('\n\n');
    const blob = new Blob([`2026 RACE REPORT FOR: ${email}\n\n${data}`], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `IM_Race_Selections.txt`;
    link.click();
  };

  const btnStyle = { display: 'block', width: '100%', padding: '15px', margin: '10px 0', backgroundColor: 'white', color: '#231F20', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#231F20', color: 'white', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <Analytics /><SpeedInsights />
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#D62027', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>IRONMAN</h1>
        <h2 style={{ letterSpacing: '4px', marginBottom: '40px', fontSize: '0.9rem' }}>RACE SELECTOR 2026</h2>

        {step === 1 && (
          <div>
            <h3>Enter Your Email to Start</h3>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="athlete@example.com" style={{ width: '100%', padding: '15px', borderRadius: '8px', marginBottom: '10px', color: 'black' }} />
            {emailError && <p style={{ color: '#D62027' }}>{emailError}</p>}
            <button onClick={() => validateEmail(email) ? setStep(2) : setEmailError('Valid email required')} style={btnStyle}>Begin</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Select Distance</h3>
            <button onClick={() => handleSelection('distance', '70.3')} style={btnStyle}>70.3 (Half)</button>
            <button onClick={() => handleSelection('distance', '140.6')} style={btnStyle}>140.6 (Full)</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>What is your primary goal?</h3>
            {['First-Timer', 'PR', 'WC Qualifier', 'Redemption'].map(g => (
              <button key={g} onClick={() => handleSelection('goal', g)} style={btnStyle}>{g}</button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div>
            <h3>Swim Profile</h3>
            <button onClick={() => handleSelection('swimStrength', 'Weak')} style={btnStyle}>Weak (Prefer Wetsuit + Current)</button>
            <button onClick={() => handleSelection('swimStrength', 'Strong')} style={btnStyle}>Strong (No current/wetsuit needed)</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3>Bike Terrain Preference</h3>
            <button onClick={() => handleSelection('bikeTerrain', 'Flat')} style={btnStyle}>Flat and Fast (Power)</button>
            <button onClick={() => handleSelection('bikeTerrain', 'Rolling')} style={btnStyle}>Gently Rolling</button>
            <button onClick={() => handleSelection('bikeTerrain', 'Hilly')} style={btnStyle}>Hilly / Technical (Climbing)</button>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3>Run Terrain Preference</h3>
            <button onClick={() => handleSelection('runTerrain', 'Flat')} style={btnStyle}>Flat and Fast</button>
            <button onClick={() => handleSelection('runTerrain', 'Hilly')} style={btnStyle}>Hilly / Brutal (Strength focus)</button>
          </div>
        )}

        {step === 7 && (
          <div>
            <h3>Climate Tolerance</h3>
            <button onClick={() => handleSelection('climate', 'Heat/Humidity')} style={btnStyle}>I thrive in Heat/Humidity</button>
            <button onClick={() => handleSelection('climate', 'Cold/Moderate')} style={btnStyle}>I prefer Cold/Moderate</button>
          </div>
        )}

        {step === 8 && (
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ textAlign: 'center', color: '#D62027' }}>Your Top 10 Race Matches</h3>
            {getRankedRaces().map((race, index) => (
              <div key={race.name} style={{ backgroundColor: 'white', color: '#231F20', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
                <div style={{ fontWeight: '900' }}>#{index + 1}: {race.name}</div>
                <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                  <strong>Swim:</strong> {race.wetsuit} Wetsuit | <strong>Bike:</strong> {race.bike}<br/>
                  <strong>Run:</strong> {race.run} | <strong>Climate:</strong> {race.climate}
                </div>
              </div>
            ))}
            <button onClick={() => setStep(1)} style={btnStyle}>Start Over</button>
            <button onClick={exportResults} style={{ ...btnStyle, backgroundColor: '#D62027', color: 'white' }}>Export Results (.txt)</button>
          </div>
        )}
      </div>
    </div>
  );
}
