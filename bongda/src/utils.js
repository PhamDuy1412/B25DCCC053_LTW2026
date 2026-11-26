import { TEAMS, POINTS, MAX_GOALS } from './data';

export const getTeamName = (id) => {
  const team = TEAMS.find((t) => t.id === Number(id));
  return team ? team.name : '';
};

export const getResult = (match) => {
  if (match.homeGoals > match.awayGoals) return 'home';
  if (match.homeGoals < match.awayGoals) return 'away';
  return 'draw';
};

export const isValidGoals = (n) => Number.isInteger(n) && n >= 0 && n <= MAX_GOALS;

export const calcStandings = (matches) => {
  const table = TEAMS.map((t) => ({
    id: t.id, name: t.name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, diff: 0, points: 0,
  }));
  const byId = {};
  table.forEach((row) => {
    byId[row.id] = row;
  });

  matches.forEach((m) => {
    const h = byId[m.home];
    const a = byId[m.away];
    if (!h || !a) return;
    h.played += 1;
    a.played += 1;
    h.gf += m.homeGoals;
    h.ga += m.awayGoals;
    a.gf += m.awayGoals;
    a.ga += m.homeGoals;
    const result = getResult(m);
    if (result === 'home') {
      h.won += 1;
      a.lost += 1;
      h.points += POINTS.win;
      a.points += POINTS.loss;
    } else if (result === 'away') {
      a.won += 1;
      h.lost += 1;
      a.points += POINTS.win;
      h.points += POINTS.loss;
    } else {
      h.drawn += 1;
      a.drawn += 1;
      h.points += POINTS.draw;
      a.points += POINTS.draw;
    }
  });

  table.forEach((row) => {
    row.diff = row.gf - row.ga;
  });

  return table.sort(
    (x, y) =>
      y.points - x.points ||
      y.diff - x.diff ||
      y.gf - x.gf ||
      x.name.localeCompare(y.name, 'vi')
  );
};

export const calcMatchStats = (matches) => {
  const counts = { home: 0, draw: 0, away: 0 };
  let goals = 0;
  matches.forEach((m) => {
    goals += m.homeGoals + m.awayGoals;
    counts[getResult(m)] += 1;
  });
  const count = matches.length;
  const average = count === 0 ? 0 : Math.round((goals / count) * 100) / 100;
  return { count, goals, average, counts };
};

const toInt = (v) => {
  const s = String(v).trim();
  return s === '' ? NaN : Number(s);
};

export const calcNeeded = (standings, teamId, target, remaining) => {
  const row = standings.find((r) => String(r.id) === String(teamId));
  const t = toInt(target);
  const r = toInt(remaining);
  if (!row || !Number.isInteger(t) || t < 0 || !Number.isInteger(r) || r < 1) {
    return 'Hãy chọn đội, nhập số điểm mục tiêu (từ 0) và số trận còn lại (từ 1)';
  }
  const need = t - row.points;
  if (need <= 0) return 'Đội đã đạt mục tiêu';
  if (need > 3 * r) return 'Không thể đạt mục tiêu này';
  const wins = Math.max(0, Math.ceil((need - r) / 2));
  return `Cần thêm ${need} điểm ở ${r} trận còn lại, tối thiểu ${wins} trận thắng`;
};