import React, { useState } from 'react';
import { useKanbanContext } from '../context/KanbanContext';
import Modal from './Modal';
import FormField from './FormField';

const Sidebar = () => {
  const {
    state: { boards, selectedBoardId },
    selectBoard,
    addBoard,
    deleteBoard,
    updateBoard,
  } = useKanbanContext();

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editBoard, setEditBoard] = useState<any>(null);
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const openCreate = () => {
    setEditBoard(null);
    setName('');
    setError('');
    setModalOpen(true);
  };
  const openEdit = (board: any) => {
    setEditBoard(board);
    setName(board.name);
    setError('');
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setName('');
    setEditBoard(null);
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Board name is required');
      return;
    }
    if (name.length < 3) {
      setError('Board name must be at least 3 characters');
      return;
    }
    if (editBoard) {
      updateBoard({ ...editBoard, name });
    } else {
      addBoard({
        id: Date.now().toString(),
        name,
        columns: [
          { name: 'Todo', tasks: [] },
          { name: 'Doing', tasks: [] },
          { name: 'Done', tasks: [] },
        ],
      });
    }
    closeModal();
  };

  return (
    <aside className="sidebar">
      <div>
        {/* Branding/Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 24px', marginBottom: 32 }}>
         
          <span style={{ fontWeight: 700, fontSize: 22, letterSpacing: 2, color: '#fff' }}>kanban</span>
        </div>
        {/* Board List */}
        <h3 style={{ marginLeft: 24, marginBottom: 20, color: 'var(--muted)', fontSize: 13, letterSpacing: 2 }}>ALL BOARDS ({boards.length})</h3>
        <ul style={{ marginBottom: 32 }}>
          {boards.map((board) => (
            <li key={board.id}>
              <button
                className={`sidebar-board${board.id === selectedBoardId ? ' selected' : ''}`}
                onClick={() => selectBoard(board.id)}
                onDoubleClick={() => openEdit(board)}
              >
                <span style={{ marginRight: 12, fontWeight: 700, fontSize: 18, color: 'var(--muted)' }}>📋</span>
                <span style={{ flex: 1, textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{board.name}</span>
              <span onClick={() => deleteBoard(board.id)} style={{ color: 'var(--muted)', float: 'right', fontSize: 13, marginRight: 10 }}>✕</span>
              </button>
            </li>
          ))}
        </ul>
        <button
          style={{
            color: '#514E85',
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: 1,
            width: '85%',
          }}
          onClick={openCreate}
        >
          + Create New Board
        </button>
        <Modal open={modalOpen} onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <h3 style={{ marginBottom: 20 }}>{editBoard ? 'Edit Board' : 'Create Board'}</h3>
            <FormField
              label="Board Name"
              value={name}
              onChange={setName}
              error={error}
              placeholder="e.g. Marketing Plan"
            />
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
              {editBoard ? 'Save Changes' : 'Create Board'}
            </button>
          </form>
        </Modal>
      </div>
    </aside>
  );
};

export default Sidebar;
