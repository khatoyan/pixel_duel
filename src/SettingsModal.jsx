import React, { useState, useEffect } from 'react';

const SettingsModal = ({ hero, onChange, onClose }) => {
  const [color, setColor] = useState(hero.color);
  const [speed, setSpeed] = useState(hero.speed);
  const [fireRate, setFireRate] = useState(hero.fireRate);

  useEffect(() => {
    if (speed < 1) {
      setSpeed(1);
    }
  }, [speed]);

  const handleSubmit = () => {
    onChange(hero.id, { color, speed, fireRate });
    onClose();
  };

  return (
    <div className="modal">
      <h2>Settings</h2>
      <label>
        Color:
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </label>
      <label>
        Speed:
        <input
          type="range"
          min="1"
          max="10"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        {speed}
      </label>
      <label>
        Fire Rate:
        <input
          type="range"
          min="100"
          max="2000"
          step="100"
          value={fireRate}
          onChange={(e) => setFireRate(Number(e.target.value))}
        />
        {fireRate} ms
      </label>
      <button onClick={handleSubmit}>Save</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default SettingsModal;