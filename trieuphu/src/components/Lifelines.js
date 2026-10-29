const Lifelines = ({ usedFifty, usedAudience, disabled, onFifty, onAudience, onStop }) => (
  <div className="lifelines">
    <button className="lifeline" onClick={onFifty} disabled={disabled || usedFifty}>
      50:50
    </button>
    <button className="lifeline" onClick={onAudience} disabled={disabled || usedAudience}>
      Hỏi khán giả
    </button>
    <button className="lifeline lifeline-stop" onClick={onStop} disabled={disabled}>
      Dừng cuộc chơi
    </button>
  </div>
);

export default Lifelines;
