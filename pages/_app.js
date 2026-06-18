import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Toaster position="top-right" />
      <style global jsx>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', sans-serif; background: #F7F8FA; color: #1A1A2E; }
        a { text-decoration: none; color: inherit; }
      `}</style>
    </>
  );
}
