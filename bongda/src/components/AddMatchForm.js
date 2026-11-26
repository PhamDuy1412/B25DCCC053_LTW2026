import { useRef, useState } from 'react';
import { ROUNDS, TEAMS } from '../data';
import { isValidGoals } from '../utils';

const EMPTY = { round: '1', home: '', away: '', hg: '', ag: '' };
const GOALS_ERROR = 'Số bàn thắng phải là số nguyên từ 0 đến 20';

const goalsOk = (v) => v !== '' && isValidGoals(Number(v));

const AddMatchForm = ({ matches, dispatch }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const homeRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const next = {};
    const home = Number(form.home);
    const away = Number(form.away);

    if (form.home === '') next.home = 'Hãy chọn đội nhà';
    if (form.away === '') next.away = 'Hãy chọn đội khách';
    else if (form.home !== '' && home === away) next.away = 'Hai đội phải khác nhau';
    else if (
      form.home !== '' &&
      matches.some((m) => (m.home === home && m.away === away) || (m.home === away && m.away === home))
    ) {
      next.away = 'Hai đội đã đá với nhau rồi';
    }
    if (!goalsOk(form.hg)) next.hg = GOALS_ERROR;
    if (!goalsOk(form.ag)) next.ag = GOALS_ERROR;

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    dispatch({
      type: 'ADD',
      payload: {
        round: Number(form.round),
        home,
        away,
        homeGoals: Number(form.hg),
        awayGoals: Number(form.ag),
      },
    });
    setForm(EMPTY);
    homeRef.current.focus();
  };

  const teamOptions = TEAMS.map((t) => (
    <option key={t.id} value={t.id}>{t.name}</option>
  ));

  return (
    <form onSubmit={handleSubmit} noValidate className="add-form">
      <div>
        <label htmlFor="add-round">Vòng</label>{' '}
        <select id="add-round" name="round" value={form.round} onChange={handleChange}>
          {ROUNDS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="add-home">Đội nhà</label>{' '}
        <select id="add-home" name="home" ref={homeRef} value={form.home} onChange={handleChange}>
          <option value="">-- Chọn đội --</option>
          {teamOptions}
        </select>
        {errors.home && <div role="alert" className="error">{errors.home}</div>}
      </div>
      <div>
        <label htmlFor="add-away">Đội khách</label>{' '}
        <select id="add-away" name="away" value={form.away} onChange={handleChange}>
          <option value="">-- Chọn đội --</option>
          {teamOptions}
        </select>
        {errors.away && <div role="alert" className="error">{errors.away}</div>}
      </div>
      <div>
        <label htmlFor="add-hg">Bàn thắng đội nhà</label>{' '}
        <input id="add-hg" name="hg" type="number" value={form.hg} onChange={handleChange} />
        {errors.hg && <div role="alert" className="error">{errors.hg}</div>}
      </div>
      <div>
        <label htmlFor="add-ag">Bàn thắng đội khách</label>{' '}
        <input id="add-ag" name="ag" type="number" value={form.ag} onChange={handleChange} />
        {errors.ag && <div role="alert" className="error">{errors.ag}</div>}
      </div>
      <button type="submit">Thêm trận</button>
    </form>
  );
};

export default AddMatchForm;