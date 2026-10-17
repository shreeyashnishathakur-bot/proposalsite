import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Volume2, VolumeX, Music, Heart } from 'lucide-react';
import { HeartCanvas } from './components/HeartCanvas';
import { ProposalCard } from './components/ProposalCard';
import { CelebrationView } from './components/CelebrationView';
import { sound } from './utils/audio';

export default function App() {
  const [isAccepted, setIsAccepted] = useState<boolean>(false);
  const [partnerName, setPartnerName] = useState<string>('My Love');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicActive, setIsMusicActive] = useState<boolean>(false);

  // Initialize partner name from URL query parameter if available (e.g., ?to=Maya or ?name=Sarah)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const nameFromParam = params.get('to') || params.get('name');
      if (nameFromParam && nameFromParam.trim()) {
        setPartnerName(nameFromParam.trim());
      }
    }
  }, []);

  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (muted) {
      setIsMusicActive(false);
    }
  };

  const handleToggleMusic = () => {
    if (isMuted) {
      sound.setMuted(false);
      setIsMuted(false);
    }
    const active = sound.toggleMusic();
    setIsMusicActive(active);
  };

  const handleYes = () => {
    setIsAccepted(true);
    // Start sweet romantic background music automatically upon YES if not already playing
    if (!sound.getIsMusicPlaying() && !sound.getIsMuted()) {
      sound.startRomanticMusic();
      setIsMusicActive(true);
    }
  };

  const handleReplay = () => {
    setIsAccepted(false);
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-rose-600 via-pink-500 to-red-600 flex flex-col justify-between selection:bg-rose-300 selection:text-rose-950">
      {/* Dynamic Background Ambient Glow Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[55vw] h-[55vw] rounded-full bg-rose-400/35 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-red-400/30 blur-[130px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-pink-300/25 blur-[100px]" />
      </div>

      {/* Floating Canvas Hearts & Rose Petals */}
      <HeartCanvas isCelebration={isAccepted} />

      {/* Minimal Top Brand & Audio Bar */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-sm">
            <Heart className="w-4 h-4 fill-white" />
          </div>
          <span className="text-white font-dancing text-2xl font-bold tracking-wide drop-shadow-sm">
            Always & Forever
          </span>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleMusic}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-all cursor-pointer ${
              isMusicActive
                ? 'bg-white text-rose-600 border-white shadow-md'
                : 'bg-white/20 hover:bg-white/30 text-white border-white/30'
            }`}
            title="Romantic Music Box Melody"
          >
            <Music className={`w-3.5 h-3.5 ${isMusicActive ? 'animate-bounce' : ''}`} />
            <span className="hidden sm:inline">{isMusicActive ? 'Playing 🎵' : 'Music Box'}</span>
          </button>

          <button
            onClick={handleToggleMute}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md border border-white/30 transition shadow-sm cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-white/80" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex items-center justify-center py-6 sm:py-10">
        <AnimatePresence mode="wait">
          {!isAccepted ? (
            <motion.div
              key="proposal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <ProposalCard
                onYes={handleYes}
                partnerName={partnerName}
                onUpdatePartnerName={setPartnerName}
              />
            </motion.div>
          ) : (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <CelebrationView
                partnerName={partnerName}
                onReplay={handleReplay}
                isMuted={isMuted}
                onToggleMute={handleToggleMute}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subtle Romantic Footnote */}
      <footer className="relative z-10 py-3 text-center text-xs text-white/70 tracking-wide font-medium">
        <span>Click anywhere on the screen to sprinkle love hearts ✨</span>
      </footer>
    </main>
  );
}
