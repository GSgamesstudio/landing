/* Alternative AI paths used only after a player breaks the dated timeline. */
window.HISTORICAL_ALTERNATIVE_PATHS = [
  { id: "ww1-containment", years: [1904, 1912, 1914, 1918, 1919], defaultPath: true, agenda: "security", stability: 4, warSupport: 3 },
  { id: "interwar-regional", years: [1922, 1933, 1936, 1938, 1939, 1941], defaultPath: true, agenda: "regional", stability: 3, warSupport: 5 },
  { id: "cold-war-detente", years: [1945, 1960, 1980], defaultPath: true, agenda: "security", stability: 5, warSupport: 2 },
  { id: "modern-balance", years: [1994, 2008, 1866], defaultPath: true, agenda: "trade", stability: 4, warSupport: 0 },
  { id: "germany-alternative", years: [1933, 1936, 1938, 1939, 1941], countries: ["Германия"], agenda: "revisionist", stability: 0, warSupport: 8 },
  { id: "uk-france-alternative", years: [1933, 1936, 1938, 1939, 1941], countries: ["Великобритания", "Франция"], agenda: "security", stability: 6, warSupport: 8 },
  { id: "ussr-alternative", years: [1933, 1936, 1938, 1939, 1941, 1945], countries: ["СССР"], agenda: "regional", stability: 2, warSupport: 7 },
];
