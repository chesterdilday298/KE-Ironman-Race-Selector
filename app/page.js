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
  
  // This points to the file you just uploaded to the public folder
  const LOGO_PATH = "/logo.png";

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

  const btnStyle = { display: 'block', width: '100%', padding: '15px', margin: '10px 0', backgroundColor: 'white', color: '#231F20', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', textAlign: 'center', textDecoration: 'none' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#231F20', color: 'white', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <Analytics /><SpeedInsights />
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        
        {/* LOGO HEADER */}
        <div style={{ marginBottom: '30px' }}>
          <img src={LOGO_PATH} alt="Keystone Endurance" style={{ maxWidth: '400px', width: '100%', filter: 'invert(1)' }} />
          <h2 style={{ letterSpacing: '4px', marginTop: '15px', fontSize: '1rem', color: '#D62027', fontWeight: '900' }}>RACE SELECTOR 2026</h2>
        </div>
        
        {step < TOTAL_STEPS && (
          <div style={{ width: '100%', backgroundColor: '#444', height: '8px', borderRadius: '4px', marginBottom: '30px', overflow: 'hidden' }}>
            <div style={{ width: `${(step / TOTAL_STEPS) * 100}%`, backgroundColor: '#D62027', height: '100%', transition: 'width 0.3s ease' }}></div>
          </div>
        )}

        {step === 1 && (
          <div>
            <h3>Athlete Profile</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '20px', fontStyle: 'italic', opacity: '0.9' }}>
              On a scale of 1 to 10 (1=lowest, 10=elite), select where you stand in each discipline.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First" style={{ padding: '15px', borderRadius: '8px', color: 'black', border: 'none' }} />
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last" style={{ padding: '15px', borderRadius: '8px', color: 'black', border: 'none' }} />
            </div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: 'black', border: 'none' }} />
            {['swimStrength', 'bikeStrength', 'runStrength'].map(field => (
              <div key={field} style={{ marginBottom: '25px', textAlign: 'left' }}>
                <label style={{ fontWeight: '700', fontSize: '1rem' }}>{field.replace('Strength', ' ')} Strength: {selections[field]}/10</label>
                <input type="range" min="1" max="10" value={selections[field]} onChange={(e) => setSelections({...selections, [field]: parseInt(e.target.value)})} style={{ width: '100%', accentColor: '#D62027', marginTop: '10px' }} />
              </div>
            ))}
            <button onClick={() => setStep(2)} style={btnStyle}>Next</button>
          </div>
        )}

        {step > 1 && step < 8 && (
            <div>
              <h3 style={{fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '25px'}}>
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
              {step === 6 && ['Flat', 'Rolling', 'Hilly'].map(t => <button key={t} onClick={() => handleSelection('runTerrain', t)} style={btnStyle}>{t}</button>)}
              {step === 7 && (
                <>
                  <button onClick={() => handleSelection('climate', 'Heat/Humidity')} style={btnStyle}>Heat/Humidity</button>
                  <button onClick={() => handleSelection('climate', 'Cold/Moderate')} style={btnStyle}>Cold/Moderate</button>
                </>
              )}
            </div>
        )}

        {step === 8 && (
          <div style={{ textAlign: 'left' }}>
            <h2 style={{ color: '#D62027', textAlign: 'center', marginBottom: '20px', fontSize: '1.8rem', fontWeight: 'bold' }}>Your Ranked 2026 Races</h2>
            {getRankedRaces().map((race, index) => (
              <div key={race.name} style={{ backgroundColor: 'white', color: '#231F20', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
                <strong style={{fontSize: '1.1rem'}}>#{index + 1}: {race.name}</strong><br/>
                <small style={{fontSize: '0.85rem'}}>{race.date} | Swim: {race.water} (Wetsuit {race.wetsuit}) | Bike: {race.bike} | Run: {race.run}</small>
              </div>
            ))}
            
            {/* KEYSTONE RULE BOX */}
            <div style={{ backgroundColor: '#D62027', color: 'white', padding: '25px', borderRadius: '12px', marginTop: '30px', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              <h4 style={{ margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: '900' }}>The Keystone Rule</h4>
              <p style={{ margin: '0', fontSize: '1.2rem', fontWeight: 'bold' }}>Restraint early. Discipline in the middle. Execution late.</p>
              <p style={{ margin: '12px 0 0 0', fontSize: '0.85rem', opacity: '0.9' }}>Most athletes reverse that order — and that's why they fall short of their potential.</p>
            </div>

            {/* COACHING BOX */}
            <div style={{ backgroundColor: '#D62027', color: 'white', padding: '25px', borderRadius: '12px', marginTop: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
              <h4 style={{ textAlign: 'center', margin: '0 0 15px 0', fontWeight: '900', letterSpacing: '1px' }}>WANT PERSONALIZED 1:1 COACHING?</h4>
              <p style={{ fontSize: '0.85rem', marginBottom: '15px', lineHeight: '1.4' }}>This calculator provides general pacing guidance. For a truly personalized race strategy tailored to YOUR specific needs, goals, and race-day conditions, consider 1:1 coaching with Keystone Endurance.</p>
              <ul style={{ fontSize: '0.85rem', paddingLeft: '20px', marginBottom: '20px' }}>
                <li style={{marginBottom: '5px'}}>Custom training plans for swim, bike, run, and strength</li>
                <li style={{marginBottom: '5px'}}>Personalized race-day execution strategies</li>
                <li style={{marginBottom: '5px'}}>Unlimited communication and bi-weekly coaching calls</li>
                <li>Access to metabolic assessments and video form analysis</li>
              </ul>
              <div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '15px', textAlign: 'center' }}>
                <a 
                  href={`mailto:coach@keystoneendurance.com?subject=Coaching Review&body=Athlete Name: ${firstName} ${lastName}`}
                  style={{ color: '#D62027', fontWeight: '900', textDecoration: 'none', fontSize: '0.9rem' }}
                >
                  EMAIL US:<br/>COACH@KEYSTONEENDURANCE.COM
                </a>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '25px' }}>
              <button onClick={() => { setStep(1); setSelections({distance: '', goal: '', swimStrength: 5, bikeStrength: 5, runStrength: 5, swimType: '', bikeTerrain: '', runTerrain: '', climate: ''}); }} style={btnStyle}>Start Over</button>
              <button onClick={exportResults} style={{ ...btnStyle, backgroundColor: '#D62027', color: 'white', border: 'none' }}>Export to Text File</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
