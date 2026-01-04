'use client';

import { useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function IronmanRaceSelector() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selections, setSelections] = useState({
    distance: '', goal: '', swimStrength: '', bodyType: '', climate: ''
  });

  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xykzlvpo';

  const races = [
    // FULL DISTANCE (140.6)
    { name: "IRONMAN California (Sacramento)", distance: "140.6", swim: "Downriver (Fast/Wetsuit)", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["PR", "First-Timer", "Weak-Swim"] },
    { name: "IRONMAN Jacksonville (IMJAX)", distance: "140.6", swim: "River (Current/Wetsuit)", bike: "Flat", run: "Rolling", climate: "Moderate/Humid", tags: ["First-Timer", "Weak-Swim", "Power"] },
    { name: "IRONMAN Maryland", distance: "140.6", swim: "Brackish (Wetsuit)", bike: "Flat", run: "Flat", climate: "Moderate/Windy", tags: ["PR", "Power", "Redemption"] },
    { name: "IRONMAN Florida", distance: "140.6", swim: "Ocean (Wetsuit-Legal)", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["PR", "Power", "First-Timer"] },
    { name: "IRONMAN Chattanooga", distance: "140.6", swim: "Downriver (Fast/Wetsuit)", bike: "Rolling", run: "Hilly", climate: "Moderate/Humid", tags: ["Weak-Swim", "Redemption"] },
    { name: "IRONMAN Texas", distance: "140.6", swim: "Lake (Wetsuit-Legal)", bike: "Flat/Windy", run: "Flat", climate: "Heat Tolerance", tags: ["Heat-Seeker", "Power"] },
    { name: "IRONMAN Wisconsin", distance: "140.6", swim: "Lake (Wetsuit)", bike: "Hilly", run: "Hilly", climate: "Cold/Moderate", tags: ["Climber", "Cold-Weather", "Redemption"] },
    { name: "IRONMAN Lake Placid", distance: "140.6", swim: "Lake (Wetsuit)", bike: "Very Hilly", run: "Hilly", climate: "Moderate", tags: ["Climber", "WC Qualifier"] },
    { name: "IRONMAN Canada (Ottawa)", distance: "140.6", swim: "River (Wetsuit)", bike: "Rolling", run: "Flat", climate: "Moderate", tags: ["First-Timer", "WC Qualifier"] },

    // HALF DISTANCE (70.3)
    { name: "70.3 Oregon (Salem)", distance: "70.3", swim: "Downriver (Rocket/Wetsuit)", bike: "Rolling", run: "Flat", climate: "Moderate", tags: ["Weak-Swim", "First-Timer", "PR"] },
    { name: "70.3 Maine (Augusta)", distance: "70.3", swim: "Downriver (Fast/Wetsuit)", bike: "Rolling", run: "Rolling", climate: "Cold/Moderate", tags: ["Cold-Weather", "Weak-Swim"] },
    { name: "70.3 Chattanooga", distance: "70.3", swim: "Downriver (Wetsuit)", bike: "Rolling", run: "Rolling", climate: "Moderate/Humid", tags: ["Weak-Swim", "Redemption"] },
    { name: "70.3 Augusta", distance: "70.3", swim: "Downriver (Wetsuit)", bike: "Flat", run: "Flat", climate: "Heat Tolerance", tags: ["Weak-Swim", "Heat-Seeker", "PR"] },
    { name: "70.3 North Carolina", distance: "70.3", swim: "Downriver (Wetsuit)", bike: "Flat", run: "Flat", climate: "Moderate", tags: ["Weak-Swim", "Power", "PR"] },
    { name: "70.3 Gulf Coast", distance: "70.3", swim: "Ocean (Wetsuit)", bike: "Flat", run: "Flat", climate: "Heat Tolerance", tags: ["Power", "PR", "Heat-Seeker"] },
    { name: "70.3 Eagleman", distance: "70.3", swim: "Bay (Wetsuit)", bike: "Flat", run: "Flat", climate: "Heat Tolerance", tags: ["Power", "PR", "Redemption"] },
    { name: "70.3 Mont-Tremblant", distance: "70.3", swim: "Lake (Wetsuit)", bike: "Hilly", run: "Rolling", climate: "Moderate", tags: ["Climber", "WC Qualifier"] },
    { name: "70.3 St. George", distance: "70.3", swim: "Lake (Wetsuit)", bike: "Mountainous", run: "Hilly", climate: "Moderate/Dry", tags: ["Climber", "WC Qualifier"] },
    { name: "70.3 Oceanside", distance: "70.3", swim: "Ocean (Wetsuit)", bike: "Hilly", run: "Flat", climate: "Moderate", tags: ["Climber", "First-Timer"] }
  ];

  const validateEmail = (e) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e).toLowerCase());
  };

  const handleSelection = (field, value) => {
    const updated = { ...selections, [field]: value };
    setSelections(updated);
    
    // Auto-submit to Formspree on the very last selection
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
      let scoreA = 0, scoreB = 0;
      
      // Weak Swim Scoring (Preference for Downriver/Current)
      if (selections.swimStrength === 'Weak') {
        if (a.swim.includes("Downriver") || a.swim.includes("River")) scoreA += 10;
        if (b.swim.includes("Downriver") || b.swim.includes("River")) scoreB += 10;
      }
      
      // Goal Matching
      if (a.tags.includes(selections.goal)) scoreA += 5;
      if (b.tags.includes(selections.goal)) scoreB += 5;

      // Body Type Matching
      if (selections.bodyType === 'Power/Heavy' && a.tags.includes("Power")) scoreA += 5;
      if (selections.bodyType === 'Power/Heavy' && b.tags.includes("Power")) scoreB += 5;
      if (selections.bodyType === 'Climber/Light' && a.tags.includes("Climber")) scoreA += 5;
      if (selections.bodyType === 'Climber/Light' && b.tags.includes("Climber")) scoreB += 5;

      // Climate Matching
      if (selections.climate === 'Heat Tolerance' && a.tags.includes("Heat-Seeker")) scoreA += 5;
      if (selections.climate === 'Heat Tolerance' && b.tags.includes("Heat-Seeker")) scoreB += 5;
      if (selections.climate === 'Cold/Moderate' && a.tags.includes("Cold-Weather")) scoreA += 5;
      if (selections.climate === 'Cold/Moderate' && b.tags.includes("Cold-Weather")) scoreB += 5;

      return scoreB - scoreA;
    }).slice(0, 10);
  };

  const exportResults = () => {
    const resultsText = getRankedRaces().map((r, i) => 
      `#${i + 1}: ${r.name}\n- Swim: ${r.swim}\n- Bike: ${r.bike}\n- Climate: ${r.climate}`
    ).join('\n\n');
    const blob = new Blob([`2026 RACE RECOMMENDATIONS FOR: ${email}\n\n${resultsText}`], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Ironman_Race_Recommendations.txt`;
    link.click();
  };

  const colors = { primary: '#D62027', charcoal: '#231F20' };
  const btnStyle = { display: 'block', width: '100%', padding: '15px', margin: '10px 0', backgroundColor: 'white', color: '#231F20', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: '0.2s' };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.charcoal, color: 'white', fontFamily: 'Inter, sans-serif', padding: '40px 20px' }}>
      <Analytics />
      <SpeedInsights />
      <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ color: colors.primary, fontSize: '2.5rem', fontWeight: '900', margin: 0 }}>IRONMAN</h1>
        <h2 style={{ letterSpacing: '4px', marginBottom: '40px', fontSize: '1rem' }}>RACE SELECTOR 2026</h2>

        {step === 1 && (
          <div>
            <h3 style={{ marginBottom: '20px' }}>Enter Your Email to Start</h3>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="athlete@example.com" 
              style={{ width: '100%', padding: '15px', borderRadius: '8px', marginBottom: '10px', color: 'black', border: 'none' }} 
            />
            {emailError && <p style={{ color: colors.primary, fontSize: '0.8rem' }}>{emailError}</p>}
            <button 
              onClick={() => {
                if (validateEmail(email)) { setStep(2); setEmailError(''); }
                else { setEmailError('Please enter a valid email address'); }
              }} 
              style={btnStyle}
            >
              Start Selection
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Select Your Distance</h3>
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
            <h3>How is your swimming?</h3>
            <button onClick={() => handleSelection('swimStrength', 'Weak')} style={btnStyle}>Weak (Prefer Downriver/Wetsuit)</button>
            <button onClick={() => handleSelection('swimStrength', 'Strong')} style={btnStyle}>Strong (Can handle chop/non-wetsuit)</button>
          </div>
        )}

        {step === 5 && (
          <div>
            <h3>Identify your body type / bike strength:</h3>
            <button onClick={() => handleSelection('bodyType', 'Power/Heavy')} style={btnStyle}>Power Specialist (Flat courses)</button>
            <button onClick={() => handleSelection('bodyType', 'Climber/Light')} style={btnStyle}>Climbing Specialist (Hilly courses)</button>
          </div>
        )}

        {step === 6 && (
          <div>
            <h3>How do you handle heat?</h3>
            <button onClick={() => handleSelection('climate', 'Heat Tolerance')} style={btnStyle}>I thrive in heat/humidity</button>
            <button onClick={() => handleSelection('climate', 'Cold/Moderate')} style={btnStyle}>I prefer cold/moderate temps</button>
          </div>
        )}

        {step === 7 && (
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ textAlign: 'center', color: colors.primary, marginBottom: '20px' }}>Your 2026 Race Recommendations</h3>
            {getRankedRaces().map((race, index) => (
              <div key={race.name} style={{ backgroundColor: 'white', color: colors.charcoal, padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
                <div style={{ fontWeight: '900' }}>#{index + 1}: {race.name}</div>
                <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                  <strong>Swim:</strong> {race.swim}<br/>
                  <strong>Bike:</strong> {race.bike} | <strong>Climate:</strong> {race.climate}
                </div>
              </div>
            ))}
            <button 
              onClick={() => { setStep(1); setEmail(''); setSelections({ distance: '', goal: '', swimStrength: '', bodyType: '', climate: '' }); }} 
              style={{ ...btnStyle, marginTop: '20px' }}
            >
              Start Over
            </button>
            <button 
              onClick={exportResults} 
              style={{ ...btnStyle, backgroundColor: colors.primary, color: 'white' }}
            >
              Export to Text File (.txt)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
