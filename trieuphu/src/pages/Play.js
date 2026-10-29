import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TIME_PER_QUESTION } from '../data';
import { calcPrize } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';

// status của câu hiện tại: 'answering' -> 'locked' -> 'revealed'
const Play = ({ questions, playerName }) => {
  const navigate = useNavigate();
  const name = playerName.trim();

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('answering');
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);

  const question = questions[index];
  const total = questions.length;

  const finishGame = (correctCount, reason) => {
    const prize = calcPrize(correctCount, reason);
    navigate('/result', {
      replace: true,
      state: { name, prize, correctCount, reason },
    });
  };

  const handleSelect = (i) => {
    if (status !== 'answering') return;
    setSelected(i);
    setStatus('locked');
  };

  // Đồng hồ: chỉ chạy khi đang trả lời
  useEffect(() => {
    if (status !== 'answering') return;
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [status]);

  // Hết giờ: lộ đáp án đúng, tính như trả lời sai
  useEffect(() => {
    if (status === 'answering' && timeLeft <= 0) setStatus('revealed');
  }, [status, timeLeft]);

  // Các bước chờ: 1 giây để lộ kết quả, 2 giây để sang câu tiếp / kết thúc
  useEffect(() => {
    if (status === 'locked') {
      const id = setTimeout(() => setStatus('revealed'), 1000);
      return () => clearTimeout(id);
    }
    if (status === 'revealed') {
      const id = setTimeout(() => {
        if (selected === question.answer) {
          if (index === total - 1) {
            finishGame(total, 'win');
          } else {
            setIndex(index + 1);
            setSelected(null);
            setTimeLeft(TIME_PER_QUESTION);
            setStatus('answering');
          }
        } else {
          finishGame(index, selected === null ? 'timeout' : 'wrong');
        }
      }, 2000);
      return () => clearTimeout(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (!question) return null;

  return (
    <div className="play">
      <div className="play-main">
        <Timer seconds={timeLeft} />
        <QuestionCard
          question={question}
          number={index + 1}
          total={total}
          status={status}
          selected={selected}
          onSelect={handleSelect}
        />
      </div>
      <aside className="play-side">
        <MoneyLadder currentIndex={index} />
      </aside>
    </div>
  );
};

export default Play;
