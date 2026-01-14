#!/bin/bash

echo "🚀 Creating test users - FINAL VERSION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

TIMESTAMP=$(date +%s)

# ============================================================
# USER 1: SAFE
# ============================================================
echo "👤 Creating user-safe-$TIMESTAMP..."

USER_SAFE="user-safe-$TIMESTAMP"

for i in {1..3}; do
  curl -s -X POST http://localhost:3000/api/transactions \
    -H "Content-Type: application/json" \
    -d "{\"userId\":\"$USER_SAFE\",\"amount\":100,\"country\":\"CO\"}" > /dev/null
  sleep 30
done

echo "✅ user-safe-$TIMESTAMP created (Expected: 0 points)"
echo ""

# ============================================================
# USER 2: MEDIUM
# ============================================================
echo "👤 Creating user-medium-$TIMESTAMP..."

USER_MEDIUM="user-medium-$TIMESTAMP"

# Baseline: 2 transactions of $100
curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_MEDIUM\",\"amount\":100,\"country\":\"CO\"}" > /dev/null
sleep 30

curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_MEDIUM\",\"amount\":100,\"country\":\"CO\"}" > /dev/null
sleep 30

# SPIKE: $500 (400% above $100 average)
curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_MEDIUM\",\"amount\":500,\"country\":\"CO\"}" > /dev/null

echo "✅ user-medium-$TIMESTAMP created"
echo "   ⚡ ANALYZE NOW! Expected: 20 points (AMOUNT_SPIKE)"
echo ""
read -p "Press Enter after analyzing to continue..."

# ============================================================
# USER 3: HIGH
# ============================================================
echo ""
echo "👤 Creating user-high-$TIMESTAMP..."

USER_HIGH="user-high-$TIMESTAMP"

# Baseline: 2 transactions in CO only
curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_HIGH\",\"amount\":100,\"country\":\"CO\"}" > /dev/null
sleep 30

curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_HIGH\",\"amount\":100,\"country\":\"CO\"}" > /dev/null
sleep 30

# SPIKE + NEW COUNTRY: $600 in VE
curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_HIGH\",\"amount\":600,\"country\":\"VE\"}" > /dev/null

echo "✅ user-high-$TIMESTAMP created"
echo "   ⚡ ANALYZE NOW! Expected: 40 points (AMOUNT_SPIKE + UNUSUAL_COUNTRY)"
echo ""
read -p "Press Enter after analyzing to continue..."

# ============================================================
# USER 4: CRITICAL
# ============================================================
echo ""
echo "👤 Creating user-critical-$TIMESTAMP..."

USER_CRITICAL="user-critical-$TIMESTAMP"

# Baseline: 2 transactions of $100 in CO
curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_CRITICAL\",\"amount\":100,\"country\":\"CO\"}" > /dev/null
sleep 30

curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_CRITICAL\",\"amount\":100,\"country\":\"CO\"}" > /dev/null

echo ""
echo "🚨 BURST STARTING IN 5 SECONDS..."
echo "   After burst completes, you'll have ~90 seconds to analyze!"
sleep 5

# BURST: 3 transactions in ~3 seconds
curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_CRITICAL\",\"amount\":700,\"country\":\"VE\"}" > /dev/null
echo "   🔥 Burst 1/3: \$700 in VE"
sleep 1

curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_CRITICAL\",\"amount\":800,\"country\":\"PA\"}" > /dev/null
echo "   🔥 Burst 2/3: \$800 in PA"
sleep 1

curl -s -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -d "{\"userId\":\"$USER_CRITICAL\",\"amount\":900,\"country\":\"MX\"}" > /dev/null
echo "   🔥 Burst 3/3: \$900 in MX"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "⚡⚡⚡ ANALYZE user-critical-$TIMESTAMP NOW! ⚡⚡⚡"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Expected: 70 points"
echo "  - HIGH_FREQUENCY (30): 3 trans in 3 seconds"
echo "  - AMOUNT_SPIKE (20): \$900 vs \$100 avg = 800%"
echo "  - UNUSUAL_COUNTRY (20): VE is new"
echo ""
echo "⏰ You have ~90 seconds before HIGH_FREQUENCY expires!"
echo ""
echo "Users created:"
echo "  1. $USER_SAFE"
echo "  2. $USER_MEDIUM"
echo "  3. $USER_HIGH"
echo "  4. $USER_CRITICAL"
echo ""