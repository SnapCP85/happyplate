import { useState, useRef, useEffect } from "react";

/* ─── TOKENS ─── */
const B    = "#FF6B35";
const BG   = "#FFB800";
const BL   = "#FFF4EE";
const CREAM = "#FEFCF7";
const DARK = "#1A1410";
const MID  = "#6B5E52";
const SOFT = "#A8998C";
const GR1  = "#16A34A";
const GR2  = "#0D9488";
const PT   = { g1:GR1, g2:GR2, shadow:"#16A34A44", light:"#F0FDFA", text:"#134E4A" };
const CS   = "0 1px 2px rgba(0,0,0,.04),0 4px 16px rgba(0,0,0,.07),0 8px 24px rgba(0,0,0,.03),inset 0 1px 0 rgba(255,255,255,.85)";
const CS2  = "0 2px 4px rgba(0,0,0,.06),0 8px 28px rgba(0,0,0,.12),0 16px 40px rgba(0,0,0,.05)";

/* ─── MEALS ─── */
const MEALS = {
  breakfast: { label:"Breakfast", emoji:"🌅", g1:"#F59E0B", g2:"#EF4444", shadow:"#F59E0B44", light:"#FEF9EC", text:"#92400E" },
  lunch:     { label:"Lunch",     emoji:"☀️",  g1:"#10B981", g2:"#0EA5E9", shadow:"#10B98144", light:"#ECFDF5", text:"#065F46" },
  dinner:    { label:"Dinner",    emoji:"🌙",  g1:"#7C3AED", g2:"#DB2777", shadow:"#7C3AED44", light:"#F5F3FF", text:"#4C1D95" },
};

/* ─── FOOD LIBRARY ─── */
const LIBRARY = {
  breakfast: {
    setMeals: [
      {id:"bs1",name:"Pancakes",emoji:"🥞"},{id:"bs2",name:"Waffles",emoji:"🧇"},
      {id:"bs3",name:"Oatmeal",emoji:"🥣"},{id:"bs4",name:"French Toast",emoji:"🍞"},
      {id:"bs5",name:"Cereal",emoji:"🥣"},{id:"bs6",name:"Bagel",emoji:"🥯"},
    ],
    items: [
      {id:"bi1",name:"Eggs",emoji:"🍳"},{id:"bi2",name:"Bacon",emoji:"🥓"},
      {id:"bi3",name:"Fruit",emoji:"🍓"},{id:"bi4",name:"Yogurt",emoji:"🫙"},
      {id:"bi5",name:"OJ",emoji:"🍊"},{id:"bi6",name:"Milk",emoji:"🥛"},
      {id:"bi7",name:"Toast",emoji:"🍞"},{id:"bi8",name:"Sausage",emoji:"🌭"},
    ],
  },
  lunch: {
    setMeals: [
      {id:"ls1",name:"PB&J",emoji:"🥪"},{id:"ls2",name:"Grilled Cheese",emoji:"🧀"},
      {id:"ls3",name:"Quesadilla",emoji:"🫓"},{id:"ls4",name:"Mac & Cheese",emoji:"🍜"},
      {id:"ls5",name:"Hot Dog",emoji:"🌭"},{id:"ls6",name:"Soup",emoji:"🍲"},
    ],
    items: [
      {id:"li1",name:"Apple Slices",emoji:"🍎"},{id:"li2",name:"Carrots",emoji:"🥕"},
      {id:"li3",name:"Chips",emoji:"🍟"},{id:"li4",name:"Milk",emoji:"🥛"},
      {id:"li5",name:"Cookie",emoji:"🍪"},{id:"li6",name:"Grapes",emoji:"🍇"},
      {id:"li7",name:"Crackers",emoji:"🫙"},{id:"li8",name:"Cheese",emoji:"🧀"},
    ],
  },
  dinner: {
    setMeals: [
      {id:"ds1",name:"Spaghetti",emoji:"🍝"},{id:"ds2",name:"Cheeseburger",emoji:"🍔"},
      {id:"ds3",name:"Tacos",emoji:"🌮"},{id:"ds4",name:"Cod",emoji:"🐟"},
      {id:"ds5",name:"Pizza",emoji:"🍕"},{id:"ds6",name:"Chicken",emoji:"🍗"},
      {id:"ds7",name:"Steak",emoji:"🥩"},{id:"ds8",name:"Salmon",emoji:"🐠"},
    ],
    items: [
      {id:"di1",name:"Broccoli",emoji:"🥦"},{id:"di2",name:"Corn",emoji:"🌽"},
      {id:"di3",name:"Salad",emoji:"🥗"},{id:"di4",name:"Roll",emoji:"🍞"},
      {id:"di5",name:"Milk",emoji:"🥛"},{id:"di6",name:"Ice Cream",emoji:"🍦"},
      {id:"di7",name:"Mashed Potato",emoji:"🥔"},{id:"di8",name:"Green Beans",emoji:"🫛"},
    ],
  },
};

const PANTRY_EXTRAS = [
  {id:"pe1",name:"Apple",emoji:"🍎"},{id:"pe2",name:"Banana",emoji:"🍌"},
  {id:"pe3",name:"Goldfish",emoji:"🐠"},{id:"pe4",name:"Granola Bar",emoji:"🍫"},
  {id:"pe5",name:"Fruit Snacks",emoji:"🍬"},{id:"pe6",name:"Pretzels",emoji:"🥨"},
  {id:"pe7",name:"Popcorn",emoji:"🍿"},{id:"pe8",name:"Cheese Stick",emoji:"🧀"},
  {id:"pe9",name:"PB on Toast",emoji:"🥜"},{id:"pe10",name:"Applesauce",emoji:"🍶"},
  {id:"pe11",name:"Raisins",emoji:"🍇"},{id:"pe12",name:"String Cheese",emoji:"🧀"},
];

// Category tags for each item  — main | side | drink | dessert
const ITEM_CAT = {
  bs1:"main",bs2:"main",bs3:"main",bs4:"main",bs5:"main",bs6:"main",
  bi1:"side",bi2:"side",bi3:"side",bi4:"side",bi5:"drink",bi6:"drink",bi7:"side",bi8:"side",
  ls1:"main",ls2:"main",ls3:"main",ls4:"main",ls5:"main",ls6:"main",
  li1:"side",li2:"side",li3:"side",li4:"drink",li5:"dessert",li6:"side",li7:"side",li8:"side",
  ds1:"main",ds2:"main",ds3:"main",ds4:"main",ds5:"main",ds6:"main",ds7:"main",ds8:"main",
  di1:"side",di2:"side",di3:"side",di4:"side",di5:"drink",di6:"dessert",di7:"side",di8:"side",
  pe1:"side",pe2:"side",pe3:"side",pe4:"side",pe5:"dessert",pe6:"side",
  pe7:"side",pe8:"side",pe9:"side",pe10:"side",pe11:"side",pe12:"side",
};

const MENU_CATS = [
  {id:"main",    label:"Main Dish", icon:"🍽️"},
  {id:"side",    label:"Sides",     icon:"🥦"},
  {id:"drink",   label:"Drinks",    icon:"🥛"},
  {id:"dessert", label:"Dessert",   icon:"🍦"},
];

const COMMON_ITEMS = {
  breakfast: [
    {name:"Pancakes",emoji:"🥞"},{name:"Waffles",emoji:"🧇"},{name:"French Toast",emoji:"🍞"},
    {name:"Oatmeal",emoji:"🥣"},{name:"Cereal",emoji:"🥣"},{name:"Bagel",emoji:"🥯"},
    {name:"Eggs",emoji:"🍳"},{name:"Bacon",emoji:"🥓"},{name:"Sausage",emoji:"🌭"},
    {name:"Toast",emoji:"🍞"},{name:"Yogurt",emoji:"🫙"},{name:"Fruit",emoji:"🍓"},
    {name:"Milk",emoji:"🥛"},{name:"OJ",emoji:"🍊"},{name:"Muffin",emoji:"🧁"},
    {name:"Smoothie",emoji:"🥤"},{name:"Avocado Toast",emoji:"🥑"},{name:"Breakfast Burrito",emoji:"🌯"},
  ],
  lunch: [
    {name:"PB&J",emoji:"🥪"},{name:"Grilled Cheese",emoji:"🧀"},{name:"Quesadilla",emoji:"🫓"},
    {name:"Mac & Cheese",emoji:"🍜"},{name:"Hot Dog",emoji:"🌭"},{name:"Soup",emoji:"🍲"},
    {name:"Chicken Nuggets",emoji:"🍗"},{name:"Pizza Slice",emoji:"🍕"},{name:"Turkey Wrap",emoji:"🌯"},
    {name:"Apple Slices",emoji:"🍎"},{name:"Carrots",emoji:"🥕"},{name:"Chips",emoji:"🍟"},
    {name:"Grapes",emoji:"🍇"},{name:"Crackers",emoji:"🫙"},{name:"Cheese",emoji:"🧀"},
    {name:"Milk",emoji:"🥛"},{name:"Cookie",emoji:"🍪"},{name:"Fruit Cup",emoji:"🍑"},
  ],
  dinner: [
    {name:"Spaghetti",emoji:"🍝"},{name:"Cheeseburger",emoji:"🍔"},{name:"Tacos",emoji:"🌮"},
    {name:"Pizza",emoji:"🍕"},{name:"Chicken",emoji:"🍗"},{name:"Salmon",emoji:"🐠"},
    {name:"Cod",emoji:"🐟"},{name:"Steak",emoji:"🥩"},{name:"Meatballs",emoji:"🍝"},
    {name:"Stir Fry",emoji:"🥢"},{name:"Soup",emoji:"🍲"},{name:"Grilled Cheese",emoji:"🧀"},
    {name:"Broccoli",emoji:"🥦"},{name:"Corn",emoji:"🌽"},{name:"Salad",emoji:"🥗"},
    {name:"Green Beans",emoji:"🫛"},{name:"Mashed Potato",emoji:"🥔"},{name:"Roll",emoji:"🍞"},
    {name:"Milk",emoji:"🥛"},{name:"Ice Cream",emoji:"🍦"},
  ],
  snack: [
    {name:"Apple",emoji:"🍎"},{name:"Banana",emoji:"🍌"},{name:"Goldfish",emoji:"🐠"},
    {name:"Pretzels",emoji:"🥨"},{name:"Popcorn",emoji:"🍿"},{name:"Granola Bar",emoji:"🍫"},
    {name:"Fruit Snacks",emoji:"🍬"},{name:"Applesauce",emoji:"🍶"},{name:"Cheese Stick",emoji:"🧀"},
    {name:"String Cheese",emoji:"🧀"},{name:"PB on Toast",emoji:"🥜"},{name:"Raisins",emoji:"🍇"},
    {name:"Crackers",emoji:"🫙"},{name:"Yogurt",emoji:"🫙"},{name:"Carrots & Dip",emoji:"🥕"},
    {name:"Trail Mix",emoji:"🥜"},
  ],
};

const PALS = [
  {bg:"#FFF9C4",ring:"#F9A825",check:"#F57F17",glow:"#F9A82533"},
  {bg:"#FCE4EC",ring:"#E91E63",check:"#C2185B",glow:"#E91E6333"},
  {bg:"#E8F5E9",ring:"#43A047",check:"#2E7D32",glow:"#43A04733"},
  {bg:"#E3F2FD",ring:"#1E88E5",check:"#1565C0",glow:"#1E88E533"},
  {bg:"#F3E5F5",ring:"#8E24AA",check:"#6A1B9A",glow:"#8E24AA33"},
  {bg:"#FFF3E0",ring:"#FB8C00",check:"#E65100",glow:"#FB8C0033"},
  {bg:"#E0F7FA",ring:"#00ACC1",check:"#006064",glow:"#00ACC133"},
  {bg:"#F9FBE7",ring:"#C0CA33",check:"#827717",glow:"#C0CA3333"},
  {bg:"#EDE7F6",ring:"#673AB7",check:"#4527A0",glow:"#673AB733"},
  {bg:"#E8EAF6",ring:"#3949AB",check:"#1A237E",glow:"#3949AB33"},
];

const ENC = [
  {msg:"Tap something yummy! 👇",sub:""},
  {msg:"Great pick! 🌟",sub:"What else sounds good?"},
  {msg:"Ooh, tasty! 😋",sub:"Keep building your plate!"},
  {msg:"Looking delicious! 🔥",sub:"Add more if you want!"},
  {msg:"Almost ready! 🎉",sub:"Tap done whenever!"},
  {msg:"What a plate! 😍",sub:"Ready whenever you are!"},
];

const ROTS = [2.2,-1.8,2.8,-2.2,1.5,-2.8,1.8,-1.5,2.5,-2];

/* ─── HELPERS ─── */
function makeInitialMenu() {
  const out = {};
  for (const meal of Object.keys(LIBRARY)) {
    out[meal] = {
      setMeals: LIBRARY[meal].setMeals.map(x => ({...x, active:false})),
      items:    LIBRARY[meal].items.map(x => ({...x, active:false})),
    };
  }
  return out;
}

function makeInitialPantry() {
  const out = {}, seen = new Set();
  for (const [mealKey, meal] of Object.entries(LIBRARY)) {
    for (const item of meal.setMeals) {
      const k = item.name.toLowerCase();
      if (!seen.has(k)) { seen.add(k); out[item.id] = {...item, inStock:false, section:"meals", meals:[mealKey], isSetMeal:true}; }
      else if (out[Object.keys(out).find(id => out[id].name.toLowerCase()===k)]) {
        const id = Object.keys(out).find(id => out[id].name.toLowerCase()===k);
        if (id && !out[id].meals.includes(mealKey)) out[id].meals.push(mealKey);
      }
    }
    for (const item of meal.items) {
      const k = item.name.toLowerCase();
      if (!seen.has(k)) { seen.add(k); out[item.id] = {...item, inStock:false, section:"extras", meals:[mealKey], isSetMeal:false}; }
      else {
        const id = Object.keys(out).find(id => out[id].name.toLowerCase()===k);
        if (id && !out[id].meals.includes(mealKey)) out[id].meals.push(mealKey);
      }
    }
  }
  for (const item of PANTRY_EXTRAS) {
    const k = item.name.toLowerCase();
    if (!seen.has(k)) { seen.add(k); out[item.id] = {...item, inStock:false, section:"extras", meals:["snack"], isSetMeal:false}; }
  }
  return out;
}

function timeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return {text:"Good morning!", emoji:"☀️"};
  if (h < 17) return {text:"Good afternoon!", emoji:"🌤️"};
  return {text:"Good evening!", emoji:"🌙"};
}

function activeMeal() {
  const h = new Date().getHours();
  if (h < 11) return "breakfast";
  if (h < 15) return "lunch";
  return "dinner";
}

/* ─── CSS ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  @keyframes fadeUp   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }
  @keyframes slideIn  { from{opacity:0;transform:translateX(26px)} to{opacity:1;transform:translateX(0)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.03)} }
  @keyframes logoSpring { 0%{transform:scale(0.35) rotate(-14deg);opacity:0} 55%{transform:scale(1.1) rotate(3deg);opacity:1} 75%{transform:scale(0.95) rotate(-1deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes popIn    { 0%{transform:scale(0) rotate(-18deg);opacity:0} 55%{transform:scale(1.2) rotate(5deg);opacity:1} 75%{transform:scale(0.93) rotate(-2deg)} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes popOut   { 0%{transform:scale(1);opacity:1} 100%{transform:scale(0);opacity:0} }
  @keyframes wiggle   { 0%,100%{transform:rotate(0) scale(1)} 20%{transform:rotate(-4deg) scale(1.04)} 40%{transform:rotate(4deg) scale(1.04)} 60%{transform:rotate(-2deg) scale(1.02)} 80%{transform:rotate(2deg) scale(1.02)} }
  @keyframes confetti { 0%{transform:translateY(-30px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(580deg);opacity:0} }
  @keyframes badgePop { 0%{transform:scale(0)} 70%{transform:scale(1.3)} 100%{transform:scale(1)} }
  @keyframes stampDrop{ 0%{transform:scale(3) rotate(-12deg);opacity:0} 55%{transform:scale(0.9) rotate(2deg);opacity:1} 100%{transform:scale(1) rotate(0);opacity:1} }
  @keyframes starBurst{ 0%{transform:scale(0);opacity:1} 60%{transform:scale(1.4);opacity:0.6} 100%{transform:scale(2.2);opacity:0} }
  @keyframes bannerIn { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes greetIn  { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }
  .btn  { cursor:pointer; user-select:none; -webkit-tap-highlight-color:transparent; transition:transform 0.12s ease; }
  .btn:active  { transform:scale(0.95); }
  .card { cursor:pointer; user-select:none; -webkit-tap-highlight-color:transparent; transition:transform 0.12s ease,box-shadow 0.15s ease; }
  .card:active { transform:scale(0.92) !important; }
  .tab  { cursor:pointer; user-select:none; -webkit-tap-highlight-color:transparent; border:none; background:none; }
`;

const shell = {
  maxWidth:390, margin:"0 auto", height:"100dvh",
  display:"flex", flexDirection:"column", overflow:"hidden",
  position:"relative", fontFamily:"'Baloo 2',sans-serif",
  background:CREAM, boxShadow:"0 0 120px rgba(0,0,0,0.2)",
};

/* ─── LOGO ─── */
function HappyPlateLogo({size=48}) {
  return (
    <svg width={Math.round(size*1.22)} height={size} viewBox="0 0 68 56" fill="none">
      <defs>
        <radialGradient id="hplg" cx="32%" cy="26%" r="72%">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#EDE5DA"/>
        </radialGradient>
        <linearGradient id="hplr" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={B}/>
          <stop offset="100%" stopColor={BG}/>
        </linearGradient>
        <filter id="hpls">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="rgba(0,0,0,0.14)"/>
        </filter>
      </defs>
      <g transform="translate(4,13) rotate(-14,6,22)" opacity="0.9">
        <rect x="4" y="18" width="3.5" height="18" rx="1.75" fill={B}/>
        <rect x="4" y="6" width="3.5" height="14" rx="1.75" fill={B}/>
        <rect x="2" y="4" width="2" height="10" rx="1" fill={B}/>
        <rect x="4.5" y="4" width="2" height="10" rx="1" fill={B}/>
        <rect x="7" y="4" width="2" height="10" rx="1" fill={B}/>
      </g>
      <g transform="translate(49,13) rotate(14,6,22)" opacity="0.9">
        <rect x="4" y="20" width="3.5" height="18" rx="1.75" fill={BG}/>
        <ellipse cx="5.75" cy="12.5" rx="5.5" ry="7.5" fill={BG}/>
        <ellipse cx="5.75" cy="12.5" rx="3.5" ry="5.5" fill="#FFD54F" opacity="0.6"/>
      </g>
      <ellipse cx="32" cy="53" rx="20" ry="3" fill="rgba(0,0,0,0.09)"/>
      <circle cx="32" cy="28" r="25" fill="url(#hplg)" filter="url(#hpls)"/>
      <circle cx="32" cy="28" r="25" stroke="url(#hplr)" strokeWidth="2.8"/>
      <circle cx="32" cy="28" r="20" stroke="#EDE0D0" strokeWidth="1.5" fill="none"/>
      <circle cx="32" cy="28" r="16" fill="white"/>
      <ellipse cx="17" cy="33" rx="7" ry="5.5" fill="#FCA5A5" opacity="0.65"/>
      <ellipse cx="47" cy="33" rx="7" ry="5.5" fill="#FCA5A5" opacity="0.65"/>
      <circle cx="14.5" cy="30.5" r="1.3" fill="#FBBF24" opacity="0.9"/>
      <circle cx="49.5" cy="30.5" r="1.3" fill="#FBBF24" opacity="0.9"/>
      <circle cx="24" cy="23" r="5.5" fill={B}/><circle cx="40" cy="23" r="5.5" fill={B}/>
      <circle cx="25.8" cy="21" r="2.1" fill="white"/><circle cx="41.8" cy="21" r="2.1" fill="white"/>
      <circle cx="23.2" cy="25" r="1" fill="white" opacity="0.7"/><circle cx="39.2" cy="25" r="1" fill="white" opacity="0.7"/>
      <path d="M 19.5 17.5 Q 24 15 28.5 17.5" stroke={B} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M 35.5 17.5 Q 40 15 44.5 17.5" stroke={B} strokeWidth="2.2" fill="none" strokeLinecap="round"/>
      <path d="M 18 30 Q 32 47 46 30" strokeWidth="4" stroke={B} fill={B} strokeLinecap="round"/>
      <path d="M 20.5 31 Q 32 44.5 43.5 31" fill="white"/>
      <path d="M 57 4 L 58.5 9 L 63.5 10.5 L 58.5 12 L 57 17 L 55.5 12 L 50.5 10.5 L 55.5 9 Z" fill={BG}/>
      <path d="M 7 3 L 8 5.8 L 11 7 L 8 8.2 L 7 11 L 6 8.2 L 3 7 L 6 5.8 Z" fill={B} opacity="0.55"/>
    </svg>
  );
}

/* ─── CONFETTI ─── */
function Confetti() {
  const pieces = Array.from({length:38},(_,i) => {
    const colors = ["#FF6B35","#FFB800","#4ECDC4","#A8E6CF","#FF8A80","#FFD180","#B9F6CA","#80D8FF","#EA80FC","#CCFF90"];
    return {id:i,color:colors[i%colors.length],left:2+(i/38)*96,delay:(i*0.042)%0.85,dur:1.3+(i%6)*0.22,size:8+(i%7)*2.5,circle:i%3!==0};
  });
  return (
    <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,overflow:"hidden"}}>
      {pieces.map(p => (
        <div key={p.id} style={{position:"absolute",left:`${p.left}%`,top:"-30px",width:p.size,height:p.size,background:p.color,borderRadius:p.circle?"50%":"3px",animation:`confetti ${p.dur}s ${p.delay}s ease-in forwards`}}/>
      ))}
    </div>
  );
}

/* ─── SECTION LABEL ─── */
function SL({children}) {
  return <div style={{fontSize:11,fontWeight:800,letterSpacing:"0.08em",textTransform:"uppercase",color:SOFT,fontFamily:"'Baloo 2'",marginBottom:10}}>{children}</div>;
}

/* ─── HINT BAR ─── */
function Hint({text,icon="💡"}) {
  return (
    <div style={{display:"flex",gap:10,alignItems:"flex-start",background:"white",borderRadius:14,padding:"10px 14px 10px 12px",borderLeft:`4px solid ${B}`,boxShadow:`0 2px 12px rgba(255,107,53,0.1)`,flexShrink:0}}>
      <div style={{width:26,height:26,borderRadius:8,background:BL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,flexShrink:0}}>{icon}</div>
      <p style={{fontSize:12,fontFamily:"'Baloo 2'",fontWeight:600,color:MID,margin:0,lineHeight:1.55}}>{text}</p>
    </div>
  );
}

/* ─── GRADIENT HEADER ─── */
function GH({g1,g2,shadow,back,children}) {
  return (
    <div style={{background:`linear-gradient(140deg,${g1},${g2})`,padding:"48px 24px 22px",position:"relative",flexShrink:0,boxShadow:`0 4px 24px ${shadow}`}}>
      {back && <button onClick={back} className="btn" style={{background:"rgba(255,255,255,0.18)",backdropFilter:"blur(8px)",border:"none",color:"white",fontSize:13,fontFamily:"'Baloo 2'",fontWeight:700,cursor:"pointer",position:"absolute",top:48,left:20,padding:"6px 14px",borderRadius:50}}>← Back</button>}
      {children}
    </div>
  );
}

/* ─── TOGGLE CARD ─── */
function ToggleCard({item,m,onToggle,onRemove}) {
  return (
    <div style={{position:"relative"}}>
      <div onClick={onToggle} className="card" style={{background:item.active?m.light:"white",borderRadius:20,padding:"14px 6px 12px",textAlign:"center",border:`2.5px solid ${item.active?m.g1:"#EDE5DA"}`,boxShadow:item.active?`0 4px 20px ${m.shadow}`:CS,transition:"all 0.22s"}}>
        {item.active && <div style={{position:"absolute",top:-9,left:-9,width:22,height:22,borderRadius:"50%",background:`linear-gradient(135deg,${m.g1},${m.g2})`,color:"white",fontSize:12,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",animation:"badgePop 0.25s ease",boxShadow:`0 3px 10px ${m.shadow}`}}>✓</div>}
        {item.photo
          ? <img src={item.photo} alt={item.name} style={{width:36,height:36,borderRadius:10,objectFit:"cover",margin:"0 auto 2px"}}/>
          : <div style={{fontSize:28,lineHeight:1}}>{item.emoji}</div>
        }
        <div style={{fontSize:10,fontWeight:700,marginTop:5,color:item.active?m.text:SOFT,fontFamily:"'Baloo 2'",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",padding:"0 2px"}}>{item.name}</div>
      </div>
      {onRemove && <button onClick={e=>{e.stopPropagation();onRemove();}} style={{position:"absolute",top:-7,right:-7,width:20,height:20,borderRadius:"50%",background:"#EF4444",color:"white",fontSize:9,border:"2px solid white",cursor:"pointer",zIndex:3,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>✕</button>}
    </div>
  );
}

/* ─── PANTRY CARD ─── */
function PantryCard({item,usageCount,colorIdx,onToggle,onRemove,onEdit}) {
  const pal = PALS[colorIdx%PALS.length];
  return (
    <div style={{position:"relative"}}>
      <div onClick={onToggle} className="card" style={{background:item.inStock?pal.bg:"#F0EEE8",borderRadius:20,padding:"14px 6px 11px",textAlign:"center",border:`2.5px solid ${item.inStock?pal.ring:"#C4BDB4"}`,opacity:item.inStock?1:0.72,boxShadow:item.inStock?`0 4px 16px ${pal.glow}`:CS,transition:"all 0.28s"}}>
        {usageCount>0 && <div style={{position:"absolute",top:-8,right:-8,background:item.inStock?pal.check:"#9CA3AF",color:"white",borderRadius:10,padding:"1px 6px",fontSize:9,fontWeight:800,fontFamily:"'Baloo 2'",border:"1.5px solid white"}}>{usageCount}×</div>}
        {item.photo
          ? <img src={item.photo} alt={item.name} style={{width:40,height:40,borderRadius:12,objectFit:"cover",margin:"0 auto 2px",filter:item.inStock?"none":"grayscale(1)"}}/>
          : <div style={{fontSize:28,lineHeight:1,filter:item.inStock?"none":"grayscale(1)"}}>{item.emoji}</div>
        }
        <div style={{fontSize:9,fontWeight:700,marginTop:5,color:item.inStock?DARK:"#5C5650",fontFamily:"'Baloo 2'",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",padding:"0 2px"}}>{item.name}</div>
        <div style={{fontSize:8,marginTop:2,fontFamily:"'Baloo 2'",fontWeight:700,color:item.inStock?pal.check:"#9CA3AF"}}>{item.inStock?"✓ in stock":"✗ out of stock"}</div>
      </div>
      {onEdit && <button onClick={e=>{e.stopPropagation();onEdit();}} style={{position:"absolute",top:-7,right:-7,width:20,height:20,borderRadius:"50%",background:"#6B7280",color:"white",fontSize:9,border:"2px solid white",cursor:"pointer",zIndex:3,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>✏️</button>}
      {onRemove && <button onClick={e=>{e.stopPropagation();onRemove();}} style={{position:"absolute",top:-7,left:-7,width:20,height:20,borderRadius:"50%",background:"#EF4444",color:"white",fontSize:9,border:"2px solid white",cursor:"pointer",zIndex:3,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800}}>✕</button>}
    </div>
  );
}

/* ─── KID FOOD CARD ─── */
function KidFoodCard({item,isOnPlate,colorIdx,onTap,onNote,small}) {
  const pal = PALS[colorIdx%PALS.length];
  const rot = isOnPlate ? 0 : ROTS[colorIdx%ROTS.length];
  return (
    <div onClick={onTap} className="card" style={{background:isOnPlate?pal.bg:"white",borderRadius:small?18:22,padding:small?"14px 6px 10px":"18px 8px 14px",textAlign:"center",border:`3px solid ${isOnPlate?pal.ring:"#F0EDE8"}`,position:"relative",transform:`rotate(${rot}deg) scale(${isOnPlate?1.02:1})`,transition:"all 0.18s cubic-bezier(0.34,1.56,0.64,1)",boxShadow:isOnPlate?`0 0 0 3px white,0 4px 20px ${pal.glow}`:"0 2px 4px rgba(0,0,0,0.06),0 6px 16px rgba(0,0,0,0.08)"}}>
      {isOnPlate && <div style={{position:"absolute",top:-10,right:-10,width:26,height:26,borderRadius:"50%",background:pal.check,color:"white",fontSize:13,fontWeight:900,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 3px 10px ${pal.glow},0 0 0 2px white`,animation:"badgePop 0.25s cubic-bezier(0.34,1.56,0.64,1)",zIndex:2}}>✓</div>}
      {/* Note indicator */}
      {isOnPlate && onNote && (
        <div onClick={e=>{e.stopPropagation();onNote();}} style={{position:"absolute",bottom:-8,left:"50%",transform:"translateX(-50%)",background:item.note?pal.check:"#D6CFC4",color:"white",borderRadius:50,padding:"2px 8px",fontSize:9,fontWeight:800,fontFamily:"'Baloo 2'",border:"1.5px solid white",whiteSpace:"nowrap",zIndex:2,cursor:"pointer"}}>
          {item.note ? `📝 ${item.note.slice(0,12)}${item.note.length>12?"…":""}` : "+ note"}
        </div>
      )}
      {item.photo
        ? <img src={item.photo} alt={item.name} style={{width:small?38:52,height:small?38:52,borderRadius:small?12:16,objectFit:"cover",margin:"0 auto 2px"}}/>
        : <div style={{fontSize:small?34:44,lineHeight:1}}>{item.emoji}</div>
      }
      <div style={{fontSize:small?10:12,fontWeight:700,marginTop:small?5:7,color:isOnPlate?DARK:MID,fontFamily:"'Baloo 2'",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",padding:"0 2px"}}>{item.name}</div>
    </div>
  );
}

/* ─── PLATE VISUAL ─── */
function PlateVisual({plate=[],removingIds,onRemove,wiggle,size=228}) {
  const r1=Math.round(size*0.073), r2=Math.round(size*0.12), iS=Math.round(size*0.72), iO=Math.round((size-Math.round(size*0.72))/2);
  return (
    <div style={{position:"relative",width:size,height:size,flexShrink:0,animation:wiggle?"wiggle 0.5s ease":"none"}}>
      <div style={{position:"absolute",bottom:-8,left:"50%",transform:"translateX(-50%)",width:size*0.8,height:18,background:"radial-gradient(ellipse,rgba(0,0,0,0.13),transparent)",borderRadius:"50%",filter:"blur(4px)"}}/>
      <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"radial-gradient(circle at 34% 28%,#FFFFFF 0%,#EDE6DA 100%)",boxShadow:"0 2px 0 #D9CFC0,0 8px 32px rgba(0,0,0,0.14),inset 0 2px 4px rgba(255,255,255,0.9)"}}>
        <div style={{position:"absolute",top:r1,left:r1,right:r1,bottom:r1,borderRadius:"50%",border:"1.5px solid rgba(0,0,0,0.07)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:r2,left:r2,right:r2,bottom:r2,borderRadius:"50%",border:"1px solid rgba(0,0,0,0.04)",pointerEvents:"none"}}/>
        <div style={{position:"absolute",top:iO,left:iO,width:iS,height:iS,borderRadius:"50%",background:"white",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"center",overflow:"hidden",padding:"10%",gap:size>200?6:4}}>
          {plate.length===0
            ? <div style={{opacity:0.18,fontSize:size*0.2,lineHeight:1}}>🍽️</div>
            : plate.map(it => (
                <div key={it.plateKey} onClick={()=>onRemove&&onRemove(it.plateKey)} style={{textAlign:"center",cursor:onRemove?"pointer":"default",animation:removingIds?.has(it.plateKey)?"popOut 0.22s ease forwards":"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both",padding:"1px"}}>
                  <div style={{fontSize:size>200?28:22,lineHeight:1}}>{it.emoji}</div>
                  <div style={{fontSize:size>200?8:6,fontFamily:"'Baloo 2'",fontWeight:700,color:MID,marginTop:1,maxWidth:size>200?46:34,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it.name}</div>
                </div>
              ))
          }
        </div>
      </div>
    </div>
  );
}

/* ─── INSIGHTS ─── */
function InsightsView({pantry,usage}) {
  const ranked = Object.values(usage).sort((a,b)=>b.count-a.count);
  const outNeeded = ranked.filter(u => !pantry[u.item.id]?.inStock && u.count>0);
  const allOut = Object.values(pantry).filter(x=>!x.inStock).sort((a,b)=>(usage[b.id]?.count||0)-(usage[a.id]?.count||0));
  const medals = ["🥇","🥈","🥉"];
  if (ranked.length===0 && allOut.length===0) return (
    <div style={{textAlign:"center",padding:"52px 32px"}}>
      <div style={{fontSize:52,opacity:0.2}}>📊</div>
      <p style={{fontFamily:"'Baloo 2'",fontSize:14,fontWeight:600,color:MID,marginTop:16,lineHeight:1.6}}>No data yet — use the app at meal time and snack time to start seeing insights!</p>
    </div>
  );
  return (
    <div style={{padding:"18px 18px 40px"}}>
      {ranked.length>0 && (
        <div style={{marginBottom:28}}>
          <SL>Most Loved 🏆</SL>
          {ranked.slice(0,8).map((u,idx) => (
            <div key={u.item.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"white",borderRadius:16,marginBottom:8,boxShadow:CS,animation:`fadeUp 0.3s ${idx*0.04}s both`}}>
              <span style={{fontSize:18,width:28,textAlign:"center"}}>{idx<3?medals[idx]:<span style={{fontFamily:"'Baloo 2'",fontWeight:800,color:SOFT,fontSize:13}}>{idx+1}.</span>}</span>
              <span style={{fontSize:26}}>{u.item.emoji}</span>
              <span style={{flex:1,fontSize:15,fontWeight:700,color:DARK,fontFamily:"'Baloo 2'"}}>{u.item.name}</span>
              <div style={{background:BL,borderRadius:50,padding:"3px 12px",fontSize:12,fontWeight:800,color:"#92400E",fontFamily:"'Baloo 2'"}}>{u.count}×</div>
            </div>
          ))}
        </div>
      )}
      {outNeeded.length>0 && (
        <div style={{marginBottom:28}}>
          <SL>The Kids Want These 🛒</SL>
          {outNeeded.map((u,idx) => (
            <div key={u.item.id} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",background:"#FFFBEB",border:"1.5px solid #FDE68A",borderRadius:16,marginBottom:8}}>
              <span style={{fontSize:26,filter:"grayscale(1)",opacity:.55}}>{u.item.emoji}</span>
              <span style={{flex:1,fontSize:15,fontWeight:700,color:MID,fontFamily:"'Baloo 2'"}}>{u.item.name}</span>
              <div style={{background:"#FEF3C7",borderRadius:50,padding:"3px 12px",fontSize:12,fontWeight:800,color:"#92400E",fontFamily:"'Baloo 2'"}}>chosen {u.count}×</div>
            </div>
          ))}
        </div>
      )}
      {allOut.length>0 && (
        <div>
          <SL>Shopping List 📝</SL>
          <div style={{background:"white",borderRadius:20,overflow:"hidden",boxShadow:CS}}>
            {allOut.map((item,idx) => (
              <div key={item.id} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderBottom:idx<allOut.length-1?"1px solid #F5EEE6":"none"}}>
                <span style={{fontSize:22,filter:"grayscale(0.8)",opacity:.55}}>{item.emoji}</span>
                <span style={{flex:1,fontSize:14,fontWeight:600,color:MID,fontFamily:"'Baloo 2'"}}>{item.name}</span>
                {(usage[item.id]?.count||0)>0 && <span style={{fontSize:11,color:SOFT,fontFamily:"'Baloo 2'",fontWeight:600}}>×{usage[item.id].count}</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ONBOARDING ─── */
function OnboardingOverlay({onDone}) {
  const [step, setStep] = useState(0); // 0=welcome, 1=kids
  const [kidInput, setKidInput] = useState("");
  const [kidNames, setKidNames] = useState([]);

  function addKid() {
    const name = kidInput.trim();
    if (!name || kidNames.includes(name)) return;
    setKidNames(prev => [...prev, name]);
    setKidInput("");
  }

  return (
    <div style={{...shell, background:CREAM}}>
      <style>{CSS}</style>
      <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 0%,${BL} 0%,transparent 60%)`,pointerEvents:"none"}}/>

      {step===0 ? (
        <>
          <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"32px 36px 16px",position:"relative"}}>
            <div style={{animation:"logoSpring 0.7s cubic-bezier(0.34,1.56,0.64,1)",display:"flex",justifyContent:"center",marginBottom:28}}>
              <HappyPlateLogo size={88}/>
            </div>
            <h1 style={{fontSize:36,fontWeight:800,color:DARK,fontFamily:"'Baloo 2'",lineHeight:1.1,marginBottom:14,textAlign:"center"}}>
              Happy<span style={{color:B}}>Plate</span>
            </h1>
            <p style={{fontSize:16,color:MID,lineHeight:1.7,fontFamily:"'Baloo 2'",fontWeight:500,maxWidth:280,margin:"0 auto",textAlign:"center"}}>
              The fun, easy way to handle mealtime with your family. No more "what do you want?"
            </p>
          </div>
          <div style={{padding:"0 28px 52px",position:"relative"}}>
            <button onClick={()=>setStep(1)} className="btn" style={{width:"100%",padding:"20px",border:"none",borderRadius:22,background:`linear-gradient(135deg,${B},${BG})`,color:"white",fontSize:18,fontWeight:800,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:`0 8px 28px ${B}55`}}>
              Let's Get Started →
            </button>
          </div>
        </>
      ) : (
        <>
          <div style={{flex:1,display:"flex",flexDirection:"column",padding:"52px 28px 16px",position:"relative",animation:"slideIn 0.35s ease"}}>
            <div style={{textAlign:"center",marginBottom:28}}>
              <div style={{fontSize:68,lineHeight:1,marginBottom:16}}>👧🧒</div>
              <h1 style={{fontSize:26,fontWeight:800,color:DARK,fontFamily:"'Baloo 2'",marginBottom:10}}>Who's at the table?</h1>
              <p style={{fontSize:14,color:MID,fontFamily:"'Baloo 2'",lineHeight:1.65,maxWidth:280,margin:"0 auto"}}>
                Add your kids' names — their plates will be labeled. You can always add more later.
              </p>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <input value={kidInput} onChange={e=>setKidInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addKid()} placeholder="Enter a name…" autoFocus style={{flex:1,padding:"13px 16px",borderRadius:16,border:"2px solid #EDE5DA",fontSize:16,fontFamily:"'Baloo 2'",outline:"none",background:"white",boxShadow:CS}}/>
              <button onClick={addKid} className="btn" style={{padding:"13px 18px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${B},${BG})`,color:"white",fontSize:20,cursor:"pointer",flexShrink:0,boxShadow:`0 4px 16px ${B}44`}}>＋</button>
            </div>
            {kidNames.length>0 ? (
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
                {kidNames.map(name => (
                  <div key={name} style={{display:"flex",alignItems:"center",gap:6,background:BL,border:`2px solid ${B}`,borderRadius:50,padding:"6px 14px 6px 16px"}}>
                    <span style={{fontSize:14,fontWeight:700,color:"#92400E",fontFamily:"'Baloo 2'"}}>{name}</span>
                    <button onClick={()=>setKidNames(prev=>prev.filter(n=>n!==name))} style={{background:"none",border:"none",cursor:"pointer",color:B,fontSize:14,fontWeight:800,padding:0,lineHeight:1}}>✕</button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{fontSize:12,color:SOFT,fontFamily:"'Baloo 2'",fontWeight:600,textAlign:"center"}}>Tap + to add a name, or skip.</p>
            )}
          </div>
          <div style={{padding:"0 28px 52px",position:"relative"}}>
            <button onClick={()=>onDone(kidNames)} className="btn" style={{width:"100%",padding:"18px",border:"none",borderRadius:22,background:`linear-gradient(135deg,${B},${BG})`,color:"white",fontSize:17,fontWeight:800,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:`0 8px 28px ${B}55`}}>
              {kidNames.length>0 ? "Let's Eat! 🎉" : "Skip for now →"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════
   APP
════════════════════════════════════════════ */
export default function App({savedData=null, onStateChange=null, onSignOut=null, userEmail=null}) {
  const d = savedData || {};
  const saveRef = useRef(null);

  const [screen,        setScreen]        = useState("home");
  const [showOnboarding,setShowOnboarding]= useState(d.showOnboarding !== false);
  const [kids,          setKids]          = useState(d.kids || []);
  const [meal,          setMeal]          = useState(activeMeal());
  const [menu,          setMenu]          = useState(d.menu || makeInitialMenu);
  const [pantry,        setPantry]        = useState(d.pantry || makeInitialPantry);
  const [usage,         setUsage]         = useState(d.usage || {});
  const [plate,         setPlate]         = useState([]);
  const [removingIds,   setRemovingIds]   = useState(new Set());
  const [wiggle,        setWiggle]        = useState(false);
  const [spark,         setSpark]         = useState(false);
  const [showConfetti,  setShowConfetti]  = useState(false);
  const [cookingOrder,  setCookingOrder]  = useState([]);
  const [templates,     setTemplates]     = useState(d.templates || {});
  const [savingTmpl,    setSavingTmpl]    = useState(false);
  const [tmplName,      setTmplName]      = useState("");
  const [addItemSheet,  setAddItemSheet]  = useState(false);
  const [pantryPrompt,  setPantryPrompt]  = useState(null);
  const [customItemName,setCustomItemName]= useState("");
  const [customItemEmoji,setCustomItemEmoji]=useState("");
  const [editingItem,   setEditingItem]   = useState(null);  // pantry item id being edited
  const [noteTarget,    setNoteTarget]    = useState(null);  // plateKey getting a note
  const [noteText,      setNoteText]      = useState("");
  const [pantryView,    setPantryView]    = useState("snack");
  const [stockFilter,   setStockFilter]   = useState("all");
  const [snackFilter,   setSnackFilter]   = useState("all");
  const [snackSearch,   setSnackSearch]   = useState("");
  const [stockSearch,   setStockSearch]   = useState("");
  const [grocerySearch, setGrocerySearch] = useState("");
  const [pantryModal,   setPantryModal]   = useState(false);
  const [newName,       setNewName]       = useState("");
  const [newEmoji,      setNewEmoji]      = useState("");
  const [newItemMeals,  setNewItemMeals]  = useState(["breakfast","lunch","dinner","snack"]);
  const [groceryList,   setGroceryList]   = useState(d.groceryList || []);
  const [groceryInput,  setGroceryInput]  = useState("");
  const [copied,        setCopied]        = useState(false);
  const [checkingOff,   setCheckingOff]   = useState(new Set());
  const [snackPicks,    setSnackPicks]    = useState([]);
  const [snackDone,     setSnackDone]     = useState(false);
  const [pantryExplained,setPantryExplained]=useState(d.pantryExplained===true);
  const [saveStatus,    setSaveStatus]    = useState("idle");

  /* ── auto-save ── */
  useEffect(() => {
    if (!onStateChange) return;
    if (saveRef.current) clearTimeout(saveRef.current);
    setSaveStatus("saving");
    saveRef.current = setTimeout(() => {
      onStateChange({showOnboarding,kids,menu,pantry,usage,templates,groceryList,pantryExplained});
      setSaveStatus("saved");
      setTimeout(()=>setSaveStatus("idle"),2000);
    }, 1800);
  }, [showOnboarding,kids,menu,pantry,usage,templates,groceryList,pantryExplained]);

  /* ── derived ── */
  const m          = MEALS[meal];
  const mealMenu   = menu[meal];
  const activeSM   = mealMenu.setMeals.filter(x=>x.active);
  const activeIt   = mealMenu.items.filter(x=>x.active);
  const isSetUp    = activeSM.length+activeIt.length > 0;
  const savedTmpls = templates[meal] || [];
  const encIdx     = Math.min(plate.length, ENC.length-1);
  const pantryItems     = Object.values(pantry);
  const inStockItems    = pantryItems.filter(x=>x.inStock);
  const inStockCount    = inStockItems.length;
  const outOfStockItems = pantryItems.filter(x=>!x.inStock).sort((a,b)=>(usage[b.id]?.count||0)-(usage[a.id]?.count||0));
  const oosNotOnList    = outOfStockItems.filter(x=>!groceryList.some(g=>g.pantryId===x.id));
  const groceryBadge    = oosNotOnList.length + groceryList.filter(x=>!x.checked).length;
  const greet           = timeGreeting();

  /* ── menu ── */
  function toggleMenuItem(type,id) { setMenu(prev=>({...prev,[meal]:{...prev[meal],[type]:prev[meal][type].map(x=>x.id===id?{...x,active:!x.active}:x)}})); }
  function removeCustomMenuItem(type,id) { setMenu(prev=>({...prev,[meal]:{...prev[meal],[type]:prev[meal][type].filter(x=>x.id!==id)}})); }

  function syncMenuFromPantry(mealKey) {
    const tagged = pantryItems.filter(x=>x.inStock&&x.meals?.includes(mealKey));
    setMenu(prev=>{
      const curr = prev[mealKey];
      const existIds = new Set([...curr.setMeals,...curr.items].map(x=>x.id));
      const newSM = tagged.filter(x=>x.isSetMeal&&!existIds.has(x.id)).map(x=>({...x,active:true}));
      const newIt = tagged.filter(x=>!x.isSetMeal&&!existIds.has(x.id)).map(x=>({...x,active:true}));
      const updSM = curr.setMeals.map(x=>{const pi=pantry[x.id];return pi?.meals?.includes(mealKey)?{...x,active:pi.inStock}:x;});
      const updIt = curr.items.map(x=>{const pi=pantry[x.id];return pi?.meals?.includes(mealKey)?{...x,active:pi.inStock}:x;});
      return {...prev,[mealKey]:{setMeals:[...updSM,...newSM],items:[...updIt,...newIt]}};
    });
  }

  function addItemTonight(item) {
    const inPantry = pantryItems.find(p=>p.name.toLowerCase()===item.name.toLowerCase());
    const newItem = inPantry ? {...inPantry,active:true} : {id:`t${Date.now()}`,name:item.name,emoji:item.emoji,active:true,custom:true};
    const type = (COMMON_ITEMS[meal]||[]).slice(0,10).some(x=>x.name===item.name) ? "setMeals" : "items";
    setMenu(prev=>({...prev,[meal]:{...prev[meal],[type]:[...prev[meal][type].filter(x=>x.name.toLowerCase()!==item.name.toLowerCase()),newItem]}}));
    setAddItemSheet(false); setCustomItemName(""); setCustomItemEmoji("");
    if (!inPantry) setPantryPrompt({item,meal});
  }

  function removeFromMenuByName(name) {
    setMenu(prev=>({...prev,[meal]:{
      setMeals: prev[meal].setMeals.filter(x=>x.name.toLowerCase()!==name.toLowerCase()),
      items:    prev[meal].items.filter(x=>x.name.toLowerCase()!==name.toLowerCase()),
    }}));
  }

  /* ── Edit a pantry item (name, emoji, meals, photo) ── */
  function editPantryItem(id, updates) {
    setPantry(prev=>({...prev,[id]:{...prev[id],...updates}}));
    // Sync name/emoji changes into any active menu items too
    if (updates.name || updates.emoji || updates.photo) {
      setMenu(prev=>{
        const next={...prev};
        for (const mk of Object.keys(next)) {
          next[mk]={
            setMeals: next[mk].setMeals.map(x=>x.id===id?{...x,...updates}:x),
            items:    next[mk].items.map(x=>x.id===id?{...x,...updates}:x),
          };
        }
        return next;
      });
    }
    setEditingItem(null);
  }

  /* ── Save a special note to a plate item ── */
  function saveItemNote() {
    if (!noteTarget) return;
    setPlate(prev=>prev.map(p=>p.plateKey===noteTarget?{...p,note:noteText.trim()}:p));
    setNoteTarget(null); setNoteText("");
  }

  function confirmAddToPantry() {
    if (!pantryPrompt) return;
    const {item,meal:mk} = pantryPrompt;
    const id = `cp${Date.now()}`;
    const isSetMealType = (COMMON_ITEMS[mk]||[]).slice(0,10).some(x=>x.name===item.name);
    setPantry(prev=>({...prev,[id]:{id,name:item.name,emoji:item.emoji,inStock:true,section:isSetMealType?"meals":"extras",meals:[mk],isSetMeal:isSetMealType,custom:true}}));
    setPantryPrompt(null);
  }

  function loadTemplate(tmpl) { setMenu(prev=>({...prev,[meal]:JSON.parse(JSON.stringify(tmpl.state))})); }
  function saveTemplate() {
    if (!tmplName.trim()) return;
    setTemplates(prev=>({...prev,[meal]:[...(prev[meal]||[]),{name:tmplName.trim(),state:JSON.parse(JSON.stringify(mealMenu))}]}));
    setTmplName(""); setSavingTmpl(false);
  }

  /* ── pantry ── */
  function togglePantryItem(id) { setPantry(prev=>({...prev,[id]:{...prev[id],inStock:!prev[id].inStock}})); }
  function removeCustomPantryItem(id) { setPantry(prev=>{const n={...prev};delete n[id];return n;}); }
  function addCustomPantryItem() {
    if (!newName.trim()) return;
    const id = `cp${Date.now()}`;
    setPantry(prev=>({...prev,[id]:{id,name:newName.trim(),emoji:newEmoji.trim()||"✨",inStock:true,section:"extras",meals:newItemMeals.length>0?newItemMeals:["snack"],isSetMeal:false,custom:true}}));
    setNewName(""); setNewEmoji(""); setNewItemMeals(["breakfast","lunch","dinner","snack"]); setPantryModal(false);
  }
  /* ── Add an out-of-stock pantry item to the grocery list ── */
  function addPantryItemToGrocery(item) {
    // Don't add if already on the list
    if (groceryList.some(x => x.pantryId===item.id)) return;
    setGroceryList(prev => [...prev, {
      id: `g${Date.now()}`,
      name: item.name,
      emoji: item.emoji,
      checked: false,
      pantryId: item.id,   // link back to pantry for restock
    }]);
  }

  /* ── Confirm purchased: restock all checked pantry items at once ── */
  function confirmPurchasedAndRestock() {
    const toRestock = groceryList.filter(x => x.checked && x.pantryId);
    if (toRestock.length===0) return;
    // Restock each pantry item
    setPantry(prev => {
      const n = {...prev};
      for (const item of toRestock) {
        if (n[item.pantryId]) n[item.pantryId] = {...n[item.pantryId], inStock:true};
      }
      return n;
    });
    // Remove confirmed items from grocery list
    setGroceryList(prev => prev.filter(x => !(x.checked && x.pantryId)));
  }

  function copyGroceryList() {
    const lines = ["🛒 Grocery List",""];
    const manual = groceryList.filter(x=>!x.checked&&!x.pantryId);
    const pantryItems_ = groceryList.filter(x=>!x.checked&&x.pantryId);
    if (manual.length>0) {lines.push("— To Buy —");manual.forEach(x=>lines.push(`• ${x.name}`));lines.push("");}
    if (pantryItems_.length>0) {lines.push("— Restock —");pantryItems_.forEach(x=>lines.push(`• ${x.emoji||""} ${x.name}`));lines.push("");}
    if (outOfStockItems.filter(x=>!groceryList.some(g=>g.pantryId===x.id)).length>0) {
      lines.push("— Also Out of Stock —");
      outOfStockItems.filter(x=>!groceryList.some(g=>g.pantryId===x.id)).forEach(x=>lines.push(`• ${x.emoji} ${x.name}`));
    }
    navigator.clipboard?.writeText(lines.join("\n")).catch(()=>{});
    setCopied(true); setTimeout(()=>setCopied(false),2200);
  }

  /* ── plate ── */
  function addToPlate(item) {
    if (plate.some(p=>p.id===item.id)) return;
    setPlate(prev=>[...prev,{...item,plateKey:Date.now()+Math.random()}]);
    setWiggle(true); setTimeout(()=>setWiggle(false),520);
    setSpark(true); setTimeout(()=>setSpark(false),600);
  }
  function removeFromPlate(plateKey) {
    setRemovingIds(prev=>new Set([...prev,plateKey]));
    setTimeout(()=>{setPlate(prev=>prev.filter(p=>p.plateKey!==plateKey));setRemovingIds(prev=>{const n=new Set(prev);n.delete(plateKey);return n;});},250);
  }
  function togglePlateItem(item) { const on=plate.find(p=>p.id===item.id);if(on)removeFromPlate(on.plateKey);else addToPlate(item); }

  /* ── flow ── */
  function handleCreateMeal() { syncMenuFromPantry(meal); setScreen("parentSetup"); }
  function handleDone() {
    if (plate.length>0) trackUsage(plate);
    setShowConfetti(true);
    setScreen("review"); // instant — confetti plays as overlay
    setTimeout(()=>setShowConfetti(false),2200);
  }
  function approveAndCook() {
    const idx = cookingOrder.length;
    const label = kids[idx] ? kids[idx] : idx===0 ? "Plate 1" : "Guest";
    setCookingOrder(prev=>[...prev,{id:Date.now(),label,items:plate.map(it=>({...it,checked:false}))}]);
    setPlate([]); setScreen("cooking");
  }
  function toggleCookingItem(pid,iid) { setCookingOrder(prev=>prev.map(p=>p.id===pid?{...p,items:p.items.map(x=>x.id===iid?{...x,checked:!x.checked}:x)}:p)); }
  function finishCooking() { setCookingOrder([]); setScreen("home"); }
  function trackUsage(items) {
    setUsage(prev=>{const n={...prev};for(const it of items)n[it.id]={count:(n[it.id]?.count||0)+1,item:{id:it.id,name:it.name,emoji:it.emoji}};return n;});
  }

  /* ── snack ── */
  function toggleSnack(item) { const on=snackPicks.find(p=>p.id===item.id);if(on)setSnackPicks(prev=>prev.filter(p=>p.id!==item.id));else setSnackPicks(prev=>[...prev,item]); }
  function confirmSnack() {
    if (snackPicks.length>0) trackUsage(snackPicks);
    setShowConfetti(true); setSnackDone(true);
    setTimeout(()=>{setShowConfetti(false);setSnackDone(false);setSnackPicks([]);},2400);
  }

  /* ════════════════════ SCREENS ════════════════════ */

  if (showOnboarding) return <OnboardingOverlay onDone={names=>{setKids(names);setShowOnboarding(false);}}/>;

  /* ── HOME ── */
  if (screen==="home") return (
    <div style={shell}>
      <style>{CSS}</style>

      {/* Cooking banner */}
      {cookingOrder.length>0 && (
        <div onClick={()=>setScreen("cooking")} className="card" style={{background:`linear-gradient(135deg,${GR1},${GR2})`,padding:"12px 20px",display:"flex",alignItems:"center",gap:12,boxShadow:`0 4px 16px rgba(22,163,74,0.35)`,animation:"bannerIn 0.35s ease",flexShrink:0}}>
          <span style={{fontSize:24}}>🍳</span>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:800,color:"white",fontFamily:"'Baloo 2'"}}>{kids[0]||"Plate 1"}'s {m.label} is cooking</div>
            <div style={{fontSize:11,color:"rgba(255,255,255,0.8)",fontFamily:"'Baloo 2'",marginTop:1}}>Tap to open checklist</div>
          </div>
          <div style={{background:"rgba(255,255,255,0.2)",borderRadius:50,padding:"4px 12px",fontSize:12,fontWeight:800,color:"white",fontFamily:"'Baloo 2'"}}>View →</div>
        </div>
      )}

      <div style={{flex:1,overflow:"auto",paddingBottom:24}}>
        {/* Header */}
        <div style={{padding:"40px 24px 24px",textAlign:"center",position:"relative"}}>
          <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 50% 0%,${BL} 0%,transparent 65%)`,pointerEvents:"none"}}/>

          {/* Pantry button — top right */}
          <button onClick={()=>setScreen("pantry")} className="btn" style={{position:"absolute",top:44,right:20,background:"white",border:`1.5px solid #EDE5DA`,borderRadius:50,padding:"7px 14px",display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:700,color:MID,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:CS,zIndex:2}}>
            <span style={{fontSize:16}}>🏠</span> Pantry
          </button>

          <div style={{animation:"logoSpring 0.7s cubic-bezier(0.34,1.56,0.64,1)",display:"flex",justifyContent:"center",marginBottom:8,position:"relative"}}>
            <HappyPlateLogo size={52}/>
          </div>
          <h1 style={{fontSize:28,fontWeight:800,color:DARK,fontFamily:"'Baloo 2'",lineHeight:1.1,marginBottom:4,position:"relative"}}>
            Happy<span style={{color:B}}>Plate</span>
          </h1>
          <p key={greet.text} style={{color:MID,fontSize:13,fontFamily:"'Baloo 2'",fontWeight:600,position:"relative",animation:"greetIn 0.4s ease"}}>{greet.emoji} {greet.text}</p>

          {/* Save status + sign out */}
          {onSignOut && (
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,marginTop:10,position:"relative"}}>
              {saveStatus!=="idle" && <span style={{fontSize:11,fontFamily:"'Baloo 2'",fontWeight:700,color:saveStatus==="saved"?"#16A34A":SOFT}}>{saveStatus==="saving"?"💾 Saving…":"✓ Saved"}</span>}
              {saveStatus==="idle"&&userEmail && <span style={{fontSize:11,fontFamily:"'Baloo 2'",fontWeight:600,color:SOFT}}>{userEmail}</span>}
              <button onClick={onSignOut} style={{background:"none",border:`1.5px solid #EDE5DA`,borderRadius:50,padding:"4px 12px",fontSize:11,fontFamily:"'Baloo 2'",fontWeight:700,color:SOFT,cursor:"pointer"}}>Sign out</button>
            </div>
          )}
        </div>

        {/* Meal selector pills */}
        <div style={{padding:"0 20px",display:"flex",gap:10,justifyContent:"center",marginBottom:24}}>
          {Object.entries(MEALS).map(([key,mx]) => {
            const selected = key===meal;
            return (
              <button key={key} onClick={()=>setMeal(key)} className="btn"
                style={{flex:1,padding:"14px 8px 12px",borderRadius:20,border:`2.5px solid ${selected?mx.g1:"#EDE5DA"}`,background:selected?`linear-gradient(135deg,${mx.g1},${mx.g2})`:"white",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:5,boxShadow:selected?`0 6px 22px ${mx.shadow}`:CS,transition:"all 0.22s"}}>
                <span style={{fontSize:28,filter:selected?"drop-shadow(0 2px 4px rgba(0,0,0,0.2))":"none"}}>{mx.emoji}</span>
                <span style={{fontSize:12,fontWeight:800,fontFamily:"'Baloo 2'",color:selected?"white":MID}}>{mx.label}</span>
              </button>
            );
          })}
        </div>

        {/* Big Create Meal button */}
        <div style={{padding:"0 20px"}}>
          <button onClick={handleCreateMeal} className="btn" style={{width:"100%",padding:"22px",borderRadius:24,border:"none",background:`linear-gradient(135deg,${m.g1},${m.g2})`,color:"white",fontSize:20,fontWeight:800,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:`0 10px 36px ${m.shadow}`,display:"flex",alignItems:"center",justifyContent:"center",gap:12,animation:"pulse 3s ease-in-out infinite"}}>
            <span style={{fontSize:28}}>{m.emoji}</span>
            Create {m.label} →
          </button>
        </div>

        {/* Snack time shortcut */}
        <div style={{padding:"10px 20px 0"}}>
          <div onClick={()=>{setScreen("pantry");setPantryView("snack");}} className="btn"
            style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 18px",borderRadius:18,background:"white",border:"1.5px solid #EDE5DA",boxShadow:CS,cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:22}}>🍿</span>
              <span style={{fontSize:14,fontWeight:700,color:MID,fontFamily:"'Baloo 2'"}}>Snack time?</span>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:B,fontFamily:"'Baloo 2'"}}>Let them pick →</span>
          </div>
        </div>

        {/* Subtle helper tip */}
        <p style={{textAlign:"center",fontSize:12,color:SOFT,fontFamily:"'Baloo 2'",fontWeight:600,marginTop:16,padding:"0 24px"}}>
          Choose a meal above and tap Create — takes 30 seconds.
        </p>
      </div>
    </div>
  );

  /* ── PARENT SETUP ── */
  if (screen==="parentSetup") {
    const pantryForMeal  = pantryItems.filter(x=>x.inStock&&x.meals?.includes(meal));
    const pantryIds      = new Set(Object.keys(pantry));
    const customTonight  = [...mealMenu.setMeals,...mealMenu.items].filter(x=>x.custom&&!pantryIds.has(x.id)&&x.active);
    const menuNames      = new Set([...mealMenu.setMeals,...mealMenu.items].filter(x=>x.active).map(x=>x.name.toLowerCase()));
    const commonForMeal  = COMMON_ITEMS[meal]||[];
    const hasAnything    = pantryForMeal.length+customTonight.length > 0;
    const canSkip        = pantryForMeal.length >= 2;

    return (
      <div style={shell}>
        <style>{CSS}</style>
        <GH g1={m.g1} g2={m.g2} shadow={m.shadow} back={()=>setScreen("home")}>
          <div style={{textAlign:"center",paddingTop:8}}>
            <h1 style={{color:"white",fontSize:22,fontWeight:800,fontFamily:"'Baloo 2'"}}>Set the Menu</h1>
            <p style={{color:"rgba(255,255,255,0.78)",fontSize:13,marginTop:3,fontFamily:"'Baloo 2'"}}>{m.emoji} {m.label} · {isSetUp?`${activeSM.length+activeIt.length} items selected`:"Choose what's on tonight"}</p>
          </div>
        </GH>

        <div style={{flex:1,overflow:"auto",padding:"16px 18px 24px"}}>

          {/* Fast path — skip to kids if pantry ready */}
          {canSkip && (
            <div style={{background:"linear-gradient(135deg,#F0FDF4,#ECFDF5)",border:"2.5px solid #86EFAC",borderRadius:22,padding:"16px 18px",marginBottom:16,boxShadow:"0 4px 20px rgba(22,163,74,0.12)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
                <span style={{fontSize:24}}>✅</span>
                <div>
                  <div style={{fontSize:14,fontWeight:800,color:GR1,fontFamily:"'Baloo 2'"}}>{pantryForMeal.length} items ready from your pantry</div>
                  <div style={{fontSize:12,color:"#166534",fontFamily:"'Baloo 2'",fontWeight:600,marginTop:1}}>All pre-selected — or adjust below</div>
                </div>
              </div>
              <button onClick={()=>{setPlate([]);setScreen("kidPlate");}} className="btn" style={{width:"100%",padding:"13px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${GR1},${GR2})`,color:"white",fontSize:14,fontWeight:800,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:"0 4px 18px rgba(22,163,74,0.3)"}}>
                Skip to Kid's Turn →
              </button>
            </div>
          )}

          {savedTmpls.length>0 && (
            <div style={{marginBottom:18}}>
              <SL>Saved Menus</SL>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {savedTmpls.map((t,i)=>(
                  <button key={i} onClick={()=>loadTemplate(t)} className="btn" style={{background:m.light,border:`2px solid ${m.g1}`,borderRadius:50,padding:"6px 16px",fontSize:13,fontWeight:700,color:m.text,fontFamily:"'Baloo 2'",cursor:"pointer"}}>{t.name}</button>
                ))}
              </div>
            </div>
          )}

          {pantryForMeal.length>0 && (() => {
            // Group pantry items into menu categories
            const getItemCat = item => ITEM_CAT[item.id] || (item.isSetMeal ? "main" : "side");
            return MENU_CATS.map(cat => {
              const catItems = pantryForMeal.filter(item => getItemCat(item) === cat.id);
              if (catItems.length===0) return null;
              return (
                <div key={cat.id} style={{marginBottom:20}}>
                  <SL>{cat.icon} {cat.label}</SL>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
                    {catItems.map(item=>{
                      const inMenu=[...mealMenu.setMeals,...mealMenu.items].find(x=>x.id===item.id);
                      const active=inMenu?.active??true;
                      const type=item.isSetMeal?"setMeals":"items";
                      return <ToggleCard key={item.id} item={{...item,active}} m={m}
                        onToggle={()=>{if(inMenu)toggleMenuItem(type,item.id);else setMenu(prev=>({...prev,[meal]:{...prev[meal],[type]:[...prev[meal][type],{...item,active:true}]}}));}}
                        onRemove={null}/>;
                    })}
                  </div>
                </div>
              );
            });
          })()}

          {customTonight.length>0 && (
            <>
              <SL>Added for Tonight</SL>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
                {customTonight.map(item=>{
                  const type=item.isSetMeal?"setMeals":"items";
                  return <ToggleCard key={item.id} item={item} m={m} onToggle={()=>toggleMenuItem(type,item.id)} onRemove={()=>removeCustomMenuItem(type,item.id)}/>;
                })}
              </div>
            </>
          )}

          {!hasAnything && (
            <div style={{textAlign:"center",padding:"28px 20px 20px"}}>
              <div style={{fontSize:44,opacity:0.22}}>🍽️</div>
              <p style={{fontFamily:"'Baloo 2'",fontSize:15,fontWeight:700,color:MID,marginTop:12}}>Nothing in your pantry for {m.label.toLowerCase()} yet.</p>
              <p style={{fontFamily:"'Baloo 2'",fontSize:13,color:SOFT,marginTop:6}}>Tap + Add Item below to choose what's on tonight's menu.</p>
            </div>
          )}

          <button onClick={()=>setAddItemSheet(true)} className="btn" style={{width:"100%",padding:"15px",borderRadius:18,border:`2px dashed ${m.g1}`,background:m.light,color:m.text,fontSize:15,fontWeight:800,fontFamily:"'Baloo 2'",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:4}}>
            <span style={{fontSize:18}}>＋</span> Add Item for Tonight
          </button>

          <Hint text={pantryForMeal.length>0?"In-stock pantry items are pre-checked. Toggle off anything you don't want, or add more below.":"Tap + Add Item to build tonight's menu. Items you add can be saved to your pantry for next time."}/>
        </div>

        {/* Bottom CTAs */}
        <div style={{padding:"12px 18px 32px",background:CREAM,borderTop:"1px solid #EDE5DA"}}>
          {savingTmpl ? (
            <div style={{display:"flex",gap:10}}>
              <input value={tmplName} onChange={e=>setTmplName(e.target.value)} placeholder="Name this menu…" onKeyDown={e=>e.key==="Enter"&&saveTemplate()} autoFocus style={{flex:1,padding:"14px 16px",borderRadius:16,border:`2px solid ${m.g1}`,fontSize:14,fontFamily:"'Baloo 2'",outline:"none",background:"white"}}/>
              <button onClick={saveTemplate} className="btn" style={{padding:"14px 18px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${m.g1},${m.g2})`,color:"white",fontSize:14,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer"}}>Save</button>
              <button onClick={()=>setSavingTmpl(false)} className="btn" style={{padding:"14px",borderRadius:16,border:"2px solid #EDE5DA",background:"white",color:MID,fontSize:14,cursor:"pointer"}}>✕</button>
            </div>
          ) : (
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setSavingTmpl(true)} className="btn" style={{flex:1,padding:"14px",borderRadius:16,border:`2px solid ${m.g1}`,background:"white",color:m.text,fontSize:14,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer"}}>💾 Save</button>
              <button onClick={()=>{setPlate([]);setScreen("kidPlate");}} className="btn" style={{flex:2,padding:"14px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${m.g1},${m.g2})`,color:"white",fontSize:14,fontWeight:800,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:`0 4px 18px ${m.shadow}`}}>
                {isSetUp ? "Kid's Turn! ⭐" : "Continue →"}
              </button>
            </div>
          )}
        </div>

        {/* Pantry prompt */}
        {pantryPrompt && (
          <div style={{position:"absolute",bottom:0,left:0,right:0,zIndex:60,padding:"16px 18px 36px",background:"white",borderTop:"1px solid #EDE5DA",boxShadow:"0 -8px 32px rgba(0,0,0,0.12)",animation:"slideUp 0.28s ease"}}>
            <p style={{fontSize:14,fontWeight:700,color:DARK,fontFamily:"'Baloo 2'",marginBottom:12}}>
              {pantryPrompt.item.emoji} Add <strong>{pantryPrompt.item.name}</strong> to your pantry for next time?
            </p>
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>setPantryPrompt(null)} className="btn" style={{flex:1,padding:"12px",borderRadius:14,border:"2px solid #EDE5DA",background:"white",color:MID,fontSize:14,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer"}}>Not now</button>
              <button onClick={confirmAddToPantry} className="btn" style={{flex:2,padding:"12px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${PT.g1},${PT.g2})`,color:"white",fontSize:14,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:`0 3px 12px ${PT.shadow}`}}>Yes, add to pantry ✓</button>
            </div>
          </div>
        )}

        {/* Add item sheet */}
        {addItemSheet && (
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",zIndex:50,display:"flex",alignItems:"flex-end"}}>
            <div style={{background:CREAM,width:"100%",borderRadius:"28px 28px 0 0",maxHeight:"82dvh",display:"flex",flexDirection:"column",animation:"slideUp 0.28s ease",boxShadow:"0 -8px 40px rgba(0,0,0,0.15)"}}>
              <div style={{padding:"20px 22px 12px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
                <h3 style={{fontSize:18,fontWeight:800,fontFamily:"'Baloo 2'",color:DARK}}>Add Item for Tonight</h3>
                <button onClick={()=>{setAddItemSheet(false);setCustomItemName("");setCustomItemEmoji("");}} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:SOFT}}>✕</button>
              </div>
              <div style={{padding:"0 18px 10px",flexShrink:0}}>
                <div style={{display:"flex",gap:8}}>
                  <input value={customItemEmoji} onChange={e=>setCustomItemEmoji(e.target.value)} placeholder="🍽️" maxLength={2} style={{width:54,padding:"12px",borderRadius:14,border:"2px solid #EDE5DA",fontSize:22,textAlign:"center",outline:"none",background:"white"}}/>
                  <input
                    value={customItemName}
                    onChange={e=>setCustomItemName(e.target.value)}
                    onKeyDown={e=>e.key==="Enter"&&customItemName.trim()&&addItemTonight({name:customItemName.trim(),emoji:customItemEmoji.trim()||"✨"})}
                    placeholder="Search or type a food…"
                    autoFocus
                    style={{flex:1,padding:"12px 16px",borderRadius:14,border:`2px solid ${customItemName.trim()?m.g1:"#EDE5DA"}`,fontSize:15,fontFamily:"'Baloo 2'",outline:"none",background:"white",transition:"border-color 0.18s"}}
                  />
                </div>
              </div>
              <div style={{flex:1,overflow:"auto",padding:"8px 18px 32px"}}>
                {(() => {
                  const q = customItemName.trim().toLowerCase();
                  const filtered = q
                    ? commonForMeal.filter(item => item.name.toLowerCase().includes(q))
                    : commonForMeal;
                  const exactMatch = commonForMeal.some(item => item.name.toLowerCase()===q);
                  const showAddNew = q && !exactMatch;

                  if (filtered.length===0 && !showAddNew) return (
                    <div style={{textAlign:"center",padding:"32px 0"}}>
                      <div style={{fontSize:40,opacity:.2}}>🔍</div>
                      <p style={{fontFamily:"'Baloo 2'",fontSize:14,color:SOFT,fontWeight:600,marginTop:12}}>No matches found</p>
                    </div>
                  );

                  return (
                    <>
                      {!q && <div style={{marginBottom:10}}><SL>Common {m.label} Items</SL></div>}
                      {q && filtered.length>0 && <div style={{marginBottom:10}}><SL>{filtered.length} result{filtered.length!==1?"s":""} for "{customItemName}"</SL></div>}

                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:9,marginBottom:showAddNew?16:8}}>
                        {filtered.map((item,idx)=>{
                          const added = menuNames.has(item.name.toLowerCase());
                          const inPantry = pantryItems.some(p=>p.name.toLowerCase()===item.name.toLowerCase());
                          return (
                            <div key={idx}
                              onClick={()=>added ? removeFromMenuByName(item.name) : addItemTonight(item)}
                              className="card"
                              style={{background:added?"#F0FDF4":inPantry?m.light:"white",borderRadius:18,padding:"13px 6px 10px",textAlign:"center",border:`2.5px solid ${added?"#86EFAC":inPantry?m.g1:"#EDE5DA"}`,boxShadow:CS,position:"relative",cursor:"pointer"}}>
                              {inPantry&&!added&&<div style={{position:"absolute",top:-7,right:-7,background:m.g1,color:"white",borderRadius:50,fontSize:8,fontWeight:800,padding:"2px 7px",fontFamily:"'Baloo 2'",border:"1.5px solid white"}}>pantry</div>}
                              {added&&<div style={{position:"absolute",top:-7,right:-7,background:GR1,color:"white",borderRadius:50,fontSize:8,fontWeight:800,padding:"2px 7px",fontFamily:"'Baloo 2'",border:"1.5px solid white"}}>✓ tap to remove</div>}
                              <div style={{fontSize:28,lineHeight:1}}>{item.emoji}</div>
                              <div style={{fontSize:10,fontWeight:700,marginTop:4,color:added?GR1:DARK,fontFamily:"'Baloo 2'",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",padding:"0 2px"}}>{item.name}</div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add new item row — shown when no exact match */}
                      {showAddNew && (
                        <div onClick={()=>addItemTonight({name:customItemName.trim(),emoji:customItemEmoji.trim()||"✨"})} className="card"
                          style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:m.light,borderRadius:18,border:`2px solid ${m.g1}`,boxShadow:`0 4px 16px ${m.shadow}`,cursor:"pointer",animation:"fadeUp 0.2s ease"}}>
                          <div style={{width:44,height:44,borderRadius:14,background:`linear-gradient(135deg,${m.g1},${m.g2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,color:"white",fontWeight:800,flexShrink:0}}>
                            {customItemEmoji.trim()||"＋"}
                          </div>
                          <div style={{flex:1}}>
                            <div style={{fontSize:15,fontWeight:800,color:DARK,fontFamily:"'Baloo 2'"}}>{customItemName.trim()}</div>
                            <div style={{fontSize:12,color:m.text,fontFamily:"'Baloo 2'",fontWeight:600,marginTop:1}}>Tap to add to tonight's menu</div>
                          </div>
                          <div style={{fontSize:20,color:m.g1,fontWeight:800}}>＋</div>
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── KID PLATE BUILDER ── */
  if (screen==="kidPlate") {
    const kidName = kids[cookingOrder.length];
    return (
      <div style={{...shell,background:`linear-gradient(180deg,${m.g1}18 0%,${m.g2}10 40%,${CREAM} 75%)`}}>
        <style>{CSS}</style>
        {showConfetti && <Confetti/>}

        <div style={{padding:"44px 22px 6px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <button onClick={()=>setScreen("parentSetup")} className="btn" style={{background:"rgba(0,0,0,0.06)",backdropFilter:"blur(8px)",border:"none",fontSize:13,fontFamily:"'Baloo 2'",fontWeight:700,color:MID,cursor:"pointer",padding:"7px 14px",borderRadius:50}}>← Back</button>
          <div style={{fontSize:14,fontWeight:800,fontFamily:"'Baloo 2'",background:`linear-gradient(135deg,${m.g1},${m.g2})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            {kidName ? `${kidName}'s Plate 🍽️` : `${m.emoji} ${m.label}`}
          </div>
          <div style={{width:70}}/>
        </div>

        <div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"4px 0 8px",flexShrink:0,position:"relative"}}>
          {plate.length===0 && <p style={{fontSize:11,fontFamily:"'Baloo 2'",fontWeight:700,color:SOFT,marginBottom:6,textAlign:"center"}}>👇 Tap food below · 👆 Tap plate to remove</p>}
          {spark && <div style={{position:"absolute",width:100,height:100,borderRadius:"50%",background:`radial-gradient(circle,${m.g1}66,transparent 70%)`,animation:"starBurst 0.55s ease-out forwards",pointerEvents:"none",zIndex:10}}/>}
          <PlateVisual plate={plate} removingIds={removingIds} onRemove={removeFromPlate} wiggle={wiggle} size={224}/>
          <div style={{marginTop:10,textAlign:"center",minHeight:38,padding:"0 24px"}}>
            <div key={plate.length} style={{animation:"fadeUp 0.3s ease",fontSize:15,fontWeight:800,color:DARK,fontFamily:"'Baloo 2'"}}>{ENC[encIdx].msg}</div>
            {ENC[encIdx].sub
              ? <div style={{fontSize:12,color:MID,fontFamily:"'Baloo 2'",marginTop:1}}>{ENC[encIdx].sub}</div>
              : plate.length>0 && <div style={{fontSize:11,color:SOFT,fontFamily:"'Baloo 2'",marginTop:1}}>tap plate items to remove</div>}
          </div>
        </div>

        <div style={{flex:1,overflow:"auto",padding:"2px 16px 6px"}}>
          {activeSM.length>0 && (
            <>
              <SL>Set Meals</SL>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:18}}>
                {activeSM.map((item,idx)=>{const p=plate.find(x=>x.id===item.id);return <KidFoodCard key={item.id} item={{...item,note:p?.note}} isOnPlate={!!p} colorIdx={idx} onTap={()=>togglePlateItem(item)} onNote={p?()=>{setNoteTarget(p.plateKey);setNoteText(p.note||"");}:null}/>;})}
              </div>
            </>
          )}
          {activeIt.length>0 && (
            <>
              <SL>Sides &amp; Extras</SL>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
                {activeIt.map((item,idx)=>{const p=plate.find(x=>x.id===item.id);return <KidFoodCard key={item.id} item={{...item,note:p?.note}} small isOnPlate={!!p} colorIdx={activeSM.length+idx} onTap={()=>togglePlateItem(item)} onNote={p?()=>{setNoteTarget(p.plateKey);setNoteText(p.note||"");}:null}/>;})}
              </div>
            </>
          )}
          {activeSM.length===0&&activeIt.length===0 && (
            <div style={{textAlign:"center",padding:"32px 20px"}}>
              <div style={{fontSize:44,opacity:.2}}>🍽️</div>
              <p style={{fontFamily:"'Baloo 2'",fontSize:15,fontWeight:700,color:MID,marginTop:12}}>No items on the menu yet.</p>
              <button onClick={()=>setScreen("parentSetup")} className="btn" style={{marginTop:14,padding:"12px 24px",borderRadius:50,border:`2px solid ${m.g1}`,background:m.light,color:m.text,fontSize:14,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer"}}>← Set up menu first</button>
            </div>
          )}
        </div>

        <div style={{padding:"8px 16px 32px",flexShrink:0}}>
          <button onClick={handleDone} className="btn" style={{width:"100%",padding:"20px",border:"none",borderRadius:24,background:`linear-gradient(135deg,${m.g1},${m.g2})`,color:"white",fontSize:20,fontWeight:800,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:`0 8px 32px ${m.shadow}`,animation:plate.length>0?"pulse 2.2s ease-in-out infinite":"none"}}>
            I'm Done! 🎉
          </button>
        </div>

        {/* Special request note sheet */}
        {noteTarget && (
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",zIndex:60,display:"flex",alignItems:"flex-end"}} onClick={()=>{setNoteTarget(null);setNoteText("");}}>
            <div onClick={e=>e.stopPropagation()} style={{background:CREAM,width:"100%",borderRadius:"28px 28px 0 0",padding:"24px 20px 44px",animation:"slideUp 0.28s ease",boxShadow:"0 -8px 40px rgba(0,0,0,0.15)"}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <span style={{fontSize:32}}>{plate.find(p=>p.plateKey===noteTarget)?.emoji||"🍽️"}</span>
                <div>
                  <h3 style={{fontSize:17,fontWeight:800,fontFamily:"'Baloo 2'",color:DARK}}>{plate.find(p=>p.plateKey===noteTarget)?.name}</h3>
                  <p style={{fontSize:13,color:SOFT,fontFamily:"'Baloo 2'",fontWeight:600,marginTop:2}}>Any special requests?</p>
                </div>
              </div>
              <input
                value={noteText}
                onChange={e=>setNoteText(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&saveItemNote()}
                placeholder={`e.g. "extra cheese", "no crust", "apple juice"`}
                autoFocus
                style={{width:"100%",padding:"14px 16px",borderRadius:16,border:`2px solid ${m.g1}`,fontSize:16,fontFamily:"'Baloo 2'",outline:"none",background:"white",marginBottom:14}}
              />
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>{setNoteTarget(null);setNoteText("");}} className="btn" style={{flex:1,padding:"14px",borderRadius:16,border:"2px solid #EDE5DA",background:"white",color:MID,fontSize:14,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer"}}>
                  {noteText?"Clear":"Skip"}
                </button>
                <button onClick={saveItemNote} className="btn" style={{flex:2,padding:"14px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${m.g1},${m.g2})`,color:"white",fontSize:14,fontWeight:800,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:`0 4px 16px ${m.shadow}`}}>
                  {noteText?"Save Note ✓":"Done"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── APPROVE PLATE ── */
  if (screen==="review") return (
    <div style={shell}>
      <style>{CSS}</style>
      {showConfetti && <Confetti/>}

      <GH g1={m.g1} g2={m.g2} shadow={m.shadow}>
        <div style={{textAlign:"center",paddingTop:4}}>
          <div style={{fontSize:40,animation:"badgePop 0.5s ease",marginTop:4}}>👀</div>
          <h1 style={{color:"white",fontSize:24,fontWeight:800,fontFamily:"'Baloo 2'",marginTop:6}}>
            {kids[cookingOrder.length] ? `${kids[cookingOrder.length]}'s Plate` : "Here's the Plate!"}
          </h1>
          <p style={{color:"rgba(255,255,255,0.78)",fontSize:13,marginTop:3,fontFamily:"'Baloo 2'"}}>{m.label} · {plate.length} item{plate.length!==1?"s":""}</p>
        </div>
      </GH>

      <div style={{flex:1,overflow:"auto",padding:"20px 20px 100px"}}>
        <Hint icon="👀" text="Look over the plate. Tap Looks Good to approve and start cooking, or Edit to let them change something."/>
        <div style={{display:"flex",justifyContent:"center",margin:"20px 0 22px"}}>
          <PlateVisual plate={plate} size={210}/>
        </div>
        {plate.length>0 ? (
          <div style={{background:"white",borderRadius:22,overflow:"hidden",boxShadow:CS}}>
            {plate.map((item,idx)=>(
              <div key={item.plateKey} style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",borderBottom:idx<plate.length-1?"1px solid #F5EEE6":"none",animation:`fadeUp 0.3s ${idx*0.05}s both`}}>
                <span style={{fontSize:28}}>{item.emoji}</span>
                <div style={{flex:1}}>
                  <span style={{fontSize:16,fontWeight:700,color:DARK,fontFamily:"'Baloo 2'"}}>{item.name}</span>
                  {item.note && <div style={{fontSize:12,fontWeight:600,color:MID,fontFamily:"'Baloo 2'",marginTop:2}}>📝 {item.note}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{textAlign:"center",padding:"20px 0"}}>
            <div style={{fontSize:36,opacity:.2}}>🍽️</div>
            <p style={{color:SOFT,fontFamily:"'Baloo 2'",fontSize:14,marginTop:8}}>Nothing on the plate yet</p>
          </div>
        )}
      </div>

      <div style={{position:"sticky",bottom:0,padding:"12px 18px 32px",background:CREAM,borderTop:"1px solid #EDE5DA"}}>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>setScreen("kidPlate")} className="btn" style={{flex:1,padding:"15px",borderRadius:18,border:"2px solid #EDE5DA",background:"white",color:MID,fontSize:14,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:CS}}>← Edit</button>
          <button onClick={approveAndCook} className="btn" style={{flex:2,padding:"15px",borderRadius:18,border:"none",background:`linear-gradient(135deg,${m.g1},${m.g2})`,color:"white",fontSize:14,fontWeight:800,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:`0 4px 20px ${m.shadow}`,animation:"pulse 2s ease-in-out infinite"}}>Looks Good! ✅</button>
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
        {allDone && <Confetti/>}

        <GH g1={m.g1} g2={m.g2} shadow={m.shadow} back={()=>setScreen("home")}>
          <div style={{textAlign:"center",paddingTop:4}}>
            <div style={{fontSize:34}}>🍳</div>
            <h1 style={{color:"white",fontSize:22,fontWeight:800,fontFamily:"'Baloo 2'",marginTop:4}}>Get Cooking!</h1>
            <p style={{color:"rgba(255,255,255,0.78)",fontSize:13,marginTop:3,fontFamily:"'Baloo 2'"}}>{m.label} · {cookingOrder.length} plate{cookingOrder.length!==1?"s":""}</p>
          </div>
        </GH>

        <div style={{flex:1,overflow:"auto",padding:"16px 16px 120px"}}>
          <Hint icon="☑️" text="Check off each item as you serve it. Plate turns green when complete. Tap + Add Plate for another kid."/>
          <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:14}}>
            {cookingOrder.map(ticket=>{
              const done = ticket.items.every(x=>x.checked);
              return (
                <div key={ticket.id} style={{background:"white",borderRadius:24,overflow:"hidden",boxShadow:done?`0 4px 20px rgba(22,163,74,0.2)`:CS,border:done?"2.5px solid #86EFAC":"2.5px solid transparent",transition:"all 0.35s"}}>
                  <div style={{padding:"13px 18px",background:done?`linear-gradient(135deg,${GR1},${GR2})`:m.light,display:"flex",alignItems:"center",justifyContent:"space-between",transition:"background 0.4s"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:20}}>{done?"✅":"🍽️"}</span>
                      <span style={{fontSize:16,fontWeight:800,fontFamily:"'Baloo 2'",color:done?"white":m.text}}>{ticket.label}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      {done && <div style={{fontSize:13,fontWeight:800,color:"white",fontFamily:"'Baloo 2'",animation:"stampDrop 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}>DONE!</div>}
                      <span style={{fontSize:12,fontFamily:"'Baloo 2'",fontWeight:700,color:done?"rgba(255,255,255,0.85)":SOFT}}>{ticket.items.filter(x=>x.checked).length}/{ticket.items.length}</span>
                    </div>
                  </div>
                  {ticket.items.map((item,idx)=>(
                    <div key={item.id} onClick={()=>toggleCookingItem(ticket.id,item.id)}
                      style={{display:"flex",alignItems:"center",gap:14,padding:"13px 18px",borderTop:"1px solid #F5EEE6",cursor:"pointer",background:item.checked?"#F0FDF4":"white",transition:"background 0.2s"}}>
                      <div style={{width:26,height:26,borderRadius:9,flexShrink:0,border:item.checked?"none":"2.5px solid #D6CFC4",background:item.checked?GR1:"white",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s",boxShadow:item.checked?"0 2px 8px rgba(22,163,74,0.35)":"none"}}>
                        {item.checked && <span style={{color:"white",fontSize:14,fontWeight:900,animation:"badgePop 0.2s ease"}}>✓</span>}
                      </div>
                      <span style={{fontSize:24,opacity:item.checked?.45:1,transition:"opacity 0.2s"}}>{item.emoji}</span>
                      <div style={{flex:1}}>
                        <span style={{fontSize:15,fontWeight:600,fontFamily:"'Baloo 2'",color:item.checked?SOFT:DARK,textDecoration:item.checked?"line-through":"none",transition:"all 0.2s"}}>{item.name}</span>
                        {item.note && <div style={{fontSize:11,fontWeight:600,color:item.checked?SOFT:MID,fontFamily:"'Baloo 2'",marginTop:2,fontStyle:"italic"}}>📝 {item.note}</div>}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{position:"sticky",bottom:0,padding:"12px 16px 32px",background:CREAM,borderTop:"1px solid #EDE5DA"}}>
          {allDone ? (
            <div key="done" style={{animation:"badgePop 0.4s ease"}}>
              <p style={{textAlign:"center",fontSize:14,fontWeight:700,color:GR1,fontFamily:"'Baloo 2'",marginBottom:10}}>Every plate is ready! 🎉</p>
              <button onClick={finishCooking} className="btn" style={{width:"100%",padding:"18px",border:"none",borderRadius:22,background:`linear-gradient(135deg,${GR1},${GR2})`,color:"white",fontSize:18,fontWeight:800,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:"0 6px 24px rgba(22,163,74,0.4)"}}>
                Dinner's Ready! 🍽️
              </button>
            </div>
          ) : (
            <div style={{display:"flex",gap:10}}>
              <button onClick={()=>{setPlate([]);setScreen("kidPlate");}} className="btn" style={{flex:1,padding:"15px",borderRadius:18,border:`2px solid ${m.g1}`,background:"white",color:m.text,fontSize:13,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:CS}}>+ Add Plate</button>
              <button onClick={finishCooking} className="btn" style={{flex:2,padding:"15px",borderRadius:18,border:"none",background:`linear-gradient(135deg,${m.g1},${m.g2})`,color:"white",fontSize:14,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:`0 4px 18px ${m.shadow}`}}>Done Cooking ✓</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── PANTRY ── */
  if (screen==="pantry") {
    const pantryMeals  = pantryItems.filter(x=>x.section==="meals");
    const pantryExtras = pantryItems.filter(x=>x.section==="extras");

    return (
      <div style={shell}>
        <style>{CSS}</style>
        {showConfetti && <Confetti/>}

        {/* Pantry header */}
        <div style={{background:`linear-gradient(140deg,${PT.g1},${PT.g2})`,padding:"48px 22px 18px",flexShrink:0,boxShadow:`0 4px 24px ${PT.shadow}`}}>
          <button onClick={()=>setScreen("home")} className="btn" style={{background:"rgba(255,255,255,0.18)",backdropFilter:"blur(8px)",border:"none",color:"white",fontSize:13,fontFamily:"'Baloo 2'",fontWeight:700,cursor:"pointer",position:"absolute",top:48,left:20,padding:"6px 14px",borderRadius:50}}>← Back</button>
          <div style={{textAlign:"center",paddingTop:4}}>
            <h1 style={{color:"white",fontSize:22,fontWeight:800,fontFamily:"'Baloo 2'",lineHeight:1}}>The Pantry 🏠</h1>
            <p style={{color:"rgba(255,255,255,0.75)",fontSize:13,marginTop:4,fontFamily:"'Baloo 2'"}}>{inStockCount} item{inStockCount!==1?"s":""} in stock</p>
          </div>
          {/* Sub-tabs */}
          <div style={{display:"flex",gap:6,marginTop:16,flexWrap:"wrap"}}>
            {[
              {id:"snack",label:"🍿 Available"},
              {id:"stock",label:"Stock"},
              {id:"grocery",label:groceryBadge>0?`🛒 List (${groceryBadge})`:"🛒 List"},
              {id:"insights",label:"Insights"},
            ].map(t=>(
              <button key={t.id} onClick={()=>setPantryView(t.id)} className="tab"
                style={{padding:"6px 14px",borderRadius:50,fontSize:12,fontWeight:700,fontFamily:"'Baloo 2'",background:pantryView===t.id?"white":"rgba(255,255,255,0.15)",color:pantryView===t.id?PT.text:"rgba(255,255,255,0.88)",border:pantryView===t.id?"none":"1.5px solid rgba(255,255,255,0.25)",whiteSpace:"nowrap"}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* First-time explanation */}
        {!pantryExplained && (
          <div style={{margin:"12px 16px 0",padding:"12px 14px",background:"#FFFBEB",border:"1.5px solid #FDE68A",borderRadius:16,display:"flex",gap:10,alignItems:"flex-start",flexShrink:0}}>
            <span style={{fontSize:20,flexShrink:0}}>💡</span>
            <div style={{flex:1}}>
              <p style={{fontSize:13,fontWeight:700,color:DARK,fontFamily:"'Baloo 2'",marginBottom:3}}>Welcome to your Pantry!</p>
              <p style={{fontSize:12,fontWeight:600,color:MID,fontFamily:"'Baloo 2'",lineHeight:1.55}}>This is your home's food inventory. Items get added here when you use them in meals. Tap anything in Stock to mark it in or out of stock — that's how the app knows what to show your kids.</p>
            </div>
            <button onClick={()=>setPantryExplained(true)} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:SOFT,flexShrink:0,lineHeight:1}}>✕</button>
          </div>
        )}

        {/* AVAILABLE TAB */}
        {pantryView==="snack" && (
          <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            {snackDone ? (
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 30px"}}>
                <div style={{fontSize:80,animation:"badgePop 0.5s cubic-bezier(0.34,1.56,0.64,1)"}}>{snackPicks[0]?.emoji||"🎉"}</div>
                <h2 style={{fontSize:26,fontWeight:800,color:DARK,fontFamily:"'Baloo 2'",marginTop:18,textAlign:"center"}}>Enjoy your snack!</h2>
                <p style={{fontSize:14,color:MID,fontFamily:"'Baloo 2'",marginTop:8,textAlign:"center"}}>{snackPicks.map(x=>x.name).join(", ")}</p>
              </div>
            ) : inStockItems.length===0 ? (
              <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 30px",textAlign:"center"}}>
                <div style={{fontSize:52,opacity:.18}}>🏠</div>
                <p style={{fontFamily:"'Baloo 2'",fontSize:16,fontWeight:700,color:MID,marginTop:14}}>Nothing in stock!</p>
                <p style={{fontFamily:"'Baloo 2'",fontSize:13,color:SOFT,marginTop:6}}>Tap Stock above to mark items available.</p>
              </div>
            ) : (
              <>
                {/* Search bar */}
                <div style={{padding:"10px 16px 0",flexShrink:0}}>
                  <input
                    value={snackSearch}
                    onChange={e=>setSnackSearch(e.target.value)}
                    placeholder="Search available items…"
                    style={{width:"100%",padding:"11px 16px",borderRadius:14,border:`2px solid ${snackSearch?PT.g1:"#EDE5DA"}`,fontSize:14,fontFamily:"'Baloo 2'",outline:"none",background:"white",boxShadow:CS,transition:"border-color 0.18s"}}
                  />
                </div>

                {/* Category filter chips — hidden while searching */}
                {!snackSearch && (
                <div style={{padding:"8px 16px 0",flexShrink:0}}>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {[
                      {id:"all",     label:"All"},
                      {id:"breakfast",label:"🌅 Breakfast"},
                      {id:"lunch",   label:"☀️ Lunch"},
                      {id:"dinner",  label:"🌙 Dinner"},
                      {id:"snack",   label:"🍿 Snack"},
                      {id:"drink",   label:"🥛 Drinks"},
                      {id:"dessert", label:"🍦 Desserts"},
                    ].map(f=>(
                      <button key={f.id} onClick={()=>setSnackFilter(f.id)} className="tab"
                        style={{padding:"5px 12px",borderRadius:50,fontSize:11,fontWeight:700,fontFamily:"'Baloo 2'",background:snackFilter===f.id?DARK:"white",color:snackFilter===f.id?"white":MID,border:`1.5px solid ${snackFilter===f.id?DARK:"#EDE5DA"}`,whiteSpace:"nowrap",boxShadow:snackFilter===f.id?"0 2px 8px rgba(0,0,0,0.15)":CS}}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                )}

                {/* Selected picks strip */}
                {snackPicks.length>0 && (
                  <div style={{margin:"10px 16px 0",padding:"11px 16px",background:"white",borderRadius:18,boxShadow:CS,display:"flex",alignItems:"center",gap:8,flexShrink:0,animation:"fadeUp 0.25s ease"}}>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap",flex:1}}>{snackPicks.map(it=><span key={it.id} style={{fontSize:22}}>{it.emoji}</span>)}</div>
                    <span style={{fontSize:12,color:MID,fontFamily:"'Baloo 2'",fontWeight:600,flexShrink:0}}>{snackPicks.length} picked</span>
                  </div>
                )}

                {/* Food grid */}
                <div style={{flex:1,overflow:"auto",padding:"10px 16px 6px"}}>
                  {(() => {
                    const q = snackSearch.trim().toLowerCase();
                    const filtered = inStockItems.filter(item => {
                      if (q) return item.name.toLowerCase().includes(q);
                      if (snackFilter==="all") return true;
                      if (snackFilter==="drink")   return ITEM_CAT[item.id]==="drink";
                      if (snackFilter==="dessert")  return ITEM_CAT[item.id]==="dessert";
                      return item.meals?.includes(snackFilter);
                    });
                    if (filtered.length===0) return (
                      <div style={{textAlign:"center",padding:"32px 0"}}>
                        <div style={{fontSize:40,opacity:.2}}>🔍</div>
                        <p style={{fontFamily:"'Baloo 2'",fontSize:14,color:SOFT,fontWeight:600,marginTop:12}}>
                          {q ? `No "${snackSearch}" in stock` : `No ${snackFilter} items in stock.`}
                        </p>
                      </div>
                    );
                    return (
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,paddingBottom:16}}>
                        {filtered.map((item,idx)=><KidFoodCard key={item.id} item={item} isOnPlate={snackPicks.some(p=>p.id===item.id)} colorIdx={idx} onTap={()=>toggleSnack(item)}/>)}
                      </div>
                    );
                  })()}
                </div>

                {/* Confirm button — conditional styling */}
                <div style={{padding:"8px 16px 24px",flexShrink:0}}>
                  <button
                    onClick={snackPicks.length>0?confirmSnack:undefined}
                    className={snackPicks.length>0?"btn":""}
                    style={{
                      width:"100%",padding:"18px",border:"none",borderRadius:22,
                      background:snackPicks.length>0?`linear-gradient(135deg,${PT.g1},${PT.g2})`:"#E8E4DE",
                      color:snackPicks.length>0?"white":SOFT,
                      fontSize:18,fontWeight:800,fontFamily:"'Baloo 2'",
                      cursor:snackPicks.length>0?"pointer":"default",
                      boxShadow:snackPicks.length>0?`0 6px 24px ${PT.shadow}`:"none",
                      animation:snackPicks.length>0?"pulse 2.2s ease-in-out infinite":"none",
                      transition:"all 0.3s ease",
                    }}>
                    That's my snack! ✓
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* STOCK TAB */}
        {pantryView==="stock" && (
          <div style={{flex:1,overflow:"auto",padding:"16px 18px 32px"}}>
            {/* Search bar */}
            <div style={{marginBottom:12}}>
              <input
                value={stockSearch}
                onChange={e=>setStockSearch(e.target.value)}
                placeholder="Search pantry items…"
                style={{width:"100%",padding:"11px 16px",borderRadius:14,border:`2px solid ${stockSearch?PT.g1:"#EDE5DA"}`,fontSize:14,fontFamily:"'Baloo 2'",outline:"none",background:"white",boxShadow:CS,transition:"border-color 0.18s"}}
              />
            </div>
            {/* Filter chips — hidden while searching */}
            {!stockSearch && (
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
                {[{id:"all",label:"All"},{id:"breakfast",label:"🌅 Breakfast"},{id:"lunch",label:"☀️ Lunch"},{id:"dinner",label:"🌙 Dinner"},{id:"snack",label:"🍿 Snack"}].map(f=>(
                  <button key={f.id} onClick={()=>setStockFilter(f.id)} className="tab"
                    style={{padding:"6px 13px",borderRadius:50,fontSize:12,fontWeight:700,fontFamily:"'Baloo 2'",background:stockFilter===f.id?DARK:"white",color:stockFilter===f.id?"white":MID,border:`1.5px solid ${stockFilter===f.id?DARK:"#EDE5DA"}`,boxShadow:stockFilter===f.id?"0 2px 8px rgba(0,0,0,0.15)":CS,whiteSpace:"nowrap"}}>
                    {f.label}
                  </button>
                ))}
              </div>
            )}
            {(() => {
              const q = stockSearch.trim().toLowerCase();
              const base = stockFilter==="all" ? pantryItems : pantryItems.filter(x=>x.meals?.includes(stockFilter));
              const filtered = q ? pantryItems.filter(x=>x.name.toLowerCase().includes(q)) : base;
              const fMeals  = filtered.filter(x=>x.section==="meals");
              const fExtras = filtered.filter(x=>x.section==="extras");
              const exactMatch = pantryItems.some(x=>x.name.toLowerCase()===q);
              const showAddNew = q && !exactMatch;

              if (filtered.length===0 && !showAddNew) return (
                <div style={{textAlign:"center",padding:"32px 0"}}>
                  <div style={{fontSize:40,opacity:.2}}>🔍</div>
                  <p style={{fontFamily:"'Baloo 2'",fontSize:14,color:SOFT,fontWeight:600,marginTop:12}}>{q?`"${stockSearch}" not in pantry`:`No ${stockFilter} items yet.`}</p>
                </div>
              );

              return (
                <>
                  {fMeals.length>0 && (
                    <>
                      <SL>{q?"Matching Meals":"Meals"}</SL>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
                        {fMeals.map((item,idx)=><PantryCard key={item.id} item={item} usageCount={usage[item.id]?.count||0} colorIdx={idx} onToggle={()=>togglePantryItem(item.id)} onEdit={()=>setEditingItem(item.id)} onRemove={item.custom?()=>removeCustomPantryItem(item.id):null}/>)}
                      </div>
                    </>
                  )}
                  {fExtras.length>0 && (
                    <>
                      <SL>{q?"Matching Items":"Snacks & Extras"}</SL>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
                        {fExtras.map((item,idx)=><PantryCard key={item.id} item={item} usageCount={usage[item.id]?.count||0} colorIdx={fMeals.length+idx} onToggle={()=>togglePantryItem(item.id)} onEdit={()=>setEditingItem(item.id)} onRemove={item.custom?()=>removeCustomPantryItem(item.id):null}/>)}
                        {!q && stockFilter==="all" && (
                          <div onClick={()=>{setPantryModal(true);setNewName("");setNewEmoji("");setNewItemMeals(["breakfast","lunch","dinner","snack"]);}} className="card"
                            style={{background:"white",borderRadius:20,padding:"14px 6px 12px",textAlign:"center",border:"2.5px dashed #D6CFC4",boxShadow:CS}}>
                            <div style={{fontSize:24,color:SOFT}}>＋</div>
                            <div style={{fontSize:9,color:SOFT,fontFamily:"'Baloo 2'",fontWeight:700,marginTop:4}}>Add Item</div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  {/* Add new item row when no match */}
                  {showAddNew && (
                    <div onClick={()=>{setPantryModal(true);setNewName(stockSearch.trim());setNewEmoji("");setNewItemMeals(["breakfast","lunch","dinner","snack"]);}} className="card"
                      style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:PT.light,borderRadius:18,border:`2px solid ${PT.g1}`,boxShadow:`0 4px 16px ${PT.shadow}`,cursor:"pointer",animation:"fadeUp 0.2s ease"}}>
                      <div style={{width:44,height:44,borderRadius:14,background:`linear-gradient(135deg,${PT.g1},${PT.g2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"white",flexShrink:0}}>＋</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:15,fontWeight:800,color:DARK,fontFamily:"'Baloo 2'"}}>{stockSearch.trim()}</div>
                        <div style={{fontSize:12,color:PT.text,fontFamily:"'Baloo 2'",fontWeight:600,marginTop:1}}>Tap to add to pantry</div>
                      </div>
                      <div style={{fontSize:20,color:PT.g1,fontWeight:800}}>＋</div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* GROCERY TAB */}
        {pantryView==="grocery" && (
          <div style={{flex:1,overflow:"hidden",display:"flex",flexDirection:"column"}}>
            <div style={{padding:"12px 16px 0",flexShrink:0}}>
              <Hint icon="🛒" text="Tap anything in 'Need to Buy' to add it to your list. Check things off at the store, then hit Confirm to restock your pantry."/>
              <div style={{display:"flex",gap:8,marginTop:12}}>
                <input
                  value={groceryInput}
                  onChange={e=>{setGroceryInput(e.target.value);setGrocerySearch(e.target.value);}}
                  onKeyDown={e=>e.key==="Enter"&&(()=>{const n=groceryInput.trim();if(!n)return;setGroceryList(prev=>[...prev,{id:`g${Date.now()}`,name:n,checked:false}]);setGroceryInput("");setGrocerySearch("");})()}
                  placeholder="Search or add an item…"
                  style={{flex:1,padding:"13px 16px",borderRadius:16,border:`2px solid ${groceryInput?PT.g1:"#EDE5DA"}`,fontSize:15,fontFamily:"'Baloo 2'",outline:"none",background:"white",boxShadow:CS,transition:"border-color 0.18s"}}
                />
                <button onClick={()=>{const n=groceryInput.trim();if(!n)return;setGroceryList(prev=>[...prev,{id:`g${Date.now()}`,name:n,checked:false}]);setGroceryInput("");setGrocerySearch("");}} className="btn" style={{padding:"13px 18px",borderRadius:16,border:"none",background:`linear-gradient(135deg,${PT.g1},${PT.g2})`,color:"white",fontSize:20,cursor:"pointer",flexShrink:0,boxShadow:`0 4px 14px ${PT.shadow}`}}>＋</button>
              </div>
              {!grocerySearch && (
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8}}>
                  <button onClick={copyGroceryList} className="btn" style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Baloo 2'",color:copied?PT.g1:MID}}>
                    {copied?"✓ Copied!":"📋 Copy list"}
                  </button>
                  {groceryList.some(x=>x.checked&&!x.pantryId) && (
                    <button onClick={()=>setGroceryList(prev=>prev.filter(x=>!(x.checked&&!x.pantryId)))} className="btn" style={{background:"none",border:"none",cursor:"pointer",fontSize:12,fontWeight:700,fontFamily:"'Baloo 2'",color:"#EF4444"}}>
                      Clear done
                    </button>
                  )}
                </div>
              )}
            </div>

            <div style={{flex:1,overflow:"auto",padding:"10px 16px 32px"}}>
              {(() => {
                const q = grocerySearch.trim().toLowerCase();
                const filteredList = groceryList.filter(x => !q || x.name.toLowerCase().includes(q));
                const filteredOOS  = oosNotOnList.filter(x => !q || x.name.toLowerCase().includes(q));
                const alreadyInList = groceryList.some(x=>x.name.toLowerCase()===q);
                const alreadyOOS    = outOfStockItems.some(x=>x.name.toLowerCase()===q);
                const showAddNew = q && !alreadyInList && !alreadyOOS;
                const pendingRestock = groceryList.filter(x=>x.checked&&x.pantryId);
                const isEmpty = filteredList.length===0 && filteredOOS.length===0 && !showAddNew && pendingRestock.length===0;

                if (isEmpty && !q) return (
                  <div style={{textAlign:"center",padding:"40px 20px"}}>
                    <div style={{fontSize:52,animation:"float 3s ease-in-out infinite"}}>🛒</div>
                    <p style={{fontFamily:"'Baloo 2'",fontSize:16,fontWeight:800,color:DARK,marginTop:14}}>All stocked up!</p>
                    <p style={{fontFamily:"'Baloo 2'",fontSize:13,color:SOFT,marginTop:6}}>Nothing needed. Add items above or mark things out of stock in the Stock tab.</p>
                  </div>
                );

                return (
                  <>
                    {/* Confirm Purchased & Restock */}
                    {pendingRestock.length>0 && (
                      <div style={{marginBottom:16,animation:"fadeUp 0.3s ease"}}>
                        <button onClick={confirmPurchasedAndRestock} className="btn"
                          style={{width:"100%",padding:"16px 20px",borderRadius:20,border:"none",background:`linear-gradient(135deg,${GR1},${GR2})`,color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:`0 6px 22px rgba(22,163,74,0.35)`,animation:"pulse 2.5s ease-in-out infinite"}}>
                          <div style={{display:"flex",alignItems:"center",gap:10}}>
                            <span style={{fontSize:22}}>🏠</span>
                            <div style={{textAlign:"left"}}>
                              <div style={{fontSize:14,fontWeight:800,fontFamily:"'Baloo 2'"}}>Confirm Purchased &amp; Restock</div>
                              <div style={{fontSize:12,opacity:.85,fontFamily:"'Baloo 2'",marginTop:1}}>{pendingRestock.length} item{pendingRestock.length!==1?"s":""} · {pendingRestock.map(x=>x.name).join(", ")}</div>
                            </div>
                          </div>
                          <div style={{background:"rgba(255,255,255,0.22)",borderRadius:50,padding:"5px 14px",fontSize:13,fontWeight:800,fontFamily:"'Baloo 2'",flexShrink:0}}>Restock →</div>
                        </button>
                      </div>
                    )}

                    {/* Add new item prompt */}
                    {showAddNew && (
                      <div onClick={()=>{const n=groceryInput.trim();if(!n)return;setGroceryList(prev=>[...prev,{id:`g${Date.now()}`,name:n,checked:false}]);setGroceryInput("");setGrocerySearch("");}} className="card"
                        style={{display:"flex",alignItems:"center",gap:14,padding:"14px 18px",background:PT.light,borderRadius:18,border:`2px solid ${PT.g1}`,boxShadow:`0 4px 16px ${PT.shadow}`,cursor:"pointer",marginBottom:16,animation:"fadeUp 0.2s ease"}}>
                        <div style={{width:44,height:44,borderRadius:14,background:`linear-gradient(135deg,${PT.g1},${PT.g2})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:800,color:"white",flexShrink:0}}>＋</div>
                        <div style={{flex:1}}>
                          <div style={{fontSize:15,fontWeight:800,color:DARK,fontFamily:"'Baloo 2'"}}>{groceryInput.trim()}</div>
                          <div style={{fontSize:12,color:PT.text,fontFamily:"'Baloo 2'",fontWeight:600,marginTop:1}}>Tap to add to grocery list</div>
                        </div>
                      </div>
                    )}

                    {/* My List */}
                    {filteredList.length>0 && (
                      <div style={{marginBottom:20}}>
                        <SL>{q?`My List — "${grocerySearch}"`:"My List"}</SL>
                        <div style={{background:"white",borderRadius:20,overflow:"hidden",boxShadow:CS}}>
                          {filteredList.map((item,idx)=>(
                            <div key={item.id} style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:idx<filteredList.length-1?"1px solid #F5EEE6":"none",opacity:item.checked?.5:1,transition:"opacity 0.2s",background:item.checked&&item.pantryId?"#F0FDF4":"white"}}>
                              <div onClick={()=>setGroceryList(prev=>prev.map(x=>x.id===item.id?{...x,checked:!x.checked}:x))}
                                style={{width:24,height:24,borderRadius:8,flexShrink:0,border:item.checked?"none":"2px solid #D6CFC4",background:item.checked?PT.g1:"white",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s",boxShadow:item.checked?`0 2px 8px ${PT.shadow}`:"none"}}>
                                {item.checked&&<span style={{color:"white",fontSize:14,fontWeight:900}}>✓</span>}
                              </div>
                              {item.emoji && <span style={{fontSize:20,flexShrink:0,filter:item.checked?"grayscale(0.3)":"none"}}>{item.emoji}</span>}
                              <span style={{flex:1,fontSize:15,fontWeight:600,fontFamily:"'Baloo 2'",color:item.checked?SOFT:DARK,textDecoration:item.checked?"line-through":"none",transition:"all 0.2s"}}>{item.name}</span>
                              {item.pantryId && (
                                <span style={{fontSize:10,fontWeight:800,fontFamily:"'Baloo 2'",color:item.checked?GR1:PT.text,background:item.checked?"#DCFCE7":PT.light,borderRadius:50,padding:"2px 8px",flexShrink:0}}>
                                  {item.checked?"✓ bought":"🏠 pantry"}
                                </span>
                              )}
                              <button onClick={()=>setGroceryList(prev=>prev.filter(x=>x.id!==item.id))} style={{background:"none",border:"none",cursor:"pointer",color:SOFT,fontSize:15,padding:"2px 4px",flexShrink:0}}>✕</button>
                            </div>
                          ))}
                        </div>
                        {pendingRestock.length>0 && !q && (
                          <p style={{fontSize:11,color:PT.g1,fontFamily:"'Baloo 2'",fontWeight:700,textAlign:"center",marginTop:8}}>
                            🏠 {pendingRestock.length} item{pendingRestock.length!==1?"s":""} ready to restock — tap the button above
                          </p>
                        )}
                      </div>
                    )}

                    {/* Need to Buy (OOS not yet on list) */}
                    {filteredOOS.length>0 && (
                      <div>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:10}}>
                          <SL>{q?`Need to Buy — "${grocerySearch}"`:"Need to Buy"}</SL>
                          <span style={{fontSize:11,color:SOFT,fontFamily:"'Baloo 2'",fontWeight:600}}>tap to add →</span>
                        </div>
                        <div style={{background:"white",borderRadius:20,overflow:"hidden",boxShadow:CS}}>
                          {filteredOOS.map((item,idx)=>(
                            <div key={item.id} onClick={()=>addPantryItemToGrocery(item)} className="card"
                              style={{display:"flex",alignItems:"center",gap:12,padding:"13px 16px",borderBottom:idx<filteredOOS.length-1?"1px solid #F5EEE6":"none",cursor:"pointer"}}>
                              <div style={{width:24,height:24,borderRadius:8,flexShrink:0,border:"2px dashed #D6CFC4",background:"transparent",display:"flex",alignItems:"center",justifyContent:"center"}}>
                                <span style={{fontSize:12,color:SOFT,fontWeight:800}}>+</span>
                              </div>
                              <span style={{fontSize:22,filter:"grayscale(0.5)",opacity:.65}}>{item.emoji}</span>
                              <span style={{flex:1,fontSize:15,fontWeight:600,fontFamily:"'Baloo 2'",color:MID}}>{item.name}</span>
                              {(usage[item.id]?.count||0)>0 && <span style={{fontSize:11,fontFamily:"'Baloo 2'",fontWeight:700,color:"white",background:SOFT,borderRadius:50,padding:"2px 8px",flexShrink:0}}>{usage[item.id].count}×</span>}
                              <span style={{fontSize:11,fontWeight:700,fontFamily:"'Baloo 2'",color:PT.text,background:PT.light,borderRadius:50,padding:"3px 10px",flexShrink:0}}>Add →</span>
                            </div>
                          ))}
                        </div>
                        {!q && <p style={{fontSize:11,color:SOFT,fontFamily:"'Baloo 2'",textAlign:"center",marginTop:8,fontWeight:600}}>Sorted by how often the kids pick them</p>}
                      </div>
                    )}

                    {q && filteredList.length===0 && filteredOOS.length===0 && !showAddNew && (
                      <div style={{textAlign:"center",padding:"32px 0"}}>
                        <div style={{fontSize:40,opacity:.2}}>🔍</div>
                        <p style={{fontFamily:"'Baloo 2'",fontSize:14,color:SOFT,fontWeight:600,marginTop:12}}>No results for "{grocerySearch}"</p>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        )}

        {/* INSIGHTS TAB */}
        {pantryView==="insights" && (
          <div style={{flex:1,overflow:"auto"}}>
            <div style={{padding:"14px 18px 0"}}>
              <Hint icon="📊" text="Built automatically from how your family uses the app. The more you use HappyPlate, the smarter it gets."/>
            </div>
            <InsightsView pantry={pantry} usage={usage}/>
          </div>
        )}

        {/* Add to pantry modal */}
        {pantryModal && (
          <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",zIndex:50,display:"flex",alignItems:"flex-end"}}>
            <div style={{background:CREAM,width:"100%",borderRadius:"28px 28px 0 0",padding:"28px 22px 52px",animation:"slideUp 0.28s ease",boxShadow:"0 -8px 40px rgba(0,0,0,0.15)"}}>
              <h3 style={{fontSize:20,fontWeight:800,fontFamily:"'Baloo 2'",color:DARK,marginBottom:20}}>Add to Pantry</h3>
              <div style={{display:"flex",gap:10,marginBottom:16}}>
                <input value={newEmoji} onChange={e=>setNewEmoji(e.target.value)} placeholder="🍽️" maxLength={2} style={{width:58,padding:"12px",borderRadius:14,border:"2px solid #EDE5DA",fontSize:24,textAlign:"center",outline:"none",background:"white"}}/>
                <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Item name…" onKeyDown={e=>e.key==="Enter"&&addCustomPantryItem()} autoFocus style={{flex:1,padding:"12px 16px",borderRadius:14,border:"2px solid #EDE5DA",fontSize:16,fontFamily:"'Baloo 2'",outline:"none",background:"white"}}/>
              </div>
              <div style={{marginBottom:14}}>
                <p style={{fontSize:12,color:SOFT,fontFamily:"'Baloo 2'",fontWeight:600,marginBottom:8}}>Tag for meals:</p>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {Object.entries(MEALS).concat([["snack",{label:"Snack",emoji:"🍿"}]]).map(([key,mx])=>{
                    const on = newItemMeals.includes(key);
                    return <button key={key} onClick={()=>setNewItemMeals(prev=>on?prev.filter(x=>x!==key):[...prev,key])} className="btn" style={{padding:"6px 14px",borderRadius:50,border:`2px solid ${on?"#1A1410":"#EDE5DA"}`,background:on?DARK:"white",color:on?"white":MID,fontSize:13,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer"}}>{mx.emoji} {mx.label}</button>;
                  })}
                </div>
              </div>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setPantryModal(false)} className="btn" style={{flex:1,padding:"14px",borderRadius:14,border:"2px solid #EDE5DA",background:"white",color:MID,fontSize:15,fontFamily:"'Baloo 2'",fontWeight:700,cursor:"pointer"}}>Cancel</button>
                <button onClick={addCustomPantryItem} className="btn" style={{flex:2,padding:"14px",borderRadius:14,border:"none",background:`linear-gradient(135deg,${PT.g1},${PT.g2})`,color:"white",fontSize:15,fontFamily:"'Baloo 2'",fontWeight:700,cursor:"pointer"}}>Add to Pantry</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Edit Item Sheet ── */}
        {editingItem && pantry[editingItem] && (() => {
          const ei = pantry[editingItem];
          return (
            <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",zIndex:60,display:"flex",alignItems:"flex-end"}}>
              <div style={{background:CREAM,width:"100%",borderRadius:"28px 28px 0 0",padding:"24px 22px 52px",animation:"slideUp 0.28s ease",boxShadow:"0 -8px 40px rgba(0,0,0,0.15)"}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
                  <h3 style={{fontSize:18,fontWeight:800,fontFamily:"'Baloo 2'",color:DARK}}>Edit Item</h3>
                  <button onClick={()=>setEditingItem(null)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:SOFT}}>✕</button>
                </div>

                {/* Emoji + Name */}
                <div style={{display:"flex",gap:10,marginBottom:16}}>
                  <input defaultValue={ei.emoji} id="ei-emoji" placeholder="🍽️" maxLength={2}
                    style={{width:58,padding:"12px",borderRadius:14,border:"2px solid #EDE5DA",fontSize:24,textAlign:"center",outline:"none",background:"white"}}/>
                  <input defaultValue={ei.name} id="ei-name" placeholder="Item name…"
                    style={{flex:1,padding:"12px 16px",borderRadius:14,border:`2px solid ${PT.g1}`,fontSize:16,fontFamily:"'Baloo 2'",outline:"none",background:"white"}}/>
                </div>

                {/* Photo upload */}
                <div style={{marginBottom:16}}>
                  <p style={{fontSize:12,color:SOFT,fontFamily:"'Baloo 2'",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Photo (optional)</p>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    {ei.photo
                      ? <img src={ei.photo} alt={ei.name} style={{width:52,height:52,borderRadius:14,objectFit:"cover",border:`2px solid ${PT.g1}`}}/>
                      : <div style={{width:52,height:52,borderRadius:14,background:"#F0EDE8",border:"2px dashed #D6CFC4",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{ei.emoji}</div>
                    }
                    <label className="btn" style={{flex:1,padding:"11px 16px",borderRadius:14,border:`2px solid ${PT.g1}`,background:PT.light,color:PT.text,fontSize:13,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer",textAlign:"center"}}>
                      {ei.photo?"Change Photo 📷":"Add Photo 📷"}
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = ev => {
                          // Compress via canvas
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement("canvas");
                            const MAX = 200;
                            const scale = Math.min(MAX/img.width, MAX/img.height, 1);
                            canvas.width  = Math.round(img.width*scale);
                            canvas.height = Math.round(img.height*scale);
                            canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
                            setPantry(prev=>({...prev,[editingItem]:{...prev[editingItem],photo:canvas.toDataURL("image/jpeg",0.7)}}));
                          };
                          img.src = ev.target.result;
                        };
                        reader.readAsDataURL(file);
                      }}/>
                    </label>
                    {ei.photo && <button onClick={()=>setPantry(prev=>({...prev,[editingItem]:{...prev[editingItem],photo:undefined}}))} className="btn"
                      style={{padding:"11px 14px",borderRadius:14,border:"2px solid #FECACA",background:"#FEF2F2",color:"#DC2626",fontSize:12,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer"}}>Remove</button>}
                  </div>
                </div>

                {/* Meal tags */}
                <div style={{marginBottom:20}}>
                  <p style={{fontSize:12,color:SOFT,fontFamily:"'Baloo 2'",fontWeight:700,marginBottom:8,textTransform:"uppercase",letterSpacing:"0.06em"}}>Meal Tags</p>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {[...Object.entries(MEALS),["snack",{label:"Snack",emoji:"🍿"}]].map(([key,mx])=>{
                      const on = ei.meals?.includes(key);
                      return (
                        <button key={key} onClick={()=>{
                          const next = on ? ei.meals.filter(x=>x!==key) : [...(ei.meals||[]),key];
                          setPantry(prev=>({...prev,[editingItem]:{...prev[editingItem],meals:next}}));
                        }} className="btn" style={{padding:"6px 14px",borderRadius:50,border:`2px solid ${on?DARK:"#EDE5DA"}`,background:on?DARK:"white",color:on?"white":MID,fontSize:13,fontWeight:700,fontFamily:"'Baloo 2'",cursor:"pointer"}}>
                          {mx.emoji} {mx.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Save */}
                <button onClick={()=>{
                  const name  = document.getElementById("ei-name")?.value.trim();
                  const emoji = document.getElementById("ei-emoji")?.value.trim();
                  editPantryItem(editingItem, {
                    ...(name  ? {name}  : {}),
                    ...(emoji ? {emoji} : {}),
                  });
                }} className="btn" style={{width:"100%",padding:"15px",borderRadius:18,border:"none",background:`linear-gradient(135deg,${PT.g1},${PT.g2})`,color:"white",fontSize:15,fontWeight:800,fontFamily:"'Baloo 2'",cursor:"pointer",boxShadow:`0 4px 18px ${PT.shadow}`}}>
                  Save Changes ✓
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }
}
