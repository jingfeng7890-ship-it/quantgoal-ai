@echo off
echo [QUANTGOAL CENTRAL BANK] Starting Daily Operations...
echo [TIMEZONE] EST (New York) - Institutional Trading Cycle
echo ==================================================

echo [04:00 EST] STEP 1: OVERNIGHT SETTLEMENT
echo Processing results from European/Asian sessions...
python backend/settlement_engine.py
echo.

echo [09:00 EST] STEP 2: ALPHA GENERATION (Wall St Pre-Market)
echo Analyzing fresh market data and generating Consensus Signals...
python backend/generate_v4_signals.py
echo.

echo [09:30 EST] STEP 3: PORTFOLIO CONSTRUCTION (Market Open)
echo Deploying capital to daily optimized parlay strategies...
python backend/generate_daily_parlays.py
echo.

echo ==================================================
echo [SUCCESS] Daily Operational Cycle Complete.
echo [STATUS] QuantGoal Market is OPEN. 
pause
