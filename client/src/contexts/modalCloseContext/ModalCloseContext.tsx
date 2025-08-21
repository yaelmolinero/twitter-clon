import { createContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router';

type ConfirmCloseFn = () => Promise<boolean> | boolean;

interface CloseContextProps {
  setConfirmClose: (fn: ConfirmCloseFn | null) => void;
  confirmClose: () => Promise<boolean>;
  showCancelMenu: boolean;
  handleConfirmClose: () => void;
  handleCancelClose: () => void;
  handleCloseClick: () => Promise<void>;
}

export const ModalCloseContext = createContext<CloseContextProps>({
  setConfirmClose: () => { },
  confirmClose: async () => true,
  showCancelMenu: false,
  handleConfirmClose: () => { },
  handleCancelClose: () => { },
  handleCloseClick: async () => { }
});

function ModalCloseProvider({ children }: { children: React.ReactNode }) {
  const [showCancelMenu, setShowCancelMenu] = useState(false);
  const confirmCloseRef = useRef<ConfirmCloseFn | null>(null);
  const resolveRef = useRef<(result: boolean) => void>(undefined);
  const navigate = useNavigate();

  function setConfirmClose(fn: ConfirmCloseFn | null) {
    confirmCloseRef.current = fn;
  }

  async function confirmClose() {
    if (!confirmCloseRef.current) return true;

    const hasChanges = await confirmCloseRef.current();
    if (!hasChanges) return true;

    setShowCancelMenu(true);
    return await new Promise<boolean>(resolve => resolveRef.current = resolve);
  }

  function handleConfirmClose() {
    setShowCancelMenu(false);
    resolveRef.current?.(true);
  }

  function handleCancelClose() {
    setShowCancelMenu(false);
    resolveRef.current?.(false);
  }

  async function handleCloseClick() {
    const canClose = await confirmClose();
    if (canClose) return navigate(-1);
  }

  return (
    <ModalCloseContext.Provider value={{ setConfirmClose, confirmClose, showCancelMenu, handleConfirmClose, handleCancelClose, handleCloseClick }}>
      {children}
    </ModalCloseContext.Provider>
  );
}

export default ModalCloseProvider;
