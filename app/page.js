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
    bikeTerrain: '', runTerrain: '', climate: ''
  });

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
    { date: "Oct 31, 2026", name: "IRONMAN Florida", distance: "140.6", wetsuit: "Maybe", bike: "Flat", run: "Flat", climate: "Moderate", water: "Salt", tags: ["Power", "PR"] },

    // 70.3 IRONMAN 2026 (Abbreviated selection of easiest/fastest per request)
    { date: "Mar 29, 2026", name: "70.3 Texas (Galveston)", distance: "70.3", wetsuit: "Doubtful", bike: "Flat", run: "Flat", climate: "Heat/Humidity", water: "Salt", tags: ["PR", "Power"] },
    { date: "Jun 14, 2026", name: "70.3 Eagleman", distance: "70.3", wetsuit: "Maybe", bike: "Flat", run: "Flat", climate: "Heat/Humidity", water: "Salt", tags: ["PR", "Power", "WC"] },
    { date: "Jul 19, 2026", name: "70.3 Oregon", distance: "70.3", wetsuit: "Probable", bike: "Rolling", run: "Flat", climate: "Moderate", water: "Fresh", tags: ["Downriver", "PR", "First-Timer"] },
    { date: "Sep 26, 2026", name: "70.3 New York-Jones Beach", distance: "70.3", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", water: "Salt", tags: ["PR", "Power"] },
    { date: "Oct 17, 2026", name: "70.3 North Carolina", distance: "70.3", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Moderate", water: "Salt", tags: ["Downriver", "PR", "Weak-Swim"] },
    { date: "Dec 6, 2026", name: "70.3 La Quinta", distance: "70.3", wetsuit: "Probable", bike: "Flat", run: "Flat", climate: "Cold/Moderate", water: "Fresh", tags: ["PR", "First-Timer"] }
  ];

  const getRankedRaces = () => {
    let filtered = races.filter(r => r.distance === selections.distance);
    return filtered.sort((a, b) => {
      const calcScore = (race) => {
        let s = 0;
        const isDownriver = race.tags.includes("Downriver");
        const swimMult = Math.max(0, 1 + (5 - selections.swimStrength) * 0.2);
        const bikeImpact = Math.max(0, 1 + (5 - selections.bikeStrength) * 0.2);
        const runImpact = Math.max(0, 1 + (5 - selections.runStrength) * 0.2);

        if (race.water === "Salt") s += 5;

        if (selections.swimStrength <= 3) {
          if (race.wetsuit === "Probable" && isDownriver) s += 40;
          if (race.wetsuit === "Doubtful") s -= (50 * swimMult);
        } else if (selections.swimStrength >= 8) {
          if (race.wetsuit === "Doubtful") s += 35;
          if (isDownriver) s -= 15;
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

  const RenderSlider = ({ label, value, field }) => (
    <div style={{ marginBottom: '20px', textAlign: 'left' }}>
      <label style={{ fontWeight: '700' }}>{label}: {value}/10</label>
      <input type="range" min="1" max="10" value={value} onChange={(e) => setSelections({...selections, [field]: parseInt(e.target.value)})} style={{ width: '100%', accentColor: '#D62027' }} />
    </div>
  );

  const btnStyle = { display: 'block', width: '100%', padding: '15px', margin: '10px 0', backgroundColor: 'white', color: '#231F20', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#231F20', color: 'white', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <Analytics /><SpeedInsights />
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: '#D62027', fontSize: '2.5rem', fontWeight: '900' }}>IRONMAN</h1>
        <h2 style={{ letterSpacing: '4px', marginBottom: '40px' }}>RACE SELECTOR 2026</h2>

        {step === 1 && (
          <div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email" style={{ width: '100%', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: 'black' }} />
            <RenderSlider label="Swim Strength" value={selections.swimStrength} field="swimStrength" />
            <RenderSlider label="Bike Strength" value={selections.bikeStrength} field="bikeStrength" />
            <RenderSlider label="Run Strength" value={selections.runStrength} field="runStrength" />
            <button onClick={() => setStep(2)} style={btnStyle}>Next</button>
          </div>
        )}

        {/* ... steps 2 through 5 remain the same ... */}
        {step === 6 && (
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ textAlign: 'center', color: '#D62027' }}>Your 2026 Recommendations</h3>
            {getRankedRaces().map((race, index) => (
              <div key={race.name} style={{ backgroundColor: 'white', color: '#231F20', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
                <strong>#{index + 1}: {race.name}</strong><br/>
                <small>{race.date} | {race.water} ({race.wetsuit}) | Bike: {race.bike} | Run: {race.run}</small>
              </div>
            ))}
            <button onClick={() => setStep(1)} style={btnStyle}>Start Over</button>
          </div>
        )}
      </div>
    </div>
  );
}
