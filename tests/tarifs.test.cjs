const assert = require("node:assert/strict");
const { test } = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

// Charge les deux modules TypeScript sans dépendance de test supplémentaire.
const previousLoader = require.extensions[".ts"];
require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS },
  });
  module._compile(outputText, filename);
};
const { estimate, periodeFor } = require("../lib/tarifs.ts");
const { parseGuadeloupeDate, guadeloupeDate, formatGuadeloupeDate, isGuadeloupeHoliday } = require("../lib/guadeloupe-time.ts");
if (previousLoader) require.extensions[".ts"] = previousLoader;
else delete require.extensions[".ts"];

test("Aéroport ↔ Bergevin : 30 € dans les deux sens, sans frais de départ en plus", () => {
  for (const [fromId, toId] of [["aeroport", "bergevin"], ["bergevin", "aeroport"]]) {
    for (const [date, time] of [["2026-11-03", "10:00"], ["2026-11-03", "23:00"], ["2026-11-08", "12:00"], ["2026-05-27", "10:00"]]) {
      const result = estimate({ fromId, toId, km: 10.7, date: parseGuadeloupeDate(date, time) });
      assert.equal(result.base, 30);
      assert.equal(result.low, 30);
      assert.equal(result.high, 30);
      assert.equal(result.lines.length, 1);
      assert.ok(result.forfait);
    }
  }
});

test("Le forfait ne s'applique pas aux autres ports ni à un transfert depuis l'hôtel", () => {
  for (const [fromId, toId] of [["aeroport", "croisiere"], ["gosier", "bergevin"], ["bergevin", "bergevin"]]) {
    const result = estimate({ fromId, toId, km: 10.7, date: parseGuadeloupeDate("2026-11-03", "10:00") });
    assert.equal(result.forfait, undefined);
    assert.equal(result.base, 26.13);
  }
});

test("Le temps supplémentaire est ajouté une seule fois au forfait", () => {
  const result = estimate({ fromId: "bergevin", toId: "aeroport", km: 12, date: parseGuadeloupeDate("2026-11-03", "10:00"), extraHours: 2 });
  assert.equal(result.base, 80.08);
  assert.deepEqual(result.lines.map(line => line.value), [30, 50.08]);
});

test("Les seuils de 7 h et 19 h sont ceux de Guadeloupe", () => {
  for (const [time, expected] of [["00:00", "nuit"], ["06:59", "nuit"], ["07:00", "jour"], ["18:59", "jour"], ["19:00", "nuit"], ["23:59", "nuit"]]) {
    assert.equal(periodeFor(parseGuadeloupeDate("2026-11-03", time)), expected, time);
  }
  assert.equal(periodeFor(parseGuadeloupeDate("2026-11-07", "10:00")), "jour");
  assert.equal(periodeFor(parseGuadeloupeDate("2026-11-08", "10:00")), "nuit");
});

test("Les douze fêtes légales de 2026 sont prises en compte", () => {
  const dates = ["01-01", "04-06", "05-01", "05-08", "05-14", "05-25", "05-27", "07-14", "08-15", "11-01", "11-11", "12-25"];
  for (const date of dates) {
    const [month, day] = date.split("-").map(Number);
    assert.ok(isGuadeloupeHoliday(2026, month, day), date);
    assert.equal(periodeFor(parseGuadeloupeDate(`2026-${date}`, "10:00")), "nuit", date);
  }
  // Un jour chômé d'usage n'est pas ajouté aux fêtes légales par hypothèse.
  assert.equal(isGuadeloupeHoliday(2026, 2, 17), false);
  assert.equal(isGuadeloupeHoliday(2026, 5, 28), false);
});

test("Les fêtes mobiles sont recalculées pour les années suivantes", () => {
  for (const [year, month, day] of [[2027, 3, 29], [2027, 5, 6], [2027, 5, 17], [2028, 4, 17], [2028, 5, 25], [2028, 6, 5]]) {
    assert.ok(isGuadeloupeHoliday(year, month, day));
  }
  assert.equal(isGuadeloupeHoliday(2027, 4, 6), false);
});

test("Tarifs 2026 (arrêté 2026-99) : prise en charge 3,73 €, 2,10 €/km jour, 3,15 €/km nuit, chute 0,10 €", () => {
  const day = parseGuadeloupeDate("2026-11-03", "10:00");
  const night = parseGuadeloupeDate("2026-11-03", "22:00");
  assert.equal(estimate({ km: 10, date: day }).base, 24.73);
  assert.equal(estimate({ km: 10.7, date: day }).base, 26.13);
  assert.equal(estimate({ km: 24, date: day }).base, 54.13);
  assert.equal(estimate({ km: 24, date: day, extraHours: 2 }).base, 104.21);
  assert.equal(estimate({ km: 10, date: night }).base, 35.23);
  assert.equal(estimate({ km: 10.7, date: night }).base, 37.43);
  assert.equal(estimate({ km: 10, date: parseGuadeloupeDate("2026-11-08", "10:00") }).base, 35.23);
  assert.equal(estimate({ km: 10, date: parseGuadeloupeDate("2026-05-27", "10:00") }).base, 35.23);
});

test("Course minimum de 8 €, suppléments compris", () => {
  const day = parseGuadeloupeDate("2026-11-03", "10:00");
  const r = estimate({ km: 1, date: day });
  assert.equal(r.base, 8);
  assert.equal(r.lines.reduce((a, l) => a + l.value, 0).toFixed(2), "8.00");
  assert.equal(estimate({ km: 3, date: day }).base, 10.03);
});

test("Un même instant garde sa date de prise en charge en Guadeloupe", () => {
  const instant = new Date("2026-11-04T02:30:00Z");
  assert.equal(guadeloupeDate(instant), "2026-11-03");
  assert.match(formatGuadeloupeDate(instant), /mardi 3 novembre/);
  assert.equal(parseGuadeloupeDate("2026-11-03", "22:30").toISOString(), instant.toISOString());
  assert.equal(periodeFor(new Date("2026-11-04T02:30:00Z")), "nuit");
});
