import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  requireTextMatch?: string; // If set, user must type this exact text to confirm (for permanent deletion)
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'warning',
  requireTextMatch,
}) => {
  const [typedValue, setTypedValue] = useState('');

  const isConfirmedDisabled = requireTextMatch ? typedValue !== requireTextMatch : false;

  const handleConfirm = () => {
    onConfirm();
    setTypedValue('');
    onClose();
  };

  const handleClose = () => {
    setTypedValue('');
    onClose();
  };

  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return (
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertTriangle className="h-6 w-6" />
          </div>
        );
      case 'warning':
        return (
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <AlertCircle className="h-6 w-6" />
          </div>
        );
      default:
        return (
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <Info className="h-6 w-6" />
          </div>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      maxWidth="md"
      footer={
        <>
          <Button variant="outline" onClick={handleClose}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={handleConfirm}
            disabled={isConfirmedDisabled}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        {getIcon()}
        <div className="flex-1">
          <p className="text-sm text-slate-600 leading-relaxed">{message}</p>

          {requireTextMatch && (
            <div className="mt-4 rounded-lg bg-rose-50 border border-rose-200 p-3">
              <p className="text-xs font-semibold text-rose-800">
                To confirm permanent deletion, type <span className="font-mono bg-white px-1 py-0.5 rounded border border-rose-300">{requireTextMatch}</span> below:
              </p>
              <input
                type="text"
                value={typedValue}
                onChange={(e) => setTypedValue(e.target.value)}
                placeholder={requireTextMatch}
                className="mt-2 w-full rounded-md border border-rose-300 bg-white px-3 py-1.5 text-sm font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

