import { RouterProvider } from 'react-router';
import { router } from './routes';
import { UIProvider } from './components/UIContext';

export default function App() {
  return (
    <UIProvider>
      <RouterProvider router={router} />
    </UIProvider>
  );
}
