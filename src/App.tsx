import { AppProvider } from './state/store';
import { AppShell } from './components/layout/Shell';

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
}
