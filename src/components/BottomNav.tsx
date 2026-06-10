import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: '首页', icon: '⌂' },
  { to: '/map', label: '点位', icon: '⌖' },
  { to: '/progress', label: '进度', icon: '◉' },
  { to: '/memory-card', label: '记忆卡', icon: '▣' },
  { to: '/share', label: '分享', icon: '↗' }
];

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="底部导航">
      {navItems.map((item) => (
        <NavLink to={item.to} key={item.to} end={item.to === '/'}>
          <span>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
