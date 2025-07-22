// src/App.jsx
import React, { useState } from 'react';
import './App.scss';
import typeChart from './typeChart.json';
import SwordIcon from './assets/icons/sword';
import ShieldIcon from './assets/icons/shield';

const types = Object.keys(typeChart);

const App = () => {
  const [defendingType1, setDefendingType1] = useState('');
  const [defendingType2, setDefendingType2] = useState('');
  const [attackingType, setAttackingType] = useState('');

  // Tool 1: Calculate recommended attack types (> 1x) and types to avoid (< 1x)
  const calculateAttackRecommendations = () => {
    if (!defendingType1) return { recommended: [], toAvoid: [] };

    const recommended = [];
    const toAvoid = [];
    types.forEach(attackType => {
      const multiplier = defendingType2 && defendingType2 !== defendingType1
        ? typeChart[attackType][defendingType1] * typeChart[attackType][defendingType2]
        : typeChart[attackType][defendingType1];

      if (multiplier > 1) {
        recommended.push({ attackType, multiplier });
      } else if (multiplier < 1) {
        toAvoid.push({ attackType, multiplier });
      }
    });

    return {
      recommended: recommended.sort((a, b) => b.multiplier - a.multiplier),
      toAvoid: toAvoid.sort((a, b) => a.multiplier - b.multiplier),
    };
  };

  // Tool 2: Calculate recommended defending types (< 1x) and types to avoid (> 1x)
  const calculateDefenseRecommendations = () => {
    if (!attackingType) return { recommended: [], toAvoid: [] };

    const recommended = [];
    const toAvoid = [];
    types.forEach(defendingType => {
      const multiplier = typeChart[attackingType][defendingType];
      if (multiplier < 1) {
        recommended.push({ defendingType, multiplier });
      } else if (multiplier > 1) {
        toAvoid.push({ defendingType, multiplier });
      }
    });

    return {
      recommended: recommended.sort((a, b) => a.multiplier - b.multiplier),
      toAvoid: toAvoid.sort((a, b) => b.multiplier - a.multiplier),
    };
  };

  const { recommended: attackRecommendations, toAvoid: attackToAvoid } = calculateAttackRecommendations();
  const { recommended: defenseRecommendations, toAvoid: defenseToAvoid } = calculateDefenseRecommendations();

  return (
    <div className="container">
      <h1><img src="/assets/icons/pogotype-logo-512x512.png" alt="" width="192" height="192"/>Pokémon GO Type Effectiveness Tool</h1>

      {/* Tool 1: Attack Type Recommendations and Types to Avoid */}
      <div className="tool-section tool-section--attack">
        <h2><SwordIcon/> Best Attack Types</h2>
        <p>Select the defending Pokémon's type(s) to see recommended attack types (damage &gt; 1x) and types to avoid (damage &lt; 1x).</p>
        <div className="type-selector">
          <div>
            <label>Enemy Type 1</label>
            <select value={defendingType1} onChange={(e) => setDefendingType1(e.target.value)}>
              <option value="">Select Type</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Enemy Type 2</label>
            <select value={defendingType2} onChange={(e) => setDefendingType2(e.target.value)}>
              <option value="">None</option>
              {types
                .filter(type => type !== defendingType1)
                .map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
            </select>
          </div>
        </div>
        {defendingType1 && (
          <div className="results">
            <h3>Recommended Attack Types</h3>
            {attackRecommendations.length > 0 ? (
              <ul>
                {attackRecommendations.map(({ attackType, multiplier }) => (
                  <li key={attackType} className="type-item">
                    <img
                      src={`/assets/icons/${attackType.toLowerCase()}.svg`}
                      alt={`${attackType} icon`}
                      className="type-icon"
                    />
                    {attackType}: {multiplier.toFixed(2)}x damage
                  </li>
                ))}
              </ul>
            ) : (
              <p>No attack types deal super-effective damage (&gt;1x).</p>
            )}
            <h3>Attack Types to Avoid</h3>
            {attackToAvoid.length > 0 ? (
              <ul>
                {attackToAvoid.map(({ attackType, multiplier }) => (
                  <li key={attackType} className="type-item">
                    <img
                      src={`/assets/icons/${attackType.toLowerCase()}.svg`}
                      alt={`${attackType} icon`}
                      className="type-icon"
                    />
                    {attackType}: {multiplier.toFixed(3)}x damage
                  </li>
                ))}
              </ul>
            ) : (
              <p>No attack types deal less than normal damage.</p>
            )}
          </div>
        )}
      </div>

      {/* Tool 2: Defending Type Recommendations and Types to Avoid */}
      <div className="tool-section tool-section--defense">
        <h2><ShieldIcon/> Find Best Defending Types</h2>
        <p>Select an attacking type to see recommended defending types (damage &lt; 1x) and types to avoid (damage &gt; 1x).</p>
        <div className="type-selector">
          <div>
            <label>Enemy attack Type: </label>
            <select value={attackingType} onChange={(e) => setAttackingType(e.target.value)}>
              <option value="">Select Type</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        {attackingType && (
          <div className="results">
            <h3>Recommended Defending Types</h3>
            {defenseRecommendations.length > 0 ? (
              <ul>
                {defenseRecommendations.map(({ defendingType, multiplier }) => (
                  <li key={defendingType} className="type-item">
                    <img
                      src={`/assets/icons/${defendingType.toLowerCase()}.svg`}
                      alt={`${defendingType} icon`}
                      className="type-icon"
                    />
                    {defendingType}: {multiplier.toFixed(3)}x damage
                  </li>
                ))}
              </ul>
            ) : (
              <p>No defending types resist this attack type.</p>
            )}
            <h3>Defending Types to Avoid</h3>
            {defenseToAvoid.length > 0 ? (
              <ul>
                {defenseToAvoid.map(({ defendingType, multiplier }) => (
                  <li key={defendingType} className="type-item">
                    <img
                      src={`/assets/icons/${defendingType.toLowerCase()}.svg`}
                      alt={`${defendingType} icon`}
                      className="type-icon"
                    />
                    {defendingType}: {multiplier.toFixed(2)}x damage
                  </li>
                ))}
              </ul>
            ) : (
              <p>No defending types take super-effective damage (&gt;1x).</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
