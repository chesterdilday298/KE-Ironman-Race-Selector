const getRankedRaces = () => {
    let filtered = races.filter(r => r.distance === selections.distance);
    return filtered.sort((a, b) => {
      const calcScore = (race) => {
        let s = 0;
        const isDownriver = race.tags.includes("Downriver");

        // --- SWIM SCORING (SWIM 1/10 MULTIPLIER) ---
        // For a 1/10 swimmer, the penalty for a non-wetsuit race is doubled (-100).
        const swimMultiplier = Math.max(0.5, 1 + (5 - selections.swimStrength) * 0.2);
        
        if (race.wetsuit === "Probable" && isDownriver) s += 40; // High priority for weak swimmers
        else if (race.wetsuit === "Probable" && !isDownriver) s += 20;
        else if (race.wetsuit === "Maybe" && isDownriver) s += 15;
        else if (race.wetsuit === "Doubtful") s -= (50 * swimMultiplier); // -100 for 1/10 swimmer

        // --- BIKE SCORING (BIKE 9/10 RESILIENCE) ---
        // Since you are a 9/10 biker, the penalty for a "Rolling" bike (Oregon) is 
        // almost zeroed out, allowing it to stay at the top.
        const bikeImpact = Math.max(0.1, 1 + (5 - selections.bikeStrength) * 0.15);
        if (selections.bikeTerrain === race.bike) s += 25;
        else if (selections.bikeTerrain === 'Flat' && race.bike === 'Rolling') s -= (5 * bikeImpact);
        else if (selections.bikeTerrain === 'Flat' && race.bike === 'Hilly') s -= (40 * bikeImpact);

        // --- RUN SCORING (RUN 7/10 RESILIENCE) ---
        const runImpact = Math.max(0.3, 1 + (5 - selections.runStrength) * 0.15);
        if (selections.runTerrain === race.run) s += 25;
        else if (selections.runTerrain === 'Flat' && race.run === 'Hilly') s -= (45 * runImpact);

        // --- CLIMATE & GOAL ---
        if (selections.climate === 'Heat/Humidity' && race.climate.includes('Heat')) s += 20;
        if (race.tags.includes(selections.goal)) s += 20;

        return s;
      };
      return calcScore(b) - calcScore(a);
    }).slice(0, 10);
  };
