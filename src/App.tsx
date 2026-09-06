import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';

const Home = lazy(() => import('@/pages/Home'));
const BusinessHealthReview = lazy(() => import('@/pages/BusinessHealthReview'));
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
            <Route path="/pricing" element={<Navigate to="/business-health-review" replace />} />
            <Route path="/business-health-review" element={<BusinessHealthReview />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/how-we-use-ai" element={<HowWeUseAI />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="*" element={<div className="health wrap review-hero section"><h1>Page not found</h1><a className="primary" href="/">Back to home</a></div>} />
          </Routes>
        </Layout>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
