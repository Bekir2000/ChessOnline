'use client';

import { useCallback, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiProps {
  isActive: boolean;
}

export default function Confetti({ isActive }: ConfettiProps) {
  const refAnimationInstance = useRef<confetti.CreateTypes | null>(null);

  const getInstance = useCallback(() => {
    if (refAnimationInstance.current === null) {
      refAnimationInstance.current = confetti.create(undefined, {
        resize: true,
        useWorker: true,
      });
    }
    return refAnimationInstance.current;
  }, []);

  const makeShot = useCallback((particleRatio: number, opts: confetti.Options) => {
    getInstance()?.(
      {
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      }
    );
  }, [getInstance]);

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  useEffect(() => {
    if (isActive) {
      fire();
    }
    return () => {
      getInstance()?.reset();
    };
  }, [fire, getInstance, isActive]);

  return null;
}