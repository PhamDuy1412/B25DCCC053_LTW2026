import { LETTERS } from '../data';

const AudienceChart = ({ percents }) => (
  <div className="audience">
    <p className="audience-title">Khán giả bình chọn</p>
    {percents.map((pct, i) => (
      <div key={LETTERS[i]} className="bar-track">
        <div className="bar" style={{ width: `${pct}%` }}>
          {`${LETTERS[i]}: ${pct}%`}
        </div>
      </div>
    ))}
  </div>
);

export default AudienceChart;
