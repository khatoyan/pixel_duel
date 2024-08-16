import React from 'react';
import './ResultsModal.css';

const ResultsModal = ({ heroes, onClose }) => {
  return (
    <div className="results-modal">
      <div className="modal-content">
        <h2>Game Over</h2>
        <ul>
          {heroes.map((hero) => (
            <li key={hero.id} style={{ color: hero.color }}>
              {hero.id === 0 ? 'Player 1' : 'Player 2'}: {hero.hits} hits
            </li>
          ))}
        </ul>
        <button className="close-button" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ResultsModal;