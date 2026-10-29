import { formatMoney } from '../data';

const History = ({ history, onClear }) => {
  // sắp xếp trên bản sao, không sửa state
  const sorted = [...history].sort((a, b) => b.prize - a.prize);
  const best = history.reduce((max, h) => Math.max(max, h.prize), 0);
  const total = history.reduce((sum, h) => sum + h.prize, 0);

  return (
    <div>
      <h2>Lịch sử các lượt chơi</h2>
      {history.length === 0 ? (
        <p className="notice">Chưa có lượt chơi nào.</p>
      ) : (
        <>
          <p>Số lượt chơi: {history.length}</p>
          <p>Tiền thưởng cao nhất: {formatMoney(best)}</p>
          <p>Tổng tiền thưởng: {formatMoney(total)}</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Người chơi</th>
                  <th>Số câu đúng</th>
                  <th>Tiền thưởng</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((h) => (
                  <tr key={h.id}>
                    <td>{h.name}</td>
                    <td>{h.correctCount}</td>
                    <td>{formatMoney(h.prize)}</td>
                    <td>{h.playedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="danger" onClick={onClear}>Xóa lịch sử</button>
        </>
      )}
    </div>
  );
};

export default History;
