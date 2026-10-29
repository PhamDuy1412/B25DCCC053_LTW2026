import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from './components/Layout';
import QuestionBank from './pages/QuestionBank';
import QuestionDetail from './pages/QuestionDetail';
import NotFound from './pages/NotFound';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        <Route index element={<h2>Trang chủ</h2>} />
        <Route path="play" element={<h2>Màn hình chơi</h2>} />
        <Route path="result" element={<h2>Kết quả</h2>} />
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
