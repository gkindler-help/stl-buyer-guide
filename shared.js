/**
 * shared.js — St. Louis Buyer Guide
 * Single source of truth for ZIP data, tax rates, color engine,
 * and financial calculations used across all tools in this repo.
 *
 * Files that reference this:
 *   index.html, prep.html, compare.html, home-cost.html, afford.html
 *
 * To update market data: edit ZIP_DATA and ZIP_TAX below.
 * Every tool in the repo reflects the change automatically.
 *
 * Data source: 2025 MARIS MLS — residential sales, St. Louis metro
 * Excludes: new construction, tenant-occupied, condos
 */

'use strict';

// ════════════════════════════════════════════════════════════════
// BRAND / STYLE CONSTANTS
// Keep in sync with CSS :root variables across all HTML files
// ════════════════════════════════════════════════════════════════
const BRAND = {
  navy:       '#0A1628',
  navyMid:    '#1B3A6B',
  card:       '#162040',
  deep:       '#0d1e3a',
  gold:       '#D4A017',
  goldLight:  '#E8B820',
  green:      '#1a7a4a',
  greenLight: '#5DCAA5',
  red:        '#C0392B',
  redLight:   '#E88080',
  warn:       '#E8A020',
  gray:       '#8A9BB0',
  grayLight:  '#B0C0D0',
  cream:      '#F5F0E8',
  border:     '#1e3060',
  text:       '#c8d8e8',
};

// ════════════════════════════════════════════════════════════════
// MARKET DATA — 2025 MARIS MLS
// Keys: zip code (string)
// Fields:
//   city   — primary city name for this zip
//   n      — number of transactions analyzed
//   fw     — first weekend rate (% of homes that sold ≤7 days at/above list)
//   dom    — median days on market
//   price  — median sale price
//   splp   — median sale price / list price ratio (%)
//   above  — % of sales at or above list price
// ════════════════════════════════════════════════════════════════
const ZIP_DATA = {
  "63005":{city:"Chesterfield",      n:70,  fw:41.4, dom:7.5,  price:800000, splp:100.0, above:52.9},
  "63010":{city:"Arnold",            n:122, fw:45.9, dom:6.5,  price:282400, splp:101.4, above:67.2},
  "63011":{city:"Ballwin",           n:169, fw:47.3, dom:6,    price:455000, splp:101.1, above:69.2},
  "63012":{city:"Barnhart",          n:43,  fw:39.5, dom:9,    price:290000, splp:100.0, above:69.8},
  "63016":{city:"Cedar Hill",        n:26,  fw:26.9, dom:37.5, price:326000, splp:98.7,  above:46.2},
  "63017":{city:"Chesterfield W.",   n:130, fw:46.9, dom:6.0,  price:575000, splp:100.0, above:59.2},
  "63019":{city:"Crystal City",      n:27,  fw:33.3, dom:25,   price:230000, splp:100.0, above:55.6},
  "63020":{city:"De Soto",           n:126, fw:19.0, dom:38.5, price:219500, splp:100.0, above:56.3},
  "63021":{city:"Ballwin S.",        n:192, fw:49.0, dom:6.0,  price:414200, splp:100.6, above:69.3},
  "63023":{city:"Dittmer",           n:24,  fw:29.2, dom:33.0, price:332500, splp:100.0, above:54.2},
  "63025":{city:"Eureka",            n:108, fw:21.3, dom:32.5, price:442500, splp:99.9,  above:50.0},
  "63026":{city:"Fenton",            n:224, fw:46.0, dom:7.0,  price:387400, splp:100.7, above:70.5},
  "63028":{city:"Festus",            n:149, fw:31.5, dom:19,   price:320000, splp:100.0, above:61.1},
  "63031":{city:"Florissant",        n:217, fw:36.4, dom:11,   price:180000, splp:100.0, above:69.6},
  "63033":{city:"Florissant N.",     n:151, fw:30.5, dom:16,   price:220000, splp:100.0, above:65.6},
  "63034":{city:"Florissant E.",     n:71,  fw:26.8, dom:18,   price:289000, splp:100.0, above:53.5},
  "63038":{city:"Wildwood",          n:34,  fw:47.1, dom:4.5,  price:626200, splp:100.0, above:58.8},
  "63040":{city:"Wildwood W.",       n:45,  fw:53.3, dom:6,    price:525000, splp:100.8, above:71.1},
  "63042":{city:"Hazelwood",         n:64,  fw:34.4, dom:9.0,  price:195000, splp:100.0, above:59.4},
  "63043":{city:"Maryland Heights",  n:83,  fw:53.0, dom:4,    price:295000, splp:101.9, above:71.1},
  "63044":{city:"Bridgeton",         n:40,  fw:42.5, dom:9.5,  price:267500, splp:100.0, above:65.0},
  "63048":{city:"Herculaneum",       n:25,  fw:24.0, dom:24,   price:319900, splp:100.0, above:64.0},
  "63049":{city:"High Ridge",        n:82,  fw:45.1, dom:6.0,  price:297500, splp:100.0, above:64.6},
  "63050":{city:"Hillsboro",         n:90,  fw:31.1, dom:36.0, price:328500, splp:100.0, above:61.1},
  "63051":{city:"House Springs",     n:61,  fw:36.1, dom:11,   price:290000, splp:100.0, above:60.7},
  "63052":{city:"Imperial",          n:132, fw:50.0, dom:6.0,  price:331500, splp:100.4, above:72.0},
  "63069":{city:"Pacific",           n:22,  fw:22.7, dom:27.5, price:532500, splp:100.0, above:54.5},
  "63070":{city:"Pevely",            n:37,  fw:40.5, dom:14,   price:281000, splp:101.7, above:78.4},
  "63074":{city:"St. Ann",           n:61,  fw:24.6, dom:18,   price:166500, splp:100.0, above:57.4},
  "63088":{city:"Valley Park",       n:37,  fw:56.8, dom:5,    price:320000, splp:101.4, above:73.0},
  "63104":{city:"St. Louis City",    n:64,  fw:21.9, dom:18.0, price:443200, splp:99.3,  above:45.3},
  "63105":{city:"Clayton",           n:21,  fw:33.3, dom:19,   price:850000, splp:100.0, above:61.9},
  "63108":{city:"St. Louis City W.", n:17,  fw:23.5, dom:32,   price:581000, splp:98.4,  above:35.3},
  "63109":{city:"St. Louis City S.", n:152, fw:45.4, dom:8.0,  price:301700, splp:100.0, above:66.4},
  "63110":{city:"St. Louis City C.", n:54,  fw:31.5, dom:18.0, price:349700, splp:100.0, above:53.7},
  "63111":{city:"St. Louis City SE", n:66,  fw:27.3, dom:34.0, price:165000, splp:100.0, above:62.1},
  "63112":{city:"St. Louis City N.", n:19,  fw:0.0,  dom:62,   price:275000, splp:98.0,  above:42.1},
  "63113":{city:"St. Louis City NW", n:6,   fw:0.0,  dom:21.5, price:72000,  splp:98.4,  above:50.0},
  "63114":{city:"Overland",          n:136, fw:38.2, dom:8.0,  price:164400, splp:100.0, above:65.4},
  "63115":{city:"St. Louis City NE", n:9,   fw:11.1, dom:44,   price:74600,  splp:99.6,  above:44.4},
  "63116":{city:"St. Louis City SW", n:201, fw:30.3, dom:21,   price:221600, splp:100.0, above:65.2},
  "63117":{city:"Richmond Heights",  n:31,  fw:48.4, dom:9,    price:355000, splp:101.9, above:67.7},
  "63118":{city:"St. Louis City S2", n:80,  fw:23.8, dom:28.5, price:263400, splp:100.0, above:51.2},
  "63119":{city:"Webster Groves",    n:164, fw:52.4, dom:5.0,  price:393000, splp:101.6, above:71.3},
  "63120":{city:"St. Louis City NW2",n:6,   fw:16.7, dom:59.0, price:72000,  splp:97.6,  above:50.0},
  "63121":{city:"Normandy",          n:63,  fw:19.0, dom:32,   price:116000, splp:98.8,  above:49.2},
  "63122":{city:"Kirkwood",          n:239, fw:54.4, dom:5,    price:600000, splp:100.9, above:69.0},
  "63123":{city:"Affton",            n:236, fw:48.3, dom:6.0,  price:259500, splp:100.3, above:72.0},
  "63124":{city:"Ladue",             n:30,  fw:33.3, dom:35.0, price:787500, splp:99.4,  above:50.0},
  "63125":{city:"Mehlville",         n:122, fw:47.5, dom:7.0,  price:219000, splp:101.8, above:70.5},
  "63126":{city:"Crestwood",         n:80,  fw:53.8, dom:5.0,  price:330000, splp:102.3, above:75.0},
  "63127":{city:"Sunset Hills",      n:20,  fw:45.0, dom:6.5,  price:739000, splp:100.0, above:60.0},
  "63128":{city:"Oakville",          n:107, fw:48.6, dom:5,    price:421900, splp:100.0, above:69.2},
  "63129":{city:"Oakville S.",       n:198, fw:44.4, dom:7.5,  price:360000, splp:101.1, above:70.2},
  "63130":{city:"University City",   n:127, fw:36.2, dom:11,   price:457900, splp:100.0, above:61.4},
  "63131":{city:"Des Peres",         n:58,  fw:46.6, dom:7.5,  price:832500, splp:100.2, above:63.8},
  "63132":{city:"Overland E.",       n:43,  fw:32.6, dom:26,   price:475000, splp:100.0, above:55.8},
  "63133":{city:"Maplewood S.",      n:14,  fw:35.7, dom:30.0, price:107500, splp:98.8,  above:50.0},
  "63134":{city:"Pagedale",          n:53,  fw:32.1, dom:12,   price:120000, splp:100.0, above:56.6},
  "63135":{city:"Ferguson",          n:84,  fw:23.8, dom:19.5, price:115600, splp:100.0, above:52.4},
  "63136":{city:"Jennings",          n:135, fw:19.3, dom:25,   price:95000,  splp:99.7,  above:49.6},
  "63137":{city:"Bellefontaine Nbrs",n:59,  fw:20.3, dom:23,   price:110000, splp:100.0, above:55.9},
  "63138":{city:"N. County",         n:59,  fw:22.0, dom:32,   price:158200, splp:100.0, above:50.8},
  "63139":{city:"St. Louis City SW2",n:118, fw:44.1, dom:7.0,  price:255500, splp:100.0, above:60.2},
  "63141":{city:"Creve Coeur",       n:76,  fw:46.1, dom:5.5,  price:637000, splp:100.0, above:67.1},
  "63143":{city:"Maplewood",         n:35,  fw:40.0, dom:11,   price:290000, splp:100.0, above:62.9},
  "63144":{city:"Brentwood",         n:44,  fw:52.3, dom:7.0,  price:402500, splp:100.2, above:68.2},
  "63146":{city:"Maryland Hts W.",   n:97,  fw:43.3, dom:7,    price:355000, splp:100.0, above:60.8},
  "63147":{city:"St. Louis City NW3",n:19,  fw:5.3,  dom:28,   price:114000, splp:100.0, above:52.6},
  "63301":{city:"St. Charles",       n:210, fw:44.3, dom:6.0,  price:320000, splp:100.0, above:68.1},
  "63303":{city:"St. Charles E.",    n:93,  fw:59.1, dom:4,    price:333000, splp:100.0, above:73.1},
  "63304":{city:"St. Charles S.",    n:116, fw:50.0, dom:5.0,  price:350000, splp:100.8, above:70.7},
  "63341":{city:"Defiance",          n:5,   fw:0.0,  dom:53,   price:325000, splp:92.5,  above:20.0},
  "63348":{city:"Foristell",         n:13,  fw:46.2, dom:10,   price:310000, splp:100.0, above:84.6},
  "63366":{city:"O'Fallon",          n:138, fw:42.0, dom:10.5, price:328200, splp:100.0, above:68.8},
  "63367":{city:"Lake St. Louis",    n:65,  fw:36.9, dom:11,   price:345000, splp:100.0, above:50.8},
  "63368":{city:"O'Fallon S.",       n:84,  fw:42.9, dom:6.5,  price:360000, splp:100.0, above:63.1},
  "63376":{city:"St. Peters",        n:272, fw:50.4, dom:5.0,  price:329900, splp:100.7, above:72.1},
  "63385":{city:"Wentzville",        n:197, fw:36.5, dom:12,   price:340000, splp:100.0, above:65.5},
};

// ════════════════════════════════════════════════════════════════
// TAX RATES — effective rate on home value
// Source: county assessor records, 2025
// ════════════════════════════════════════════════════════════════
const ZIP_TAX = {
  // St. Charles County (lowest) — 0.92%
  "63005":0.0092,
  "63301":0.0092,"63303":0.0092,"63304":0.0092,
  "63341":0.0092,"63348":0.0092,
  "63366":0.0092,"63367":0.0092,"63368":0.0092,
  "63376":0.0092,"63385":0.0092,
  // St. Louis City — 1.02%
  "63104":0.0102,"63108":0.0102,"63109":0.0102,"63110":0.0102,
  "63111":0.0102,"63112":0.0102,"63113":0.0102,"63115":0.0102,
  "63116":0.0102,"63118":0.0102,"63120":0.0102,"63139":0.0102,
  "63147":0.0102,
  // St. Louis County standard — 1.14%
  "63010":0.0114,"63011":0.0114,"63012":0.0114,"63016":0.0114,
  "63017":0.0114,"63019":0.0114,"63020":0.0114,"63021":0.0114,
  "63023":0.0114,"63025":0.0114,"63026":0.0114,"63028":0.0114,
  "63031":0.0114,"63033":0.0114,"63034":0.0114,"63038":0.0114,
  "63040":0.0114,"63042":0.0114,"63043":0.0114,"63044":0.0114,
  "63048":0.0114,"63049":0.0114,"63050":0.0114,"63051":0.0114,
  "63052":0.0114,"63069":0.0114,"63070":0.0114,"63074":0.0114,
  "63088":0.0114,"63114":0.0114,"63117":0.0114,"63121":0.0114,
  "63123":0.0114,"63124":0.0114,"63125":0.0114,"63126":0.0114,
  "63127":0.0114,"63128":0.0114,"63129":0.0114,"63130":0.0114,
  "63131":0.0114,"63132":0.0114,"63133":0.0114,"63134":0.0114,
  "63135":0.0114,"63136":0.0114,"63137":0.0114,"63138":0.0114,
  "63141":0.0114,"63143":0.0114,"63146":0.0114,
  // Higher St. Louis County municipalities
  "63105":0.0118, // Clayton
  "63144":0.0118, // Brentwood
  "63119":0.0128, // Webster Groves
  "63122":0.0132, // Kirkwood (highest in dataset)
};

const ZIP_INS = { default: 3000 }; // annual insurance estimate

// ════════════════════════════════════════════════════════════════
// SCHOOL DISTRICTS
// ════════════════════════════════════════════════════════════════
const ZIP_DISTRICT = {
  "63005":"Rockwood R-VI",   "63010":"Fox C-6",
  "63011":"Rockwood R-VI",   "63017":"Rockwood R-VI",
  "63021":"Rockwood R-VI",   "63025":"Rockwood R-VI",
  "63026":"Rockwood R-VI",   "63038":"Rockwood R-VI",
  "63040":"Rockwood R-VI",   "63088":"Rockwood R-VI",
  "63043":"Pattonville R-3", "63044":"Pattonville R-3",
  "63031":"Ferguson-Florissant R-II",
  "63033":"Ferguson-Florissant R-II",
  "63034":"Ferguson-Florissant R-II",
  "63042":"Hazelwood",       "63074":"Hazelwood",
  "63119":"Webster Groves",  "63122":"Kirkwood R-7",
  "63141":"Parkway C-2",     "63146":"Parkway C-2",
  "63130":"University City", "63132":"Parkway C-2",
  "63117":"Maplewood-Richmond Heights",
  "63143":"Maplewood-Richmond Heights",
  "63144":"Brentwood",       "63105":"Clayton",
  "63010":"Fox C-6",         "63020":"Dunklin R-V",
  "63028":"Fox C-6",         "63049":"Fox C-6",
  "63050":"Hillsboro R-III", "63051":"Fox C-6",
  "63052":"Fox C-6",
  "63123":"Affton 101",      "63125":"Mehlville R-9",
  "63126":"Lindbergh Schools","63127":"Lindbergh Schools",
  "63128":"Mehlville R-9",   "63129":"Mehlville R-9",
  "63301":"Francis Howell R-3","63303":"Francis Howell R-3",
  "63304":"Francis Howell R-3","63366":"Fort Zumwalt R-II",
  "63367":"Lake St. Louis / Francis Howell",
  "63368":"Fort Zumwalt R-II","63376":"Francis Howell R-3",
  "63385":"Wentzville R-IV",
};

// ════════════════════════════════════════════════════════════════
// COUNTY MAP — which county each zip belongs to
// ════════════════════════════════════════════════════════════════
const ZIP_COUNTY = {
  "63005":"St. Louis County","63010":"Jefferson County",
  "63011":"St. Louis County","63012":"Jefferson County",
  "63016":"Jefferson County","63017":"St. Louis County",
  "63019":"Jefferson County","63020":"Jefferson County",
  "63021":"St. Louis County","63023":"Jefferson County",
  "63025":"St. Louis County","63026":"St. Louis County",
  "63028":"Jefferson County","63031":"St. Louis County",
  "63033":"St. Louis County","63034":"St. Louis County",
  "63038":"St. Louis County","63040":"St. Louis County",
  "63042":"St. Louis County","63043":"St. Louis County",
  "63044":"St. Louis County","63048":"Jefferson County",
  "63049":"Jefferson County","63050":"Jefferson County",
  "63051":"Jefferson County","63052":"Jefferson County",
  "63069":"St. Louis County","63070":"Jefferson County",
  "63074":"St. Louis County","63088":"St. Louis County",
  "63104":"St. Louis City",  "63105":"St. Louis County",
  "63108":"St. Louis City",  "63109":"St. Louis City",
  "63110":"St. Louis City",  "63111":"St. Louis City",
  "63112":"St. Louis City",  "63113":"St. Louis City",
  "63114":"St. Louis County","63115":"St. Louis City",
  "63116":"St. Louis City",  "63117":"St. Louis County",
  "63118":"St. Louis City",  "63119":"St. Louis County",
  "63120":"St. Louis City",  "63121":"St. Louis County",
  "63122":"St. Louis County","63123":"St. Louis County",
  "63124":"St. Louis County","63125":"St. Louis County",
  "63126":"St. Louis County","63127":"St. Louis County",
  "63128":"St. Louis County","63129":"St. Louis County",
  "63130":"St. Louis County","63131":"St. Louis County",
  "63132":"St. Louis County","63133":"St. Louis County",
  "63134":"St. Louis County","63135":"St. Louis County",
  "63136":"St. Louis County","63137":"St. Louis County",
  "63138":"St. Louis County","63139":"St. Louis City",
  "63141":"St. Louis County","63143":"St. Louis County",
  "63144":"St. Louis County","63146":"St. Louis County",
  "63147":"St. Louis City",
  "63301":"St. Charles County","63303":"St. Charles County",
  "63304":"St. Charles County","63341":"St. Charles County",
  "63348":"St. Charles County","63366":"St. Charles County",
  "63367":"St. Charles County","63368":"St. Charles County",
  "63376":"St. Charles County","63385":"St. Charles County",
};

// ════════════════════════════════════════════════════════════════
// SEARCH ALIASES
// Maps common names / area terms to zip arrays
// ════════════════════════════════════════════════════════════════
const ZIP_ALIASES = {
  'south county':    ['63125','63123','63128','63129','63126','63127'],
  'south st louis':  ['63116','63118','63109','63139','63111'],
  'north county':    ['63031','63033','63034','63042','63136','63138','63137'],
  'west county':     ['63005','63011','63017','63021','63038','63040','63141'],
  'st charles county':['63301','63303','63304','63366','63376','63385'],
  'jefferson county':['63010','63020','63028','63052','63049','63051'],
  'clayton':['63105'],     'kirkwood':['63122'],
  'webster':['63119'],     'webster groves':['63119'],
  'affton':['63123'],      'mehlville':['63125'],
  'arnold':['63010'],      'fenton':['63026'],
  'ballwin':['63011','63021'], 'chesterfield':['63005','63017'],
  'florissant':['63031','63033','63034'],
  'creve coeur':['63141'], 'maplewood':['63143'],
  'brentwood':['63144'],   'university city':['63130'],
  'u city':['63130'],      'crestwood':['63126'],
  'sunset hills':['63127'],'oakville':['63128','63129'],
  'valley park':['63088'], 'high ridge':['63049'],
  'imperial':['63052'],    'festus':['63028'],
  'st peters':['63376'],   'st charles':['63301','63303','63304'],
  "o'fallon":['63366','63368'], 'ofallon':['63366','63368'],
  'wentzville':['63385'],  'wildwood':['63038','63040'],
  'hazelwood':['63042'],   'maryland heights':['63043'],
  'bridgeton':['63044'],   'richmond heights':['63117'],
  'des peres':['63131'],   'overland':['63114','63132'],
  'normandy':['63121'],    'ladue':['63124'],
  'lake st louis':['63367'],'lake saint louis':['63367'],
};

// ════════════════════════════════════════════════════════════════
// COLOR ENGINE — matches heat map exactly
// ════════════════════════════════════════════════════════════════
function _lerp(a,b,t){return a+(b-a)*t;}
function _clamp(v,lo,hi){return Math.max(lo,Math.min(hi,v));}
function _hexToRgb(h){
  return[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
}
function _lerpColor(c1,c2,t){
  return[
    Math.round(_lerp(c1[0],c2[0],t)),
    Math.round(_lerp(c1[1],c2[1],t)),
    Math.round(_lerp(c1[2],c2[2],t))
  ];
}
function _rgbToHex(r,g,b){
  return '#'+[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
}

const _COLD = _hexToRgb('#8B1A1A');
const _MID  = _hexToRgb('#D4A017');
const _HOT  = _hexToRgb('#1a7a4a');

/**
 * heatColor(t) — returns a hex color on the cold→gold→green scale
 * t: 0.0 = coldest (worst), 1.0 = hottest (best)
 */
function heatColor(t){
  t=_clamp(t,0,1);
  if(t<0.5) return _rgbToHex(..._lerpColor(_COLD,_MID,t*2));
  return _rgbToHex(..._lerpColor(_MID,_HOT,(t-0.5)*2));
}

/**
 * fwHeatColor(fw) — color for a first-weekend rate value (0–60)
 */
function fwHeatColor(fw){
  return heatColor(_clamp((fw-0)/(60-0),0,1));
}

// ════════════════════════════════════════════════════════════════
// METRIC DEFINITIONS — used by heat map and prep tool
// ════════════════════════════════════════════════════════════════
const METRICS = {
  fw:   {label:'First Weekend Rate',  low:'0%',    high:'60%+', min:0,     max:60,    invert:false, fmt:v=>v.toFixed(1)+'%'},
  dom:  {label:'Median Days on Market',low:'60+ days',high:'4 days',min:3,max:60,    invert:true,  fmt:v=>v+' days'},
  price:{label:'Median Sale Price',   low:'$75K',  high:'$850K+',min:75000,max:850000,invert:false, fmt:v=>'$'+Math.round(v/1000)+'K'},
  above:{label:'% Sold At/Above List',low:'20%',   high:'85%',  min:20,    max:85,    invert:false, fmt:v=>v.toFixed(1)+'%'},
};

// ════════════════════════════════════════════════════════════════
// FINANCIAL CALCULATIONS
// ════════════════════════════════════════════════════════════════

/**
 * calcPI(loan, rate) — monthly principal & interest payment
 * loan: loan amount in dollars
 * rate: annual interest rate as percentage (e.g. 6.75)
 */
function calcPI(loan, rate){
  const r=(rate/100)/12, n=360;
  if(r===0) return loan/n;
  return loan*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
}

/**
 * calcTrueMonthly(homePrice, down, rate, zip)
 * Returns full PITI + PMI + maintenance breakdown
 */
function calcTrueMonthly(homePrice, down, rate, zip){
  const loan = homePrice - down;
  const pi   = calcPI(loan, rate);
  const tax  = (homePrice*(ZIP_TAX[zip]||0.0114))/12;
  const ins  = (ZIP_INS[zip]||ZIP_INS.default)/12;
  const pmi  = (down/homePrice)<0.20 ? (loan*0.0085)/12 : 0;
  const maint= (homePrice*0.015)/12;
  return {
    pi:    Math.round(pi),
    tax:   Math.round(tax),
    ins:   Math.round(ins),
    pmi:   Math.round(pmi),
    maint: Math.round(maint),
    total: Math.round(pi+tax+ins+pmi+maint),
    taxRate: ZIP_TAX[zip]||0.0114,
  };
}

/**
 * calcMaxPrice(payment, down, rate, debts)
 * Returns maximum purchase price for a given monthly budget
 */
function calcMaxPrice(payment, down, rate, debts){
  const r=(rate/100)/12, n=360;
  const mrf = r===0 ? 1/n : (r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
  const factor = mrf + 0.0015;
  const net = payment - (debts*0.1);
  return Math.round(Math.max(0, net/factor) + down);
}

/**
 * getTierPrice(d, condition)
 * Returns estimated price based on condition tier
 * condition: 'aisis' | 'mid' | 'move' | anything else = median
 */
function getTierPrice(d, condition){
  const p = d.price;
  if(condition==='aisis') return Math.round(p*0.82/1000)*1000;
  if(condition==='mid')   return Math.round(p*0.93/1000)*1000;
  if(condition==='move')  return Math.round(p*1.08/1000)*1000;
  return p;
}

/**
 * getValueFlag(d, zip)
 * Returns {flag, color, text} describing buyer opportunity level
 */
function getValueFlag(d, zip){
  const fw      = d.fw;
  const taxRate = ZIP_TAX[zip]||0.0114;
  if(fw>=50 && d.splp>=101) return {
    flag:'HOT MARKET', color:BRAND.greenLight,
    text:`${fw}% of homes here sell the first weekend at or above list. Come with pre-approval and be ready to move within hours.`
  };
  if(fw<30 && d.dom>20) return {
    flag:'BUYER LEVERAGE', color:BRAND.greenLight,
    text:`At ${fw}% first weekend rate and ${d.dom} average days on market, buyers have more negotiating room here than most of the metro.`
  };
  if(taxRate<=0.0092) return {
    flag:'TAX ADVANTAGE ZONE', color:BRAND.greenLight,
    text:`${ZIP_COUNTY[zip]||'This county'} rate is ${(taxRate*100).toFixed(2)}% — lowest in the metro. At $300K that saves $110–$140/month vs. a comparable St. Louis County address.`
  };
  return {
    flag:'ACTIVE MARKET', color:BRAND.gold,
    text:`${fw}% first weekend rate means competition is real but not overwhelming. Correctly priced homes move fast. Overpriced ones give buyers an opening.`
  };
}

// ════════════════════════════════════════════════════════════════
// SEARCH UTILITY
// ════════════════════════════════════════════════════════════════

/**
 * searchZips(query) — returns array of {zip, city} matches
 * Handles: exact zip, city name, alias terms
 * Returns up to 8 results
 */
function searchZips(query){
  const q = query.trim().toLowerCase();
  if(!q) return [];
  const results=[], seen=new Set();

  const add=(zip)=>{
    if(!seen.has(zip) && ZIP_DATA[zip]){
      results.push({zip, city:ZIP_DATA[zip].city});
      seen.add(zip);
    }
  };

  // Exact zip
  if(/^\d{5}$/.test(q)) add(q);

  // Alias match
  for(const[alias,zips] of Object.entries(ZIP_ALIASES)){
    if(alias.includes(q)) zips.forEach(add);
  }

  // Fuzzy city / zip match
  for(const[zip,d] of Object.entries(ZIP_DATA)){
    const s=(zip+' '+d.city).toLowerCase();
    if(s.includes(q)) add(zip);
  }

  return results.slice(0,8);
}

// ════════════════════════════════════════════════════════════════
// FORMATTING HELPERS
// ════════════════════════════════════════════════════════════════
const fmt$ = n => n<0
  ? '-$'+Math.abs(Math.round(n)).toLocaleString()
  : '$'+Math.round(n).toLocaleString();

const fmtK = n => '$'+Math.round(n/1000)+'K';

const fmtPct = n => n.toFixed(1)+'%';

// ════════════════════════════════════════════════════════════════
// GA4 HELPER — safe wrapper so tools don't break if gtag not loaded
// ════════════════════════════════════════════════════════════════
function gaEvent(name, params){
  if(typeof gtag !== 'undefined') gtag('event', name, params||{});
}

// ════════════════════════════════════════════════════════════════
// URL PARAMETER HELPERS
// Lets tools pass state to each other via query string
// e.g. prep.html passes ?zip=63125&price=280000 to compare.html
// ════════════════════════════════════════════════════════════════
function getParam(key){
  return new URLSearchParams(window.location.search).get(key)||'';
}

function buildUrl(base, params){
  const q = new URLSearchParams(params).toString();
  return base+(q?'?'+q:'');
}
