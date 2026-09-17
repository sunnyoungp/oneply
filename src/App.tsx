import { AppProvider } from './state/store';
import { TaskDragProvider } from './state/task-drag';
import { AppShell } from './components/layout/Shell';

export default function App() {
  return (
    <AppProvider>
      <TaskDragProvider>
        <AppShell />
      </TaskDragProvider>
    </AppProvider>
  );
}
