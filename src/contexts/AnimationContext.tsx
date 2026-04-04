import { createContext, useContext, useState, ReactNode } from 'react';

interface AnimationContextType {
  torchEffectEnabled: boolean;
  setTorchEffectEnabled: (enabled: boolean) => void;
  resetTorchEffect: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: ReactNode }) {
  const [torchEffectEnabled, setTorchEffectEnabled] = useState(true);

  // Reset function to enable torch effect (called on theme change to dark)
  const resetTorchEffect = () => {
    setTorchEffectEnabled(true);
  };

  return (
    <AnimationContext.Provider value={{ torchEffectEnabled, setTorchEffectEnabled, resetTorchEffect }}>
      {children}
    </AnimationContext.Provider>
  );
}

export function useAnimation() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
}
