import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link');

const NavBar = () => (
  <header className="navbar">
    <span className="brand">Ai là triệu phú</span>
    <nav className="nav-links">
      <NavLink to="/" end className={linkClass}>Trang chủ</NavLink>
      <NavLink to="/questions" className={linkClass}>Ngân hàng câu hỏi</NavLink>
      <NavLink to="/history" className={linkClass}>Lịch sử</NavLink>
    </nav>
  </header>
);

export default NavBar;
