const Timer = ({ seconds }) => (
  <p className={seconds <= 10 ? 'timer timer-low' : 'timer'}>Còn {seconds} giây</p>
);

export default Timer;
