const AnswerButton = ({ letter, text, state, disabled, onClick }) => {
  if (state === 'hidden') {
    return <button className="answer answer-hidden" disabled tabIndex={-1} aria-hidden="true" />;
  }
  return (
    <button className={`answer answer-${state}`} disabled={disabled} onClick={onClick}>
      <span className="answer-letter">{letter}.</span> {text}
    </button>
  );
};

export default AnswerButton;