import { useNavigate } from 'react-router-dom';

type Props = {
  fallback: string;
  children?: string;
  className?: string;
};

export function CameraBackButton({ fallback, children = '返回', className }: Props) {
  const navigate = useNavigate();

  const goBack = () => {
    const historyIndex = Number(window.history.state?.idx ?? 0);
    if (historyIndex > 0) {
      navigate(-1);
      return;
    }
    navigate(fallback, { replace: true });
  };

  return (
    <button type="button" className={className} onClick={goBack} aria-label={children}>
      {children}
    </button>
  );
}
