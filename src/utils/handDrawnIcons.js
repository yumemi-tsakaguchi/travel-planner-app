// 手書き風SVGアイコンを生成する関数
export const getHandDrawnIcon = (type) => {
  const icons = {
    landmark: `
      <svg width="50" height="50" viewBox="0 0 100 100" style="transform: rotate(${Math.random() * 6 - 3}deg);">
        <path d="M20,80 Q25,75 30,80 L70,80 Q75,75 80,80 L80,85 Q75,90 70,85 L30,85 Q25,90 20,85 Z" 
              fill="#ff6b6b" stroke="#d63031" stroke-width="2" opacity="0.8"/>
        <path d="M25,80 L25,20 Q25,15 30,15 L70,15 Q75,15 75,20 L75,80" 
              fill="none" stroke="#d63031" stroke-width="3" stroke-linecap="round"/>
        <circle cx="50" cy="40" r="8" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>
        <path d="M40,55 Q50,50 60,55 Q55,65 50,60 Q45,65 40,55" 
              fill="#74b9ff" stroke="#0984e3" stroke-width="1"/>
      </svg>
    `,
    museum: `
      <svg width="50" height="50" viewBox="0 0 100 100" style="transform: rotate(${Math.random() * 4 - 2}deg);">
        <path d="M15,75 Q20,70 25,75 L75,75 Q80,70 85,75 L85,85 Q80,90 75,85 L25,85 Q20,90 15,85 Z" 
              fill="#6c5ce7" stroke="#5f3dc4" stroke-width="2"/>
        <path d="M20,75 L20,35 Q25,30 30,35 L70,35 Q75,30 80,35 L80,75" 
              fill="#a29bfe" stroke="#5f3dc4" stroke-width="2"/>
        <rect x="30" y="45" width="8" height="25" fill="#fd79a8" stroke="#e84393" stroke-width="1"/>
        <rect x="46" y="40" width="8" height="30" fill="#fd79a8" stroke="#e84393" stroke-width="1"/>
        <rect x="62" y="50" width="8" height="20" fill="#fd79a8" stroke="#e84393" stroke-width="1"/>
        <path d="M25,25 Q50,15 75,25 L80,30 Q75,35 70,30 L30,30 Q25,35 20,30 Z" 
              fill="#fab1a0" stroke="#e17055" stroke-width="2"/>
      </svg>
    `,
    temple: `
      <svg width="50" height="50" viewBox="0 0 100 100" style="transform: rotate(${Math.random() * 5 - 2.5}deg);">
        <path d="M20,80 Q25,75 30,80 L70,80 Q75,75 80,80 L80,85 Q75,90 70,85 L30,85 Q25,90 20,85 Z" 
              fill="#e17055" stroke="#d63031" stroke-width="2"/>
        <path d="M25,80 L25,50 Q30,45 35,50 L65,50 Q70,45 75,50 L75,80" 
              fill="#fab1a0" stroke="#e17055" stroke-width="2"/>
        <path d="M15,45 Q50,25 85,45 L80,50 Q75,55 70,50 L30,50 Q25,55 20,50 Z" 
              fill="#fd79a8" stroke="#e84393" stroke-width="2"/>
        <circle cx="50" cy="60" r="6" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>
        <path d="M45,35 Q50,30 55,35 Q50,40 45,35" fill="#74b9ff" stroke="#0984e3"/>
      </svg>
    `,
    cafe: `
      <svg width="50" height="50" viewBox="0 0 100 100" style="transform: rotate(${Math.random() * 8 - 4}deg);">
        <ellipse cx="45" cy="60" rx="20" ry="25" fill="#fd79a8" stroke="#e84393" stroke-width="2"/>
        <path d="M25,45 Q30,40 35,45 L55,45 Q60,40 65,45 Q65,50 60,50 L35,50 Q30,50 25,45" 
              fill="#fab1a0" stroke="#e17055" stroke-width="2"/>
        <rect x="65" y="50" width="10" height="15" rx="5" fill="#fd79a8" stroke="#e84393" stroke-width="1"/>
        <path d="M30,30 Q35,25 40,30 Q35,35 30,30" fill="#74b9ff" stroke="#0984e3"/>
        <path d="M40,25 Q45,20 50,25 Q45,30 40,25" fill="#74b9ff" stroke="#0984e3"/>
        <path d="M50,30 Q55,25 60,30 Q55,35 50,30" fill="#74b9ff" stroke="#0984e3"/>
      </svg>
    `,
    restaurant: `
      <svg width="50" height="50" viewBox="0 0 100 100" style="transform: rotate(${Math.random() * 6 - 3}deg);">
        <ellipse cx="35" cy="60" rx="8" ry="20" fill="#fd79a8" stroke="#e84393" stroke-width="2"/>
        <path d="M25,25 L25,45 Q30,50 35,45 L35,25" fill="none" stroke="#e84393" stroke-width="3"/>
        <path d="M30,25 L30,35" stroke="#e84393" stroke-width="2"/>
        <path d="M40,25 L40,35" stroke="#e84393" stroke-width="2"/>
        <ellipse cx="65" cy="50" rx="12" ry="8" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>
        <path d="M65,25 L65,70 Q70,75 75,70 L75,25" fill="none" stroke="#fdcb6e" stroke-width="3"/>
        <circle cx="75" cy="30" r="5" fill="#fd79a8" stroke="#e84393" stroke-width="1"/>
      </svg>
    `,
    park: `
      <svg width="50" height="50" viewBox="0 0 100 100" style="transform: rotate(${Math.random() * 4 - 2}deg);">
        <ellipse cx="50" cy="80" rx="35" ry="10" fill="#00b894" stroke="#00a085" stroke-width="1"/>
        <path d="M30,80 Q35,60 40,80" fill="#00b894" stroke="#00a085" stroke-width="2"/>
        <path d="M40,75 Q45,50 50,75" fill="#00b894" stroke="#00a085" stroke-width="2"/>
        <path d="M50,80 Q55,55 60,80" fill="#00b894" stroke="#00a085" stroke-width="2"/>
        <path d="M60,75 Q65,60 70,75" fill="#00b894" stroke="#00a085" stroke-width="2"/>
        <circle cx="35" cy="65" r="8" fill="#55a3ff" stroke="#2d96ff" stroke-width="1"/>
        <circle cx="58" cy="58" r="6" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="1"/>
        <path d="M20,40 Q25,35 30,40 Q35,35 40,40 Q35,45 30,40 Q25,45 20,40" 
              fill="#fd79a8" stroke="#e84393" stroke-width="1"/>
      </svg>
    `,
    shopping: `
      <svg width="50" height="50" viewBox="0 0 100 100" style="transform: rotate(${Math.random() * 5 - 2.5}deg);">
        <rect x="25" y="40" width="50" height="35" rx="5" fill="#fd79a8" stroke="#e84393" stroke-width="2"/>
        <path d="M35,40 Q35,30 45,30 Q55,30 55,40" fill="none" stroke="#e84393" stroke-width="3"/>
        <path d="M65,40 Q65,30 75,30 Q80,30 80,40" fill="none" stroke="#e84393" stroke-width="3"/>
        <rect x="35" y="50" width="30" height="3" fill="#ffeaa7"/>
        <rect x="35" y="60" width="25" height="3" fill="#74b9ff"/>
        <circle cx="40" cy="25" r="3" fill="#00b894"/>
        <circle cx="60" cy="28" r="4" fill="#ffeaa7"/>
      </svg>
    `,
    market: `
      <svg width="50" height="50" viewBox="0 0 100 100" style="transform: rotate(${Math.random() * 6 - 3}deg);">
        <path d="M20,70 Q25,65 30,70 L70,70 Q75,65 80,70 L80,80 Q75,85 70,80 L30,80 Q25,85 20,80 Z" 
              fill="#fab1a0" stroke="#e17055" stroke-width="2"/>
        <path d="M15,30 Q50,20 85,30 L80,40 Q50,25 20,40 Z" 
              fill="#fd79a8" stroke="#e84393" stroke-width="2"/>
        <rect x="30" y="45" width="8" height="20" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="1"/>
        <rect x="46" y="50" width="8" height="15" fill="#74b9ff" stroke="#0984e3" stroke-width="1"/>
        <rect x="62" y="48" width="8" height="17" fill="#fd79a8" stroke="#e84393" stroke-width="1"/>
        <circle cx="40" cy="35" r="3" fill="#00b894"/>
        <circle cx="55" cy="32" r="2" fill="#e17055"/>
      </svg>
    `,
    fountain: `
      <svg width="50" height="50" viewBox="0 0 100 100" style="transform: rotate(${Math.random() * 4 - 2}deg);">
        <ellipse cx="50" cy="75" rx="30" ry="8" fill="#74b9ff" stroke="#0984e3" stroke-width="2"/>
        <ellipse cx="50" cy="60" rx="20" ry="6" fill="#74b9ff" stroke="#0984e3" stroke-width="1"/>
        <path d="M50,20 Q52,30 50,40 Q48,30 50,20" fill="#74b9ff" stroke="#0984e3" stroke-width="1"/>
        <path d="M45,25 Q47,35 45,45 Q43,35 45,25" fill="#74b9ff" stroke="#0984e3" stroke-width="1"/>
        <path d="M55,25 Q57,35 55,45 Q53,35 55,25" fill="#74b9ff" stroke="#0984e3" stroke-width="1"/>
        <circle cx="50" cy="50" r="8" fill="#ffeaa7" stroke="#fdcb6e" stroke-width="2"/>
        <path d="M40,65 Q45,55 50,65 Q55,55 60,65" stroke="#0984e3" stroke-width="1" fill="none"/>
      </svg>
    `
  };

  return icons[type] || icons.landmark;
};

export const getRandomHandDrawnBorder = () => {
  const borders = [
    'border: 3px dashed #ff6b6b; border-radius: 15px;',
    'border: 2px dotted #74b9ff; border-radius: 20px;',
    'border: 3px solid #fd79a8; border-radius: 12px; border-style: dashed solid;',
    'border: 2px double #00b894; border-radius: 18px;',
    'border: 3px ridge #ffeaa7; border-radius: 10px;'
  ];
  return borders[Math.floor(Math.random() * borders.length)];
};