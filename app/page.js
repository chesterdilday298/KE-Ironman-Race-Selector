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
    { 
      name: "IRONMAN Lake Placid", distance: "140.6", 
      wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate",
      tags: ["Climber", "WC Qualifier", "Strong-Run"] 
    },
    { 
      name: "IRONMAN California (Sacramento)", distance: "140.6", 
      wetsuit: "Probable", bike: "Flat and Fast", run: "Flat and Fast", climate: "Moderate",
      tags: ["PR", "First-Timer", "Weak-Swim", "Flat-Specialist"] 
    },
    { 
      name: "IRONMAN Chattanooga", distance: "140.6", 
      wetsuit: "Maybe", bike: "Rolling", run: "Hilly", climate: "Moderate/Humid",
      tags: ["Weak-Swim", "Redemption", "Strong-Run", "Downriver"] 
    },
    { 
      name: "IRONMAN Jacksonville (IMJAX)", distance: "140.6", 
      wetsuit: "Probable", bike: "Flat and Fast", run: "Rolling", climate: "Moderate",
      tags: ["First-Timer", "Weak-Swim", "Power"] 
    },
    { 
      name: "IRONMAN Wisconsin", distance: "140.6", 
      wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Cold/Moderate",
      tags: ["Climber", "Cold-Weather", "Strong-Run"] 
    },
    { 
      name: "IRONMAN Florida", distance: "140.6", 
      wetsuit: "Maybe", bike: "Flat and Fast", run: "Flat and Fast", climate: "Moderate",
      tags: ["PR", "Power", "First-Timer", "Flat-Specialist"] 
    },
    // HALF DISTANCE (70.3)
    { 
      name: "70.3 Oregon (Salem)", distance: "70.3", 
      wetsuit: "Probable", bike: "Rolling", run: "Flat and Fast", climate: "Moderate",
      tags: ["Weak-Swim", "First-Timer", "PR", "Downriver"] 
    },
    { 
      name: "70.3 St. George", distance: "70.3", 
      wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate/Dry",
      tags: ["Climber", "WC Qualifier", "Strong-Run"] 
    },
    { 
      name: "70.3 Maine (Augusta)", distance: "70.3", 
      wetsuit: "Probable", bike: "Hilly", run: "Rolling", climate: "Cold/Moderate",
      tags: ["Cold-Weather", "Weak-Swim", "Downriver"] 
    },
    { 
      name: "70.3 Oceanside", distance: "70.3", 
      wetsuit: "Probable", bike: "Hilly", run: "Flat and Fast", climate: "Moderate",
      tags: ["Climber", "Strong-Swim"] 
    }
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
      const score = (race) => {
        let s = 0;
        // Swim Logic
        if (selections.swimStrength === 'Weak' && race.tags.includes("Downriver")) s += 15;
        if (selections.swimStrength === 'Weak' && race.wetsuit === "Doubtful") s -= 20;
        
        // Bike Logic
        if (selections.bikeTerrain === race.bike) s += 10;
        else if (selections.bikeTerrain === 'Hilly' && race.bike === 'Flat and Fast') s -= 20;

        // Run Logic
        if (selections.runTerrain === race.run) s += 10;
        else if (selections.runTerrain === 'Flat and Fast' && race.run === 'Hilly') s -= 20;

        // Climate Logic
        if (selections.climate === 'Cold/Moderate' && race.climate.includes("Moderate")) s += 5;
        if (selections.climate === 'Heat Tolerance' && race.climate.includes("Humid")) s += 5;

        return s;
      };
      return score(b) - score(a);
    }).slice(0, 10);
  };

  const btnStyle = { display: 'block', width: '100%', padding: '15px', margin: '10px 0', backgroundColor: 'white', color: '#231F20', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#231F20', color: 'white', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <Analytics /><SpeedInsights />
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#D62027', fontSize: '2.5rem', fontWeight: '900' }}>IRONMAN</h1>
        <h2 style={{ letterSpacing: '4px', marginBottom: '40px' }}>RACE SELECTOR 2026</h2>

        {step === 1 && (
          <div>
            <h3>Enter Your Email to Start</h3>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="athlete@example.com" style={{ width: '100%', padding: '15px', borderRadius: '8px', marginBottom: '10px', color: 'black' }} />
            <button onClick={() => setStep(2)} style={btnStyle}>Start Selection</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Distance</h3>
            <button onClick={() => handleSelection('distance', '70.3')} style={btnStyle}>70.3 (Half)</button>
            <button onClick={() => handleSelection('distance', '140.6')} style={btnStyle}>140.6 (Full)</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Swimming Strength</h3>
            <button onClick={() => handleSelection('swimStrength', 'Weak')} style={btnStyle}>Weak (Needs Wetsuit + Current)</button>
            <button onClick={() => handleSelection('swimStrength', 'Strong')} style={btnStyle}>Strong (Can handle any water)</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3>Preferred Bike Terrain</h3>
            <button onClick={() => handleSelection('bikeTerrain', 'Flat and Fast')} style={btnStyle}>Flat and Fast (Aerodynamic Power)</button>
            <button onClick={() => handleSelection('bikeTerrain', 'Rolling')} style={btnStyle}>Rolling Hills</button>
            <button onClick={() => handleSelection('bikeTerrain', 'Hilly')} style={btnStyle}>Hilly / Technical (Climbing)</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3>Preferred Run Terrain</h3>
            <button onClick={() => handleSelection('runTerrain', 'Flat and Fast')} style={btnStyle}>Flat and Fast (Pacing focus)</button>
            <button onClick={() => handleSelection('runTerrain', 'Rolling')} style={btnStyle}>Gently Rolling</button>
            <button onClick={() => handleSelection('runTerrain', 'Hilly')} style={btnStyle}>Hilly / Brutal (Strength focus)</button>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3>Climate Tolerance</h3>
            <button onClick={() => handleSelection('climate', 'Heat Tolerance')} style={btnStyle}>I thrive in Heat/Humidity</button>
            <button onClick={() => handleSelection('climate', 'Cold/Moderate')} style={btnStyle}>I prefer Cold/Moderate</button>
          </div>
        )}

        {step === 7 && (
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ textAlign: 'center', color: '#D62027' }}>Your Ranked Results</h3>
            {getRankedRaces().map((race, index) => (
              <div key={race.name} style={{ backgroundColor: 'white', color: '#231F20', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
                <div style={{ fontWeight: '900' }}>#{index + 1}: {race.name}</div>
                <div style={{ fontSize: '0.8rem' }}>
                  Wetsuit: {race.wetsuit} | Bike: {race.bike} | Run: {race.run}
                </div>
              </div>
            ))}
            <button onClick={() => setStep(1)} style={btnStyle}>Start Over</button>
          </div>
        )}
      </div>
    </div>
  );
}
