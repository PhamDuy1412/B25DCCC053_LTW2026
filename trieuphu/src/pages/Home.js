import { useNavigate } from 'react-router-dom';

const Home = ({ playerName, onNameChange }) => {
  const navigate = useNavigate();
  const canStart = playerName.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canStart) navigate('/play');
  };

  return (
    <div className="home">
      <h1>Ai là triệu phú</h1>
      <ul className="rules">
        <li>Trả lời lần lượt 15 câu hỏi trắc nghiệm về HTML, CSS, ES6 và React.</li>
        <li>Mỗi câu có 30 giây. Hết giờ được tính như trả lời sai.</li>
        <li>Câu 5, 10, 15 là các mốc an toàn: trả lời sai chỉ nhận tiền của mốc cao nhất đã vượt qua.</li>
        <li>Trả lời đúng cả 15 câu để nhận 250.000.000 đ.</li>
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
