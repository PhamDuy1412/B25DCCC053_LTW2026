import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RESULT_LABELS, ROUNDS } from './data';
import { removeMatch, selectMatches, setGoals, setMatches } from './features/matchesSlice';
import { hasSaved } from './store';
import useFetch from './hooks/useFetch';
import useLocalStorage from './hooks/useLocalStorage';
import useDebounce from './hooks/useDebounce';
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

  const [round, setRound] = useLocalStorage('ltw_bongda_round', 'all');
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const searchRef = useRef(null);

  // Chỉ nạp dữ liệu mẫu khi chưa có dữ liệu lưu
  useEffect(() => {
    if (data && !hasSaved) dispatch(setMatches(data));
  }, [data, dispatch]);

  const standings = useMemo(() => calcStandings(matches), [matches]);

  const byRound = useMemo(
    () => (round === 'all' ? matches : matches.filter((m) => m.round === Number(round))),
    [matches, round]
  );

  const shown = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    if (q === '') return byRound;
    return byRound.filter(
      (m) =>
        getTeamName(m.home).toLowerCase().includes(q) ||
        getTeamName(m.away).toLowerCase().includes(q)
    );
  }, [byRound, debouncedSearch]);

  const stats = useMemo(() => calcMatchStats(byRound), [byRound]);

  const leader = matches.length > 0 ? standings[0] : null;
  const leaderName = leader ? leader.name : '';

  useEffect(() => {
    document.title = leaderName ? `${leaderName} dẫn đầu – Giải bóng đá khoa` : 'Giải bóng đá khoa';
  }, [leaderName]);

  // Phím tắt: "/" nhảy vào ô tìm, Esc xóa tìm kiếm
  useEffect(() => {
    const handleKey = (e) => {
      const tag = e.target && e.target.tagName;
      if (e.key === '/' && !['INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) {
        e.preventDefault();
        if (searchRef.current) searchRef.current.focus();
      } else if (e.key === 'Escape' && document.activeElement === searchRef.current) {
        setSearch('');
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleTeamShift = (e) => {
    setSearch(e.target.value);
  };

  const handleGoals = useCallback((payload) => dispatch(setGoals(payload)), [dispatch]);

  const handleRemove = useCallback(
    (match) => {
      dispatch(removeMatch(match.id));
      showNotice(`Đã xóa trận ${getTeamName(match.home)} - ${getTeamName(match.away)}`);
    },
    [dispatch, showNotice]
  );

  const handleReset = () => {
    if (!data) return;
    dispatch(setMatches(data));
    showNotice('Đã đặt lại dữ liệu mẫu');
  };

  let content;
  if (!hasSaved && loading) {
    content = <p>Đang tải lịch thi đấu...</p>;
  } else if (!hasSaved && error) {
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
          <h3>Phân bố kết quả</h3>
          <ul>
            {Object.keys(RESULT_LABELS).map((key) => (
              <li key={key}>
                {`${RESULT_LABELS[key]}: ${stats.counts[key]}`}{' '}
                <span
                  className="bar"
                  style={{
                    display: 'inline-block',
                    background: '#1976d2',
                    height: '10px',
                    width: `${24 * stats.counts[key]}px`,
                  }}
                />
              </li>
            ))}
          </ul>
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
            </select>{' '}
            <label htmlFor="team-search">Tìm đội</label>{' '}
            <input
              id="team-search"
              type="text"
              ref={searchRef}
              value={search}
              onChange={handleTeamShift}
            />
          </div>
          <p>{`Tìm thấy ${shown.length} trận`}</p>
          {shown.length === 0 ? (
            <p>Chưa có trận đấu nào</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Vòng</th><th>Đội nhà</th><th>BT nhà</th><th>BT khách</th>
                  <th>Đội khách</th><th>Kết quả</th><th>Số lần render</th><th />
                </tr>
              </thead>
              <tbody>
                {shown.map((m) => (
                  <MatchRow key={m.id} match={m} onGoals={handleGoals} onRemove={handleRemove} />
                ))}
              </tbody>
            </table>
          )}
          <button type="button" onClick={handleReset}>Đặt lại dữ liệu mẫu</button>
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