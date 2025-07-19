import React, { lazy, Suspense, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import FloatingChat from "./components/FloatingChat";
import Header from "./components/Header";
// Add icon import
import { MessageCircle } from "lucide-react"; // Make sure to install lucide-react or use another icon library
import About from './pages/About';
import Contact from './pages/Contact';
import TournamentDetails from './pages/TournamentDetails';

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const News = lazy(() => import("./pages/News"));
const Matches = lazy(() => import("./pages/Matches"));
const Tournaments = lazy(() => import("./pages/Tournaments"));
const MatchDetailsPage = lazy(() => import("./pages/MatchDetailsPage"));
const Standings = lazy(() => import('./pages/Standings'));

function App() {
  const [showChat, setShowChat] = useState(false);
  return (
    <Router>
      <Header />
      <main className="flex-1 min-h-screen bg-[#181818] text-white font-sans">
        <Suspense fallback={<div className="text-center text-gray-400 py-8">جاري التحميل...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/news" element={<News />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/tournament/:leagueId" element={<TournamentDetails />} />
            <Route path="/standings/:leagueId/:season" element={<Standings />} />
            <Route path="/match/:id" element={<MatchDetailsPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Suspense>
      </main>
      {/* Floating Chat Button - new design */}
      {!showChat && (
        <button
          style={{
            position: "fixed",
            bottom: 32,
            left: 32,
            zIndex: 99999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            border: "4px solid #fff",
          }}
          className="rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 hover:from-indigo-600 hover:to-pink-600 w-16 h-16 flex items-center justify-center transition-all duration-300 border-4 shadow-2xl hover:scale-110 animate-pulse"
          onClick={() => setShowChat(true)}
        >
          <MessageCircle size={32} className="text-white drop-shadow-lg" />
        </button>
      )}
      {showChat && <FloatingChat onClose={() => setShowChat(false)} />}
    </Router>
  );
}

export default App;
