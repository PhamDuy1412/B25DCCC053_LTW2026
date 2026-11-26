import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TEAMS } from '../data';
import { setRemaining, setTarget, setTeamId } from '../features/goalSlice';
import { calcNeeded } from '../utils';

const GoalPlanner = ({ standings }) => {
  const { teamId, target, remaining } = useSelector((state) => state.goal);
  const dispatch = useDispatch();

  const message = useMemo(
    () => calcNeeded(standings, teamId, target, remaining),
    [standings, teamId, target, remaining]
  );

  return (
    <div>
      <div>
        <label htmlFor="goal-team">Đội của bạn</label>{' '}
        <select id="goal-team" value={teamId} onChange={(e) => dispatch(setTeamId(e.target.value))}>
          {TEAMS.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="goal-target">Số điểm mục tiêu</label>{' '}
        <input
          id="goal-target"
          type="number"
          value={target}
          onChange={(e) => dispatch(setTarget(e.target.value))}
        />
      </div>
      <div>
        <label htmlFor="goal-remaining">Số trận còn lại</label>{' '}
        <input
          id="goal-remaining"
          type="number"
          value={remaining}
          onChange={(e) => dispatch(setRemaining(e.target.value))}
        />
      </div>
      <p>{message}</p>
    </div>
  );
};

export default GoalPlanner;