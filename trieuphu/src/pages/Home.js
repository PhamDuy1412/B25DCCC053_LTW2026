import { useNavigate } from 'react-router-dom';
import { formatMoney } from '../data';

const Home = ({ playerName, onNameChange, history }) => {
  const navigate = useNavigate();
  const canStart = playerName.trim() !== '';

  const record = history.reduce(
    (best, item) => (best === null || item.prize > best.prize ? item : best),
    null
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canStart) navigate('/play');
  };

  return (
    <div className="home">
      <h1>Ai là triệu phú</h1>
      {record && <p className="record">Kỷ lục: {formatMoney(record.prize)} – {record.name}</p>}
      <ul className="rules">
        <li>Trả lời lần lượt 15 câu hỏi trắc nghiệm về HTML, CSS, ES6 và React.</li>
        <li>Mỗi câu có 30 giây. Hết giờ được tính như trả lời sai.</li>
        <li>Câu 5, 10, 15 là các mốc an toàn: trả lời sai chỉ nhận tiền của mốc cao nhất đã vượt qua.</li>
        <li>Có 3 quyền trợ giúp: 50:50, Hỏi khán giả và Dừng cuộc chơi để mang tiền về.</li>
        <li>Bấm phím A, B, C, D để chọn nhanh đáp án.</li>
      </ul>
      <form className="start-form" onSubmit={handleSubmit}>
        <label htmlFor="player-name">Tên người chơi</label>
        <input
          id="player-name"
          type="text"
          value={playerName}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Nhập tên của bạn"
        />
        <button type="submit" disabled={!canStart}>Bắt đầu</button>
      </form>
    </div>
  );
};

export default Home;
