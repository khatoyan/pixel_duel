import React, { useEffect, useRef, useState } from 'react';
import SettingsModal from './SettingsModal';
import ResultsModal from './ResultsModal/ResultsModal';
import './App.css';

const DuelCanvas = () => {
  const canvasRef = useRef(null);  
  const [heroes, setHeroes] = useState([
    { x: 50, y: 50, color: 'blue', id: 0, speed: 2 + Math.random(), fireRate: 1000, direction: 1, lastFireTime: 0, hits: 0 },
    { x: 450, y: 50, color: 'red', id: 1, speed: 2 + Math.random(), fireRate: 1000, direction: 1, lastFireTime: 0, hits: 0 },
  ]);
  const [spells, setSpells] = useState([]);
  const [settingsHero, setSettingsHero] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    heroes.forEach((hero) => {
      if (Math.hypot(x - hero.x, y - hero.y) < 20) {
        setSettingsHero(hero);
      }
    });
  };

  const handleSettingsChange = (heroId, newSettings) => {
    setHeroes((prevHeroes) =>
      prevHeroes.map((hero) =>
        hero.id === heroId ? { ...hero, ...newSettings } : hero
      )
    );
    setSettingsHero(null);
  };

  const endGame = () => {
    setShowResults(true);
  };

  const closeResults = () => {
    setShowResults(false);
    setHeroes((prevHeroes) =>
      prevHeroes.map((hero) => ({ ...hero, hits: 0 }))
    );
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const fireSpell = (hero) => {
      const now = Date.now();
      if (now - hero.lastFireTime > hero.fireRate) {
        const dx = (hero.id === 0 ? 1 : -1) * 5;
        const spellColor = hero.color;
        const dy = (Math.random() - 0.5) * 2;
        setSpells((prevSpells) => [...prevSpells, { x: hero.x, y: hero.y, dx, dy, color: spellColor, heroId: hero.id }]);
        hero.lastFireTime = now;
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width,canvas.height);

      heroes.forEach((hero) => {
        let newY = hero.y + hero.speed * hero.direction;
        if (newY < 20 || newY > canvas.height - 20) {
          hero.direction *= -1;
        } else if (Math.hypot(mouseX - hero.x, mouseY - newY) < 25) {
          hero.direction *= -1;
        } else {
          hero.y = newY;
        }

        fireSpell(hero);

        ctx.beginPath();
        ctx.arc(hero.x, hero.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = hero.color;
        ctx.fill();
        ctx.closePath();

        ctx.font = '16px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText(`Hits: ${hero.hits}`, hero.x - 20, hero.y - 30);
      });

      setSpells((prevSpells) =>
        prevSpells.filter((spell) => spell.x > 0 && spell.x < canvas.width).map((spell) => {
          spell.x += spell.dx;
          spell.y += spell.dy;

          heroes.forEach((hero) => {
            if (hero.id !== spell.heroId && Math.hypot(spell.x - hero.x, spell.y - hero.y) < 25) {
              spell.x = -100;
              hero.hits += 1;
            }
          });

          ctx.beginPath();
          ctx.arc(spell.x, spell.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = spell.color;
          ctx.fill();
          ctx.closePath();

          return spell;
        })
      );

      requestAnimationFrame(render);
    };
    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [heroes]);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} width="500" height="500" onClick={handleClick} />
      <button className="end-game-button" onClick={endGame}>End Game</button>
      {showResults && <ResultsModal heroes={heroes} onClose={closeResults} />}
      {settingsHero && (
        <>
          <div className="modal-overlay" onClick={() => setSettingsHero(null)}></div>
          <SettingsModal
            hero={settingsHero}
            onChange={handleSettingsChange}
            onClose={() => setSettingsHero(null)}
          />
        </>
      )}
    </div>
  );
};

export default DuelCanvas;