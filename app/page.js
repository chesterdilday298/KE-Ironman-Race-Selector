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
    setSelections(prev => ({ ...prev, [field]: value }));
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
  }, [step, selections, email, firstName, lastName]);

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
        else if (selections.runTerrain === 'Flat' && race.run === 'Hilly') s -= (50 *
