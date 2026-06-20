import { Toaster } from 'react-hot-toast';
import BottomNav from '../components/BottomNav';

export default function App({ Component, pageProps }) {
  return (
    <>
      <div style={{ paddingBottom: 64 }}>
        <Component {...pageProps} />
      </div>
      <BottomNav />
      <Toaster position="top-right" />
      <style global jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; }
        a { text-decoration: none; color: inherit; }
      `}</style>
    </>
  );
}
