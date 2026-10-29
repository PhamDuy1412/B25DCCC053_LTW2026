import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import History from './pages/History';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const HISTORY_KEY = 'ltw_trieuphu_history';

const loadHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [history, setHistory] = useState(loadHistory);

  // Bài 1: tải câu hỏi bằng axios, hủy request trong cleanup
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get('/data/questions.json', { signal: controller.signal })
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isCancel(err)) return; // request bị hủy thì bỏ qua
        setError(true);
        setLoading(false);
      });
    return () => controller.abort();
  }, []);

  // Bài 3: lưu lịch sử vào localStorage mỗi khi thay đổi
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch {
      // bỏ qua nếu trình duyệt không cho ghi
    }
  }, [history]);

  const addHistory = (record) => setHistory((prev) => [...prev, record]);
  const clearHistory = () => setHistory([]);

  // Các trang cần dữ liệu câu hỏi
  const withData = (element) => {
    if (loading) return <p className="notice">Đang tải câu hỏi...</p>;
    if (error) return <p className="notice notice-error">Không tải được câu hỏi.</p>;
    return element;
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <Home
              playerName={playerName}
              onNameChange={setPlayerName}
              history={history}
            />
          }
        />
        <Route
          path="play"
          element={
            playerName.trim() === ''
              ? <Navigate to="/" replace />
              : withData(
                  <Play
                    questions={questions}
                    playerName={playerName}
                    onFinish={addHistory}
                  />
                )
          }
        />
        <Route path="result" element={<Result />} />
        <Route
          path="history"
          element={<History history={history} onClear={clearHistory} />}
        />
        <Route
          path="questions"
          element={withData(<QuestionBank questions={questions} />)}
        />
        <Route
          path="questions/:id"
          element={withData(<QuestionDetail questions={questions} />)}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default App;
