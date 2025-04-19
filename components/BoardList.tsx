import React, { useState } from 'react';
import { useKanbanContext } from '../context/KanbanContext';
import Modal from './Modal';
import FormField from './FormField';

const BoardList = () => {
  const {
    state: { boards, selectedBoardId },
    addTask,
  } = useKanbanContext();

  const board = boards.find((b) => b.id === selectedBoardId);
  const columnNames = board ? board.columns.map(col => col.name) : [];

  // Modal state for add task
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [taskState, setTaskState] = useState('Todo');
  const [error, setError] = useState('');

  const openModal = () => {
    setTitle('');
    setTaskState(columnNames[0] || 'Todo');
    setError('');
    setModalOpen(true);
  };
  const closeModal = () => {
    setTitle('');
    setTaskState(columnNames[0] || 'Todo');
    setError('');
    setModalOpen(false);
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
    if (board && board.columns.length > 0) {
      addTask(board.id, taskState, {
        id: Date.now().toString(),
        title,
        status: taskState,
      });
    }
    closeModal();
  };

  return (
    <div style={{
      padding: '24px 0 16px 0',
      borderBottom: '1.5px solid var(--border)',
      background: 'var(--secondary-bg)',
      minHeight: 56,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <h2 style={{
        fontWeight: 700,
        fontSize: 24,
        color: 'var(--text)',
        margin: 0,
        paddingLeft: 24,
        letterSpacing: 1,
      }}>
        {board ? board.name : ''}
      </h2>
      {board && (
        <button
          style={{
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 24,
            padding: '12px 28px',
            marginRight: 32,
            boxShadow: '0 2px 8px rgba(99,95,199,0.10)',
            letterSpacing: 1,
          }}
          onClick={openModal}
        >
          + Add Task
        </button>
      )}
      <Modal open={modalOpen} onClose={closeModal}>
        <form onSubmit={handleSubmit}>
          <h3 style={{ marginBottom: 20 }}>Add Task</h3>
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
              value={taskState}
              onChange={e => setTaskState(e.target.value)}
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
            Add Task
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default BoardList;
