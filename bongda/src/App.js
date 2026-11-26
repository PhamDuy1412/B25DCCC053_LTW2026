import { useEffect, useMemo, useReducer, useState } from 'react';
import { ROUNDS } from './data';
import { matchesReducer } from './matchesReducer';
import useFetch from './hooks/useFetch';
import { calcMatchStats, calcStandings } from './utils';
import MatchRow from './components/MatchRow';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';

const BUILD_TAG = "bd-5918";

const App = () => {
  const [matches, dispatch] = useReducer(matchesReducer, []);
  const { data, loading, error } = useFetch('/data/matches.json');
  const [round, setRound] = useState('all');

  useEffect(() => {
    if (data) dispatch({ type: 'LOAD', payload: data });
  }, [data]);

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const shown = useMemo(
    () => (round === 'all' ? matches : matches.filter((m) => m.round === Number(round))),
    [matches, round]
  );
  const stats = useMemo(() => calcMatchStats(shown), [shown]);
  const leader = matches.length > 0 ? standings[0] : null;

  const handleGoals = (payload) => dispatch({ type: 'SET_GOALS', payload });
  const handleRemove = (match) => dispatch({ type: 'REMOVE', payload: match.id });

  let content;
  if (loading) {
    content = <p>Đang tải lịch thi đấu...</p>;
  } else if (error) {
    content = <p>Không tải được lịch thi đấu.</p>;
  } else {
    content = (
      <>
        <section>
          <h2>Bảng xếp hạng</h2>
          <StandingsTable standings={standings} />
        </section>

        <section>
          <h2>Thống kê</h2>
          <p>{`Số trận: ${stats.count}`}</p>
          <p>{`Tổng số bàn thắng: ${stats.goals}`}</p>
          <p>{`Bàn thắng mỗi trận: ${stats.average.toFixed(2)}`}</p>
          <p>{leader ? `Đội dẫn đầu: ${leader.name} (${leader.points} điểm)` : 'Đội dẫn đầu: —'}</p>
        </section>

        <section>
          <h2>Lịch thi đấu</h2>
          <div>
            <label htmlFor="round-filter">Xem vòng</label>{' '}
            <select id="round-filter" value={round} onChange={(e) => setRound(e.target.value)}>
              <option value="all">Tất cả</option>
              {ROUNDS.map((r) => (
                <option key={r} value={r}>{`Vòng ${r}`}</option>
              ))}
            </select>
          </div>
          {shown.length === 0 ? (
            <p>Chưa có trận đấu nào</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Vòng</th><th>Đội nhà</th><th>BT nhà</th><th>BT khách</th>
                  <th>Đội khách</th><th>Kết quả</th><th />
                </tr>
              </thead>
              <tbody>
                {shown.map((m) => (
                  <MatchRow key={m.id} match={m} onGoals={handleGoals} onRemove={handleRemove} />
                ))}
              </tbody>
            </table>
          )}
        </section>

        <section>
          <h2>Thêm trận đấu</h2>
          <AddMatchForm matches={matches} dispatch={dispatch} />
        </section>
      </>
    );
  }

  return (
    <div className="app" data-build={BUILD_TAG}>
      <h1>Giải bóng đá khoa</h1>
      {content}
    </div>
  );
};

export default App;