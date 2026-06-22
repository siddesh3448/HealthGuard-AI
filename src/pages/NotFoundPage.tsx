import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-150 mb-2">404</h1>
      <p className="text-slate-500 mb-6">Page not found.</p>
      <Link to="/">
        <Button variant="primary">Back to Safety</Button>
      </Link>
    </div>
  );
}
export default NotFoundPage;
