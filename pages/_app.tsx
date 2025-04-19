import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { KanbanProvider } from '../context/KanbanContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <KanbanProvider>
      <Component {...pageProps} />
    </KanbanProvider>
  );
}

export default MyApp;
