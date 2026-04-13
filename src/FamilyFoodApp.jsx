import { useState, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════════════════════════════ */
const B = "#FF6B35";        // brand orange
const BG = "#FFB800";       // brand gold
const BL = "#FFF4EE";       // brand light
const CREAM = "#FEFCF7";    // warm surface
const DARK = "#1A1410";     // warm near-black
const MID = "#6B5E52";      // warm mid-tone
const SOFT = "#A8998C";     // soft text

const CSHADOW = "0 1px 2px rgba(0,0,0,.04), 0 4px 16px rgba(0,0,0,.07), 0 8px 24px rgba(0,0,0,.03), inset 0 1px 0 rgba(255,255,255,.85)";
const CSHADOW2 = "0 2px 4px rgba(0,0,0,.06), 0 8px 28px rgba(0,0,0,.10), 0 16px 40px rgba(0,0,0,.05), inset 0 1px 0 rgba(255,255,255,.9)";

/* ═══════════════════════════════════════════════════════════════════════
   CSS
═══════════════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #E8E0D8; }

  @keyframes logoSpring {
    0%   { transform: scale(0.3) rotate(-14deg); opacity: 0; }
    50%  { transform: scale(1.12) rotate(4deg); opacity: 1; }
    70%  { transform: scale(0.94) rotate(-2deg); }
    85%  { transform: scale(1.04) rotate(1deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes springPop {
    0%   { transform: scale(0); opacity: 0; }
    45%  { transform: scale(1.14); opacity: 1; }
    65%  { transform: scale(0.95); }
    82%  { transform: scale(1.03); }
    100% { transform: scale(1); }
  }
  @keyframes popIn {
    0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
    55%  { transform: scale(1.22) rotate(6deg); opacity: 1; }
    75%  { transform: scale(0.92) rotate(-3deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes popOut {
    0%   { transform: scale(1); opacity: 1; }
    100% { transform: scale(0); opacity: 0; }
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hintIn {
    from { opacity: 0; transform: translateX(-14px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideUp {
    from { transform: translateY(100%); }
    to   { transform: translateY(0); }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%      { transform: translateY(-9px); }
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50%      { transform: scale(1.03); }
  }
  @keyframes plateWiggle {
    0%, 100% { transform: rotate(0deg) scale(1); }
    15%      { transform: rotate(-4deg) scale(1.04); }
    30%      { transform: rotate(3.5deg) scale(1.04); }
    50%      { transform: rotate(-2deg) scale(1.02); }
    70%      { transform: rotate(2deg) scale(1.02); }
    85%      { transform: rotate(-1deg) scale(1.01); }
  }
  @keyframes confettiFall {
    0%   { transform: translateY(-40px) rotate(0deg); opacity: 1; }
    100% { transform: translateY(115vh) rotate(600deg); opacity: 0; }
  }
  @keyframes badgePop {
    0%   { transform: scale(0); }
    70%  { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  @keyframes bounceIn {
    0%   { transform: scale(0.2); opacity: 0; }
    60%  { transform: scale(1.15); opacity: 1; }
    80%  { transform: scale(0.92); }
    100% { transform: scale(1); }
  }
  @keyframes stampDrop {
    0%   { transform: scale(3.5) rotate(-12deg); opacity: 0; }
    55%  { transform: scale(0.88) rotate(3deg); opacity: 1; }
    75%  { transform: scale(1.06) rotate(-1deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes starBurst {
    0%   { transform: scale(0); opacity: 1; }
    60%  { transform: scale(1.4); opacity: 0.6; }
    100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(28px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes scaleIn {
    0%   { transform: scale(0.6) rotate(-10deg); opacity: 0; }
    60%  { transform: scale(1.08) rotate(3deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes greetIn {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .card { cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent; }
  .card:active { transform: scale(0.93) !important; transition: transform 0.1s ease !important; }
  .btn { cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent; transition: transform 0.12s ease; }
  .btn:active { transform: scale(0.95); }
  .tab { cursor: pointer; user-select: none; -webkit-tap-highlight-color: transparent; border: none; background: none; }
`;

/* ═══════════════════════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════════════════════ */
const MEALS = {
  breakfast: { label:"Breakfast", emoji:"🌅", g1:"#F59E0B", g2:"#EF4444", shadow:"#F59E0B44", light:"#FEF9EC", text:"#92400E" },
  lunch:     { label:"Lunch",     emoji:"☀️",  g1:"#10B981", g2:"#0EA5E9", shadow:"#10B98144", light:"#ECFDF5", text:"#065F46" },
  dinner:    { label:"Dinner",    emoji:"🌙",  g1:"#7C3AED", g2:"#DB2777", shadow:"#7C3AED44", light:"#F5F3FF", text:"#4C1D95" },
};
const PT = { g1:"#0F766E", g2:"#0369A1", shadow:"#0F766E44", light:"#F0FDFA", text:"#134E4A" };

const LIBRARY = {
  breakfast: {
    setMeals: [
      { id:"bs1", name:"Pancakes",     emoji:"🥞" }, { id:"bs2", name:"Waffles",      emoji:"🧇" },
      { id:"bs3", name:"Oatmeal",      emoji:"🥣" }, { id:"bs4", name:"French Toast", emoji:"🍞" },
      { id:"bs5", name:"Cereal",       emoji:"🥣" }, { id:"bs6", name:"Bagel",        emoji:"🥯" },
    ],
    items: [
      { id:"bi1", name:"Eggs",    emoji:"🍳" }, { id:"bi2", name:"Bacon",   emoji:"🥓" },
      { id:"bi3", name:"Fruit",   emoji:"🍓" }, { id:"bi4", name:"Yogurt",  emoji:"🫙" },
      { id:"bi5", name:"OJ",      emoji:"🍊" }, { id:"bi6", name:"Milk",    emoji:"🥛" },
      { id:"bi7", name:"Toast",   emoji:"🍞" }, { id:"bi8", name:"Sausage", emoji:"🌭" },
    ],
  },
  lunch: {
    setMeals: [
      { id:"ls1", name:"PB&J",           emoji:"🥪" }, { id:"ls2", name:"Grilled Cheese", emoji:"🧀" },
      { id:"ls3", name:"Quesadilla",     emoji:"🫓" }, { id:"ls4", name:"Mac & Cheese",   emoji:"🍜" },
      { id:"ls5", name:"Hot Dog",        emoji:"🌭" }, { id:"ls6", name:"Soup",           emoji:"🍲" },
    ],
    items: [
      { id:"li1", name:"Apple Slices", emoji:"🍎" }, { id:"li2", name:"Carrots",      emoji:"🥕" },
      { id:"li3", name:"Chips",        emoji:"🍟" }, { id:"li4", name:"Milk",         emoji:"🥛" },
      { id:"li5", name:"Cookie",       emoji:"🍪" }, { id:"li6", name:"Grapes",       emoji:"🍇" },
      { id:"li7", name:"Crackers",     emoji:"🫙" }, { id:"li8", name:"Cheese",       emoji:"🧀" },
    ],
  },
  dinner: {
    setMeals: [
      { id:"ds1", name:"Spaghetti",    emoji:"🍝" }, { id:"ds2", name:"Cheeseburger", emoji:"🍔" },
      { id:"ds3", name:"Tacos",        emoji:"🌮" }, { id:"ds4", name:"Cod",          emoji:"🐟" },
      { id:"ds5", name:"Pizza",        emoji:"🍕" }, { id:"ds6", name:"Chicken",      emoji:"🍗" },
      { id:"ds7", name:"Steak",        emoji:"🥩" }, { id:"ds8", name:"Salmon",       emoji:"🐠" },
    ],
    items: [
      { id:"di1", name:"Broccoli",      emoji:"🥦" }, { id:"di2", name:"Corn",          emoji:"🌽" },
      { id:"di3", name:"Salad",         emoji:"🥗" }, { id:"di4", name:"Roll",          emoji:"🍞" },
      { id:"di5", name:"Milk",          emoji:"🥛" }, { id:"di6", name:"Ice Cream",     emoji:"🍦" },
      { id:"di7", name:"Mashed Potato", emoji:"🥔" }, { id:"di8", name:"Green Beans",   emoji:"🫛" },
    ],
  },
};

const PANTRY_EXTRAS = [
  { id:"pe1",  name:"Apple",        emoji:"🍎" }, { id:"pe2",  name:"Banana",       emoji:"🍌" },
  { id:"pe3",  name:"Goldfish",     emoji:"🐠" }, { id:"pe4",  name:"Granola Bar",  emoji:"🍫" },
  { id:"pe5",  name:"Fruit Snacks", emoji:"🍬" }, { id:"pe6",  name:"Pretzels",     emoji:"🥨" },
  { id:"pe7",  name:"Popcorn",      emoji:"🍿" }, { id:"pe8",  name:"Cheese Stick", emoji:"🧀" },
  { id:"pe9",  name:"PB on Toast",  emoji:"🥜" }, { id:"pe10", name:"Applesauce",   emoji:"🍶" },
  { id:"pe11", name:"Raisins",      emoji:"🍇" }, { id:"pe12", name:"String Cheese",emoji:"🧀" },
];

const PALS = [
  { bg:"#FFF9C4", ring:"#F9A825", check:"#F57F17", glow:"#F9A82533" },
  { bg:"#FCE4EC", ring:"#E91E63", check:"#C2185B", glow:"#E91E6333" },
  { bg:"#E8F5E9", ring:"#43A047", check:"#2E7D32", glow:"#43A04733" },
  { bg:"#E3F2FD", ring:"#1E88E5", check:"#1565C0", glow:"#1E88E533" },
  { bg:"#F3E5F5", ring:"#8E24AA", check:"#6A1B9A", glow:"#8E24AA33" },
  { bg:"#FFF3E0", ring:"#FB8C00", check:"#E65100", glow:"#FB8C0033" },
  { bg:"#E0F7FA", ring:"#00ACC1", check:"#006064", glow:"#00ACC133" },
  { bg:"#F9FBE7", ring:"#C0CA33", check:"#827717", glow:"#C0CA3333" },
  { bg:"#EDE7F6", ring:"#673AB7", check:"#4527A0", glow:"#673AB733" },
  { bg:"#E8EAF6", ring:"#3949AB", check:"#1A237E", glow:"#3949AB33" },
];

const ENC = [
  { msg:"Tap something yummy! 👇", sub:"" },
  { msg:"Great pick! 🌟",          sub:"What else sounds good?" },
  { msg:"Ooh, tasty! 😋",          sub:"Keep building your plate!" },
  { msg:"Nice choices! 🔥",        sub:"Looking delicious!" },
  { msg:"Almost ready! 🎉",        sub:"Tap done whenever you're set!" },
  { msg:"What a plate! 😍",        sub:"Ready whenever you are!" },
];

const ONBOARD_SLIDES = [
  { visual:null,    title:"Happy Meals",           desc:"The fun, easy way to handle mealtime and snack time with your family. No more \"what do you want?\"",                                        btn:"See how it works →" },
  { visual:"👨‍👩‍👧", title:"Parents set the menu",  desc:"Before mealtime, tap a meal → Parent Setup. Toggle what's available tonight in under a minute. Save favorites as templates!",                btn:"Got it →" },
  { visual:"⭐",    title:"Kids build their plate", desc:"Hand them the phone. They tap Kid's Turn, choose their food, and hit Done. You review it together — no debates!",                            btn:"Love it →" },
  { visual:"🏠",    title:"The Pantry",             desc:"Track what's in stock, let kids browse for snacks, and your grocery list builds itself automatically from out-of-stock items.",              btn:"Let's go →" },
];

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════ */
function makeInitialMenu() {
  const out = {};
  for (const meal of Object.keys(LIBRARY)) {
    out[meal] = {
      setMeals: LIBRARY[meal].setMeals.map(x => ({ ...x, active:false })),
      items:    LIBRARY[meal].items.map(x => ({ ...x, active:false })),
    };
  }
  return out;
}

function makeInitialPantry() {
  const out = {}, seen = new Set();
  for (const meal of Object.values(LIBRARY)) {
    for (const item of meal.setMeals) {
      const k = item.name.toLowerCase();
      if (!seen.has(k)) { seen.add(k); out[item.id] = { ...item, inStock:false, section:"meals" }; }
    }
    for (const item of meal.items) {
      const k = item.name.toLowerCase();
      if (!seen.has(k)) { seen.add(k); out[item.id] = { ...item, inStock:false, section:"extras" }; }
    }
  }
  for (const item of PANTRY_EXTRAS) {
    const k = item.name.toLowerCase();
    if (!seen.has(k)) { seen.add(k); out[item.id] = { ...item, inStock:false, section:"extras" }; }
  }
  return out;
}

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { text:"Good morning!", emoji:"☀️" };
  if (h < 17) return { text:"Good afternoon!", emoji:"🌤️" };
  return { text:"Good evening!", emoji:"🌙" };
}

const shell = {
  maxWidth:390, margin:"0 auto", height:"100dvh",
  display:"flex", flexDirection:"column", overflow:"hidden",
  position:"relative", fontFamily:"'Baloo 2', sans-serif",
  background:CREAM, boxShadow:"0 0 120px rgba(0,0,0,0.2)",
};

/* ═══════════════════════════════════════════════════════════════════════
   LOGO
═══════════════════════════════════════════════════════════════════════ */
function HappyMealsLogo({ size = 48 }) {
  return (
    <svg width={Math.round(size * 1.22)} height={size} viewBox="0 0 68 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="pg" cx="32%" cy="26%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#EDE5DA"/>
        </radialGradient>
        <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={B}/>
          <stop offset="100%" stopColor={BG}/>
        </linearGradient>
        <filter id="ps">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.14)"/>
        </filter>
      </defs>

      {/* Fork */}
      <g transform="translate(4,13) rotate(-14,6,22)" opacity="0.9">
        <rect x="4" y="18" width="3.5" height="18" rx="1.75" fill={B}/>
        <rect x="4" y="6"  width="3.5" height="14" rx="1.75" fill={B}/>
        <rect x="2"   y="4" width="2" height="10" rx="1" fill={B}/>
        <rect x="4.5" y="4" width="2" height="10" rx="1" fill={B}/>
        <rect x="7"   y="4" width="2" height="10" rx="1" fill={B}/>
      </g>

      {/* Spoon */}
      <g transform="translate(49,13) rotate(14,6,22)" opacity="0.9">
        <rect x="4" y="20" width="3.5" height="18" rx="1.75" fill={BG}/>
        <ellipse cx="5.75" cy="12.5" rx="5.5" ry="7.5" fill={BG}/>
        <ellipse cx="5.75" cy="12.5" rx="3.5" ry="5.5" fill="#FFD54F" opacity="0.6"/>
      </g>

      {/* Plate shadow */}
      <ellipse cx="32" cy="53" rx="20" ry="3" fill="rgba(0,0,0,0.1)"/>
      {/* Plate */}
      <circle cx="32" cy="28" r="25" fill="url(#pg)" filter="url(#ps)"/>
      <circle cx="32" cy="28" r="25" stroke="url(#rg)" strokeWidth="2.8"/>
      {/* Rings */}
      <circle cx="32" cy="28" r="20" stroke="#EDE0D0" strokeWidth="1.5" fill="none"/>
      <circle cx="32" cy="28" r="16" fill="white"/>

      {/* Rosy cheeks — plump and pink */}
      <ellipse cx="17" cy="33" rx="7" ry="5.5" fill="#FCA5A5" opacity="0.65"/>
      <ellipse cx="47" cy="33" rx="7" ry="5.5" fill="#FCA5A5" opacity="0.65"/>
      {/* Tiny gold sparkle on each cheek */}
      <circle cx="14.5" cy="30.5" r="1.3" fill="#FBBF24" opacity="0.9"/>
      <circle cx="49.5" cy="30.5" r="1.3" fill="#FBBF24" opacity="0.9"/>

      {/* Eyes — bigger, rounder, more cartoon */}
      <circle cx="24" cy="23" r="5.5" fill={B}/>
      <circle cx="40" cy="23" r="5.5" fill={B}/>
      {/* Double twinkle highlights */}
      <circle cx="25.8" cy="21" r="2.1" fill="white"/>
      <circle cx="41.8" cy="21" r="2.1" fill="white"/>
      <circle cx="23.2" cy="25" r="1" fill="white" opacity="0.7"/>
      <circle cx="39.2" cy="25" r="1" fill="white" opacity="0.7"/>

      {/* Eyebrows — thick, arched, happy */}
      <path d="M 19.5 17.5 Q 24 15 28.5 17.5" stroke={B} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M 35.5 17.5 Q 40 15 44.5 17.5" stroke={B} strokeWidth="2.2" fill="none" strokeLinecap="round"/>

      {/* Open grin — orange fill then white teeth inside */}
      <path d="M 18 30 Q 32 47 46 30" strokeWidth="4" stroke={B} fill={B} strokeLinecap="round"/>
      <path d="M 20.5 31 Q 32 44.5 43.5 31" fill="white"/>

      {/* Big sparkle star top-right */}
      <path d="M 57 4 L 58.5 9 L 63.5 10.5 L 58.5 12 L 57 17 L 55.5 12 L 50.5 10.5 L 55.5 9 Z" fill={BG}/>
      {/* Small sparkle star top-left */}
      <path d="M 7 3 L 8 5.8 L 11 7 L 8 8.2 L 7 11 L 6 8.2 L 3 7 L 6 5.8 Z" fill={B} opacity="0.55"/>
    </svg>
  );
}

function HappyMealsIcon({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none">
      <defs>
        <radialGradient id="pgi" cx="32%" cy="26%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#EDE5DA"/>
        </radialGradient>
        <linearGradient id="rgi" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={B}/>
          <stop offset="100%" stopColor={BG}/>
        </linearGradient>
        <filter id="psi">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.12)"/>
        </filter>
      </defs>
      <ellipse cx="28" cy="53" rx="17" ry="3" fill="rgba(0,0,0,0.09)"/>
      <circle cx="28" cy="26" r="23" fill="url(#pgi)" filter="url(#psi)"/>
      <circle cx="28" cy="26" r="23" stroke="url(#rgi)" strokeWidth="2.5"/>
      <circle cx="28" cy="26" r="18.5" stroke="#EDE0D0" strokeWidth="1.5" fill="none"/>
      <circle cx="28" cy="26" r="14.5" fill="white"/>
      {/* Cheeks — bigger, pinker */}
      <ellipse cx="16" cy="31" rx="6" ry="4.5" fill="#FCA5A5" opacity="0.65"/>
      <ellipse cx="40" cy="31" rx="6" ry="4.5" fill="#FCA5A5" opacity="0.65"/>
      <circle cx="13.5" cy="29" r="1.1" fill="#FBBF24" opacity="0.85"/>
      <circle cx="42.5" cy="29" r="1.1" fill="#FBBF24" opacity="0.85"/>
      {/* Eyes — bigger */}
      <circle cx="21.5" cy="22" r="5" fill={B}/>
      <circle cx="34.5" cy="22" r="5" fill={B}/>
      {/* Double twinkle */}
      <circle cx="23.2" cy="20" r="1.9" fill="white"/>
      <circle cx="36.2" cy="20" r="1.9" fill="white"/>
      <circle cx="20.5" cy="23.8" r="0.85" fill="white" opacity="0.7"/>
      <circle cx="33.5" cy="23.8" r="0.85" fill="white" opacity="0.7"/>
      {/* Eyebrows */}
      <path d="M 18 17.5 Q 21.5 15.5 25 17.5" stroke={B} strokeWidth="1.9" fill="none" strokeLinecap="round"/>
      <path d="M 31 17.5 Q 34.5 15.5 38 17.5" stroke={B} strokeWidth="1.9" fill="none" strokeLinecap="round"/>
      {/* Open grin */}
      <path d="M 17 29 Q 28 43 39 29" strokeWidth="3.5" stroke={B} fill={B} strokeLinecap="round"/>
      <path d="M 19 30 Q 28 41.5 37 30" fill="white"/>
      {/* Sparkle */}
      <path d="M 47 4 L 48.3 7.8 L 52.5 9 L 48.3 10.2 L 47 14 L 45.7 10.2 L 41.5 9 L 45.7 7.8 Z" fill={BG}/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HINT BAR
═══════════════════════════════════════════════════════════════════════ */
function HintBar({ text, icon = "💡", delay = "0s" }) {
  return (
    <div style={{
      margin:"10px 18px 0", display:"flex", gap:10, alignItems:"flex-start",
      background:"white", borderRadius:14, padding:"10px 14px 10px 12px",
      borderLeft:`4px solid ${B}`,
      boxShadow:"0 2px 12px rgba(255,107,53,0.1), 0 1px 4px rgba(0,0,0,0.04)",
      animation:`hintIn 0.4s ${delay} ease both`,
      flexShrink:0,
    }}>
      <div style={{
        width:26, height:26, borderRadius:8, background:BL,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:13, flexShrink:0,
      }}>{icon}</div>
      <p style={{ fontSize:12, fontFamily:"'Baloo 2'", fontWeight:600, color:MID, margin:0, lineHeight:1.55 }}>{text}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   CONFETTI
═══════════════════════════════════════════════════════════════════════ */
function Confetti() {
  const pieces = useMemo(() => {
    const colors = ["#FF6B35","#FFB800","#4ECDC4","#A8E6CF","#FF8A80","#FFD180","#B9F6CA","#80D8FF","#EA80FC","#CCFF90"];
    return Array.from({ length:40 }, (_,i) => ({
      id:i, color:colors[i%colors.length],
      left:2+(i/40)*96, delay:(i*0.04)%0.9,
      duration:1.4+(i%6)*0.25, size:8+(i%7)*2.5, isCircle:i%3!==0,
    }));
  }, []);
  return (
    <div style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:9999, overflow:"hidden" }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position:"absolute", left:`${p.left}%`, top:"-30px",
          width:p.size, height:p.size, background:p.color,
          borderRadius:p.isCircle?"50%":"3px",
          animation:`confettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
        }} />
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   ONBOARDING
═══════════════════════════════════════════════════════════════════════ */
function OnboardingOverlay({ onDone }) {
  const [step, setStep]         = useState(0);
  const [kidInput, setKidInput] = useState("");
  const [kidNames, setKidNames] = useState([]);
  const TOTAL      = ONBOARD_SLIDES.length + 1;
  const isKidsStep = step === ONBOARD_SLIDES.length;
  const slide      = !isKidsStep ? ONBOARD_SLIDES[step] : null;

  function addKid() {
    const name = kidInput.trim();
    if (!name || kidNames.includes(name)) return;
    setKidNames(prev => [...prev, name]);
    setKidInput("");
  }
  function removeKid(name) { setKidNames(prev => prev.filter(n => n !== name)); }

  return (
    <div style={{
      position:"fixed", inset:0, zIndex:2000, background:CREAM,
      display:"flex", flexDirection:"column", fontFamily:"'Baloo 2', sans-serif",
      maxWidth:390, margin:"0 auto", boxShadow:"0 0 120px rgba(0,0,0,0.2)",
    }}>
      <style>{CSS}</style>
      {/* Warm gradient background accent */}
      <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 0%, ${BL} 0%, transparent 65%)`, pointerEvents:"none" }} />

      {!isKidsStep && (
        <button onClick={() => onDone([])} style={{
          position:"absolute", top:48, right:22, zIndex:10,
          background:"none", border:"none", fontSize:13, fontWeight:700,
          color:SOFT, fontFamily:"'Baloo 2'", cursor:"pointer",
        }}>Skip</button>
      )}

      {!isKidsStep ? (
        <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 36px 16px", position:"relative" }}>
          <div key={step} style={{ textAlign:"center", animation:"slideInRight 0.38s ease" }}>
            <div style={{ marginBottom:32 }}>
              {slide.visual === null
                ? <div style={{ animation:"logoSpring 0.7s cubic-bezier(0.34,1.56,0.64,1)", display:"flex", justifyContent:"center" }}>
                    <HappyMealsLogo size={72} />
                  </div>
                : <div style={{ fontSize:92, animation:"bounceIn 0.5s ease", lineHeight:1 }}>{slide.visual}</div>
              }
            </div>
            <h1 style={{ fontSize:step===0?34:28, fontWeight:800, color:DARK, fontFamily:"'Baloo 2'", lineHeight:1.15, marginBottom:14 }}>{slide.title}</h1>
            <p style={{ fontSize:15, color:MID, lineHeight:1.7, fontFamily:"'Baloo 2'", fontWeight:500, maxWidth:290, margin:"0 auto" }}>{slide.desc}</p>
          </div>
        </div>
      ) : (
        <div style={{ flex:1, display:"flex", flexDirection:"column", padding:"52px 28px 16px", animation:"slideInRight 0.38s ease", position:"relative" }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <div style={{ fontSize:68, animation:"bounceIn 0.5s ease", lineHeight:1, marginBottom:18 }}>👧🧒</div>
            <h1 style={{ fontSize:26, fontWeight:800, color:DARK, fontFamily:"'Baloo 2'", marginBottom:10 }}>Who's at the table?</h1>
            <p style={{ fontSize:14, color:MID, fontFamily:"'Baloo 2'", lineHeight:1.65, maxWidth:280, margin:"0 auto" }}>
              Add your kids' names — their plates will be labeled automatically. You can update this any time.
            </p>
          </div>
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            <input value={kidInput} onChange={e=>setKidInput(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&addKid()} placeholder="Enter a name…" autoFocus
              style={{ flex:1, padding:"13px 16px", borderRadius:16, border:`2px solid #EDE5DA`, fontSize:16, fontFamily:"'Baloo 2'", outline:"none", background:"white", boxShadow:CSHADOW }} />
            <button onClick={addKid} className="btn" style={{ padding:"13px 18px", borderRadius:16, border:"none", background:`linear-gradient(135deg,${B},${BG})`, color:"white", fontSize:20, cursor:"pointer", flexShrink:0, boxShadow:`0 4px 16px ${B}44` }}>＋</button>
          </div>
          {kidNames.length > 0 ? (
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:12 }}>
              {kidNames.map(name => (
                <div key={name} style={{ display:"flex", alignItems:"center", gap:6, background:BL, border:`2px solid ${B}`, borderRadius:50, padding:"6px 14px 6px 16px", boxShadow:`0 2px 8px ${B}22` }}>
                  <span style={{ fontSize:14, fontWeight:700, color:"#92400E", fontFamily:"'Baloo 2'" }}>{name}</span>
                  <button onClick={()=>removeKid(name)} style={{ background:"none", border:"none", cursor:"pointer", color:B, fontSize:14, fontWeight:800, padding:0, lineHeight:1 }}>✕</button>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ fontSize:12, color:SOFT, fontFamily:"'Baloo 2'", fontWeight:600, textAlign:"center" }}>Tap + to add, or skip for now.</p>
          )}
        </div>
      )}

      <div style={{ padding:"0 28px 48px", display:"flex", flexDirection:"column", alignItems:"center", gap:18, position:"relative" }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {Array.from({ length:TOTAL }).map((_,i) => (
            <div key={i} style={{ width:i===step?24:8, height:8, borderRadius:4, background:i===step?B:"#E8E0D4", transition:"all 0.32s ease" }} />
          ))}
        </div>
        <button onClick={() => isKidsStep ? onDone(kidNames) : setStep(s=>s+1)} className="btn"
          style={{ width:"100%", padding:"18px", border:"none", borderRadius:22, background:`linear-gradient(135deg,${B},${BG})`, color:"white", fontSize:17, fontWeight:800, fontFamily:"'Baloo 2'", cursor:"pointer", boxShadow:`0 8px 28px ${B}55` }}>
          {isKidsStep ? (kidNames.length > 0 ? "Let's Eat! 🎉" : "Skip for now →") : slide.btn}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   SECTION LABEL
═══════════════════════════════════════════════════════════════════════ */
function SectionLabel({ children }) {
  return (
    <div style={{ fontSize:11, fontWeight:800, letterSpacing:"0.08em", textTransform:"uppercase", color:SOFT, fontFamily:"'Baloo 2'", marginBottom:10 }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   BOTTOM TAB NAV — floating pill
═══════════════════════════════════════════════════════════════════════ */
function BottomTabNav({ activeTab, onChange }) {
  const tabs = [{ id:"meals", icon:"🍽️", label:"Meals" }, { id:"pantry", icon:"🏠", label:"Pantry" }];
  return (
    <div style={{ padding:"8px 20px 28px", background:CREAM, flexShrink:0 }}>
      <div style={{ background:"white", borderRadius:100, boxShadow:CSHADOW2, display:"flex", padding:"5px", gap:4 }}>
        {tabs.map(tab => {
          const active = tab.id === activeTab;
          return (
            <button key={tab.id} onClick={()=>onChange(tab.id)} className="tab"
              style={{ flex:1, padding:"10px 0", borderRadius:100, display:"flex", flexDirection:"column", alignItems:"center", gap:2, background:active?`linear-gradient(135deg,${B},${BG})`:"transparent", transition:"all 0.25s ease", boxShadow:active?`0 4px 16px ${B}44`:"none" }}>
              <span style={{ fontSize:20 }}>{tab.icon}</span>
              <span style={{ fontSize:11, fontWeight:800, fontFamily:"'Baloo 2'", color:active?"white":SOFT }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   TOGGLE CARD  (parent setup)
═══════════════════════════════════════════════════════════════════════ */
function ToggleCard({ item, m, onToggle, onRemove }) {
  return (
    <div style={{ position:"relative" }}>
      <div onClick={onToggle} className="card" style={{
        background:item.active ? m.light : "white",
        borderRadius:20, padding:"16px 6px 13px", textAlign:"center",
        border:`2.5px solid ${item.active ? m.g1 : "#EDE5DA"}`,
        boxShadow:item.active ? `0 4px 20px ${m.shadow}, inset 0 1px 0 rgba(255,255,255,0.8)` : CSHADOW,
        transition:"all 0.22s ease",
      }}>
        {item.active && (
          <div style={{
            position:"absolute", top:-9, left:-9, width:24, height:24, borderRadius:"50%",
            background:`linear-gradient(135deg,${m.g1},${m.g2})`, color:"white",
            fontSize:12, fontWeight:800, display:"flex", alignItems:"center", justifyContent:"center",
            animation:"badgePop 0.25s ease", boxShadow:`0 3px 10px ${m.shadow}`,
          }}>✓</div>
        )}
        <div style={{ fontSize:30, lineHeight:1 }}>{item.emoji}</div>
        <div style={{ fontSize:10, fontWeight:700, marginTop:6, color:item.active?m.text:SOFT, fontFamily:"'Baloo 2'", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", padding:"0 2px" }}>{item.name}</div>
      </div>
      {onRemove && (
        <button onClick={e=>{e.stopPropagation();onRemove();}} style={{ position:"absolute", top:-7, right:-7, width:20, height:20, borderRadius:"50%", background:"#EF4444", color:"white", fontSize:9, border:"2px solid white", cursor:"pointer", zIndex:3, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800, boxShadow:"0 2px 6px rgba(239,68,68,0.4)" }}>✕</button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PANTRY CARD
═══════════════════════════════════════════════════════════════════════ */
function PantryCard({ item, inStock, usageCount, colorIdx, onToggle, onRemove }) {
  const pal = PALS[colorIdx % PALS.length];
  return (
    <div style={{ position:"relative" }}>
      <div onClick={onToggle} className="card" style={{
        background:inStock ? pal.bg : "#F5F3F0",
        borderRadius:20, padding:"14px 6px 11px", textAlign:"center",
        border:`2.5px solid ${inStock ? pal.ring : "#E5DED4"}`,
        filter:inStock ? "none" : "grayscale(1)",
        opacity:inStock ? 1 : 0.42,
        boxShadow:inStock ? `0 4px 16px ${pal.glow}, ${CSHADOW}` : "none",
        transition:"all 0.28s ease",
      }}>
        <div style={{ fontSize:28, lineHeight:1 }}>{item.emoji}</div>
        <div style={{ fontSize:9, fontWeight:700, marginTop:5, color:inStock?DARK:SOFT, fontFamily:"'Baloo 2'", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", padding:"0 2px" }}>{item.name}</div>
        <div style={{ fontSize:8, marginTop:2, fontFamily:"'Baloo 2'", fontWeight:600, color:inStock?pal.ring:SOFT }}>{inStock?"✓ in stock":"out of stock"}</div>
      </div>
      {usageCount > 0 && (
        <div style={{ position:"absolute", top:-8, right:-8, background:inStock?pal.check:"#9CA3AF", color:"white", borderRadius:10, padding:"1px 6px", fontSize:9, fontWeight:800, fontFamily:"'Baloo 2'", boxShadow:"0 2px 6px rgba(0,0,0,0.18)", border:"1.5px solid white" }}>{usageCount}×</div>
      )}
      {onRemove && (
        <button onClick={e=>{e.stopPropagation();onRemove();}} style={{ position:"absolute", top:usageCount>0?10:-7, left:-7, width:20, height:20, borderRadius:"50%", background:"#EF4444", color:"white", fontSize:9, border:"2px solid white", cursor:"pointer", zIndex:3, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:800 }}>✕</button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   KID FOOD CARD  — sticker style
═══════════════════════════════════════════════════════════════════════ */
const ROTS = [2.2, -1.8, 2.8, -2.2, 1.5, -2.8, 1.8, -1.5, 2.5, -2];
function KidFoodCard({ item, isOnPlate, colorIdx, onTap, small }) {
  const pal = PALS[colorIdx % PALS.length];
  const rot = isOnPlate ? 0 : ROTS[colorIdx % ROTS.length];
  const [pressed, setPressed] = useState(false);
  function handleTap() { setPressed(true); setTimeout(()=>setPressed(false),180); onTap(); }
  return (
    <div onClick={handleTap} style={{
      background:"white",
      borderRadius:small?20:24,
      padding:small?"14px 6px 10px":"20px 8px 14px",
      textAlign:"center",
      border:`3.5px solid ${isOnPlate?pal.ring:"rgba(255,255,255,0.5)"}`,
      outline:isOnPlate?`none`:`3.5px solid #F0E8DE`,
      outlineOffset:"-3.5px",
      position:"relative", cursor:"pointer",
      transform:`rotate(${pressed?0:rot}deg) scale(${pressed?0.88:isOnPlate?1.02:1})`,
      transformOrigin:"center center",
      transition:"transform 0.18s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.18s, border-color 0.18s",
      boxShadow:isOnPlate
        ? `0 0 0 3px white, 0 4px 20px ${pal.glow}, 0 8px 32px rgba(0,0,0,0.1)`
        : `0 2px 4px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)`,
      userSelect:"none", WebkitTapHighlightColor:"transparent",
    }}>
      {isOnPlate && (
        <div style={{ position:"absolute", top:-10, right:-10, width:26, height:26, borderRadius:"50%", background:pal.check, color:"white", fontSize:13, fontWeight:900, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 3px 10px ${pal.glow}, 0 0 0 2px white`, animation:"springPop 0.3s cubic-bezier(0.34,1.56,0.64,1)", zIndex:2 }}>✓</div>
      )}
      <div style={{ fontSize:small?34:46, lineHeight:1 }}>{item.emoji}</div>
      <div style={{ fontSize:small?10:12, fontWeight:700, marginTop:small?5:7, color:isOnPlate?DARK:MID, fontFamily:"'Baloo 2'", lineHeight:1.2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", padding:"0 2px" }}>{item.name}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   PLATE VISUAL  — porcelain
═══════════════════════════════════════════════════════════════════════ */
function PlateVisual({ plate, removingIds, onRemove, wiggle, size=230 }) {
  const rim1 = Math.round(size*0.073);
  const rim2 = Math.round(size*0.12);
  const innerSize = Math.round(size*0.72);
  const innerOff = Math.round((size - innerSize)/2);
  return (
    <div style={{ position:"relative", width:size, height:size, flexShrink:0, animation:wiggle?"plateWiggle 0.5s ease":"none" }}>
      {/* Cast shadow */}
      <div style={{ position:"absolute", bottom:-8, left:"50%", transform:"translateX(-50%)", width:size*0.8, height:20, background:"radial-gradient(ellipse, rgba(0,0,0,0.14), transparent)", borderRadius:"50%", filter:"blur(4px)" }} />
      {/* Plate body */}
      <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:"radial-gradient(circle at 34% 28%, #FFFFFF 0%, #EDE6DA 100%)", boxShadow:`0 2px 0 #D9CFC0, 0 8px 32px rgba(0,0,0,0.14), 0 2px 6px rgba(0,0,0,0.08), inset 0 2px 4px rgba(255,255,255,0.9)` }}>
        {/* Rim ring 1 */}
        <div style={{ position:"absolute", top:rim1, left:rim1, right:rim1, bottom:rim1, borderRadius:"50%", border:"1.5px solid rgba(0,0,0,0.07)", pointerEvents:"none" }} />
        {/* Rim ring 2 */}
        <div style={{ position:"absolute", top:rim2, left:rim2, right:rim2, bottom:rim2, borderRadius:"50%", border:"1px solid rgba(0,0,0,0.04)", pointerEvents:"none" }} />
        {/* Inner white surface */}
        <div style={{ position:"absolute", top:innerOff, left:innerOff, width:innerSize, height:innerSize, borderRadius:"50%", background:"white", display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"center", overflow:"hidden", padding:"10%", gap:size>200?6:4 }}>
          {plate.length === 0
            ? <div style={{ opacity:0.18, fontSize:size*0.2, lineHeight:1 }}>🍽️</div>
            : plate.map(item => (
                <div key={item.plateKey} onClick={()=>onRemove&&onRemove(item.plateKey)}
                  style={{ textAlign:"center", cursor:onRemove?"pointer":"default", animation:removingIds?.has(item.plateKey)?"popOut 0.22s ease forwards":"popIn 0.42s cubic-bezier(0.34,1.56,0.64,1) both", padding:"1px" }}>
                  <div style={{ fontSize:size>200?28:22, lineHeight:1 }}>{item.emoji}</div>
                  <div style={{ fontSize:size>200?8:6, fontFamily:"'Baloo 2'", fontWeight:700, color:MID, marginTop:1, maxWidth:size>200?44:32, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.name}</div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   INSIGHTS VIEW
═══════════════════════════════════════════════════════════════════════ */
function InsightsView({ pantry, usage }) {
  const ranked = Object.values(usage).sort((a,b) => b.count - a.count);
  const outNeeded = ranked.filter(u => !pantry[u.item.id]?.inStock && u.count > 0);
  const allOut = Object.values(pantry).filter(x => !x.inStock).sort((a,b) => (usage[b.id]?.count||0) - (usage[a.id]?.count||0));
  const medals = ["🥇","🥈","🥉"];

  if (ranked.length === 0 && allOut.length === 0) return (
    <div style={{ textAlign:"center", padding:"52px 32px" }}>
      <div style={{ fontSize:52, opacity:0.2 }}>📊</div>
      <p style={{ fontFamily:"'Baloo 2'", fontSize:14, fontWeight:600, color:MID, marginTop:16, lineHeight:1.6, maxWidth:260, margin:"16px auto 0" }}>No data yet — use the app at meal time and snack time to start seeing insights!</p>
    </div>
  );

  return (
    <div style={{ padding:"18px 18px 40px" }}>
      {ranked.length > 0 && (
        <div style={{ marginBottom:28 }}>
          <SectionLabel>Most Loved 🏆</SectionLabel>
          {ranked.slice(0,8).map((u,idx) => (
            <div key={u.item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:"white", borderRadius:16, marginBottom:8, boxShadow:CSHADOW, animation:`fadeUp 0.3s ${idx*0.04}s both` }}>
              <span style={{ fontSize:18, width:28, textAlign:"center" }}>{idx<3?medals[idx]:<span style={{ fontFamily:"'Baloo 2'", fontWeight:800, color:SOFT, fontSize:13 }}>{idx+1}.</span>}</span>
              <span style={{ fontSize:26 }}>{u.item.emoji}</span>
              <span style={{ flex:1, fontSize:15, fontWeight:700, color:DARK, fontFamily:"'Baloo 2'" }}>{u.item.name}</span>
              <div style={{ background:BL, borderRadius:50, padding:"3px 12px", fontSize:12, fontWeight:800, color:"#92400E", fontFamily:"'Baloo 2'" }}>{u.count}×</div>
            </div>
          ))}
        </div>
      )}
      {outNeeded.length > 0 && (
        <div style={{ marginBottom:28 }}>
          <SectionLabel>The Kids Want These 🛒</SectionLabel>
          <p style={{ fontSize:12, color:SOFT, fontFamily:"'Baloo 2'", marginBottom:12, fontWeight:600 }}>Out of stock but frequently chosen</p>
          {outNeeded.map((u,idx) => (
            <div key={u.item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", background:"#FFFBEB", border:"1.5px solid #FDE68A", borderRadius:16, marginBottom:8, animation:`fadeUp 0.3s ${idx*0.04}s both` }}>
              <span style={{ fontSize:26, filter:"grayscale(1)", opacity:0.55 }}>{u.item.emoji}</span>
              <span style={{ flex:1, fontSize:15, fontWeight:700, color:MID, fontFamily:"'Baloo 2'" }}>{u.item.name}</span>
              <div style={{ background:"#FEF3C7", borderRadius:50, padding:"3px 12px", fontSize:12, fontWeight:800, color:"#92400E", fontFamily:"'Baloo 2'" }}>chosen {u.count}×</div>
            </div>
          ))}
        </div>
      )}
      {allOut.length > 0 && (
        <div>
          <SectionLabel>Shopping List 📝</SectionLabel>
          <div style={{ background:"white", borderRadius:20, overflow:"hidden", boxShadow:CSHADOW }}>
            {allOut.map((item,idx) => (
              <div key={item.id} style={{ display:"flex", alignItems:"center", gap:14, padding:"14px 18px", borderBottom:idx<allOut.length-1?"1px solid #F5EEE6":"none" }}>
                <span style={{ fontSize:22, filter:"grayscale(0.8)", opacity:0.55 }}>{item.emoji}</span>
                <span style={{ flex:1, fontSize:14, fontWeight:600, color:MID, fontFamily:"'Baloo 2'" }}>{item.name}</span>
                {usage[item.id]?.count>0 && <span style={{ fontSize:11, color:SOFT, fontFamily:"'Baloo 2'", fontWeight:600 }}>×{usage[item.id].count}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   APP
═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [meal, setMeal]                   = useState("dinner");
  const [screen, setScreen]               = useState("home");
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [kids, setKids]                   = useState([]);
  const [cookingOrder, setCookingOrder]   = useState([]);
  const [homeTab, setHomeTab]             = useState("meals");
  const [pantryView, setPantryView]       = useState("snack");
  const [menu, setMenu]                   = useState(makeInitialMenu);
  const [pantry, setPantry]               = useState(makeInitialPantry);
  const [usage, setUsage]                 = useState({});
  const [plate, setPlate]                 = useState([]);
  const [plateRequest, setPlateRequest]   = useState("");
  const [removingIds, setRemovingIds]     = useState(new Set());
  const [wiggle, setWiggle]               = useState(false);
  const [showConfetti, setShowConfetti]   = useState(false);
  const [snackPicks, setSnackPicks]       = useState([]);
  const [snackRemoving, setSnackRemoving] = useState(new Set());
  const [snackWiggle, setSnackWiggle]     = useState(false);
  const [snackDone, setSnackDone]         = useState(false);
  const [templates, setTemplates]         = useState({});
  const [addModal, setAddModal]           = useState(null);
  const [pantryModal, setPantryModal]     = useState(false);
  const [groceryList, setGroceryList]     = useState([]);
  const [groceryInput, setGroceryInput]   = useState("");
  const [copied, setCopied]               = useState(false);
  const [checkingOff, setCheckingOff]     = useState(new Set());
  const [newName, setNewName]             = useState("");
  const [newEmoji, setNewEmoji]           = useState("");
  const [savingTmpl, setSavingTmpl]       = useState(false);
  const [tmplName, setTmplName]           = useState("");
  const [spark, setSpark]                 = useState(false);

  const m          = MEALS[meal];
  const mealMenu   = menu[meal];
  const activeSM   = mealMenu.setMeals.filter(x => x.active);
  const activeIt   = mealMenu.items.filter(x => x.active);
  const isSetUp    = activeSM.length + activeIt.length > 0;
  const savedTmpls = templates[meal] || [];
  const encIdx     = Math.min(plate.length, ENC.length - 1);
  const pantryItems     = Object.values(pantry);
  const pantryMeals     = pantryItems.filter(x => x.section==="meals");
  const pantryExtras    = pantryItems.filter(x => x.section==="extras");
  const inStockItems    = pantryItems.filter(x => x.inStock);
  const inStockCount    = inStockItems.length;
  const outOfStockItems = pantryItems.filter(x => !x.inStock).sort((a,b)=>(usage[b.id]?.count||0)-(usage[a.id]?.count||0));
  const uncheckedManual = groceryList.filter(x => !x.checked).length;
  const groceryBadge    = outOfStockItems.length + uncheckedManual;
  const greet           = timeGreeting();

  function toggleMenuItem(type, id) { setMenu(prev => ({ ...prev, [meal]: { ...prev[meal], [type]: prev[meal][type].map(x => x.id===id?{...x,active:!x.active}:x) } })); }
  function addCustomMenuItem(type) {
    if (!newName.trim()) return;
    const emoji = newEmoji.trim() || (type==="setMeals"?"🍽️":"✨");
    setMenu(prev => ({ ...prev, [meal]: { ...prev[meal], [type]: [...prev[meal][type], { id:`c${Date.now()}`, name:newName.trim(), emoji, active:true, custom:true }] } }));
    setNewName(""); setNewEmoji(""); setAddModal(null);
  }
  function removeCustomMenuItem(type, id) { setMenu(prev => ({ ...prev, [meal]: { ...prev[meal], [type]: prev[meal][type].filter(x => x.id!==id) } })); }
  function togglePantryItem(id) { setPantry(prev => ({ ...prev, [id]: { ...prev[id], inStock:!prev[id].inStock } })); }
  function addCustomPantryItem() {
    if (!newName.trim()) return;
    const id = `cp${Date.now()}`;
    setPantry(prev => ({ ...prev, [id]: { id, name:newName.trim(), emoji:newEmoji.trim()||"✨", inStock:true, section:"extras", custom:true } }));
    setNewName(""); setNewEmoji(""); setPantryModal(false);
  }
  function removeCustomPantryItem(id) { setPantry(prev => { const n={...prev}; delete n[id]; return n; }); }
  function addGroceryItem() {
    const name = groceryInput.trim();
    if (!name) return;
    setGroceryList(prev => [...prev, { id:`g${Date.now()}`, name, checked:false }]);
    setGroceryInput("");
  }
  function toggleGroceryItem(id) { setGroceryList(prev => prev.map(x => x.id===id?{...x,checked:!x.checked}:x)); }
  function removeGroceryItem(id) { setGroceryList(prev => prev.filter(x => x.id!==id)); }
  function clearCheckedGrocery() { setGroceryList(prev => prev.filter(x => !x.checked)); }
  function checkOffPantryItem(itemId) {
    setCheckingOff(prev => new Set([...prev, itemId]));
    setTimeout(() => {
      setPantry(prev => ({ ...prev, [itemId]: { ...prev[itemId], inStock:true } }));
      setCheckingOff(prev => { const n=new Set(prev); n.delete(itemId); return n; });
    }, 500);
  }
  function copyGroceryList() {
    const lines = ["🛒 Grocery List",""];
    if (groceryList.filter(x=>!x.checked).length>0) { lines.push("— My List —"); groceryList.filter(x=>!x.checked).forEach(x=>lines.push(`• ${x.name}`)); lines.push(""); }
    if (outOfStockItems.length>0) { lines.push("— Out of Stock —"); outOfStockItems.forEach(x=>lines.push(`• ${x.emoji} ${x.name}`)); }
    navigator.clipboard?.writeText(lines.join("\n")).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2200);
  }
  function trackUsage(items) {
    setUsage(prev => {
      const next = {...prev};
      for (const item of items) next[item.id] = { count:(next[item.id]?.count||0)+1, item:{id:item.id,name:item.name,emoji:item.emoji} };
      return next;
    });
  }
  function addToPlate(item) {
    if (plate.some(p => p.id===item.id)) return;
    setPlate(prev => [...prev, { ...item, plateKey:Date.now()+Math.random() }]);
    setWiggle(true); setTimeout(()=>setWiggle(false),520);
    setSpark(true); setTimeout(()=>setSpark(false),600);
  }
  function removeFromPlate(plateKey) {
    setRemovingIds(prev => new Set([...prev, plateKey]));
    setTimeout(() => {
      setPlate(prev => prev.filter(p => p.plateKey!==plateKey));
      setRemovingIds(prev => { const n=new Set(prev); n.delete(plateKey); return n; });
    }, 250);
  }
  function togglePlateItem(item) { const on=plate.find(p=>p.id===item.id); if(on)removeFromPlate(on.plateKey); else addToPlate(item); }
  function toggleSnackPick(item) {
    const on = snackPicks.find(p=>p.id===item.id);
    if (on) {
      setSnackRemoving(prev => new Set([...prev, item.id]));
      setTimeout(() => { setSnackPicks(prev=>prev.filter(p=>p.id!==item.id)); setSnackRemoving(prev=>{const n=new Set(prev);n.delete(item.id);return n;}); }, 200);
    } else {
      setSnackPicks(prev=>[...prev,item]); setSnackWiggle(true); setTimeout(()=>setSnackWiggle(false),500);
    }
  }
  function confirmSnack() {
    if (snackPicks.length>0) trackUsage(snackPicks);
    setShowConfetti(true); setSnackDone(true);
    setTimeout(() => { setShowConfetti(false); setSnackDone(false); setSnackPicks([]); }, 2400);
  }
  function handleDone() {
    if (plate.length>0) trackUsage(plate);
    setShowConfetti(true);
    setTimeout(() => { setShowConfetti(false); setScreen("review"); }, 1600);
  }
  function approveAndCook() {
    const idx = cookingOrder.length;
    const label = kids[idx] ? kids[idx] : idx===0 ? "Plate 1" : "Guest";
    setCookingOrder(prev => [...prev, { id:Date.now(), label, request:plateRequest.trim(), items:plate.map(item=>({...item,checked:false})) }]);
    setPlate([]); setPlateRequest(""); setScreen("cooking");
  }
  function toggleCookingItem(plateId, itemId) {
    setCookingOrder(prev => prev.map(p => p.id===plateId ? { ...p, items:p.items.map(x=>x.id===itemId?{...x,checked:!x.checked}:x) } : p));
  }
  function finishCooking() { setCookingOrder([]); setScreen("home"); }
  function saveTemplate() {
    if (!tmplName.trim()) return;
    setTemplates(prev => ({ ...prev, [meal]:[...(prev[meal]||[]),{name:tmplName.trim(),state:JSON.parse(JSON.stringify(mealMenu))}] }));
    setTmplName(""); setSavingTmpl(false);
  }
  function loadTemplate(tmpl) { setMenu(prev => ({ ...prev, [meal]:JSON.parse(JSON.stringify(tmpl.state)) })); }

  /* ── SHARED MODAL ── */
  const AddItemModal = ({ type, onAdd, onClose }) => (
    <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", zIndex:50, display:"flex", alignItems:"flex-end" }}>
      <div style={{ background:CREAM, width:"100%", borderRadius:"28px 28px 0 0", padding:"28px 22px 52px", animation:"slideUp 0.28s ease", boxShadow:"0 -8px 40px rgba(0,0,0,0.15)" }}>
        <h3 style={{ fontSize:20, fontWeight:800, fontFamily:"'Baloo 2'", color:DARK, marginBottom:20 }}>Add {type==="setMeals"?"a Set Meal":"an Item"}</h3>
        <div style={{ display:"flex", gap:10, marginBottom:16 }}>
          <input value={newEmoji} onChange={e=>setNewEmoji(e.target.value)} placeholder="🍽️" maxLength={2} style={{ width:58, padding:"12px", borderRadius:14, border:`2px solid #EDE5DA`, fontSize:24, textAlign:"center", outline:"none", background:"white" }} />
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder={type==="setMeals"?"Meal name…":"Item name…"} onKeyDown={e=>e.key==="Enter"&&onAdd()} autoFocus style={{ flex:1, padding:"12px 16px", borderRadius:14, border:`2px solid #EDE5DA`, fontSize:16, fontFamily:"'Baloo 2'", outline:"none", background:"white" }} />
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={onClose} className="btn" style={{ flex:1, padding:"14px", borderRadius:14, border:`2px solid #EDE5DA`, background:"white", color:MID, fontSize:15, fontFamily:"'Baloo 2'", fontWeight:700 }}>Cancel</button>
          <button onClick={onAdd} className="btn" style={{ flex:2, padding:"14px", borderRadius:14, border:"none", background:`linear-gradient(135deg,${m.g1},${m.g2})`, color:"white", fontSize:15, fontFamily:"'Baloo 2'", fontWeight:700, boxShadow:`0 4px 16px ${m.shadow}` }}>Add to Menu</button>
        </div>
      </div>
    </div>
  );

  /* ── GRADIENT HEADER ── */
  const GradHeader = ({ g1, g2, shadow, children, back }) => (
    <div style={{ background:`linear-gradient(140deg,${g1},${g2})`, padding:"48px 24px 24px", position:"relative", flexShrink:0, boxShadow:`0 4px 24px ${shadow}` }}>
      {back && <button onClick={back} style={{ background:"rgba(255,255,255,0.18)", border:"none", backdropFilter:"blur(8px)", color:"white", fontSize:13, fontFamily:"'Baloo 2'", fontWeight:700, cursor:"pointer", position:"absolute", top:48, left:20, padding:"6px 14px", borderRadius:50 }}>← Back</button>}
      {children}
    </div>
  );

  /* ════════════════════════════════════════════════════════
     ROUTING
  ════════════════════════════════════════════════════════ */
  if (showOnboarding) return <OnboardingOverlay onDone={(names) => { setKids(names); setShowOnboarding(false); }} />;

  /* ── HOME ── */
  if (screen === "home") {
    const MealsTab = (
      <div style={{ flex:1, overflow:"auto", paddingBottom:8 }}>
        {/* Hero header */}
        <div style={{ padding:"44px 24px 20px", textAlign:"center", position:"relative" }}>
          <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 0%, ${BL} 0%, transparent 70%)`, pointerEvents:"none" }} />
          <div style={{ animation:"logoSpring 0.7s cubic-bezier(0.34,1.56,0.64,1)", display:"flex", justifyContent:"center", marginBottom:6, position:"relative" }}>
            <HappyMealsLogo size={52} />
          </div>
          <h1 style={{ fontSize:28, fontWeight:800, fontFamily:"'Baloo 2'", color:DARK, lineHeight:1.1, marginBottom:4, animation:"greetIn 0.4s 0.1s ease both", position:"relative" }}>
            Happy <span style={{ color:B }}>Meals</span>
          </h1>
          <p key={greet.text} style={{ color:MID, fontSize:13, fontFamily:"'Baloo 2'", fontWeight:600, animation:"greetIn 0.5s 0.2s ease both", position:"relative" }}>{greet.emoji} {greet.text}</p>
        </div>

        {/* Active cooking re-entry */}
        {cookingOrder.length > 0 && (
          <div onClick={()=>setScreen("cooking")} className="card"
            style={{ margin:"0 18px 14px", borderRadius:24, background:"linear-gradient(135deg,#16A34A,#0D9488)", padding:"16px 20px", display:"flex", alignItems:"center", gap:14, boxShadow:`0 8px 28px rgba(22,163,74,0.35)`, animation:"fadeUp 0.3s both" }}>
            <div style={{ width:48, height:48, background:"rgba(255,255,255,0.2)", borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, flexShrink:0 }}>🍳</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:15, fontWeight:800, color:"white", fontFamily:"'Baloo 2'" }}>Get Cooking</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.8)", fontFamily:"'Baloo 2'", marginTop:1 }}>{m.label} · {cookingOrder.length} plate{cookingOrder.length!==1?"s":""} waiting · tap to return</div>
            </div>
            <div style={{ color:"rgba(255,255,255,0.7)", fontSize:22 }}>›</div>
          </div>
        )}

        {/* Meal cards */}
        <div style={{ padding:"0 18px", display:"flex", flexDirection:"column", gap:12 }}>
          {Object.entries(MEALS).map(([key,mx],idx) => {
            const count = menu[key].setMeals.filter(x=>x.active).length + menu[key].items.filter(x=>x.active).length;
            return (
              <div key={key} onClick={()=>{setMeal(key);setScreen("mealHub");}} className="card"
                style={{ borderRadius:26, background:`linear-gradient(140deg,${mx.g1},${mx.g2})`, padding:"20px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow:`0 8px 28px ${mx.shadow}, inset 0 1px 0 rgba(255,255,255,0.15)`, animation:`fadeUp 0.4s ${idx*0.08}s both` }}>
                <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                  <div style={{ fontSize:42, filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>{mx.emoji}</div>
                  <div>
                    <div style={{ color:"white", fontSize:20, fontWeight:800, fontFamily:"'Baloo 2'", textShadow:"0 1px 3px rgba(0,0,0,0.15)" }}>{mx.label}</div>
                    <div style={{ color:"rgba(255,255,255,0.78)", fontSize:12, fontFamily:"'Baloo 2'", marginTop:2 }}>{count>0?`${count} items on menu ✓`:"Tap to set up"}</div>
                  </div>
                </div>
                <div style={{ width:32, height:32, borderRadius:50, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:16, fontWeight:700 }}>›</div>
              </div>
            );
          })}
        </div>
        <HintBar icon="👆" text="Tap a meal to get started. Parents set up the menu first, then hand the phone to the kids." />
      </div>
    );

    const PantryTab = (
      <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
        {showConfetti && <Confetti />}
        {/* Pantry header */}
        <div style={{ background:`linear-gradient(140deg,${PT.g1},${PT.g2})`, padding:"44px 22px 18px", flexShrink:0, boxShadow:`0 4px 24px ${PT.shadow}` }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
            <HappyMealsIcon size={36} />
            <div>
              <h1 style={{ color:"white", fontSize:20, fontWeight:800, fontFamily:"'Baloo 2'", lineHeight:1 }}>The Pantry</h1>
              <p style={{ color:"rgba(255,255,255,0.78)", fontSize:12, marginTop:3, fontFamily:"'Baloo 2'" }}>{inStockCount} item{inStockCount!==1?"s":""} in stock</p>
            </div>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {[{id:"snack",label:"🍿 Available"},{id:"stock",label:"Stock"},{id:"grocery",label:groceryBadge>0?`🛒 List (${groceryBadge})`:"🛒 List"},{id:"insights",label:"Insights"}].map(t => (
              <button key={t.id} onClick={()=>setPantryView(t.id)} className="tab"
                style={{ padding:"6px 14px", borderRadius:50, fontSize:12, fontWeight:700, fontFamily:"'Baloo 2'", background:pantryView===t.id?"white":"rgba(255,255,255,0.15)", color:pantryView===t.id?PT.text:"rgba(255,255,255,0.88)", border:pantryView===t.id?"none":"1.5px solid rgba(255,255,255,0.25)", whiteSpace:"nowrap", backdropFilter:"blur(4px)" }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* SNACK TAB */}
        {pantryView==="snack" && (
          <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            {snackDone ? (
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 30px" }}>
                <div style={{ fontSize:80, animation:"springPop 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>{snackPicks[0]?.emoji||"🎉"}</div>
                <h2 style={{ fontSize:28, fontWeight:800, color:DARK, fontFamily:"'Baloo 2'", marginTop:20, textAlign:"center" }}>Enjoy your snack!</h2>
                <p style={{ fontSize:15, color:MID, fontFamily:"'Baloo 2'", marginTop:8, textAlign:"center" }}>{snackPicks.map(x=>x.name).join(", ")}</p>
              </div>
            ) : inStockItems.length===0 ? (
              <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 30px", textAlign:"center" }}>
                <div style={{ fontSize:60, opacity:0.18 }}>🏠</div>
                <p style={{ fontFamily:"'Baloo 2'", fontSize:16, fontWeight:800, color:MID, marginTop:16 }}>Nothing in stock!</p>
                <p style={{ fontFamily:"'Baloo 2'", fontSize:13, color:SOFT, marginTop:6 }}>Switch to Stock to mark items available</p>
              </div>
            ) : (
              <>
                <HintBar icon="🍿" text="Everything in the house right now. Kids tap what they want, then hit the button below." />
                {snackPicks.length>0 && (
                  <div style={{ margin:"10px 16px 0", padding:"11px 16px", background:"white", borderRadius:18, boxShadow:CSHADOW, display:"flex", alignItems:"center", gap:8, flexShrink:0, animation:"fadeUp 0.25s ease" }}>
                    <div style={{ display:"flex", gap:4, flexWrap:"wrap", flex:1 }}>{snackPicks.map(item=><span key={item.id} style={{ fontSize:22, animation:snackRemoving.has(item.id)?"popOut 0.2s ease forwards":"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both" }}>{item.emoji}</span>)}</div>
                    <span style={{ fontSize:12, color:MID, fontFamily:"'Baloo 2'", fontWeight:600, flexShrink:0 }}>{snackPicks.length} picked</span>
                  </div>
                )}
                <div style={{ flex:1, overflow:"auto", padding:"10px 16px 6px" }}>
                  <p style={{ fontSize:12, fontWeight:700, color:MID, fontFamily:"'Baloo 2'", marginBottom:10 }}>{snackPicks.length===0?"What sounds good? 👇":"Anything else?"}</p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, paddingBottom:16 }}>
                    {inStockItems.map((item,idx) => <KidFoodCard key={item.id} item={item} isOnPlate={snackPicks.some(p=>p.id===item.id)} colorIdx={idx} onTap={()=>toggleSnackPick(item)} />)}
                  </div>
                </div>
                <div style={{ padding:"8px 16px 24px", flexShrink:0 }}>
                  <button onClick={confirmSnack} className="btn" style={{ width:"100%", padding:"18px", border:"none", borderRadius:22, background:`linear-gradient(135deg,${PT.g1},${PT.g2})`, color:"white", fontSize:18, fontWeight:800, fontFamily:"'Baloo 2'", cursor:"pointer", boxShadow:`0 6px 24px ${PT.shadow}`, animation:snackPicks.length>0?"pulse 2.2s ease-in-out infinite":"none" }}>
                    {snackPicks.length===0?"Just Browsing 👀":"That's my snack! ✓"}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STOCK TAB */}
        {pantryView==="stock" && (
          <div style={{ flex:1, overflow:"auto", padding:"18px 18px 32px" }}>
            <HintBar icon="🟢" text="Tap any item to mark it in or out of stock. Colorful = in the house. Gray = need to buy. Badge shows how often kids pick it." />
            <div style={{ marginTop:16 }} />
            <SectionLabel>Meals</SectionLabel>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:22 }}>
              {pantryMeals.map((item,idx)=><PantryCard key={item.id} item={item} inStock={item.inStock} usageCount={usage[item.id]?.count||0} colorIdx={idx} onToggle={()=>togglePantryItem(item.id)} onRemove={item.custom?()=>removeCustomPantryItem(item.id):null}/>)}
            </div>
            <SectionLabel>Snacks &amp; Extras</SectionLabel>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:18 }}>
              {pantryExtras.map((item,idx)=><PantryCard key={item.id} item={item} inStock={item.inStock} usageCount={usage[item.id]?.count||0} colorIdx={pantryMeals.length+idx} onToggle={()=>togglePantryItem(item.id)} onRemove={item.custom?()=>removeCustomPantryItem(item.id):null}/>)}
              <div onClick={()=>{setPantryModal(true);setNewName("");setNewEmoji("");}} className="card" style={{ background:"white", borderRadius:20, padding:"14px 6px 12px", textAlign:"center", border:"2.5px dashed #D6CFC4", boxShadow:CSHADOW }}>
                <div style={{ fontSize:24, color:SOFT }}>＋</div>
                <div style={{ fontSize:9, color:SOFT, fontFamily:"'Baloo 2'", fontWeight:700, marginTop:4 }}>Add Item</div>
              </div>
            </div>
            <p style={{ fontSize:11, color:SOFT, fontFamily:"'Baloo 2'", fontWeight:600, textAlign:"center", marginTop:8 }}>Tap any item to toggle · badge = times chosen</p>
          </div>
        )}

        {/* GROCERY TAB */}
        {pantryView==="grocery" && (
          <div style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            <HintBar icon="🛒" text="Type anything you need and hit +. Out-of-stock items appear automatically — check them off when bought and they restock in your pantry." />
            <div style={{ padding:"12px 16px 0", flexShrink:0 }}>
              <div style={{ display:"flex", gap:8 }}>
                <input value={groceryInput} onChange={e=>setGroceryInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addGroceryItem()} placeholder="Add an item…" style={{ flex:1, padding:"13px 16px", borderRadius:16, border:`2px solid #EDE5DA`, fontSize:15, fontFamily:"'Baloo 2'", outline:"none", background:"white", boxShadow:CSHADOW }} />
                <button onClick={addGroceryItem} className="btn" style={{ padding:"13px 18px", borderRadius:16, border:"none", background:`linear-gradient(135deg,${PT.g1},${PT.g2})`, color:"white", fontSize:20, cursor:"pointer", flexShrink:0, boxShadow:`0 4px 14px ${PT.shadow}` }}>＋</button>
              </div>
            </div>
            {(groceryBadge>0||groceryList.some(x=>x.checked)) && (
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 18px 0", flexShrink:0 }}>
                <button onClick={copyGroceryList} className="btn" style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"'Baloo 2'", color:copied?PT.g1:MID, display:"flex", alignItems:"center", gap:4 }}>{copied?"✓ Copied!":"📋 Copy list"}</button>
                {groceryList.some(x=>x.checked) && <button onClick={clearCheckedGrocery} className="btn" style={{ background:"none", border:"none", cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"'Baloo 2'", color:"#EF4444" }}>Clear done</button>}
              </div>
            )}
            <div style={{ flex:1, overflow:"auto", padding:"12px 16px 32px" }}>
              {groceryList.length>0 && (
                <div style={{ marginBottom:24 }}>
                  <SectionLabel>My List</SectionLabel>
                  <div style={{ background:"white", borderRadius:20, overflow:"hidden", boxShadow:CSHADOW }}>
                    {groceryList.map((item,idx)=>(
                      <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom:idx<groceryList.length-1?"1px solid #F5EEE6":"none", opacity:item.checked?0.45:1, transition:"opacity 0.2s" }}>
                        <div onClick={()=>toggleGroceryItem(item.id)} style={{ width:24, height:24, borderRadius:8, flexShrink:0, border:item.checked?"none":`2px solid #D6CFC4`, background:item.checked?PT.g1:"white", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all 0.2s", boxShadow:item.checked?`0 2px 8px ${PT.shadow}`:"none" }}>
                          {item.checked&&<span style={{ color:"white", fontSize:14, fontWeight:900 }}>✓</span>}
                        </div>
                        <span style={{ flex:1, fontSize:15, fontWeight:600, fontFamily:"'Baloo 2'", color:DARK, textDecoration:item.checked?"line-through":"none", transition:"text-decoration 0.2s" }}>{item.name}</span>
                        <button onClick={()=>removeGroceryItem(item.id)} style={{ background:"none", border:"none", cursor:"pointer", color:SOFT, fontSize:16, padding:"2px 4px", flexShrink:0 }}>✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {outOfStockItems.length>0 && (
                <div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:10 }}>
                    <SectionLabel>Out of Stock</SectionLabel>
                    <span style={{ fontSize:11, color:SOFT, fontFamily:"'Baloo 2'", fontWeight:600 }}>tap to restock ✓</span>
                  </div>
                  <div style={{ background:"white", borderRadius:20, overflow:"hidden", boxShadow:CSHADOW }}>
                    {outOfStockItems.map((item,idx)=>{
                      const isChecking=checkingOff.has(item.id), count=usage[item.id]?.count||0;
                      return (
                        <div key={item.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom:idx<outOfStockItems.length-1?"1px solid #F5EEE6":"none", opacity:isChecking?0.3:1, transition:"opacity 0.4s", background:isChecking?PT.light:"white" }}>
                          <div onClick={()=>!isChecking&&checkOffPantryItem(item.id)} style={{ width:24, height:24, borderRadius:8, flexShrink:0, border:isChecking?"none":`2px solid #D6CFC4`, background:isChecking?PT.g1:"white", display:"flex", alignItems:"center", justifyContent:"center", cursor:isChecking?"default":"pointer", transition:"all 0.25s" }}>
                            {isChecking&&<span style={{ color:"white", fontSize:14, fontWeight:900, animation:"badgePop 0.2s ease" }}>✓</span>}
                          </div>
                          <span style={{ fontSize:22, filter:"grayscale(0.5)", opacity:0.7 }}>{item.emoji}</span>
                          <span style={{ flex:1, fontSize:15, fontWeight:600, fontFamily:"'Baloo 2'", color:MID }}>{item.name}</span>
                          {count>0&&<span style={{ fontSize:11, fontFamily:"'Baloo 2'", fontWeight:700, color:"white", background:SOFT, borderRadius:50, padding:"2px 8px", flexShrink:0 }}>{count}×</span>}
                        </div>
                      );
                    })}
                  </div>
                  <p style={{ fontSize:11, color:SOFT, fontFamily:"'Baloo 2'", textAlign:"center", marginTop:10, fontWeight:600 }}>Sorted by how often the kids pick them</p>
                </div>
              )}
              {groceryBadge===0&&groceryList.length===0 && (
                <div style={{ textAlign:"center", padding:"40px 20px" }}>
                  <div style={{ fontSize:52, animation:"float 3s ease-in-out infinite" }}>🛒</div>
                  <p style={{ fontFamily:"'Baloo 2'", fontSize:16, fontWeight:800, color:DARK, marginTop:14 }}>Nothing needed!</p>
                  <p style={{ fontFamily:"'Baloo 2'", fontSize:13, color:SOFT, marginTop:6 }}>All stocked up. Add items above or mark things out of stock in the Stock tab.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* INSIGHTS TAB */}
        {pantryView==="insights" && (
          <div style={{ flex:1, overflow:"auto" }}>
            <HintBar icon="📊" text="See what your kids pick most, which out-of-stock items they love, and a full shopping list — all built from real usage." />
            <InsightsView pantry={pantry} usage={usage} />
          </div>
        )}

        {/* Pantry add modal */}
        {pantryModal && (
          <div style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.5)", zIndex:50, display:"flex", alignItems:"flex-end" }}>
            <div style={{ background:CREAM, width:"100%", borderRadius:"28px 28px 0 0", padding:"28px 22px 52px", animation:"slideUp 0.28s ease", boxShadow:"0 -8px 40px rgba(0,0,0,0.15)" }}>
              <h3 style={{ fontSize:20, fontWeight:800, fontFamily:"'Baloo 2'", color:DARK, marginBottom:20 }}>Add to Pantry</h3>
              <div style={{ display:"flex", gap:10, marginBottom:16 }}>
                <input value={newEmoji} onChange={e=>setNewEmoji(e.target.value)} placeholder="🍽️" maxLength={2} style={{ width:58, padding:"12px", borderRadius:14, border:`2px solid #EDE5DA`, fontSize:24, textAlign:"center", outline:"none", background:"white" }} />
                <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Item name…" onKeyDown={e=>e.key==="Enter"&&addCustomPantryItem()} autoFocus style={{ flex:1, padding:"12px 16px", borderRadius:14, border:`2px solid #EDE5DA`, fontSize:16, fontFamily:"'Baloo 2'", outline:"none", background:"white" }} />
              </div>
              <div style={{ display:"flex", gap:10 }}>
                <button onClick={()=>setPantryModal(false)} className="btn" style={{ flex:1, padding:"14px", borderRadius:14, border:`2px solid #EDE5DA`, background:"white", color:MID, fontSize:15, fontFamily:"'Baloo 2'", fontWeight:700, cursor:"pointer" }}>Cancel</button>
                <button onClick={addCustomPantryItem} className="btn" style={{ flex:2, padding:"14px", borderRadius:14, border:"none", background:`linear-gradient(135deg,${PT.g1},${PT.g2})`, color:"white", fontSize:15, fontFamily:"'Baloo 2'", fontWeight:700, cursor:"pointer" }}>Add to Pantry</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    return (
      <div style={shell}>
        <style>{CSS}</style>
        {homeTab==="meals" ? MealsTab : PantryTab}
        <BottomTabNav activeTab={homeTab} onChange={setHomeTab} />
      </div>
    );
  }

  /* ── MEAL HUB ── */
  if (screen==="mealHub") return (
    <div style={shell}>
      <style>{CSS}</style>
      <GradHeader g1={m.g1} g2={m.g2} shadow={m.shadow} back={()=>setScreen("home")}>
        <div style={{ textAlign:"center", paddingTop:8 }}>
          <div style={{ fontSize:52, filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}>{m.emoji}</div>
          <h1 style={{ color:"white", fontSize:28, fontWeight:800, fontFamily:"'Baloo 2'", marginTop:8, textShadow:"0 2px 6px rgba(0,0,0,0.15)" }}>{m.label}</h1>
        </div>
      </GradHeader>
      <div style={{ flex:1, overflow:"auto", padding:"20px 18px 40px", display:"flex", flexDirection:"column", gap:12 }}>
        <HintBar icon="👨‍👩‍👧" text="Parent: tap Setup to choose tonight's menu. Once done, tap Kid's Turn and hand them the phone." />
        {[
          { label:"Parent Setup", sub:isSetUp?`${activeSM.length+activeIt.length} items on tonight's menu`:"Set up what's available tonight", icon:"👨‍👩‍👧", bg:m.light, fg:DARK, click:()=>setScreen("parentSetup"), active:false },
          { label:"Kid's Turn!", sub:isSetUp?"Build your plate 🎉":"Set up the menu first", icon:"⭐", bg:isSetUp?`linear-gradient(135deg,${m.g1},${m.g2})`:"#F0EDE8", fg:isSetUp?"white":SOFT, click:isSetUp?()=>{setPlate([]);setScreen("kidPlate");}:null, active:isSetUp },
        ].map((card,i) => (
          <div key={i} onClick={card.click||undefined} className={card.click?"card":""} style={{ borderRadius:24, padding:"20px 22px", background:card.bg, display:"flex", alignItems:"center", gap:16, boxShadow:card.active?`0 8px 28px ${m.shadow}, inset 0 1px 0 rgba(255,255,255,0.2)`:CSHADOW, opacity:!card.click&&i>0?0.55:1, cursor:card.click?"pointer":"default", animation:`fadeUp 0.3s ${i*0.08}s both` }}>
            <div style={{ width:54, height:54, background:"rgba(255,255,255,0.22)", borderRadius:18, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, flexShrink:0 }}>{card.icon}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:17, fontWeight:800, color:card.fg, fontFamily:"'Baloo 2'" }}>{card.label}</div>
              <div style={{ fontSize:13, color:card.active?"rgba(255,255,255,0.78)":SOFT, fontFamily:"'Baloo 2'", marginTop:2 }}>{card.sub}</div>
            </div>
            {card.click && <div style={{ width:30, height:30, borderRadius:50, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", color:card.active?"white":SOFT, fontSize:16 }}>›</div>}
          </div>
        ))}
      </div>
    </div>
  );

  /* ── PARENT SETUP ── */
  if (screen==="parentSetup") return (
    <div style={shell}>
      <style>{CSS}</style>
      <GradHeader g1={m.g1} g2={m.g2} shadow={m.shadow} back={()=>setScreen("mealHub")}>
        <div style={{ textAlign:"center", paddingTop:8 }}>
          <h1 style={{ color:"white", fontSize:22, fontWeight:800, fontFamily:"'Baloo 2'" }}>{m.label} Menu</h1>
          <p style={{ color:"rgba(255,255,255,0.78)", fontSize:13, marginTop:3, fontFamily:"'Baloo 2'" }}>Toggle what's on tonight</p>
        </div>
      </GradHeader>
      <div style={{ flex:1, overflow:"auto", padding:"18px 18px 24px" }}>
        <HintBar icon="✅" text="Tap each item to turn it on. Colored border = on the menu tonight. Tap + to add something new. Save Menu to reuse next time." />
        <div style={{ marginTop:16 }} />
        {savedTmpls.length>0 && (
          <div style={{ marginBottom:20 }}>
            <SectionLabel>Saved Menus</SectionLabel>
            <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
              {savedTmpls.map((t,i) => <button key={i} onClick={()=>loadTemplate(t)} className="btn" style={{ background:m.light, border:`2px solid ${m.g1}`, borderRadius:50, padding:"6px 16px", fontSize:13, fontWeight:700, color:m.text, fontFamily:"'Baloo 2'", cursor:"pointer", boxShadow:`0 2px 8px ${m.shadow}` }}>{t.name}</button>)}
            </div>
          </div>
        )}
        <SectionLabel>Set Meals</SectionLabel>
        <p style={{ fontSize:12, color:SOFT, fontFamily:"'Baloo 2'", fontWeight:600, marginBottom:12 }}>Full dishes — one choice covers the whole meal</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:22 }}>
          {mealMenu.setMeals.map(item=><ToggleCard key={item.id} item={item} m={m} onToggle={()=>toggleMenuItem("setMeals",item.id)} onRemove={item.custom?()=>removeCustomMenuItem("setMeals",item.id):null}/>)}
          <div onClick={()=>{setAddModal("setMeals");setNewName("");setNewEmoji("");}} className="card" style={{ background:"white", borderRadius:20, padding:"16px 6px 13px", textAlign:"center", border:"2.5px dashed #D6CFC4", boxShadow:CSHADOW }}>
            <div style={{ fontSize:24, color:SOFT }}>＋</div>
            <div style={{ fontSize:10, color:SOFT, fontFamily:"'Baloo 2'", fontWeight:700, marginTop:4 }}>Add</div>
          </div>
        </div>
        <SectionLabel>Sides &amp; Extras</SectionLabel>
        <p style={{ fontSize:12, color:SOFT, fontFamily:"'Baloo 2'", fontWeight:600, marginBottom:12 }}>Mix-and-match items kids can add to their plate</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:24 }}>
          {mealMenu.items.map(item=><ToggleCard key={item.id} item={item} m={m} onToggle={()=>toggleMenuItem("items",item.id)} onRemove={item.custom?()=>removeCustomMenuItem("items",item.id):null}/>)}
          <div onClick={()=>{setAddModal("items");setNewName("");setNewEmoji("");}} className="card" style={{ background:"white", borderRadius:20, padding:"16px 6px 13px", textAlign:"center", border:"2.5px dashed #D6CFC4", boxShadow:CSHADOW }}>
            <div style={{ fontSize:24, color:SOFT }}>＋</div>
            <div style={{ fontSize:10, color:SOFT, fontFamily:"'Baloo 2'", fontWeight:700, marginTop:4 }}>Add</div>
          </div>
        </div>
      </div>
      <div style={{ padding:"12px 18px 32px", background:CREAM, borderTop:"1px solid #EDE5DA" }}>
        {savingTmpl ? (
          <div style={{ display:"flex", gap:10 }}>
            <input value={tmplName} onChange={e=>setTmplName(e.target.value)} placeholder="Name this menu…" onKeyDown={e=>e.key==="Enter"&&saveTemplate()} autoFocus style={{ flex:1, padding:"14px 16px", borderRadius:16, border:`2px solid ${m.g1}`, fontSize:14, fontFamily:"'Baloo 2'", outline:"none", background:"white" }} />
            <button onClick={saveTemplate} className="btn" style={{ padding:"14px 18px", borderRadius:16, border:"none", background:`linear-gradient(135deg,${m.g1},${m.g2})`, color:"white", fontSize:14, fontWeight:700, fontFamily:"'Baloo 2'", cursor:"pointer" }}>Save</button>
            <button onClick={()=>setSavingTmpl(false)} className="btn" style={{ padding:"14px", borderRadius:16, border:`2px solid #EDE5DA`, background:"white", color:MID, fontSize:14, cursor:"pointer" }}>✕</button>
          </div>
        ) : (
          <div style={{ display:"flex", gap:10 }}>
            <button onClick={()=>setSavingTmpl(true)} className="btn" style={{ flex:1, padding:"14px", borderRadius:16, border:`2px solid ${m.g1}`, background:"white", color:m.text, fontSize:14, fontWeight:700, fontFamily:"'Baloo 2'", cursor:"pointer" }}>💾 Save Menu</button>
            <button onClick={()=>setScreen("mealHub")} className="btn" style={{ flex:2, padding:"14px", borderRadius:16, border:"none", background:`linear-gradient(135deg,${m.g1},${m.g2})`, color:"white", fontSize:14, fontWeight:700, fontFamily:"'Baloo 2'", cursor:"pointer", boxShadow:`0 4px 18px ${m.shadow}` }}>Done ✓</button>
          </div>
        )}
      </div>
      {addModal && <AddItemModal type={addModal} onAdd={()=>addCustomMenuItem(addModal)} onClose={()=>setAddModal(null)} />}
    </div>
  );

  /* ── KID PLATE ── */
  if (screen==="kidPlate") {
    const kidName = kids[cookingOrder.length];
    return (
      <div style={{ ...shell, background:`linear-gradient(180deg,${m.g1}18 0%,${m.g2}10 40%,${CREAM} 75%)` }}>
        <style>{CSS}</style>
        {showConfetti && <Confetti />}
        <div style={{ padding:"44px 22px 6px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <button onClick={()=>setScreen("mealHub")} style={{ background:"rgba(0,0,0,0.06)", backdropFilter:"blur(8px)", border:"none", fontSize:13, fontFamily:"'Baloo 2'", fontWeight:700, color:MID, cursor:"pointer", padding:"7px 14px", borderRadius:50 }}>← Back</button>
          <div style={{ fontSize:14, fontWeight:800, fontFamily:"'Baloo 2'", background:`linear-gradient(135deg,${m.g1},${m.g2})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {kidName ? `${kidName}'s Plate 🍽️` : `${m.emoji} ${m.label}`}
          </div>
          <div style={{ width:70 }} />
        </div>

        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", padding:"4px 0 6px", flexShrink:0, position:"relative" }}>
          {plate.length===0 && (
            <p style={{ fontSize:11, fontFamily:"'Baloo 2'", fontWeight:700, color:SOFT, marginBottom:6, textAlign:"center" }}>👇 Tap food below · 👆 Tap plate to remove</p>
          )}
          {/* Star burst on add */}
          {spark && (
            <div style={{ position:"absolute", width:100, height:100, borderRadius:"50%", background:`radial-gradient(circle, ${m.g1}66, transparent 70%)`, animation:"starBurst 0.55s ease-out forwards", pointerEvents:"none", zIndex:10 }} />
          )}
          <PlateVisual plate={plate} removingIds={removingIds} onRemove={removeFromPlate} wiggle={wiggle} size={224} />
          <div style={{ marginTop:10, textAlign:"center", minHeight:38, padding:"0 24px" }}>
            <div key={plate.length} style={{ animation:"fadeUp 0.3s ease", fontSize:15, fontWeight:800, color:DARK, fontFamily:"'Baloo 2'" }}>{ENC[encIdx].msg}</div>
            {ENC[encIdx].sub
              ? <div style={{ fontSize:12, color:MID, fontFamily:"'Baloo 2'", marginTop:1 }}>{ENC[encIdx].sub}</div>
              : plate.length>0&&<div style={{ fontSize:11, color:SOFT, fontFamily:"'Baloo 2'", marginTop:1 }}>tap plate items to remove</div>
            }
          </div>
        </div>

        <div style={{ flex:1, overflow:"auto", padding:"2px 16px 6px" }}>
          {activeSM.length>0 && (
            <>
              <SectionLabel>Set Meals</SectionLabel>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
                {activeSM.map((item,idx)=><KidFoodCard key={item.id} item={item} isOnPlate={plate.some(p=>p.id===item.id)} colorIdx={idx} onTap={()=>togglePlateItem(item)}/>)}
              </div>
            </>
          )}
          {activeIt.length>0 && (
            <>
              <SectionLabel>Sides &amp; Extras</SectionLabel>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:16 }}>
                {activeIt.map((item,idx)=><KidFoodCard key={item.id} item={item} small isOnPlate={plate.some(p=>p.id===item.id)} colorIdx={activeSM.length+idx} onTap={()=>togglePlateItem(item)}/>)}
              </div>
            </>
          )}
        </div>

        <div style={{ padding:"8px 16px 32px", flexShrink:0 }}>
          <button onClick={handleDone} className="btn" style={{ width:"100%", padding:"20px", border:"none", borderRadius:24, background:`linear-gradient(135deg,${m.g1},${m.g2})`, color:"white", fontSize:20, fontWeight:800, fontFamily:"'Baloo 2'", cursor:"pointer", boxShadow:`0 8px 32px ${m.shadow}`, animation:plate.length>0?"pulse 2.2s ease-in-out infinite":"none" }}>
            I'm Done! 🎉
          </button>
        </div>
      </div>
    );
  }

  /* ── REVIEW ── */
  if (screen==="review") return (
    <div style={shell}>
      <style>{CSS}</style>
      <GradHeader g1={m.g1} g2={m.g2} shadow={m.shadow}>
        <div style={{ textAlign:"center", paddingTop:4 }}>
          <div style={{ fontSize:42, animation:"bounceIn 0.5s ease" }}>👀</div>
          <h1 style={{ color:"white", fontSize:26, fontWeight:800, fontFamily:"'Baloo 2'", marginTop:6, textShadow:"0 2px 6px rgba(0,0,0,0.15)" }}>
            {kids[cookingOrder.length]?`${kids[cookingOrder.length]}'s Plate`:"Here's the Plate!"}
          </h1>
          <p style={{ color:"rgba(255,255,255,0.78)", fontSize:14, marginTop:4, fontFamily:"'Baloo 2'" }}>{m.label} · {plate.length} item{plate.length!==1?"s":""}</p>
        </div>
      </GradHeader>
      <div style={{ flex:1, overflow:"auto", padding:"20px 20px 100px" }}>
        <HintBar icon="👀" text="Parent: look over the plate. Tap Looks Good to approve, or Edit to send back for changes." />
        <div style={{ display:"flex", justifyContent:"center", margin:"20px 0 24px" }}>
          <PlateVisual plate={plate} size={210} />
        </div>
        {plate.length>0 ? (
          <div style={{ background:"white", borderRadius:22, overflow:"hidden", boxShadow:CSHADOW }}>
            {plate.map((item,idx)=>(
              <div key={item.plateKey} style={{ display:"flex", alignItems:"center", gap:16, padding:"16px 20px", borderBottom:idx<plate.length-1?"1px solid #F5EEE6":"none", animation:`fadeUp 0.3s ${idx*0.05}s both` }}>
                <span style={{ fontSize:30 }}>{item.emoji}</span>
                <span style={{ fontSize:17, fontWeight:700, color:DARK, fontFamily:"'Baloo 2'" }}>{item.name}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div style={{ fontSize:36, opacity:0.2 }}>🍽️</div>
            <p style={{ color:SOFT, fontFamily:"'Baloo 2'", fontSize:14, marginTop:8 }}>Nothing on the plate</p>
          </div>
        )}
      </div>
      <div style={{ position:"sticky", bottom:0, padding:"12px 18px 32px", background:CREAM, borderTop:"1px solid #EDE5DA" }}>
        <div style={{ display:"flex", gap:10 }}>
          <button onClick={()=>setScreen("kidPlate")} className="btn" style={{ flex:1, padding:"16px", borderRadius:18, border:`2px solid #EDE5DA`, background:"white", color:MID, fontSize:14, fontWeight:700, fontFamily:"'Baloo 2'", cursor:"pointer", boxShadow:CSHADOW }}>← Edit</button>
          <button onClick={approveAndCook} className="btn" style={{ flex:2, padding:"16px", borderRadius:18, border:"none", background:`linear-gradient(135deg,${m.g1},${m.g2})`, color:"white", fontSize:14, fontWeight:700, fontFamily:"'Baloo 2'", cursor:"pointer", boxShadow:`0 4px 20px ${m.shadow}` }}>Looks Good! ✅</button>
        </div>
      </div>
    </div>
  );

  /* ── GET COOKING ── */
  if (screen==="cooking") {
    const allDone = cookingOrder.length>0 && cookingOrder.every(p=>p.items.every(x=>x.checked));
    return (
      <div style={shell}>
        <style>{CSS}</style>
        {allDone && <Confetti />}
        <GradHeader g1={m.g1} g2={m.g2} shadow={m.shadow} back={()=>setScreen("home")}>
          <div style={{ textAlign:"center", paddingTop:4 }}>
            <div style={{ fontSize:36 }}>🍳</div>
            <h1 style={{ color:"white", fontSize:24, fontWeight:800, fontFamily:"'Baloo 2'", marginTop:4, textShadow:"0 2px 6px rgba(0,0,0,0.15)" }}>Get Cooking!</h1>
            <p style={{ color:"rgba(255,255,255,0.78)", fontSize:13, marginTop:3, fontFamily:"'Baloo 2'" }}>{m.label} · {cookingOrder.length} plate{cookingOrder.length!==1?"s":""}</p>
          </div>
        </GradHeader>
        <div style={{ flex:1, overflow:"auto", padding:"16px 16px 120px" }}>
          <HintBar icon="☑️" text="Check off each item as you serve it. Plate turns green when complete. Tap + Add Plate for another kid." />
          <div style={{ marginTop:16, display:"flex", flexDirection:"column", gap:14 }}>
            {cookingOrder.map(ticket => {
              const plateDone = ticket.items.every(x=>x.checked);
              return (
                <div key={ticket.id} style={{ background:"white", borderRadius:24, overflow:"hidden", boxShadow:plateDone?`0 4px 20px rgba(22,163,74,0.2), 0 1px 4px rgba(0,0,0,0.04)`:CSHADOW, border:plateDone?"2.5px solid #86EFAC":"2.5px solid transparent", transition:"all 0.35s ease" }}>
                  <div style={{ padding:"14px 18px", background:plateDone?`linear-gradient(135deg,#16A34A,#0D9488)`:m.light, display:"flex", alignItems:"center", justifyContent:"space-between", transition:"background 0.4s ease" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:20 }}>{plateDone?"✅":"🍽️"}</span>
                      <span style={{ fontSize:16, fontWeight:800, fontFamily:"'Baloo 2'", color:plateDone?"white":m.text }}>{ticket.label}</span>
                      {ticket.request&&<span style={{ fontSize:11, background:"rgba(255,255,255,0.28)", color:plateDone?"white":m.text, borderRadius:50, padding:"2px 8px", fontFamily:"'Baloo 2'", fontWeight:600 }}>{ticket.request}</span>}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      {plateDone && <div style={{ fontSize:13, fontWeight:800, color:"white", fontFamily:"'Baloo 2'", animation:"stampDrop 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>DONE!</div>}
                      <span style={{ fontSize:12, fontFamily:"'Baloo 2'", fontWeight:700, color:plateDone?"rgba(255,255,255,0.85)":SOFT }}>{ticket.items.filter(x=>x.checked).length}/{ticket.items.length}</span>
                    </div>
                  </div>
                  {ticket.items.map((item,idx)=>(
                    <div key={item.id} onClick={()=>toggleCookingItem(ticket.id,item.id)} style={{ display:"flex", alignItems:"center", gap:14, padding:"13px 18px", borderTop:"1px solid #F5EEE6", cursor:"pointer", background:item.checked?"#F0FDF4":"white", transition:"background 0.2s" }}>
                      <div style={{ width:26, height:26, borderRadius:9, flexShrink:0, border:item.checked?"none":`2.5px solid #D6CFC4`, background:item.checked?"#16A34A":"white", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", boxShadow:item.checked?"0 2px 8px rgba(22,163,74,0.35)":"none" }}>
                        {item.checked&&<span style={{ color:"white", fontSize:14, fontWeight:900, animation:"badgePop 0.2s ease" }}>✓</span>}
                      </div>
                      <span style={{ fontSize:24, opacity:item.checked?0.45:1, transition:"opacity 0.2s" }}>{item.emoji}</span>
                      <span style={{ flex:1, fontSize:15, fontWeight:600, fontFamily:"'Baloo 2'", color:item.checked?SOFT:DARK, textDecoration:item.checked?"line-through":"none", transition:"all 0.2s" }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ position:"sticky", bottom:0, padding:"12px 16px 32px", background:CREAM, borderTop:"1px solid #EDE5DA" }}>
          {allDone ? (
            <div key="done" style={{ animation:"bounceIn 0.4s ease" }}>
              <p style={{ textAlign:"center", fontSize:14, fontWeight:700, color:"#16A34A", fontFamily:"'Baloo 2'", marginBottom:10 }}>Every plate is ready! 🎉</p>
              <button onClick={finishCooking} className="btn" style={{ width:"100%", padding:"18px", border:"none", borderRadius:22, background:"linear-gradient(135deg,#16A34A,#0D9488)", color:"white", fontSize:18, fontWeight:800, fontFamily:"'Baloo 2'", cursor:"pointer", boxShadow:"0 6px 24px rgba(22,163,74,0.4)" }}>Dinner's Ready! 🍽️</button>
            </div>
          ) : (
            <div style={{ display:"flex", gap:10 }}>
              <button onClick={()=>{setPlate([]);setScreen("kidPlate");}} className="btn" style={{ flex:1, padding:"15px", borderRadius:18, border:`2px solid ${m.g1}`, background:"white", color:m.text, fontSize:13, fontWeight:700, fontFamily:"'Baloo 2'", cursor:"pointer", boxShadow:CSHADOW }}>+ Add Plate</button>
              <button onClick={finishCooking} className="btn" style={{ flex:2, padding:"15px", borderRadius:18, border:"none", background:`linear-gradient(135deg,${m.g1},${m.g2})`, color:"white", fontSize:14, fontWeight:700, fontFamily:"'Baloo 2'", cursor:"pointer", boxShadow:`0 4px 18px ${m.shadow}` }}>Done Cooking ✓</button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
