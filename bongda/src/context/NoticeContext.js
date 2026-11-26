import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const NoticeContext = createContext(null);

export const NoticeProvider = ({ children }) => {
  const [notice, setNotice] = useState({ text: '', id: 0 });

  // Mỗi lần gọi tạo object mới => effect chạy lại => đếm lại 3 giây
  const showNotice = useCallback((text) => {
    setNotice((prev) => ({ text, id: prev.id + 1 }));
  }, []);

  useEffect(() => {
    if (!notice.text) return undefined;
    const timer = setTimeout(() => setNotice((prev) => ({ text: '', id: prev.id })), 3000);
    return () => clearTimeout(timer);
  }, [notice]);

  return (
    <NoticeContext.Provider value={showNotice}>
      <div role="status" className="notice">
        {notice.text}
      </div>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const showNotice = useContext(NoticeContext);
  if (showNotice === null) throw new Error('useNotice phải dùng bên trong NoticeProvider');
  return showNotice;
};