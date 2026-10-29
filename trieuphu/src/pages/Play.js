import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LETTERS, TIME_PER_QUESTION } from '../data';
import { calcPrize, pickTwoWrong, audiencePercents } from '../utils';
import QuestionCard from '../components/QuestionCard';
import Timer from '../components/Timer';
import MoneyLadder from '../components/MoneyLadder';
import Lifelines from '../components/Lifelines';
import AudienceChart from '../components/AudienceChart';

// status của câu hiện tại: 'answering' -> 'locked' -> 'revealed'
const Play = ({ questions, playerName, onFinish }) => {
  const navigate = useNavigate();
  const name = playerName.trim();

  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState('answering');
  const [selected, setSelected] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [hidden, setHidden] = useState([]);
  const [audience, setAudience] = useState(null);
  const [usedFifty, setUsedFifty] = useState(false);
  const [usedAudience, setUsedAudience] = useState(false);

  const question = questions[index];
  const total = questions.length;

  const finishGame = (correctCount, reason) => {
    const prize = calcPrize(correctCount, reason);
    onFinish({
      id: Date.now(),
      name,
      prize,
      correctCount,
      playedAt: new Date().toLocaleString('vi-VN'),
    });
    navigate('/result', {
      replace: true,
      state: { name, prize, correctCount, reason },
    });
  };

  const handleSelect = (i) => {
    if (status !== 'answering' || hidden.includes(i)) return;
    setSelected(i);
    setStatus('locked');
  };

  const handleFifty = () => {
    const toHide = pickTwoWrong(question.answer, question.options.length);
    setHidden(toHide);
    setUsedFifty(true);
    // nếu biểu đồ đang hiện thì tính lại theo các đáp án còn lại
    setAudience((prev) =>
      prev ? audiencePercents(question.answer, toHide, question.options.length) : prev
    );
  };

  const handleAudience = () => {
    setAudience(audiencePercents(question.answer, hidden, question.options.length));
    setUsedAudience(true);
  };

  const handleStop = () => finishGame(index, 'stop');

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
            setHidden([]);
            setAudience(null);
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

  // Phím tắt A–D
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const i = LETTERS.indexOf(e.key.toUpperCase());
      if (e.key.length !== 1 || i === -1) return;
      handleSelect(i);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, hidden, index]);

  // Tiêu đề tab
  useEffect(() => {
    document.title = `Câu ${index + 1}/${total} – ${name}`;
    return () => {
      document.title = 'Ai là triệu phú';
    };
  }, [index, total, name]);

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
          hidden={hidden}
          onSelect={handleSelect}
        />
        <Lifelines
          usedFifty={usedFifty}
          usedAudience={usedAudience}
          disabled={status !== 'answering'}
          onFifty={handleFifty}
          onAudience={handleAudience}
          onStop={handleStop}
        />
        {audience && <AudienceChart percents={audience} />}
      </div>
      <aside className="play-side">
        <MoneyLadder currentIndex={index} />
      </aside>
    </div>
  );
};

export default Play;
