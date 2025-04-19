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
  if (!board) return <div style={{ color: 'var(--muted)', padding: 32 }}>No board selected.</div>;
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
          <h4 style={{ color: 'var(--muted)', fontSize: 13, letterSpacing: 2, marginBottom: 24 }}>{col.name.toUpperCase()}</h4>
          <ul style={{ marginBottom: 16 }}>
            {col.tasks.map((task) => (
              <li key={task.id} className="task-card">
                <span style={{ flex: 1 }}>{task.title}</span>
                <button onClick={() => openEdit(col.name, task)} style={{ marginRight: 8, color: 'var(--muted)', fontSize: 13 }}>Edit</button>
                <button onClick={() => deleteTask(board.id, col.name, task.id)} style={{ color: 'var(--muted)', fontSize: 13 }}>✕</button>
              </li>
            ))}
          </ul>
          <button
            style={{
              color: 'var(--accent)',
              fontWeight: 600,
              fontSize: 14,
              marginTop: 8,
              letterSpacing: 1,
            }}
            onClick={() => openCreate(col.name)}
          >
            + Add Task
          </button>
        </div>
      ))}
      <Modal open={modalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: 20 }}>{editTask ? 'Edit Task' : 'Add Task'}</h3>
          <FormField
            label="Task Title"
            value={title}
            onChange={setTitle}
            error={error}
            placeholder="e.g. Design onboarding flow"
          />
          <label style={{ display: 'block', margin: '16px 0 8px 0', fontWeight: 600, color: 'var(--text)' }}>
            Task State
            <select
              value={columnName}
              onChange={e => setColumnName(e.target.value)}
              style={{
                width: '100%',
                marginTop: 6,
                padding: '10px 12px',
                borderRadius: 6,
                border: '1.5px solid var(--border)',
                background: 'var(--input-bg)',
                color: 'var(--text)',
                fontSize: 15,
                fontFamily: 'inherit',
                fontWeight: 500,
                outline: 'none',
              }}
            >
              {columnNames.map((col) => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            style={{
              width: '100%',
              background: 'var(--accent)',
              color: '#fff',
              fontWeight: 600,
              fontSize: 16,
              padding: '12px 0',
              borderRadius: 6,
              marginTop: 8,
            }}
          >
            {editTask ? 'Save Changes' : 'Add Task'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BoardColumn;
