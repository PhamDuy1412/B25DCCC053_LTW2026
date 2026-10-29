import { useParams, useNavigate } from 'react-router-dom';
import { LEVELS, LETTERS } from '../data';

const QuestionDetail = ({ questions }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const question = questions.find((q) => q.id === Number(id));

  if (!question) {
    return (
      <div>
        <p className="notice">Không tìm thấy câu hỏi.</p>
        <button onClick={() => navigate(-1)}>Quay lại</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Câu hỏi số {question.id} ({LEVELS[question.level]})</h2>
      <p className="detail-question">{question.question}</p>
      <ul className="detail-options">
        {question.options.map((option, i) => (
          <li key={i} className={i === question.answer ? 'option-correct' : ''}>
            {LETTERS[i]}. {option}
            {i === question.answer && ' (Đáp án đúng)'}
          </li>
        ))}
      </ul>
      <button onClick={() => navigate(-1)}>Quay lại</button>
    </div>
  );
};

export default QuestionDetail;
