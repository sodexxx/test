import { useState, useRef, useEffect, useCallback } from 'react';

interface PlanetData {
  name: string;
  nameRu: string;
  radius: number; // visual radius in px
  realRadius: number; // km
  distance: number; // visual distance from sun in px
  realDistance: number; // million km from sun
  orbitalPeriod: number; // Earth days
  color: string;
  angle: number; // current angle in radians
  speed: number; // angular speed
  description: string;
}

const PLANETS_DATA: PlanetData[] = [
  {
    name: 'Mercury',
    nameRu: 'Меркурий',
    radius: 4,
    realRadius: 2439,
    distance: 70,
    realDistance: 57.9,
    orbitalPeriod: 88,
    color: '#b5b5b5',
    angle: Math.random() * Math.PI * 2,
    speed: 0.04,
    description: 'Самая маленькая и ближайшая к Солнцу планета.'
  },
  {
    name: 'Venus',
    nameRu: 'Венера',
    radius: 7,
    realRadius: 6052,
    distance: 100,
    realDistance: 108.2,
    orbitalPeriod: 225,
    color: '#e8cda0',
    angle: Math.random() * Math.PI * 2,
    speed: 0.015,
    description: 'Самая горячая планета с плотной атмосферой из CO₂.'
  },
  {
    name: 'Earth',
    nameRu: 'Земля',
    radius: 8,
    realRadius: 6371,
    distance: 140,
    realDistance: 149.6,
    orbitalPeriod: 365,
    color: '#4da6ff',
    angle: Math.random() * Math.PI * 2,
    speed: 0.01,
    description: 'Наш дом — единственная известная планета с жизнью.'
  },
  {
    name: 'Mars',
    nameRu: 'Марс',
    radius: 6,
    realRadius: 3390,
    distance: 180,
    realDistance: 227.9,
    orbitalPeriod: 687,
    color: '#e07050',
    angle: Math.random() * Math.PI * 2,
    speed: 0.008,
    description: 'Красная планета с самой высокой горой — Олимп.'
  },
  {
    name: 'Jupiter',
    nameRu: 'Юпитер',
    radius: 18,
    realRadius: 69911,
    distance: 240,
    realDistance: 778.5,
    orbitalPeriod: 4333,
    color: '#d4a574',
    angle: Math.random() * Math.PI * 2,
    speed: 0.004,
    description: 'Крупнейшая планета, газовый гигант с Большим Красным Пятном.'
  },
  {
    name: 'Saturn',
    nameRu: 'Сатурн',
    radius: 15,
    realRadius: 58232,
    distance: 310,
    realDistance: 1434,
    orbitalPeriod: 10759,
    color: '#f0d890',
    angle: Math.random() * Math.PI * 2,
    speed: 0.003,
    description: 'Знаменит своими великолепными кольцами из льда и камней.'
  },
  {
    name: 'Uranus',
    nameRu: 'Уран',
    radius: 11,
    realRadius: 25362,
    distance: 370,
    realDistance: 2871,
    orbitalPeriod: 30687,
    color: '#7ec8e3',
    angle: Math.random() * Math.PI * 2,
    speed: 0.002,
    description: 'Ледяной гигант, вращающийся «на боку» относительно орбиты.'
  },
  {
    name: 'Neptune',
    nameRu: 'Нептун',
    radius: 10,
    realRadius: 24622,
    distance: 420,
    realDistance: 4495,
    orbitalPeriod: 60190,
    color: '#4060e0',
    angle: Math.random() * Math.PI * 2,
    speed: 0.001,
    description: 'Самая далёкая планета с сильнейшими ветрами в Солнечной системе.'
  }
];

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const planetsRef = useRef<PlanetData[]>(JSON.parse(JSON.stringify(PLANETS_DATA)));
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const isPlayingRef = useRef(isPlaying);
  const speedRef = useRef(speed);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const drawSolarSystem = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2;
    const centerY = height / 2;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    const starSeed = 42;
    for (let i = 0; i < 200; i++) {
      const x = ((starSeed * (i + 1) * 7) % width);
      const y = ((starSeed * (i + 1) * 13) % height);
      const size = ((i * 3) % 3) * 0.5 + 0.5;
      const opacity = 0.3 + ((i * 7) % 10) / 15;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    // Draw orbits
    planetsRef.current.forEach((planet) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, planet.distance, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw Sun
    const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 35);
    sunGradient.addColorStop(0, '#fff7a0');
    sunGradient.addColorStop(0.3, '#ffcc00');
    sunGradient.addColorStop(0.7, '#ff8800');
    sunGradient.addColorStop(1, '#ff440040');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
    ctx.fillStyle = sunGradient;
    ctx.fill();

    // Sun glow
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 30, centerX, centerY, 60);
    glowGradient.addColorStop(0, 'rgba(255, 200, 0, 0.3)');
    glowGradient.addColorStop(1, 'rgba(255, 200, 0, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, 60, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw planets
    planetsRef.current.forEach((planet) => {
      const x = centerX + Math.cos(planet.angle) * planet.distance;
      const y = centerY + Math.sin(planet.angle) * planet.distance;

      // Planet shadow/glow
      const planetGlow = ctx.createRadialGradient(x, y, 0, x, y, planet.radius + 4);
      planetGlow.addColorStop(0, planet.color);
      planetGlow.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, planet.radius + 4, 0, Math.PI * 2);
      ctx.fillStyle = planetGlow;
      ctx.fill();

      // Planet body
      ctx.beginPath();
      ctx.arc(x, y, planet.radius, 0, Math.PI * 2);
      ctx.fillStyle = planet.color;
      ctx.fill();

      // Saturn rings
      if (planet.name === 'Saturn') {
        ctx.beginPath();
        ctx.ellipse(x, y, planet.radius + 8, (planet.radius + 8) * 0.3, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(240, 216, 144, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Highlight on hover
      if (hoveredPlanet === planet.name) {
        ctx.beginPath();
        ctx.arc(x, y, planet.radius + 6, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Selected indicator
      if (selectedPlanet && selectedPlanet.name === planet.name) {
        ctx.beginPath();
        ctx.arc(x, y, planet.radius + 8, 0, Math.PI * 2);
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Planet name label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(planet.nameRu, x, y + planet.radius + 14);
    });
  }, [hoveredPlanet, selectedPlanet]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    if (isPlayingRef.current) {
      planetsRef.current.forEach((planet) => {
        planet.angle += planet.speed * speedRef.current;
      });
    }

    drawSolarSystem(ctx, width, height);
    animationRef.current = requestAnimationFrame(animate);
  }, [drawSolarSystem]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let clickedPlanet: PlanetData | null = null;
    for (const planet of planetsRef.current) {
      const px = centerX + Math.cos(planet.angle) * planet.distance;
      const py = centerY + Math.sin(planet.angle) * planet.distance;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planet.radius + 10) {
        clickedPlanet = planet;
        break;
      }
    }

    setSelectedPlanet(clickedPlanet);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let hovered: string | null = null;
    for (const planet of planetsRef.current) {
      const px = centerX + Math.cos(planet.angle) * planet.distance;
      const py = centerY + Math.sin(planet.angle) * planet.distance;
      const dist = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (dist <= planet.radius + 10) {
        hovered = planet.name;
        break;
      }
    }
    setHoveredPlanet(hovered);
    canvas.style.cursor = hovered ? 'pointer' : 'default';
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a1a]">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMouseMove}
      />

      {/* Title */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide drop-shadow-lg">
          ☀️ Интерактивная Солнечная Система
        </h1>
        <p className="text-sm text-gray-300 mt-1">Нажмите на планету для подробной информации</p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4 bg-black/60 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/10">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
          title={isPlaying ? 'Пауза' : 'Воспроизведение'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-white/70 text-sm">Скорость:</span>
          <input
            type="range"
            min="0.1"
            max="10"
            step="0.1"
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-24 md:w-32 accent-blue-400"
          />
          <span className="text-white font-mono text-sm w-10">{speed.toFixed(1)}x</span>
        </div>

        <button
          onClick={() => { setSpeed(1); }}
          className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white text-sm"
          title="Сброс скорости"
        >
          Сброс
        </button>
      </div>

      {/* Planet Info Panel */}
      {selectedPlanet && (
        <div className="absolute top-20 right-4 md:right-8 z-10 w-72 md:w-80 bg-black/70 backdrop-blur-lg rounded-2xl p-5 border border-white/15 shadow-2xl animate-fadeIn">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full shadow-lg"
                style={{ backgroundColor: selectedPlanet.color, boxShadow: `0 0 15px ${selectedPlanet.color}60` }}
              />
              <div>
                <h2 className="text-xl font-bold text-white">{selectedPlanet.nameRu}</h2>
                <p className="text-xs text-gray-400">{selectedPlanet.name}</p>
              </div>
            </div>
            <button
              onClick={() => setSelectedPlanet(null)}
              className="text-white/50 hover:text-white transition-colors text-xl leading-none"
            >
              ✕
            </button>
          </div>

          <p className="text-gray-300 text-sm mb-4 italic">{selectedPlanet.description}</p>

          <div className="space-y-3">
            <InfoRow label="Радиус" value={`${selectedPlanet.realRadius.toLocaleString()} км`} />
            <InfoRow label="Расстояние от Солнца" value={`${selectedPlanet.realDistance.toLocaleString()} млн км`} />
            <InfoRow label="Орбитальный период" value={`${selectedPlanet.orbitalPeriod.toLocaleString()} дней`} />
            <InfoRow
              label="Орбитальный период"
              value={`≈ ${(selectedPlanet.orbitalPeriod / 365.25).toFixed(2)} земных лет`}
              sublabel
            />
          </div>
        </div>
      )}

      {/* Planet Legend */}
      <div className="absolute top-20 left-4 md:left-8 z-10 bg-black/50 backdrop-blur-sm rounded-xl p-3 border border-white/10 hidden md:block">
        <h3 className="text-white/80 text-xs font-semibold mb-2 uppercase tracking-wider">Планеты</h3>
        <div className="space-y-1.5">
          {planetsRef.current.map((planet) => (
            <button
              key={planet.name}
              onClick={() => setSelectedPlanet(planet)}
              className="flex items-center gap-2 w-full text-left hover:bg-white/5 rounded px-1 py-0.5 transition-colors"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: planet.color }}
              />
              <span className="text-white/70 text-xs">{planet.nameRu}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, sublabel }: { label: string; value: string; sublabel?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-400 text-sm">{label}</span>
      <span className={`font-medium ${sublabel ? 'text-gray-400 text-xs' : 'text-white text-sm'}`}>
        {value}
      </span>
    </div>
  );
}

export default App;
