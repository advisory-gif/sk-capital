import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/Layout";
import LoadingScreen from "@/components/LoadingScreen";

const Audience = lazy(() => import("@/pages/Audience"));
const Home = lazy(() => import("@/pages/Home"));
const BusinessHealthReview = lazy(() => import("@/pages/BusinessHealthReview"));
const Portfolio = lazy(() => import("@/pages/Portfolio"));
const HowWeUseAI = lazy(() => import("@/pages/HowWeUseAI"));
const Blog = lazy(() => import("@/pages/Blog"));

const isOfflineReview = import.meta.env.VITE_OFFLINE_REVIEW === "true";
const Router = isOfflineReview ? HashRouter : BrowserRouter;

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/businesses" element={<Audience kind="business" />} />
            <Route path="/startups" element={<Audience kind="startup" />} />
            <Route
              path="/pricing"
              element={
                isOfflineReview ? (
                  <BusinessHealthReview />
                ) : (
                  <Navigate to="/business-health-review" replace />
                )
              }
            />
            <Route
              path="/business-health-review"
              element={<BusinessHealthReview />}
            />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/how-we-use-ai" element={<HowWeUseAI />} />
            <Route path="/blog" element={<Blog />} />
            <Route
              path="*"
              element={
                <div className="health wrap review-hero section">
                  <h1>Page not found</h1>
                  <Link className="primary" to="/">
                    Back to home
                  </Link>
                </div>
              }
            />
          </Routes>
        </Layout>
      </Suspense>
    </Router>
  );
}

export default App;
