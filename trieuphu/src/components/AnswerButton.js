// state: 'normal' | 'selected' | 'correct' | 'wrong'
const AnswerButton = ({ letter, text, state, disabled, onClick }) => (
  <button className={`answer answer-${state}`} disabled={disabled} onClick={onClick}>
    <span className="answer-letter">{letter}.</span> {text}
  </button>
);

export default AnswerButton;
