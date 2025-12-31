'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export interface BetSelection {
    id: string; // unique combo of matchId + outcomes
    matchId: string;
    matchInfo: string; // e.g. "Man Utd vs Chelsea"
    selection: string; // e.g. "Home", "Over 2.5"
    market: string; // "1x2", "AH", "O/U"
    odds: number;
}

interface BettingSlipContextType {
    items: BetSelection[];
    addToSlip: (item: BetSelection) => void;
    removeFromSlip: (id: string) => void;
    clearSlip: () => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const BettingSlipContext = createContext<BettingSlipContextType | undefined>(undefined);

export function BettingSlipProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<BetSelection[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const addToSlip = (item: BetSelection) => {
        setItems(prev => {
            // Prevent duplicate bets for the same match/market if needed, 
            // but for now allow accumulating different bets.
            // Check for exact duplicate
            if (prev.some(i => i.id === item.id)) return prev;

            // Auto-open slip on add
            setIsOpen(true);
            return [...prev, item];
        });
    };

    const removeFromSlip = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
    };

    const clearSlip = () => {
        setItems([]);
        setIsOpen(false);
    };

    return (
        <BettingSlipContext.Provider value={{ items, addToSlip, removeFromSlip, clearSlip, isOpen, setIsOpen }}>
            {children}
        </BettingSlipContext.Provider>
    );
}

export const useBettingSlip = () => {
    const context = useContext(BettingSlipContext);
    if (context === undefined) {
        throw new Error('useBettingSlip must be used within a BettingSlipProvider');
    }
    return context;
};
