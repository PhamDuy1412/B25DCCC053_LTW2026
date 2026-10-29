import { useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS } from '../data';

const QuestionBank = ({ questions }) => {
  const [level, setLevel] = useState('all');
  const [query, setQuery] = useState('');

  const handleSearchChange = (e) => setQuery(e.target.value);

  const keyword = query.trim().toLowerCase();
  const filtered = questions.filter(
    (q) =>
      (level === 'all' || q.level === Number(level)) &&
      q.question.toLowerCase().includes(keyword)
  );

  return (
    <div>
      <h2>Ngân hàng câu hỏi</h2>
      <div className="filters">
        <label>
          Mức độ{' '}
          <select value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="all">Tất cả</option>
            {Object.entries(LEVELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>
        <label>
          Tìm kiếm{' '}
          <input
            type="text"
            value={query}
            onChange={handleSearchChange}
            placeholder="Nội dung câu hỏi"
          />
        </label>
      </div>
      <p>Có {filtered.length} câu hỏi</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>STT</th>
              <th>Mức độ</th>
              <th>Câu hỏi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((q, i) => (
              <tr key={q.id}>
                <td>{i + 1}</td>
                <td>{LEVELS[q.level]}</td>
                <td><Link to={`/questions/${q.id}`}>{q.question}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuestionBank;
