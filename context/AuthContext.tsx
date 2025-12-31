'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    signInWithPopup,
    signOut,
    User,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface AuthContextType {
    user: any | null; // Allow Mock User
    loading: boolean;
    isPro: boolean;
    loginWithGoogle: () => Promise<void>;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    registerWithEmail: (email: string, password: string) => Promise<void>;
    loginWithDemo: () => void;
    logout: () => Promise<void>;
    upgradeToPro: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                // Real Firebase User found
                setUser(currentUser);
                try {
                    const userRef = doc(db, 'users', currentUser.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setIsPro(userSnap.data().isPro || false);
                    } else {
                        setIsPro(false);
                    }
                } catch (e) {
                    console.error("Firestore Error (likely permission or config)", e);
                    setIsPro(false); // Fallback
                }
            }
            // Note: If no currentUser, we don't clear immediate in case we are in 'Demo Mode' explicitly.
            // But standard behavior is to sync with Firebase. 
            // We'll let the 'loginWithDemo' override this state manually if needed, 
            // but 'onAuthStateChanged' might fire and clear it. 
            // TO FIX: we only clear user if *Firebase explicitly says signed out* AND we aren't using a mock tag.
            // Simplified: If Firebase isn't loading, we stop loading.
            if (!currentUser && !user?.isMock) {
                setUser(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, [user?.isMock]);

    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login failed", error);
            // Fallback for Demo if Firebase fails (common in preview environments)
            alert("Firebase Login Failed (Check Console). Enabling Demo Mode.");
            loginWithDemo();
        }
    };

    const loginWithEmail = async (email: string, pass: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            console.error("Email login failed", error);
            throw error;
        }
    }

    const registerWithEmail = async (email: string, pass: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, pass);
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    }

    // NEW: Mock Login for Demo functionality
    const loginWithDemo = () => {
        setUser({
            uid: 'demo-user-123',
            email: 'visitor@quantgoal.ai',
            displayName: 'Guest Investor',
            isMock: true
        });
        setIsPro(false);
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null); // Clear local mock state too
            setIsPro(false);
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    // DEBUG ONLY: Upgrade current user to Pro
    const upgradeToPro = async () => {
        if (!user) return;
        setIsPro(true); // Always optimistically define as true for Demo
        if (!user.isMock) {
            try {
                const userRef = doc(db, 'users', user.uid);
                await setDoc(userRef, { isPro: true }, { merge: true });
            } catch (error) {
                console.error("Upgrade failed", error);
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, isPro, loginWithGoogle, loginWithEmail, registerWithEmail, loginWithDemo, logout, upgradeToPro }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
