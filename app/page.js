'use client';

import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function IronmanRaceSelector() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selections, setSelections] = useState({
    distance: '', goal: '', 
    swimStrength: 5, bikeStrength: 5, runStrength: 5,
    bikeTerrain: '', runTerrain: '', climate: ''
  });

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xykzlvpo';

  const races = [
    { name: "IRONMAN California", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["Downriver", "PR", "First-Timer"] },
    { name: "IRONMAN Jacksonville (IMJAX)", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Rolling", climate: "Moderate", tags: ["Downriver", "First-Timer"] },
    { name: "IRONMAN Maryland", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["Power", "PR"] },
    { name: "IRONMAN Florida", distance: "140.6", wetsuit: "Maybe", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["Power", "PR"] },
    { name: "IRONMAN Chattanooga", distance: "140.6", wetsuit: "Maybe", bike: "Rolling", run: "Hilly", climate: "Heat/Humidity", tags: ["Downriver", "Redemption"] },
    { name: "IRONMAN Lake Placid", distance: "140.6", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate", tags: ["Climber", "WC"] },
    { name: "IRONMAN Wisconsin", distance: "140.6", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate", tags: ["Climber", "Redemption"] },
    { name: "IRONMAN Texas", distance: "140.6", wetsuit: "Doubtful", bike: "Flat", run: "Flat", climate: "Heat/Humidity", tags: ["Power", "PR"] },
    { name: "IRONMAN Canada (Ottawa)", distance: "140.6", wetsuit: "Probable", bike: "Rolling", run: "Flat", climate: "Moderate", tags: ["First-Timer", "WC"] },
    { name: "70.3 Oregon", distance: "70.3", wetsuit: "Probable", bike: "Rolling", run: "Flat", climate: "Moderate", tags: ["Downriver", "PR", "First-Timer"] },
    { name: "70.3 Maine", distance: "70.3", wetsuit: "Probable", bike: "Hilly", run: "Rolling", climate: "Cold/Moderate", tags: ["Downriver", "Climber"] },
    { name: "70.3 Chattanooga", distance: "70.3", wetsuit: "Probable", bike: "Rolling", run: "Rolling", climate: "Moderate/Humid", tags: ["Downriver"] },
    { name: "70.3 North Carolina", distance: "70.3", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["Downriver", "PR"] },
    { name: "70.3 Augusta", distance: "70.3", wetsuit: "Doubtful", bike: "Flat", run: "Flat", climate: "Heat/Humidity", tags: ["Downriver"] },
    { name: "70.3 St. George", distance: "70.3", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate", tags: ["Climber", "WC"] },
    { name: "70.3 Mont-Tremblant", distance: "70.3", wetsuit: "Probable", bike: "Hilly", run: "Rolling", climate: "Moderate", tags: ["Climber", "WC"] },
    { name: "70.3 Oceanside", distance: "70.3", wetsuit: "Probable", bike: "Hilly", run: "Flat", climate: "Moderate", tags: ["Climber"] },
    { name: "70.3 Eagleman", distance: "70.3", wetsuit: "Maybe", bike: "Flat", run: "Flat", climate: "Heat/Humidity", tags: ["PR", "Power", "WC"] },
    { name: "70.3 Gulf Coast", distance: "70.3", wetsuit: "Maybe", bike: "Flat", run: "Flat", climate: "Heat/Humidity", tags: ["PR", "Power"] }
  ];

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
        const isDownriver = race.tags.includes("Downriver");

        // --- SWIM SCORING WITH MULTIPLIER ---
        // Multiplier: 1/10 strength = 2.0x penalty, 5/10 = 1.0x, 10/10 = 0.5x
        const swimMultiplier = Math.max(0.5, 1 + (5 - selections.swimStrength) * 0.2);
        
        if (race.wetsuit === "Probable" && isDownriver) s += 20;
        else if (race.wetsuit === "Probable" && !isDownriver) s += 15;
        else if (race.wetsuit === "Maybe" && isDownriver) s += 10;
        else if (race.wetsuit === "Doubtful" && !isDownriver) s -= (50 * swimMultiplier);
        else if (race.wetsuit === "Doubtful" && isDownriver) s -= (10 * swimMultiplier);

        // --- BIKE SCORING WITH MULTIPLIER ---
        // If athlete is a 10, hilly penalty (-40) becomes -10. If they are a 1, it becomes -70.
        const bikeDifficultyImpact = Math.max(0.2, 1 + (5 - selections.bikeStrength) * 0.15);
        if (selections.bikeTerrain === race.bike) s += 20;
        else if (selections.bikeTerrain === 'Flat' && race.bike === 'Hilly') s -= (40 * bikeDifficultyImpact);
        else if (selections.bikeTerrain === 'Flat' && race.bike === 'Rolling') s -= (5 * bikeDifficultyImpact);

        // --- RUN SCORING WITH MULTIPLIER ---
        const runDifficultyImpact = Math.max(0.2, 1 + (5 - selections.runStrength) * 0.15);
        if (selections.runTerrain === race.run) s += 25;
        else if (selections.runTerrain === 'Flat' && race.run === 'Hilly') s -= (45 * runDifficultyImpact);

        // --- CLIMATE & GOAL ---
        if (selections.climate === 'Heat/Humidity' && race.climate.includes('Heat')) s += 15;
        if (selections.climate === 'Cold/Moderate' && race.climate.includes('Moderate')) s += 15;
        if (race.tags.includes(selections.goal)) s += 15;

        return s;
      };
      return calcScore(b) - calcScore(a);
    }).slice(0, 10);
  };

  const RenderSlider = ({ label, value, field }) => (
    <div style={{ marginBottom: '25px' }}>
      <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700' }}>{label}: {value}/10</label>
      <input 
        type="range" min="1" max="10" value={value} 
        onChange={(e) => setSelections({...selections, [field]: parseInt(e.target.value)})}
        style={{ width: '100%', accentColor: '#D62027' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginTop: '5px' }}>
        <span>Weak</span><span>Elite</span>
      </div>
    </div>
  );

  const btnStyle = { display: 'block', width: '100%', padding: '15px', margin: '10px 0', backgroundColor: 'white', color: '#231F20', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' };
  const backBtnStyle = { display: 'block', width: '100%', padding: '10px', marginTop: '20px', backgroundColor: 'transparent', color: 'white', border: '1px solid white', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#231F20', color: 'white', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <Analytics /><SpeedInsights />
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#D62027', fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>IRONMAN</h1>
        <h2 style={{ letterSpacing: '4px', marginBottom: '40px', fontSize: '0.9rem' }}>RACE SELECTOR 2026</h2>

        {step === 1 && (
          <div>
            <h3>Athlete Profile</h3>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" style={{ width: '100%', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: 'black' }} />
            <RenderSlider label="Swim Strength" value={selections.swimStrength} field="swimStrength" />
            <RenderSlider label="Bike Strength" value={selections.bikeStrength} field="bikeStrength" />
            <RenderSlider label="Run Strength" value={selections.runStrength} field="runStrength" />
            <button onClick={() => setStep(2)} style={btnStyle}>Next: Selection Criteria</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Distance</h3>
            <button onClick={() => handleSelection('distance', '70.3')} style={btnStyle}>70.3 (Half)</button>
            <button onClick={() => handleSelection('distance', '140.6')} style={btnStyle}>140.6 (Full)</button>
            <button onClick={() => setStep(1)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Goal Profile</h3>
            {['First-Timer', 'Step-Up', 'Redemption', 'PR', 'WC'].map(g => (
              <button key={g} onClick={() => handleSelection('goal', g)} style={btnStyle}>{g}</button>
            ))}
            <button onClick={() => setStep(2)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3>Bike Terrain Preference</h3>
            <button onClick={() => handleSelection('bikeTerrain', 'Flat')} style={btnStyle}>Flat and Fast (Aero)</button>
            <button onClick={() => handleSelection('bikeTerrain', 'Rolling')} style={btnStyle}>Gently Rolling</button>
            <button onClick={() => handleSelection('bikeTerrain', 'Hilly')} style={btnStyle}>Hilly (Climbing)</button>
            <button onClick={() => setStep(3)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3>Run Terrain Preference</h3>
            <button onClick={() => handleSelection('runTerrain', 'Flat')} style={btnStyle}>Flat and Fast</button>
            <button onClick={() => handleSelection('runTerrain', 'Rolling')} style={btnStyle}>Rolling Hills</button>
            <button onClick={() => handleSelection('runTerrain', 'Hilly')} style={btnStyle}>Hilly / Brutal</button>
            <button onClick={() => setStep(4)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3>Climate</h3>
            <button onClick={() => handleSelection('climate', 'Heat/Humidity')} style={btnStyle}>Heat/Humidity</button>
            <button onClick={() => handleSelection('climate', 'Cold/Moderate')} style={btnStyle}>Cold/Moderate</button>
            <button onClick={() => setStep(5)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 7 && (
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ textAlign: 'center', color: '#D62027' }}>Your Personalized 2026 Matches</h3>
            {getRankedRaces().map((race, index) => (
              <div key={race.name} style={{ backgroundColor: 'white', color: '#231F20', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
                <div style={{ fontWeight: '900' }}>#{index + 1}: {race.name}</div>
                <div style={{ fontSize: '0.8rem' }}>Swim: {race.wetsuit} | Bike: {race.bike} | Run: {race.run}</div>
              </div>
            ))}
            <button onClick={() => setStep(1)} style={btnStyle}>Start Over</button>
          </div>
        )}
      </div>
    </div>
  );
}
