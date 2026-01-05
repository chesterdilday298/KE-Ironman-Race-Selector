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
    { name: "IRONMAN California", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["Downriver", "Weak-Swim", "PR", "First-Timer"] },
    { name: "IRONMAN Jacksonville (IMJAX)", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Rolling", climate: "Moderate", tags: ["Downriver", "Weak-Swim", "First-Timer"] },
    { name: "IRONMAN Maryland", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["Power", "PR"] },
    { name: "IRONMAN Florida", distance: "140.6", wetsuit: "Maybe", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["Power", "PR"] },
    { name: "IRONMAN Chattanooga", distance: "140.6", wetsuit: "Maybe", bike: "Rolling", run: "Hilly", climate: "Heat/Humidity", tags: ["Downriver", "Weak-Swim", "Redemption"] },
    { name: "IRONMAN Lake Placid", distance: "140.6", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate", tags: ["Climber", "WC"] },
    { name: "IRONMAN Wisconsin", distance: "140.6", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate", tags: ["Climber", "Redemption"] },
    { name: "IRONMAN Texas", distance: "140.6", wetsuit: "Doubtful", bike: "Flat", run: "Flat", climate: "Heat/Humidity", tags: ["Power", "PR"] },

    // HALF DISTANCE (70.3)
    { name: "70.3 Oregon", distance: "70.3", wetsuit: "Probable", bike: "Rolling", run: "Flat", climate: "Moderate", tags: ["Downriver", "Weak-Swim", "PR", "First-Timer"] },
    { name: "70.3 Maine", distance: "70.3", wetsuit: "Probable", bike: "Hilly", run: "Rolling", climate: "Cold/Moderate", tags: ["Downriver", "Weak-Swim", "Climber"] },
    { name: "70.3 Chattanooga", distance: "70.3", wetsuit: "Probable", bike: "Rolling", run: "Rolling", climate: "Moderate/Humid", tags: ["Downriver", "Weak-Swim"] },
    { name: "70.3 North Carolina", distance: "70.3", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["Downriver", "Weak-Swim", "PR"] },
    { name: "70.3 Augusta", distance: "70.3", wetsuit: "Doubtful", bike: "Flat", run: "Flat", climate: "Heat/Humidity", tags: ["Downriver", "Weak-Swim"] },
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

        // SWIM SCORING (STRICT POINT MATRIX)
        const isDownriver = race.tags.includes("Downriver");
        if (selections.swimStrength === 'Weak') {
          if (race.wetsuit === "Probable" && isDownriver) s += 20;
          else if (race.wetsuit === "Probable" && !isDownriver) s += 15;
          else if (race.wetsuit === "Maybe" && isDownriver) s += 10;
          else if (race.wetsuit === "Maybe" && !isDownriver) s += 0;
          else if (race.wetsuit === "Doubtful" && isDownriver) s -= 5;
          else if (race.wetsuit === "Doubtful" && !isDownriver) s -= 50;
        }

        // BIKE TERRAIN (SOFTENED PENALTIES FOR ROLLING)
        if (selections.bikeTerrain === race.bike) s += 20; // Exact Match
        else if (selections.bikeTerrain === 'Flat' && race.bike === 'Rolling') s -= 5; // Low penalty for slight mismatch
        else if (selections.bikeTerrain === 'Flat' && race.bike === 'Hilly') s -= 40; // High penalty for extreme mismatch
        else if (selections.bikeTerrain === 'Rolling' && (race.bike === 'Flat' || race.bike === 'Hilly')) s += 5; // Rolling athletes handle both well

        // RUN TERRAIN (SOFTENED PENALTIES FOR ROLLING)
        if (selections.runTerrain === race.run) s += 25;
        else if (selections.runTerrain === 'Flat' && race.run === 'Rolling') s -= 5;
        else if (selections.runTerrain === 'Flat' && race.run === 'Hilly') s -= 45;

        // CLIMATE & GOAL
        if (selections.climate === 'Heat/Humidity' && race.climate.includes('Heat')) s += 15;
        if (selections.climate === 'Cold/Moderate' && race.climate.includes('Moderate')) s += 15;
        if (race.tags.includes(selections.goal)) s += 15; // Increased weight for WC/Goal profile

        return s;
      };
      return calcScore(b) - calcScore(a);
    }).slice(0, 10);
  };

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
            <h3>Enter Your Email to Start</h3>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="athlete@example.com" style={{ width: '100%', padding: '15px', borderRadius: '8px', marginBottom: '10px', color: 'black', border: 'none' }} />
            <button onClick={() => setStep(2)} style={btnStyle}>Begin</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Distance</h3>
            <button onClick={() => handleSelection('distance', '70.3')} style={btnStyle}>70.3 (Half)</button>
            <button onClick={() => handleSelection('distance', '140.6')} style={btnStyle}>140.6 (Full)</button>
            <button onClick={() => setStep(step - 1)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Goal Profile</h3>
            <button onClick={() => handleSelection('goal', 'First-Timer')} style={btnStyle}>First-Timer / Just Finish</button>
            <button onClick={() => handleSelection('goal', 'Step-Up')} style={btnStyle}>Experience with Sprint/Olympic Stepping Up</button>
            <button onClick={() => handleSelection('goal', 'Redemption')} style={btnStyle}>Redemption (Past DNF'd)</button>
            <button onClick={() => handleSelection('goal', 'PR')} style={btnStyle}>Personal Best (PR)</button>
            <button onClick={() => handleSelection('goal', 'WC')} style={btnStyle}>World Championship Qualifier</button>
            <button onClick={() => setStep(step - 1)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3>Swim Strength</h3>
            <button onClick={() => handleSelection('swimStrength', 'Weak')} style={btnStyle}>Weak (Wetsuit + Current Preferred)</button>
            <button onClick={() => handleSelection('swimStrength', 'Intermediate')} style={btnStyle}>Intermediate (Wetsuit/Current Optional)</button>
            <button onClick={() => handleSelection('swimStrength', 'Strong')} style={btnStyle}>Strong (Prefer No Wetsuit or Current)</button>
            <button onClick={() => setStep(step - 1)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3>Bike Terrain</h3>
            <button onClick={() => handleSelection('bikeTerrain', 'Flat')} style={btnStyle}>Flat and Fast (Aero rewarded)</button>
            <button onClick={() => handleSelection('bikeTerrain', 'Rolling')} style={btnStyle}>Gently Rolling (Mix of Aero and Hoods)</button>
            <button onClick={() => handleSelection('bikeTerrain', 'Hilly')} style={btnStyle}>Hilly (Climbing Specialist)</button>
            <button onClick={() => setStep(step - 1)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3>Run Terrain</h3>
            <button onClick={() => handleSelection('runTerrain', 'Flat')} style={btnStyle}>Flat and Fast</button>
            <button onClick={() => handleSelection('runTerrain', 'Rolling')} style={btnStyle}>Rolling Hills</button>
            <button onClick={() => handleSelection('runTerrain', 'Hilly')} style={btnStyle}>Hilly / Brutal (Strength focus)</button>
            <button onClick={() => setStep(step - 1)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 7 && (
          <div>
            <h3>Climate</h3>
            <button onClick={() => handleSelection('climate', 'Heat/Humidity')} style={btnStyle}>I thrive in Heat/Humidity</button>
            <button onClick={() => handleSelection('climate', 'Cold/Moderate')} style={btnStyle}>I prefer Cold/Moderate</button>
            <button onClick={() => setStep(step - 1)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 8 && (
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ textAlign: 'center', color: '#D62027' }}>Your Best 2026 Matches</h3>
            {getRankedRaces().map((race, index) => (
              <div key={race.name} style={{ backgroundColor: 'white', color: '#231F20', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
                <div style={{ fontWeight: '900' }}>#{index + 1}: {race.name}</div>
                <div style={{ fontSize: '0.8rem' }}>Swim: {race.wetsuit} | Bike: {race.bike} | Run: {race.run}</div>
              </div>
            ))}
            <button onClick={() => { setStep(1); setSelections({distance: '', goal: '', swimStrength: '', bikeTerrain: '', runTerrain: '', climate: ''}); }} style={btnStyle}>Start Over</button>
          </div>
        )}
      </div>
    </div>
  );
}
