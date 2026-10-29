import AnswerButton from './AnswerButton';
import { LETTERS } from '../data';

const QuestionCard = ({ question, number, total, status, selected, onSelect }) => (
  <section className="question-card">
    <p className="question-number">Câu {number}/{total}</p>
    <h2 className="question-text">{question.question}</h2>
    <div className="answers">
      {question.options.map((option, i) => {
        let state = 'normal';
        if (status === 'locked' && selected === i) {
          state = 'selected'; // đang chốt: màu cam
        } else if (status === 'revealed') {
          if (i === question.answer) state = 'correct'; // đáp án đúng: xanh lá
          else if (i === selected) state = 'wrong'; // chọn sai: đỏ
        }
        return (
          <AnswerButton
            key={i}
            letter={LETTERS[i]}
            text={option}
            state={state}
            disabled={status !== 'answering'}
            onClick={() => onSelect(i)}
          />
        );
      })}
    </div>
  </section>
);

export default QuestionCard;
