import React, { useState } from 'react';
import { useKanbanContext } from '../context/KanbanContext';
import Modal from './Modal';
import FormField from './FormField';

const BoardColumn = () => {
  const {
    state: { boards, selectedBoardId },
    addTask,
    updateTask,
    deleteTask,
  } = useKanbanContext();

  const board = boards.find((b) => b.id === selectedBoardId);
  if (!board) return <div className="no-board-selected">No board selected.</div>;
  const columnNames = board.columns.map(col => col.name);

  // Modal state for tasks
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
  const [columnName, setColumnName] = useState('');
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [originalColumn, setOriginalColumn] = useState('');

  const openCreate = (colName: string) => {
    setEditTask(null);
    setColumnName(colName);
    setTitle('');
    setError('');
    setOriginalColumn(colName);
    setModalOpen(true);
  };
  const openEdit = (colName: string, task: any) => {
    setEditTask(task);
    setColumnName(colName);
    setTitle(task.title);
    setError('');
    setOriginalColumn(colName);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setTitle('');
    setEditTask(null);
    setError('');
    setColumnName('');
    setOriginalColumn('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    if (title.length < 3) {
      setError('Task title must be at least 3 characters');
      return;
    }
    if (editTask) {
      // If state/column changed, move the task
      if (columnName !== originalColumn) {
        deleteTask(board.id, originalColumn, editTask.id);
        addTask(board.id, columnName, { ...editTask, title, status: columnName });
      } else {
        updateTask(board.id, columnName, { ...editTask, title, status: columnName });
      }
    } else {
      addTask(board.id, columnName, {
        id: Date.now().toString(),
        title,
        status: columnName,
      });
    }
    closeModal();
  };

  return (
    <div className="kanban-columns">
      {board.columns.map((col) => (
        <div key={col.name} className="kanban-column">
          <h4 className="column-title">{col.name.toUpperCase()}</h4>
          <ul className="column-task-list">
            {col.tasks.map((task) => (
              <li key={task.id} className="task-card">
                <span className="task-title">{task.title}</span>
                <button className="task-edit-btn" onClick={() => openEdit(col.name, task)}>Edit</button>
                <button className="task-delete-btn" onClick={() => deleteTask(board.id, col.name, task.id)}>✕</button>
              </li>
            ))}
          </ul>

        </div>
      ))}
      <Modal open={modalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit}>
          <h3 className="modal-title">{editTask ? 'Edit Task' : 'Add Task'}</h3>
          <FormField
            label="Task Title"
            value={title}
            onChange={setTitle}
            error={error}
            placeholder="e.g. Design onboarding flow"
          />
          <label className="form-label">
            Task State
            <select
              className="form-select"
              value={columnName}
              onChange={e => setColumnName(e.target.value)}
            >
              {columnNames.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="modal-submit-btn"
          >
            {editTask ? 'Save Changes' : 'Add Task'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BoardColumn;
