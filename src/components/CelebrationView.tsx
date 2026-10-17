import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sparkles,
  Share2,
  RotateCcw,
  Music,
  VolumeX,
  Volume2,
  Calendar,
  Award,
  CheckCircle2,
  Smile,
  Flame,
  Coffee,
  X,
} from 'lucide-react';
import { sound } from '../utils/audio';

// Visual assets generated for this experience
const POLAROID_IMAGES = [
  {
    src: '/src/assets/images/romantic_polaroid_sunset_1792220047291.jpg',
    title: 'Golden Hour Walk',
    caption: 'Wherever you go, I want to be right beside you.',
    date: 'Forever & Always',
    rotation: '-rotate-2',
  },
  {
    src: '/src/assets/images/romantic_roses_bouquet_1792220048451.jpg',
    title: 'A Garden of Love',
    caption: 'Roses fade, but what I feel for you blooms every day.',
    date: 'Just For You',
    rotation: 'rotate-3',
  },
  {
    src: '/src/assets/images/romantic_starlit_date_1792220048738.jpg',
    title: 'Under Starlit Skies',
    caption: 'A million stars above, but my eyes are only on you.',
    date: 'Magic Evenings',
    rotation: '-rotate-1',
  },
];

const LOVE_PERKS = [
  {
    icon: Coffee,
    title: 'Unlimited Morning Coffee & Hugs',
    desc: 'Guaranteed whenever you feel sleepy or stressed.',
  },
  {
    icon: Flame,
    title: 'Exclusive Warmest Hand-Holding',
    desc: 'Valid on cold winter strolls and grocery runs.',
  },
  {
    icon: Smile,
    title: 'VIP Pass to Bad Jokes & Laughs',
    desc: 'I promise to always try to make you smile every day.',
  },
  {
    icon: Award,
    title: 'Your #1 Fan Forever',
    desc: 'Always celebrating your wins and cheering you up.',
  },
];

interface CelebrationViewProps {
  partnerName: string;
  onReplay: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const CelebrationView: React.FC<CelebrationViewProps> = ({
  partnerName,
  onReplay,
  isMuted,
  onToggleMute,
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<typeof POLAROID_IMAGES[0] | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isMusicActive, setIsMusicActive] = useState(false);
  const [senderName, setSenderName] = useState('Your Boyfriend');
  const [isEditingSender, setIsEditingSender] = useState(false);

  // Trigger continuous festive confetti on initial mount
  useEffect(() => {
    // Left cannon
    confetti({
      particleCount: 80,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.75 },
      colors: ['#ff2e63', '#ff5e7e', '#ffd166', '#ffffff'],
    });

    // Right cannon
    confetti({
      particleCount: 80,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.75 },
      colors: ['#ff2e63', '#ff5e7e', '#ffd166', '#ffffff'],
    });

    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#ff3366', '#ff85a1', '#ffd166', '#fda4af'],
      });
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const triggerFireworks = () => {
    sound.playPop();
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#ff1361', '#ff5e7e', '#ffd166'],
    });
  };

  const handleCopyLink = () => {
    sound.playPop();
    const url = window.location.href;
    navigator.clipboard?.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleToggleMusic = () => {
    const active = sound.toggleMusic();
    setIsMusicActive(active);
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Top Floating Action Bar */}
      <div className="flex items-center justify-between gap-3 mb-8 flex-wrap">
        <button
          onClick={onReplay}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/30 hover:bg-white/50 text-rose-950 text-xs sm:text-sm font-semibold border border-white/50 backdrop-blur-md transition shadow-sm hover:scale-105 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-rose-600" />
          <span>Replay Proposal</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Music Box Toggle */}
          <button
            onClick={handleToggleMusic}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition shadow-sm hover:scale-105 cursor-pointer ${
              isMusicActive
                ? 'bg-rose-500 text-white border-rose-400'
                : 'bg-white/30 hover:bg-white/50 text-rose-950 border-white/50 backdrop-blur-md'
            }`}
            title="Toggle Romantic Lullaby Music Box"
          >
            <Music className={`w-4 h-4 ${isMusicActive ? 'animate-bounce' : ''}`} />
            <span>{isMusicActive ? 'Music: Playing 🎵' : 'Romantic Music'}</span>
          </button>

          {/* Mute/Sound Toggle */}
          <button
            onClick={onToggleMute}
            className="p-2 rounded-xl bg-white/30 hover:bg-white/50 text-rose-950 border border-white/50 backdrop-blur-md transition shadow-sm hover:scale-105 cursor-pointer"
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-800" /> : <Volume2 className="w-4 h-4 text-rose-600" />}
          </button>
        </div>
      </div>

      {/* Main Celebration Hero Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel rounded-3xl p-6 sm:p-10 md:p-12 text-center text-rose-950 mb-10 shadow-2xl relative overflow-hidden backdrop-blur-2xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 text-rose-700 text-xs sm:text-sm font-bold uppercase tracking-wider mb-4 border border-rose-300/40">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Official Announcement</span>
          <Sparkles className="w-4 h-4 text-amber-500" />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-rose-950 mb-4 font-dancing">
          She Said YES! 💍✨
        </h1>

        <p className="text-lg sm:text-xl text-rose-900/90 font-medium max-w-xl mx-auto mb-8 leading-relaxed">
          The best chapter of our lives officially starts today. You have my whole heart,{' '}
          <span className="font-bold text-rose-600 underline decoration-rose-300 decoration-wavy underline-offset-4">
            {partnerName}
          </span>
          .
        </p>

        {/* Quick Celebration Interactive Buttons */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap">
          <button
            onClick={triggerFireworks}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-red-500 text-white font-bold text-sm sm:text-base shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>Burst More Hearts!</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="px-5 py-3 rounded-2xl bg-white/40 hover:bg-white/60 text-rose-950 font-bold text-sm sm:text-base border border-white/60 backdrop-blur-md shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-rose-600" />
            <span>{copiedLink ? 'Link Copied! 💌' : 'Share The Joy'}</span>
          </button>
        </div>
      </motion.div>

      {/* Official Romance Certificate Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="glass-panel rounded-3xl p-6 sm:p-10 mb-10 border-2 border-white/60 shadow-xl relative"
      >
        <div className="border border-rose-300/60 rounded-2xl p-6 sm:p-8 bg-white/30 backdrop-blur-sm relative">
          {/* Certificate Header */}
          <div className="text-center mb-6">
            <div className="text-xs uppercase tracking-widest text-rose-600 font-bold mb-1">
              Certificate of Sweet Romance
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-950 font-dancing">
              Official Girlfriend Agreement
            </h2>
          </div>

          {/* Couple Names Lockup */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-4 text-center my-6 py-4 border-y border-rose-200/60">
            <div>
              <div className="text-xs text-rose-500 uppercase tracking-wider mb-1 font-semibold">The Girl of My Dreams</div>
              <div className="text-xl sm:text-2xl font-bold text-rose-900 font-dancing">{partnerName}</div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md animate-pulse">
                <Heart className="w-6 h-6 fill-white" />
              </div>
              <div className="text-xs text-rose-600 font-medium mt-1">Bound by Destiny</div>
            </div>

            <div>
              <div className="text-xs text-rose-500 uppercase tracking-wider mb-1 font-semibold">Forever Yours</div>
              {isEditingSender ? (
                <div className="flex items-center justify-center gap-1">
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="border-b border-rose-500 bg-transparent text-xl font-bold text-rose-900 text-center w-36 focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && setIsEditingSender(false)}
                  />
                  <button
                    onClick={() => setIsEditingSender(false)}
                    className="text-xs text-rose-600 hover:text-rose-900 font-bold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingSender(true)}
                  className="text-xl sm:text-2xl font-bold text-rose-900 font-dancing hover:underline"
                  title="Click to change your name"
                >
                  {senderName} ✍️
                </button>
              )}
            </div>
          </div>

          {/* Perks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {LOVE_PERKS.map((perk, idx) => {
              const Icon = perk.icon;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-xl bg-white/40 border border-white/50 backdrop-blur-sm"
                >
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-600 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-rose-950 flex items-center gap-1.5">
                      <span>{perk.title}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    </h3>
                    <p className="text-xs text-rose-900/80 mt-0.5">{perk.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Certificate Footer / Stamp */}
          <div className="flex items-center justify-between flex-wrap gap-4 mt-8 pt-4 border-t border-rose-200/60 text-xs text-rose-800/80">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-600" />
              <span>Ratified on: {formattedDate}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 font-bold border border-rose-200">
              <span>❤️ SEALED WITH LOVE & TRUST</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Romantic Polaroid Moments Section */}
      <div className="mb-10">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-rose-950 font-dancing">
            Our Love Story Begins Here
          </h2>
          <p className="text-sm text-rose-900/80">Click any memory to cherish the moment</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {POLAROID_IMAGES.map((img, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05, y: -6, rotate: 0 }}
              onClick={() => {
                sound.playPop();
                setSelectedPhoto(img);
              }}
              className={`bg-white p-3.5 pb-6 rounded-xl shadow-xl border border-rose-100 cursor-pointer transition-all duration-300 transform ${img.rotation}`}
            >
              <div className="aspect-square w-full overflow-hidden rounded-lg bg-rose-100 mb-3 relative">
                <img
                  src={img.src}
                  alt={img.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute top-2 right-2 bg-black/40 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {img.date}
                </div>
              </div>
              <div className="text-center">
                <h3 className="font-dancing text-xl font-bold text-slate-800">{img.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-1 italic mt-0.5">{img.caption}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Sweet Photo Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedPhoto(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-4 sm:p-6 max-w-lg w-full shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-square w-full rounded-2xl overflow-hidden mb-4 bg-slate-100">
                <img
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center">
                <span className="text-xs font-semibold text-rose-500 uppercase tracking-widest">
                  {selectedPhoto.date}
                </span>
                <h3 className="text-2xl font-bold text-slate-900 font-dancing mt-1">
                  {selectedPhoto.title}
                </h3>
                <p className="text-sm text-slate-600 mt-2 italic px-4 leading-relaxed">
                  "{selectedPhoto.caption}"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer / Warm Sign-off */}
      <div className="text-center text-xs text-rose-900/60 pt-6">
        <p>Made with all my love ❤️ May our journey be as sweet as today.</p>
      </div>
    </div>
  );
};
