// frontend/src/components/common/ThemeToggle.jsx








import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useTheme } from '../../theme/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={`theme-toggle-btn btn border-0 rounded-circle${theme === 'dark' ? ' theme-dark' : ''}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, transition: 'background 0.3s, color 0.3s' }}
    >
      <span style={{ transition: 'transform 0.5s cubic-bezier(.4,0,.2,1)', display: 'inline-block', transform: theme === 'dark' ? 'rotate(180deg)' : 'rotate(0deg)' }}>
        {theme === 'light' ? (
          <FaMoon className="fs-5" />
        ) : (
          <FaSun className="fs-5 text-warning" />
        )}
      </span>
    </button>
  );
};

export default ThemeToggle;
