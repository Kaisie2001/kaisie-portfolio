'use client';
import { createContext, useContext } from 'react';

// The standalone Hero stays active by default. Only the integration deck gates it.
export const HeroActivity = createContext(true);
export const useHeroActivity = () => useContext(HeroActivity);
