type Props = {
  label: string;
  active?: boolean;
};

export function StampBadge({ label, active = false }: Props) {
  return <span className={active ? 'stamp-badge active' : 'stamp-badge'}>{label}</span>;
}
