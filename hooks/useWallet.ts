import { useState, useEffect } from 'react';

const STORAGE_KEY = 'quantgoal_wallet_balance';
const TRANSACTIONS_KEY = 'quantgoal_wallet_txs';

export function useWallet() {
    const [balance, setBalance] = useState(1000);
    const [transactions, setTransactions] = useState<{ desc: string, amount: number, date: string }[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) setBalance(parseInt(saved));

        const savedTxs = localStorage.getItem(TRANSACTIONS_KEY);
        if (savedTxs) setTransactions(JSON.parse(savedTxs));

        // Auto-Settlement Logic: Check parlay_history.json for new WON bets
        const checkSettlement = async () => {
            try {
                const res = await fetch('/parlay_history.json');
                if (!res.ok) return;
                const history = await res.json();

                const settledIdsRaw = localStorage.getItem('quantgoal_settled_ids');
                let settledIds = settledIdsRaw ? JSON.parse(settledIdsRaw) : [];
                let hasNewWins = false;

                history.forEach((bet: any) => {
                    if (bet.status === 'WON' && !settledIds.includes(bet.id)) {
                        const winAmount = bet.stake * (parseFloat(bet.odds) || 1);
                        earn(winAmount, `Win Settlement: ${bet.id}`);
                        settledIds.push(bet.id);
                        hasNewWins = true;
                    }
                });

                if (hasNewWins) {
                    localStorage.setItem('quantgoal_settled_ids', JSON.stringify(settledIds));
                }
            } catch (err) {
                console.error("Settlement check failed", err);
            }
        };

        checkSettlement();
    }, []); // Only run on mount to detect wins from previous session


    const spend = (amount: number, description: string) => {
        if (balance < amount) return false;

        const newBalance = balance - amount;
        const newTx = { desc: description, amount: -amount, date: new Date().toISOString() };
        const newTxs = [newTx, ...transactions];

        setBalance(newBalance);
        setTransactions(newTxs);

        localStorage.setItem(STORAGE_KEY, newBalance.toString());
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTxs));
        return true;
    };

    const earn = (amount: number, description: string) => {
        const newBalance = balance + amount;
        const newTx = { desc: description, amount: amount, date: new Date().toISOString() };
        const newTxs = [newTx, ...transactions];

        setBalance(newBalance);
        setTransactions(newTxs);

        localStorage.setItem(STORAGE_KEY, newBalance.toString());
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(newTxs));
    };

    const reset = () => {
        setBalance(5000);
        setTransactions([]);
        localStorage.setItem(STORAGE_KEY, '5000');
        localStorage.setItem(TRANSACTIONS_KEY, '[]');
        return true;
    };

    return { balance, transactions, spend, earn, reset };
}
