import { Spinner } from '@/components/ui/shadcn-io/spinner';

const Spin = () => (
    <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col items-center justify-center min-h-screen text-center">
          <Spinner key="ellipsis" variant="ellipsis" />
    </div>
  );

export default Spin;