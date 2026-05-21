import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';

const Home = lazy(() => import('@/pages/Home'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Portfolio = lazy(() => import('@/pages/Portfolio'));
const HowWeUseAI = lazy(() => import('@/pages/HowWeUseAI'));
const Blog = lazy(() => import('@/pages/Blog'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/how-we-use-ai" element={<HowWeUseAI />} />
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </Layout>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
