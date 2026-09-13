/* Map-verified territorial clauses.  Every transfer is conditional: a player-made
 * divergence keeps its borders and the historical clause is skipped. */
(function () {
  const timeline = window.HISTORICAL_EVENT_TIMELINE;
  if (!Array.isArray(timeline)) return;
  const transfer = (id, date, title, text, from, to, regionIds) => timeline.push({
    id, date, title, text, actors: [from, to],
    when: { countryExists: from, regionsOwnedBy: [{ country: from, regionIds }] },
    effects: [{ type: "transferRegions", from, to, regionIds }],
  });

  // Regions have been checked against maps/мир.json and the corresponding
  // historical scenario ownership; do not substitute whole countries here.
  transfer("first-vienna-award-map", "1938-11-02", "Первый Венский арбитраж: передача регионов", "Южные словацкие районы, представленные на карте Жилинским и Прешовским краями, передаются Венгрии.", "Чехословакия", "Венгрия", [810, 311]);
  transfer("winter-war-map", "1940-03-13", "Московский мир: Карельский перешеек", "После Московского мира Южная Карелия на игровой карте переходит от Финляндии к СССР.", "Финляндия", "СССР", [436]);
  transfer("german-occupation-czech-map", "1939-03-15", "Протекторат Богемии и Моравии: карта", "Чешские регионы Южной Чехии, Оломоуца и Пардубице переходят под германское управление.", "Чехословакия", "Германия", [123, 329, 378]);
  transfer("munich-sudeten-map", "1938-09-30", "Судетская область: карта", "Устецкий и Карловарский края передаются Германии по Мюнхенскому соглашению.", "Чехословакия", "Германия", [4030, 122]);
}());
