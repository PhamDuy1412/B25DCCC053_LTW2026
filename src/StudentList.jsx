import StudentItem from "./StudentItem";

const StudentList = ({ students, onDelete }) => {
  if (students.length === 0) {
    return <p>Không có sinh viên nào.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Họ tên</th>
          <th>Điểm</th>
          <th>Lớp</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <StudentItem key={student.id} student={student} onDelete={onDelete} />
        ))}
      </tbody>
    </table>
  );
};

export default StudentList;