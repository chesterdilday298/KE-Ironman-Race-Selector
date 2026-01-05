'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function IronmanRaceSelector() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [selections, setSelections] = useState({
    distance: '', goal: '', swimStrength: 5, bikeStrength: 5, runStrength: 5,
    swimType: '', bikeTerrain: '', runTerrain: '', climate: ''
  });

  const TOTAL_STEPS = 8;
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xykzlvpo';

  const races = [
    // FULL IRONMAN 2026
    { date: "Apr 18, 2026", name: "IRONMAN Texas", distance: "140.6", wetsuit: "Doubtful", bike: "Flat", run: "Flat", climate: "Heat/Humidity", water: "Fresh", tags: ["Power", "PR"] },
    { date: "May 16, 2026", name: "IRONMAN Jacksonville", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Rolling", climate: "Moderate", water: "Brackish", tags: ["Downriver", "First-Timer"] },
    { date: "Jul 19, 2026", name: "IRONMAN Lake Placid", distance: "140.6", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate", water: "Fresh", tags: ["Climber", "WC"] },
    { date: "Aug 2, 2026", name: "IRONMAN Canada – Ottawa", distance: "140.6", wetsuit: "Probable", bike: "Rolling", run: "Flat", climate: "Moderate", water: "Fresh", tags: ["First-Timer", "WC"] },
    { date: "Sep 13, 2026", name: "IRONMAN Wisconsin", distance: "140.6", wetsuit: "Probable", bike: "Hilly", run: "Hilly", climate: "Moderate", water: "Fresh", tags: ["Climber", "Redemption"] },
    { date: "Sep 19, 2026", name: "IRONMAN Maryland", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", water: "Salt", tags: ["Power", "PR"] },
    { date: "Sep 27, 2026", name: "IRONMAN Chattanooga", distance: "140.6", wetsuit: "Maybe", bike: "Rolling", run: "Hilly", climate: "Heat/Humidity", water: "Fresh", tags: ["Downriver", "Redemption"] },
    { date: "Oct 18, 2026", name: "IRONMAN California", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", water: "Fresh", tags: ["Downriver", "PR", "First-Timer"] },
    { date: "Oct 31, 2026", name: "IRONMAN Florida", distance: "140.6", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", water: "Salt", tags: ["Power", "PR"] },

    // 70.3 IRONMAN 2026
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
        const swimMult = Math.max(0, 1 + (5 - selections.swimStrength) * 0.2);
        const bikeImpact = Math.max(0.1, 1 + (5 - selections.bikeStrength) * 0.2);
        const runImpact = Math.max(0.1, 1 + (5 - selections.runStrength) * 0.2);

        if (race.water === "Salt" || race.water === "Brackish") s += 5;

        if (selections.swimType === 'Weak') {
          if (race.wetsuit === "Probable" && isDownriver) s += 40;
          else if (race.wetsuit === "Probable" && !isDownriver) s += 20;
          if (race.wetsuit === "Doubtful") s -= (50 * swimMult);
        } else if (selections.swimType === 'Strong') {
          if (race.wetsuit === "Doubtful") s += 35;
          if (isDownriver) s -= 15;
        }

        if (selections.bikeTerrain === race.bike) s += 25;
        else if (selections.bikeTerrain === 'Flat' && race.bike === 'Rolling') s -= (5 * bikeImpact);
        else if (selections.bikeTerrain === 'Flat' && race.bike === 'Hilly') s -= (50 * bikeImpact);

        if (selections.runTerrain === race.run) s += 25;
        else if (selections.runTerrain === 'Flat' && race.run === 'Rolling') s -= (5 * runImpact);
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
    const blob = new Blob([`2026 RANKED RACE REPORT FOR: ${email}\n\n${data}`], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `My_Ironman_2026_Selections.txt`;
    link.click();
  };

  const RenderSlider = ({ label, value, field }) => (
    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
      <label style={{ fontWeight: '700' }}>{label}: {value}/10</label>
      <input type="range" min="1" max="10" value={value} onChange={(e) => setSelections({...selections, [field]: parseInt(e.target.value)})} style={{ width: '100%', accentColor: '#D62027' }} />
    </div>
  );

  const ProgressBar = () => (
    <div style={{ width: '100%', backgroundColor: '#444', height: '8px', borderRadius: '4px', marginBottom: '30px', overflow: 'hidden' }}>
      <div style={{ width: `${(step / TOTAL_STEPS) * 100}%`, backgroundColor: '#D62027', height: '100%', transition: 'width 0.3s ease' }}></div>
    </div>
  );

  const btnStyle = { display: 'block', width: '100%', padding: '15px', margin: '10px 0', backgroundColor: 'white', color: '#231F20', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', textAlign: 'center', textDecoration: 'none' };
  const backBtnStyle = { ...btnStyle, backgroundColor: 'transparent', color: 'white', border: '1px solid white', marginTop: '10px' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#231F20', color: 'white', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <Analytics /><SpeedInsights />
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#D62027', fontSize: '2.5rem', fontWeight: '900', marginBottom: '5px' }}>IRONMAN</h1>
        <h2 style={{ letterSpacing: '4px', marginBottom: '20px', fontSize: '0.9rem' }}>RACE SELECTOR 2026</h2>
        
        {step < TOTAL_STEPS && <ProgressBar />}

        {step === 1 && (
          <div>
            <h3>Athlete Profile</h3>
            <p style={{ fontSize: '0.85rem', marginBottom: '20px', fontStyle: 'italic', opacity: '0.9' }}>
              On a scale of 1 to 10 (1 being lowest/weakest and 10 being elite), select where you feel you currently stand in each of the three triathlon disciplines.
            </p>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" style={{ width: '100%', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: 'black' }} />
            <RenderSlider label="Swim Strength" value={selections.swimStrength} field="swimStrength" />
            <RenderSlider label="Bike Strength" value={selections.bikeStrength} field="bikeStrength" />
            <RenderSlider label="Run Strength" value={selections.runStrength} field="runStrength" />
            <button onClick={() => setStep(2)} style={btnStyle}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Distance Selection</h3>
            <button onClick={() => handleSelection('distance', '70.3')} style={btnStyle}>70.3 (Half)</button>
            <button onClick={() => handleSelection('distance', '140.6')} style={btnStyle}>140.6 (Full)</button>
            <button onClick={() => setStep(1)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Swim Type</h3>
            <button onClick={() => handleSelection('swimType', 'Weak')} style={btnStyle}>Weak (Wetsuit + Current Preferred)</button>
            <button onClick={() => handleSelection('swimType', 'Intermediate')} style={btnStyle}>Intermediate (Wetsuit/Current Optional)</button>
            <button onClick={() => handleSelection('swimType', 'Strong')} style={btnStyle}>Strong (No Wetsuit/Current Preferred)</button>
            <button onClick={() => setStep(2)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3>Primary Goal</h3>
            {['First-Timer', 'Step-Up', 'Redemption', 'PR', 'WC'].map(g => (
              <button key={g} onClick={() => handleSelection('goal', g)} style={btnStyle}>{g}</button>
            ))}
            <button onClick={() => setStep(3)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3>Bike Terrain Preference</h3>
            <button onClick={() => handleSelection('bikeTerrain', 'Flat')} style={btnStyle}>Flat and Fast (Aero rewarded)</button>
            <button onClick={() => handleSelection('bikeTerrain', 'Rolling')} style={btnStyle}>Gently Rolling</button>
            <button onClick={() => handleSelection('bikeTerrain', 'Hilly')} style={btnStyle}>Hilly (Climbing)</button>
            <button onClick={() => setStep(4)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3>Run Terrain Preference</h3>
            <button onClick={() => handleSelection('runTerrain', 'Flat')} style={btnStyle}>Flat and Fast</button>
            <button onClick={() => handleSelection('runTerrain', 'Rolling')} style={btnStyle}>Rolling Hills</button>
            <button onClick={() => handleSelection('runTerrain', 'Hilly')} style={btnStyle}>Hilly / Brutal</button>
            <button onClick={() => setStep(5)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 7 && (
          <div>
            <h3>Climate</h3>
            <button onClick={() => handleSelection('climate', 'Heat/Humidity')} style={btnStyle}>Heat/Humidity</button>
            <button onClick={() => handleSelection('climate', 'Cold/Moderate')} style={btnStyle}>Cold/Moderate</button>
            <button onClick={() => setStep(6)} style={backBtnStyle}>Back</button>
          </div>
        )}

        {step === 8 && (
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ color: '#D62027', textAlign: 'center', marginBottom: '20px' }}>Your Ranked 2026 Races</h2>
            {getRankedRaces().map((race, index) => (
              <div key={race.name} style={{ backgroundColor: 'white', color: '#231F20', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
                <strong>#{index + 1}: {race.name}</strong><br/>
                <small>{race.date} | Swim: {race.water} (Wetsuit {race.wetsuit}) | Bike: {race.bike} | Run: {race.run}</small>
              </div>
            ))}
            
            <div style={{ backgroundColor: '#D62027', color: 'white', padding: '20px', borderRadius: '12px', marginTop: '30px', textAlign: 'center' }}>
              <h4 style={{ margin: '0 0 10px 0', textTransform: 'uppercase' }}>The Keystone Rule</h4>
              <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: 'bold' }}>Restraint early. Discipline in the middle. Execution late.</p>
              <p style={{ margin: '10px 0 0 0', fontSize: '0.8rem', opacity: '0.9' }}>Most athletes reverse that order — and that's why they fall short of their potential.</p>
            </div>

            <div style={{ backgroundColor: '#D62027', color: 'white', padding: '20px', borderRadius: '12px', marginTop: '20px' }}>
              <h4 style={{ textAlign: 'center', margin: '0 0 15px 0' }}>WANT PERSONALIZED 1:1 COACHING?</h4>
              <p style={{ fontSize: '0.8rem', marginBottom: '15px' }}>This tool provides general guidance. For a truly personalized race strategy tailored to YOUR specific needs, goals, and race-day conditions, consider 1:1 coaching with Keystone Endurance.</p>
              <ul style={{ fontSize: '0.8rem', paddingLeft: '20px' }}>
                <li>Custom training plans for swim, bike, run, and strength</li>
                <li>Personalized race-day execution strategies</li>
                <li>Unlimited communication and bi-weekly coaching calls</li>
                <li>Access to metabolic assessments and video form analysis</li>
              </ul>
              <a 
                href={`mailto:coach@keystoneendurance.com?subject=Request for Coaching Review - 2026 Race Selector&body=Athlete Email: ${email}`}
                style={{ ...btnStyle, backgroundColor: 'white', color: '#D62027', marginTop: '15px' }}
              >
                Click here to email Coach Chet to review
              </a>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '20px' }}>
              <button onClick={() => { setStep(1); setSelections({distance: '', goal: '', swimStrength: 5, bikeStrength: 5, runStrength: 5, swimType: '', bikeTerrain: '', runTerrain: '', climate: ''}); }} style={btnStyle}>Start Over</button>
              <button onClick={exportResults} style={{ ...btnStyle, backgroundColor: '#D62027', color: 'white' }}>Export to Text File</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
