import { RESULT_LABELS } from '../data';
import { getResult, getTeamName, isValidGoals } from '../utils';

const MatchRow = ({ match, onGoals, onRemove }) => {
  const homeName = getTeamName(match.home);
  const awayName = getTeamName(match.away);
  const result = getResult(match);

  const handleHome = (e) => {
    const v = e.target.valueAsNumber;
    if (isValidGoals(v)) onGoals({ id: match.id, homeGoals: v, awayGoals: match.awayGoals });
  };
  const handleAway = (e) => {
    const v = e.target.valueAsNumber;
    if (isValidGoals(v)) onGoals({ id: match.id, homeGoals: match.homeGoals, awayGoals: v });
  };

  return (
    <tr style={result === 'draw' ? { background: 'rgba(255, 193, 7, 0.25)' } : undefined}>
      <td>{match.round}</td>
      <td>{homeName}</td>
      <td>
        <input
          type="number"
          min="0"
          max="20"
          aria-label={`Bàn thắng nhà ${homeName} - ${awayName}`}
          value={match.homeGoals}
          onChange={handleHome}
        />
      </td>
      <td>
        <input
          type="number"
          min="0"
          max="20"
          aria-label={`Bàn thắng khách ${homeName} - ${awayName}`}
          value={match.awayGoals}
          onChange={handleAway}
        />
      </td>
      <td>{awayName}</td>
      <td>{RESULT_LABELS[result]}</td>
      <td>
        <button type="button" onClick={() => onRemove(match)}>
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default MatchRow;