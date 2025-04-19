import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Board, Task } from '../types/kanban';

// Kanban State Type
type KanbanState = {
  boards: Board[];
  selectedBoardId: string | null;
};

// Action Types
type KanbanAction =
  | { type: 'ADD_BOARD'; payload: Board }
  | { type: 'UPDATE_BOARD'; payload: Board }
  | { type: 'DELETE_BOARD'; payload: string }
  | { type: 'ADD_TASK'; payload: { boardId: string; columnName: string; task: Task } }
  | { type: 'UPDATE_TASK'; payload: { boardId: string; columnName: string; task: Task } }
  | { type: 'DELETE_TASK'; payload: { boardId: string; columnName: string; taskId: string } }
  | { type: 'SELECT_BOARD'; payload: string };

// Initial Sample Data
const initialState: KanbanState = {
  boards: [
    {
      id: '1',
      name: 'Platform Launch',
      columns: [
        { name: 'Todo', tasks: [] },
        { name: 'Doing', tasks: [] },
        { name: 'Done', tasks: [] }
      ]
    }
  ],
  selectedBoardId: '1',
};

function kanbanReducer(state: KanbanState, action: KanbanAction): KanbanState {
  switch (action.type) {
    case 'ADD_BOARD':
      return {
        ...state,
        boards: [...state.boards, action.payload],
        selectedBoardId: action.payload.id,
      };
    case 'UPDATE_BOARD':
      return {
        ...state,
        boards: state.boards.map(b => b.id === action.payload.id ? action.payload : b),
      };
    case 'DELETE_BOARD':
      const filteredBoards = state.boards.filter(b => b.id !== action.payload);
      return {
        ...state,
        boards: filteredBoards,
        selectedBoardId: filteredBoards.length ? filteredBoards[0].id : null,
      };
    case 'ADD_TASK':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? {
                ...board,
                columns: board.columns.map(col =>
                  col.name === action.payload.columnName
                    ? { ...col, tasks: [...col.tasks, action.payload.task] }
                    : col
                )
              }
            : board
        )
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? {
                ...board,
                columns: board.columns.map(col =>
                  col.name === action.payload.columnName
                    ? {
                        ...col,
                        tasks: col.tasks.map(task =>
                          task.id === action.payload.task.id ? action.payload.task : task
                        )
                      }
                    : col
                )
              }
            : board
        )
      };
    case 'DELETE_TASK':
      return {
        ...state,
        boards: state.boards.map(board =>
          board.id === action.payload.boardId
            ? {
                ...board,
                columns: board.columns.map(col =>
                  col.name === action.payload.columnName
                    ? {
                        ...col,
                        tasks: col.tasks.filter(task => task.id !== action.payload.taskId)
                      }
                    : col
                )
              }
            : board
        )
      };
    case 'SELECT_BOARD':
      return {
        ...state,
        selectedBoardId: action.payload,
      };
    default:
      return state;
  }
}

// Context Type
interface KanbanContextType {
  state: KanbanState;
  addBoard: (board: Board) => void;
  updateBoard: (board: Board) => void;
  deleteBoard: (boardId: string) => void;
  addTask: (boardId: string, columnName: string, task: Task) => void;
  updateTask: (boardId: string, columnName: string, task: Task) => void;
  deleteTask: (boardId: string, columnName: string, taskId: string) => void;
  selectBoard: (boardId: string) => void;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

export const useKanbanContext = () => {
  const ctx = useContext(KanbanContext);
  if (!ctx) throw new Error('useKanbanContext must be used within a KanbanProvider');
  return ctx;
};

export const KanbanProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(kanbanReducer, initialState);

  // CRUD helpers
  const addBoard = (board: Board) => dispatch({ type: 'ADD_BOARD', payload: board });
  const updateBoard = (board: Board) => dispatch({ type: 'UPDATE_BOARD', payload: board });
  const deleteBoard = (boardId: string) => dispatch({ type: 'DELETE_BOARD', payload: boardId });
  const addTask = (boardId: string, columnName: string, task: Task) =>
    dispatch({ type: 'ADD_TASK', payload: { boardId, columnName, task } });
  const updateTask = (boardId: string, columnName: string, task: Task) =>
    dispatch({ type: 'UPDATE_TASK', payload: { boardId, columnName, task } });
  const deleteTask = (boardId: string, columnName: string, taskId: string) =>
    dispatch({ type: 'DELETE_TASK', payload: { boardId, columnName, taskId } });
  const selectBoard = (boardId: string) => dispatch({ type: 'SELECT_BOARD', payload: boardId });

  return (
    <KanbanContext.Provider
      value={{
        state,
        addBoard,
        updateBoard,
        deleteBoard,
        addTask,
        updateTask,
        deleteTask,
        selectBoard,
      }}
    >
      {children}
    </KanbanContext.Provider>
  );
};
