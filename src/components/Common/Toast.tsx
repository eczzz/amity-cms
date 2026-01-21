import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

interface ToastProps {
  type: 'success' | 'error';
  title: string;
  message?: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ type, title, message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-50' : 'bg-red-50';
  const borderColor = isSuccess ? 'border-green-200' : 'border-red-200';
  const textColor = isSuccess ? 'text-green-800' : 'text-red-800';
  const icon = isSuccess ? faCheckCircle : faExclamationCircle;
  const iconColor = isSuccess ? 'text-green-600' : 'text-red-600';

  return (
    <div
      className={`fixed bottom-6 right-6 max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-300 ${bgColor} border ${borderColor} rounded-lg shadow-lg p-4 z-50`}
      style={{
        animation: `slideInUp 0.3s ease-out forwards`,
      }}
    >
      <div className="flex items-start gap-3">
        <FontAwesomeIcon icon={icon} className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
        <div className="flex-1">
          <h3 className={`font-medium text-small ${textColor}`}>{title}</h3>
          {message && <p className={`text-tiny ${textColor} opacity-90 mt-1`}>{message}</p>}
        </div>
        <button
          onClick={onClose}
          className={`flex-shrink-0 p-1 hover:opacity-70 transition ${textColor}`}
        >
          <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
        </button>
      </div>

      <style>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideOutDown {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(20px);
          }
        }

        .animate-out {
          animation: slideOutDown 0.3s ease-in forwards;
        }
      `}</style>
    </div>
  );
}
