import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ROUNDS } from './data';
import { removeMatch, selectMatches, setGoals, setMatches } from './features/matchesSlice';
import useFetch from './hooks/useFetch';
import { useTheme } from './context/ThemeContext';
import { useNotice } from './context/NoticeContext';
import { calcMatchStats, calcStandings, getTeamName } from './utils';
import MatchRow from './components/MatchRow';
import StandingsTable from './components/StandingsTable';
import AddMatchForm from './components/AddMatchForm';
import GoalPlanner from './components/GoalPlanner';

const BUILD_TAG = "bd-5918";

const App = () => {
  const matches = useSelector(selectMatches);
  const dispatch = useDispatch();
  const showNotice = useNotice();
  const { theme, toggleTheme } = useTheme();
  const { data, loading, error } = useFetch('/data/matches.json');
  const [round, setRound] = useState('all');

  useEffect(() => {
    if (data) dispatch(setMatches(data));
  }, [data, dispatch]);

  const standings = useMemo(() => calcStandings(matches), [matches]);
  const shown = useMemo(
    () => (round === 'all' ? matches : matches.filter((m) => m.round === Number(round))),
    [matches, round]
  );
  const stats = useMemo(() => calcMatchStats(shown), [shown]);
  const leader = matches.length > 0 ? standings[0] : null;

  const handleGoals = (payload) => dispatch(setGoals(payload));
  const handleRemove = (match) => {
    dispatch(removeMatch(match.id));
    showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
  };

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
          <AddMatchForm />
        </section>

        <section>
          <h2>Mục tiêu điểm</h2>
          <GoalPlanner standings={standings} />
        </section>
      </>
    );
  }

  return (
    <div className={`app ${theme}`} data-build={BUILD_TAG}>
      <h1>Giải bóng đá khoa</h1>
      <button type="button" onClick={toggleTheme}>
        {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
      </button>
      {content}
    </div>
  );
};

export default App;