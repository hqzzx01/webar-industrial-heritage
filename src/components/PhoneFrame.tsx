import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

// 保留这个组件名是为了对应设计文档结构；它不是手机模型展示框，只负责给移动端页面提供安全边距。
export function PhoneFrame({ children }: Props) {
  return <div className="mobile-safe-frame">{children}</div>;
}
