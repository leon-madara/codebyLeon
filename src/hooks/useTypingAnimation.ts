import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';

interface TypingConfig {
  words: string[];
  colorIndices: number[];
  typingSpeedMin: number;
  typingSpeedMax: number;
  backspaceSpeed: number;
  pauseBeforeBackspace: number;
  pauseBeforeType: number;
}

const DEFAULT_CONFIG: TypingConfig = {
  words: ['VISIONARY', 'PIONEERING', 'ASPIRING', 'DRIVEN', 'AMBITIOUS'],
  colorIndices: [1, 2, 3, 4, 5],
  typingSpeedMin: 0.05,
  typingSpeedMax: 0.15,
  backspaceSpeed: 0.05,
  pauseBeforeBackspace: 1.5,
  pauseBeforeType: 0.5,
};

const EMPTY_CONFIG = {};

export function useTypingAnimation(config: Partial<TypingConfig> = EMPTY_CONFIG) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isActive, setIsActive] = useState(true);

  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);

  const [currentWord, setCurrentWord] = useState(DEFAULT_CONFIG.words[0]);
  const currentWordRef = useRef(DEFAULT_CONFIG.words[0]);

  useEffect(() => {
    if (!isActive) return;

    const element = elementRef.current;
    if (!element) return;

    // Clear initial content
    element.textContent = '';

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const typeLoop = (wordIndex: number) => {
      if (!isActive) return; // double check

      const targetWord = finalConfig.words[wordIndex % finalConfig.words.length];
      setCurrentWord(targetWord); // Update the current target word
      currentWordRef.current = targetWord;
      const charArray = targetWord.split('');

      const tl = gsap.timeline({
        onComplete: () => {
          if (isActive) typeLoop(wordIndex + 1)
        },
      });

      timelineRef.current = tl;

      // Typing phase
      let lastIndex: number | null = null;

      // ... rest of typing logic uses charArray ...
      charArray.forEach((char) => {
        let availableIndices = finalConfig.colorIndices;
        if (lastIndex !== null) {
          availableIndices = finalConfig.colorIndices.filter(idx => idx !== lastIndex);
        }
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        lastIndex = randomIndex;

        tl.call(
          () => {
            const span = document.createElement('span');
            span.textContent = char;
            span.className = `rainbow-color-${randomIndex}`;
            element.appendChild(span);
          },
          undefined,
          `+=${random(finalConfig.typingSpeedMin, finalConfig.typingSpeedMax)}`
        );
      });

      // Pause phase
      tl.to({}, { duration: finalConfig.pauseBeforeBackspace });

      // Backspace phase
      charArray.forEach(() => {
        tl.call(
          () => {
            if (element.lastChild) {
              element.removeChild(element.lastChild);
            }
          },
          undefined,
          `+=${finalConfig.backspaceSpeed}`
        );
      });

      // Pause before next word
      tl.to({}, { duration: finalConfig.pauseBeforeType });
    };

    // Start the loop
    typeLoop(0);

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [finalConfig, isActive]);

  const stop = useCallback(() => {
    setIsActive(false);
    if (timelineRef.current) {
      timelineRef.current.pause();
      timelineRef.current.kill();
      timelineRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsActive(true);
  }, []);

  return { elementRef, stop, start, currentWord, currentWordRef };
}
