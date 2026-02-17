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
  disabled: boolean;
}

const DEFAULT_CONFIG: TypingConfig = {
  words: ['VISIONARY', 'PIONEERING', 'ASPIRING', 'DRIVEN', 'AMBITIOUS'],
  colorIndices: [1, 2, 3, 4, 5],
  typingSpeedMin: 0.05,
  typingSpeedMax: 0.15,
  backspaceSpeed: 0.05,
  pauseBeforeBackspace: 1.5,
  pauseBeforeType: 0.5,
  disabled: false,
};

const EMPTY_CONFIG = {};

export function useTypingAnimation(config: Partial<TypingConfig> = EMPTY_CONFIG) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const [isActive, setIsActive] = useState(true);

  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);

  const [currentWord, setCurrentWord] = useState(DEFAULT_CONFIG.words[0]);
  const currentWordRef = useRef(DEFAULT_CONFIG.words[0]);
  const startWordIndexRef = useRef(0);
  const currentWordIndexRef = useRef(0);
  const wordCount = finalConfig.words.length;
  const normalizeIndex = useMemo(() => {
    return (index: number) => {
      if (wordCount === 0) return 0;
      return ((index % wordCount) + wordCount) % wordCount;
    };
  }, [wordCount]);
  const setStartingWordIndex = useCallback((index: number) => {
    startWordIndexRef.current = normalizeIndex(index);
  }, [normalizeIndex]);

  useEffect(() => {
    if (!isActive || wordCount === 0) return;

    const element = elementRef.current;
    if (!element) return;

    if (finalConfig.disabled) {
      const targetWord = finalConfig.words[0] ?? '';
      const colorIndices = finalConfig.colorIndices.length > 0 ? finalConfig.colorIndices : [1];

      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }

      element.innerHTML = '';
      targetWord.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = `rainbow-color-${colorIndices[index % colorIndices.length]}`;
        element.appendChild(span);
      });

      setCurrentWord(targetWord);
      currentWordRef.current = targetWord;
      startWordIndexRef.current = 0;
      currentWordIndexRef.current = 0;
      return;
    }

    // Clear initial content
    element.textContent = '';

    const random = (min: number, max: number) => Math.random() * (max - min) + min;

    const typeLoop = (wordIndex: number) => {
      if (!isActive) return; // double check

      const safeIndex = normalizeIndex(wordIndex);
      startWordIndexRef.current = safeIndex;
      currentWordIndexRef.current = safeIndex;
      const targetWord = finalConfig.words[safeIndex];
      setCurrentWord(targetWord); // Update the current target word
      currentWordRef.current = targetWord;
      const charArray = targetWord.split('');

      const tl = gsap.timeline({
        onComplete: () => {
          if (isActive) typeLoop(safeIndex + 1)
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

    // Start the loop from the last recorded index
    const normalizedStart = normalizeIndex(startWordIndexRef.current);
    startWordIndexRef.current = normalizedStart;
    typeLoop(normalizedStart);

    // Cleanup
    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [finalConfig, isActive, normalizeIndex, wordCount]);

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

  return { elementRef, stop, start, currentWord, currentWordRef, currentWordIndexRef, setStartingWordIndex };
}
