import { useContext } from 'react';
import { KanbanContext } from '../context/KanbanContext';

export const useKanban = () => {
  return useContext(KanbanContext);
};
