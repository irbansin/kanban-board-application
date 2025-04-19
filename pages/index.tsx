import Sidebar from '../components/Sidebar';
import BoardList from '../components/BoardList';
import BoardColumn from '../components/BoardColumn';

export default function Home() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--primary-bg)' }}>
      <aside className="sidebar">
        <Sidebar />
      </aside>
      <main className="main-content">
        <BoardList />
        <div style={{ marginTop: 32 }}>
          <BoardColumn />
        </div>
      </main>
    </div>
  );
}
