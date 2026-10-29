import { PRIZES, MILESTONES, formatMoney } from '../data';

const MoneyLadder = ({ currentIndex }) => (
  <ol className="ladder" reversed>
    {PRIZES.map((prize, i) => ({ prize, number: i + 1 }))
      .reverse()
      .map(({ prize, number }) => {
        const classes = ['ladder-step'];
        if (number - 1 === currentIndex) classes.push('ladder-current');
        if (MILESTONES.includes(number)) classes.push('ladder-milestone');
        return (
          <li key={number} value={number} className={classes.join(' ')}>
            <span className="ladder-number">{number}</span>
            <span>{formatMoney(prize)}</span>
          </li>
        );
      })}
  </ol>
);

export default MoneyLadder;
