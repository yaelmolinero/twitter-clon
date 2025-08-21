import { useContext } from 'react';

import { ModalCloseContext } from '@/contexts/modalCloseContext/ModalCloseContext.tsx';

export function useModalClose() {
  const context = useContext(ModalCloseContext);
  if (!context) throw new Error('useModalClose must be used whitin an ModalCloseProvider');

  return context;
}
