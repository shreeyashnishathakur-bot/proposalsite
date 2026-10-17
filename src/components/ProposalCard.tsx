import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, AlertCircle, Edit3, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface ProposalCardProps {
  onYes: () => void;
  partnerName: string;
  onUpdatePartnerName: (name: string) => void;
}

const PLAYFUL_REACTIONS = [
  "Think carefully... 😉",
  "Wait! Did that button just slip away? 🏃💨",
  "Are you sure? Look at how shiny YES is! ✨",
  "Nice try, but you can't catch me! 😜",
  "Physics error: 'NO' is out of service! 💖",
  "My heart says YES is the only valid answer! 🥰",
  "Stop chasing me and click the big red button! 💕",
  "Plot twist: That button is allergic to you saying no! 🌹",
  "Resistance is futile, we're meant to be! 💘",
  "Just look at the YES button, it's begging for you! 🥺",
  "Every dodge makes my love stronger! ❤️",
  "You're making this too fun... now say YES! 💍",
];

export const ProposalCard: React.FC<ProposalCardProps> = ({
  onYes,
  partnerName,
  onUpdatePartnerName,
}) => {
  const [dodgeCount, setDodgeCount] = useState<number>(0);
  const [noPosition, setNoPosition] = useState<{ x: number; y: number } | null>(null);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(partnerName);
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setTempName(partnerName);
  }, [partnerName]);

  const handleNoDodge = () => {
    sound.playWhoosh();
    setDodgeCount((prev) => prev + 1);

    // Calculate a safe coordinate within viewport avoiding screen edges
    const buttonWidth = 120;
    const buttonHeight = 50;
    const padding = 24;

    const maxX = window.innerWidth - buttonWidth - padding;
    const maxY = window.innerHeight - buttonHeight - padding;

    // Pick random target in viewport with safe bounds
    const nextX = Math.max(padding, Math.floor(Math.random() * maxX));
    const nextY = Math.max(padding, Math.floor(Math.random() * maxY));

    setNoPosition({ x: nextX, y: nextY });
  };

  const saveName = () => {
    if (tempName.trim()) {
      onUpdatePartnerName(tempName.trim());
    }
    setIsEditingName(false);
  };

  // Dynamic scaling for YES button based on dodges
  const yesScale = 1 + Math.min(dodgeCount * 0.08, 0.7);

  // Current reaction text
  const currentReaction =
    PLAYFUL_REACTIONS[Math.min(dodgeCount, PLAYFUL_REACTIONS.length - 1)];

  return (
    <div className="relative z-10 w-full max-w-2xl mx-auto px-4 py-8">
      {/* Glassmorphic Proposal Card */}
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="glass-panel rounded-3xl p-6 sm:p-10 md:p-12 text-center text-rose-950 relative overflow-hidden backdrop-blur-2xl shadow-2xl"
      >
        {/* Subtle decorative heart aura in background */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-rose-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-red-400/20 rounded-full blur-3xl pointer-events-none" />

        {/* Personalized Name Bar */}
        <div className="flex items-center justify-center mb-6">
          {isEditingName ? (
            <div className="flex items-center gap-2 bg-white/40 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/50 shadow-sm">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Partner's name..."
                maxLength={25}
                className="bg-transparent border-none text-rose-900 font-semibold text-sm focus:outline-none placeholder:text-rose-400 text-center w-36"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && saveName()}
              />
              <button
                onClick={saveName}
                className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition"
                title="Save Name"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditingName(true)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/30 hover:bg-white/45 text-rose-900 text-xs sm:text-sm font-semibold tracking-wide border border-white/40 backdrop-blur-sm transition-all shadow-sm hover:scale-105"
              title="Click to personalize name"
            >
              <span>💌 For My Special One:</span>
              <span className="underline decoration-rose-400 decoration-wavy underline-offset-4 font-bold text-rose-700">
                {partnerName}
              </span>
              <Edit3 className="w-3 h-3 text-rose-500 opacity-70" />
            </button>
          )}
        </div>

        {/* Main Pulsing Heart Icon */}
        <div className="relative inline-flex items-center justify-center mb-5">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, -3, 3, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 2.2,
              ease: 'easeInOut',
            }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr from-rose-500 to-red-500 text-white flex items-center justify-center shadow-lg shadow-rose-500/40 relative z-10"
          >
            <Heart className="w-10 h-10 sm:w-12 sm:h-12 fill-white" />
          </motion.div>
          {/* Animated Glow Halo */}
          <div className="absolute inset-0 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-rose-400 blur-xl opacity-60 animate-ping" />
        </div>

        {/* Exact User Requested Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-rose-950 mb-4 leading-tight">
          ❤️ Will You Become My Girlfriend? ❤️
        </h1>

        {/* Romantic Heartfelt Subtext */}
        <p className="text-base sm:text-lg text-rose-900/90 max-w-lg mx-auto font-medium mb-8 leading-relaxed">
          Every moment with you feels like poetry. My heart has made up its mind, and today I just have to ask you...
        </p>

        {/* Interactive Feedback & Dodge Indicator */}
        <AnimatePresence mode="wait">
          <motion.div
            key={dodgeCount}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="min-h-[32px] mb-6 flex items-center justify-center gap-1.5 text-sm sm:text-base font-semibold text-rose-700"
          >
            {dodgeCount > 0 && <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />}
            <span>{currentReaction}</span>
            {dodgeCount >= 3 && (
              <span className="text-xs text-rose-500 bg-white/40 px-2 py-0.5 rounded-full border border-rose-200">
                Dodged {dodgeCount}x!
              </span>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions Zone: YES and NO buttons */}
        <div className="relative min-h-[90px] flex items-center justify-center gap-4 sm:gap-8 flex-wrap pt-2">
          {/* YES Button */}
          <motion.button
            onClick={() => {
              sound.playYesCelebration();
              onYes();
            }}
            animate={{
              scale: yesScale,
            }}
            whileHover={{ scale: yesScale * 1.06 }}
            whileTap={{ scale: yesScale * 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="relative group px-8 sm:px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 text-white font-bold text-lg sm:text-xl shadow-xl shadow-rose-500/35 hover:shadow-rose-500/55 transition-all duration-300 flex items-center gap-3 cursor-pointer z-20"
          >
            <Heart className="w-6 h-6 fill-white group-hover:scale-125 transition-transform" />
            <span>YES, I WILL! 💕</span>
            <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-200" />
            </span>
          </motion.button>

          {/* Initial NO Button container (when position is null) */}
          {!noPosition && (
            <motion.button
              onMouseEnter={handleNoDodge}
              onTouchStart={handleNoDodge}
              onClick={handleNoDodge}
              whileHover={{ scale: 1.05 }}
              className="px-8 sm:px-9 py-4 rounded-2xl bg-white/40 hover:bg-white/60 text-rose-900/80 font-bold text-lg border border-white/60 backdrop-blur-md shadow-md hover:shadow-lg transition-colors cursor-pointer select-none"
            >
              No 🙈
            </motion.button>
          )}
        </div>

        {/* Dodge Hint / Reassurance */}
        {dodgeCount >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-xs text-rose-800/70 flex items-center justify-center gap-1"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Notice how easy it is to click YES instead? It's destiny!</span>
          </motion.div>
        )}
      </motion.div>

      {/* Escaped NO Button flying anywhere across viewport */}
      {noPosition && (
        <motion.button
          animate={{
            x: noPosition.x,
            y: noPosition.y,
            scale: Math.max(0.78, 1 - dodgeCount * 0.02),
            rotate: (dodgeCount % 2 === 0 ? 8 : -8),
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 24,
          }}
          onMouseEnter={handleNoDodge}
          onTouchStart={handleNoDodge}
          onClick={handleNoDodge}
          style={{
            position: 'fixed',
            left: 0,
            top: 0,
          }}
          className="z-50 px-6 py-3 rounded-2xl bg-white/70 hover:bg-white text-rose-900 font-bold text-base shadow-2xl border-2 border-rose-300 backdrop-blur-xl cursor-pointer select-none touch-none whitespace-nowrap"
        >
          No 🙈
        </motion.button>
      )}
    </div>
  );
};
