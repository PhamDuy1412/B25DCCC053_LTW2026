import { useState } from "react";
import StudentList from "./StudentList";

const App = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "Ngô Tuấn Cường", score: 8.5, class: "D25CQCC05-B" },
    { id: 2, name: "Phan Việt Bằng", score: 4, class: "D25CQCC05-B" },
    { id: 3, name: "Phạm Quang Duy", score: 9.2, class: "D25CQCC05-B" },
  ]);

  const [newName, setNewName] = useState("");
  const [newScore, setNewScore] = useState("");
  const [newClass, setNewClass] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  const handleAddStudent = (e) => {
    e.preventDefault();

    const trimmedName = newName.trim();
    const trimmedClass = newClass.trim();
    const scoreNumber = parseFloat(newScore);

    if (!trimmedName || !trimmedClass || newScore === "") {
      setError("Vui lòng nhập đầy đủ Họ tên, Điểm số và Lớp.");
      return;
    }

    if (isNaN(scoreNumber) || scoreNumber < 0 || scoreNumber > 10) {
      setError("Điểm số không hợp lệ (phải từ 0 đến 10).");
      return;
    }

    const newStudent = {
      id: Date.now(),
      name: trimmedName,
      score: scoreNumber,
      class: trimmedClass,
    };

    setStudents([...students, newStudent]);

    setNewName("");
    setNewScore("");
    setNewClass("");
    setError("");
  };

  const handleDeleteStudent = (id) => {
    setStudents(students.filter((student) => student.id !== id));
  };

  const filteredStudents = students.filter((student) => {
    if (filter === "excellent") return student.score >= 8;
    if (filter === "fail") return student.score < 5;
    return true;
  });

  const totalStudents = students.length;
  const averageScore =
    totalStudents === 0
      ? 0
      : students.reduce((sum, student) => sum + student.score, 0) / totalStudents;

  return (
    <div>
      <h1>Ứng dụng Quản lý Điểm Sinh viên</h1>

      <p>{`Tổng số sinh viên: ${totalStudents}`}</p>
      <p>{`Điểm trung bình: ${averageScore.toFixed(2)}`}</p>

      <div>
        <button onClick={() => setFilter("all")}>Tất cả</button>
        <button onClick={() => setFilter("excellent")}>Giỏi (≥8)</button>
        <button onClick={() => setFilter("fail")}>Trượt (&lt;5)</button>
      </div>

      <form onSubmit={handleAddStudent}>
        <input
          type="text"
          placeholder="Họ tên"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <input
          type="number"
          step="0.1"
          placeholder="Điểm số"
          value={newScore}
          onChange={(e) => setNewScore(e.target.value)}
        />
        <input
          type="text"
          placeholder="Lớp"
          value={newClass}
          onChange={(e) => setNewClass(e.target.value)}
        />
        <button type="submit">Thêm</button>
      </form>

      {error && <p>{error}</p>}

      <StudentList students={filteredStudents} onDelete={handleDeleteStudent} />
    </div>
  );
};

export default App;