import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import Home from './pages/Home';
import Play from './pages/Play';
import Result from './pages/Result';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [playerName, setPlayerName] = useState('');

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
          element={<Home playerName={playerName} onNameChange={setPlayerName} />}
        />
        <Route
          path="play"
          element={
            playerName.trim() === ''
              ? <Navigate to="/" replace />
              : withData(<Play questions={questions} playerName={playerName} />)
          }
        />
        <Route path="result" element={<Result />} />
        <Route path="history" element={<h2>Lịch sử</h2>} />
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
