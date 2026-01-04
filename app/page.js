'use client';

import { useState } from 'react';

export default function IronmanRaceSelector() {
  const [step, setStep] = useState(1);
  const [selections, setSelections] = useState({
    distance: '', // '70.3' or '140.6'
    goal: '', // 'First-Timer', 'PR', 'WC Qualifier', 'Redemption'
    swimStrength: '', // 'Weak', 'Strong'
    bodyType: '', // 'Power/Heavy', 'Climber/Light'
    climate: '' // 'Heat Tolerance', 'Cold/Moderate'
  });

  // 2026 North American Race Database
  const races = [
    { name: "IRONMAN California (Sacramento)", distance: "140.6", swim: "Downriver (Fast)", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["PR", "First-Timer", "Weak-Swim"] },
    { name: "IRONMAN Jacksonville (IMJAX)", distance: "140.6", swim: "River (Current Assisted)", bike: "Flat", run: "Rolling", climate: "Moderate/Humid", tags: ["First-Timer", "Weak-Swim", "Power"] },
    { name: "IRONMAN Maryland", distance: "140.6", swim: "Brackish/Chop", bike: "Flat", run: "Flat", climate: "Moderate/Windy", tags: ["PR", "Power", "Redemption"] },
    { name: "IRONMAN Florida", distance: "140.6", swim: "Ocean (Chop)", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["PR", "Power", "First-Timer"] },
    { name: "IRONMAN Chattanooga", distance: "140.6", swim: "Downriver (Fast)", bike: "Rolling", run: "Hilly", climate: "Moderate/Humid", tags: ["Weak-Swim", "Redemption"] },
    { name: "IRONMAN Lake Placid", distance: "140.6", swim: "Lake", bike: "Very Hilly", run: "Hilly", climate: "Moderate", tags: ["Climber", "WC Qualifier"] },
    { name: "IRONMAN Mont-Tremblant", distance: "140.6", swim: "Lake", bike: "Hilly", run: "Rolling", climate: "Cold/Moderate", tags: ["Climber", "Cold-Weather", "WC Qualifier"] },
    { name: "IRONMAN Texas", distance: "140.6", swim: "Lake", bike: "Flat/Windy", run: "Flat", climate: "Heat Tolerance", tags: ["Heat-Seeker", "Power"] },
    { name: "70.3 Oregon (Salem)", distance: "70.3", swim: "Downriver (Rocket)", bike: "Rolling", run: "Flat", climate: "Moderate", tags: ["Weak-Swim", "First-Timer", "PR"] },
    { name: "70.3 St. George", distance: "70.3", swim: "Lake", bike: "Mountainous", run: "Hilly", climate: "Moderate/Dry", tags: ["Climber", "WC Qualifier"] },
    { name: "70.3 Maine", distance: "70.3", swim: "Downriver", bike: "Rolling", run: "Rolling", climate: "Cold/Moderate", tags: ["Cold-Weather", "Weak-Swim"] },
    { name: "70.3 Eagleman", distance: "70.3", swim: "Bay/Chop", bike: "Flat", run: "Flat", climate: "Heat Tolerance", tags: ["Power", "PR", "Heat-Seeker"] }
  ];

  const handleSelection = (field, value) => {
    setSelections(prev => ({ ...prev, [field]: value }));
    setStep(step + 1);
  };

  const getRankedRaces = () => {
    let filtered = races.filter(r => r.distance === selections.distance);
    
    return filtered.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      // Scoring logic based on user profile
      if (selections.swimStrength === 'Weak') {
        if (a.tags.includes("Weak-Swim")) scoreA += 5;
        if (b.tags.includes("Weak-Swim")) scoreB += 5;
      }
      if (selections.bodyType === 'Power/Heavy') {
        if (a.tags.includes("Power")) scoreA += 3;
        if (b.tags.includes("Power")) scoreB += 3;
      } else {
        if (a.tags.includes("Climber")) scoreA += 3;
        if (b.tags.includes("Climber")) scoreB += 3;
      }
      if (selections.climate === 'Heat Tolerance') {
        if (a.tags.includes("Heat-Seeker")) scoreA += 4;
        if (b.tags.includes("Heat-Seeker")) scoreB += 4;
      } else {
        if (a.tags.includes("Cold-Weather")) scoreA += 4;
        if (b.tags.includes("Cold-Weather")) scoreB += 4;
      }
      if (a.tags.includes(selections.goal)) scoreA += 2;
      if (b.tags.includes(selections.goal)) scoreB += 2;

      return scoreB - scoreA;
    });
  };

  const colors = { primary: '#D62027', charcoal: '#231F20' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.charcoal, color: 'white', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: colors.primary, fontSize: '2.5rem', fontWeight: '900' }}>IRONMAN</h1>
        <h2 style={{ letterSpacing: '4px', marginBottom: '40px' }}>RACE SELECTOR 2026</h2>

        {step === 1 && (
          <div>
            <h3>Select Your Distance</h3>
            <button onClick={() => handleSelection('distance', '70.3')} style={btnStyle}>70.3 (Half)</button>
            <button onClick={() => handleSelection('distance', '140.6')} style={btnStyle}>140.6 (Full)</button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>What is your primary goal?</h3>
            {['First-Timer', 'PR', 'WC Qualifier', 'Redemption'].map(g => (
              <button key={g} onClick={() => handleSelection('goal', g)} style={btnStyle}>{g}</button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>How is your swimming?</h3>
            <button onClick={() => handleSelection('swimStrength', 'Weak')} style={btnStyle}>Weak (Need Current/River)</button>
            <button onClick={() => handleSelection('swimStrength', 'Strong')} style={btnStyle}>Strong (Can handle chop/lake)</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3>Identify your body type/bike strength:</h3>
            <button onClick={() => handleSelection('bodyType', 'Power/Heavy')} style={btnStyle}>Power Specialist (Flats)</button>
            <button onClick={() => handleSelection('bodyType', 'Climber/Light')} style={btnStyle}>Climbing Specialist (Hills)</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3>How do you handle heat?</h3>
            <button onClick={() => handleSelection('climate', 'Heat Tolerance')} style={btnStyle}>I thrive in heat/humidity</button>
            <button onClick={() => handleSelection('climate', 'Cold/Moderate')} style={btnStyle}>I prefer cold/moderate temps</button>
          </div>
        )}

        {step === 6 && (
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ textAlign: 'center', color: colors.primary }}>Your 2026 Race Rankings</h3>
            <p style={{ textAlign: 'center', marginBottom: '30px', fontSize: '0.9rem' }}>Ranked from Best Fit to Worst Fit</p>
            {getRankedRaces().map((race, index) => (
              <div key={race.name} style={{ backgroundColor: 'white', color: colors.charcoal, padding: '20px', borderRadius: '12px', marginBottom: '15px' }}>
                <div style={{ fontWeight: '900', fontSize: '1.2rem' }}>#{index + 1}: {race.name}</div>
                <div style={{ fontSize: '0.85rem', marginTop: '5px' }}>
                  <strong>Swim:</strong> {race.swim} | <strong>Bike:</strong> {race.bike} | <strong>Climate:</strong> {race.climate}
                </div>
              </div>
            ))}
            <button onClick={() => setStep(1)} style={{ ...btnStyle, marginTop: '20px' }}>Start Over</button>
          </div>
        )}
      </div>
    </div>
  );
}

const btnStyle = {
  display: 'block', width: '100%', padding: '15px', margin: '10px 0',
  backgroundColor: 'white', color: '#231F20', border: 'none',
  borderRadius: '8px', fontWeight: '700', cursor: 'pointer', fontSize: '1rem'
};
