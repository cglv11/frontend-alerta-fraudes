#!/bin/bash

echo "🚀 Creating fraud test users (optimized for testing)..."
echo ""

# ============================================================
# USER 1: LOW RISK (Score: 0)
# ============================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👤 USER 1: user-safe-v2 (LOW RISK)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

USER_SAFE="user-safe-v2"

for i in {1..3}; do
  curl -s -X POST http://localhost:3000/api/transactions \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"$USER_SAFE\",\"amount\":100,\"country\":\"CO\"}" > /dev/null
  echo "  ✓ Transaction $i: \$100 in CO"
  sleep 30  # Space out to avoid HIGH_FREQUENCY (> 2 minutes total)
done

echo "✅ Score: 0 (LOW) - No alerts"
echo ""

# ============================================================
# USER 2: MEDIUM RISK (Score: 20)
# ============================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👤 USER 2: user-medium-v2 (MEDIUM RISK)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

USER_MEDIUM="user-medium-v2"

# Baseline (low amounts)
for i in {1..2}; do
  curl -s -X POST http://localhost:3000/api/transactions \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"$USER_MEDIUM\",\"amount\":100,\"country\":\"CO\"}" > /dev/null
  echo "  ✓ Baseline: \$100 in CO"
  sleep 30
done

# SPIKE (high amount)
curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_MEDIUM\",\"amount\":400,\"country\":\"CO\"}" > /dev/null
echo "  ⚠️  SPIKE: \$400 in CO (300% above avg)"

echo "✅ Score: 20 (MEDIUM) - AMOUNT_SPIKE"
echo ""

# ============================================================
# USER 3: HIGH RISK (Score: 40)
# ============================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👤 USER 3: user-high-v2 (HIGH RISK)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

USER_HIGH="user-high-v2"

# Baseline in CO
for i in {1..2}; do
  curl -s -X POST http://localhost:3000/api/transactions \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"$USER_HIGH\",\"amount\":100,\"country\":\"CO\"}" > /dev/null
  echo "  ✓ Baseline: \$100 in CO"
  sleep 30
done

# SPIKE + NEW COUNTRY
curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_HIGH\",\"amount\":500,\"country\":\"VE\"}" > /dev/null
echo "  ⚠️  SPIKE + NEW COUNTRY: \$500 in VE"

echo "✅ Score: 40 (HIGH) - AMOUNT_SPIKE + UNUSUAL_COUNTRY"
echo ""

# ============================================================
# USER 4: CRITICAL RISK (Score: 70+)
# ============================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "👤 USER 4: user-critical-v2 (CRITICAL RISK)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

USER_CRITICAL="user-critical-v2"

# Baseline in CO
for i in {1..2}; do
  curl -s -X POST http://localhost:3000/api/transactions \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"$USER_CRITICAL\",\"amount\":100,\"country\":\"CO\"}" > /dev/null
  echo "  ✓ Baseline: \$100 in CO"
  sleep 30
done

echo "  🚨 Starting attack pattern..."

# Attack: HIGH_FREQUENCY + AMOUNT_SPIKE + UNUSUAL_COUNTRY
COUNTRIES=("VE" "PA" "MX")
for i in {1..3}; do
  AMOUNT=$((400 + i * 100))
  COUNTRY=${COUNTRIES[$((i - 1))]}
  
  curl -s -X POST http://localhost:3000/api/transactions \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"$USER_CRITICAL\",\"amount\":$AMOUNT,\"country\":\"$COUNTRY\"}" > /dev/null
  
  echo "  🔥 Attack $i: \$$AMOUNT in $COUNTRY"
  sleep 1  # Very fast (triggers HIGH_FREQUENCY)
done

echo "✅ Score: 70+ (CRITICAL) - ALL alerts"
echo ""

# ============================================================
# Summary
# ============================================================
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ ALL USERS CREATED!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Expected Results:"
echo "  1. user-safe-v2      → Score: 0   (LOW)      - No alerts"
echo "  2. user-medium-v2    → Score: 20  (MEDIUM)   - AMOUNT_SPIKE"
echo "  3. user-high-v2      → Score: 40  (HIGH)     - AMOUNT_SPIKE + UNUSUAL_COUNTRY"
echo "  4. user-critical-v2  → Score: 70  (CRITICAL) - HIGH_FREQ + AMOUNT_SPIKE + UNUSUAL_COUNTRY"
echo ""
echo "🔍 Refresh dashboard and analyze!"
echo ""