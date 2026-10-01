const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, class: className } = student;

  const isExcellent = score >= 8;
  const isFail = score < 5;

  return (
    <tr>
      <td>{name}</td>
      <td>{`${score} ${isExcellent ? "(Giỏi)" : isFail ? "(Trượt)" : ""}`}</td>
      <td>{className}</td>
      <td>
        <button onClick={() => onDelete(id)}>Xoá</button>
      </td>
    </tr>
  );
};

export default StudentItem;