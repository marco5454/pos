#!/bin/bash

# Ice Crumble POS - Stop Script
# Stops all running backend and frontend processes

# Color codes matching design system
CORAL='\033[38;5;203m'    # Warm Coral
AMBER='\033[38;5;215m'    # Golden Amber
TERRA='\033[38;5;173m'    # Soft Terracotta
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${TERRA}╔════════════════════════════════════════╗${NC}"
echo -e "${TERRA}║   Ice Crumble POS - Stopping...       ║${NC}"
echo -e "${TERRA}╚════════════════════════════════════════╝${NC}"
echo ""

# Function to kill processes on a specific port
kill_port() {
    local port=$1
    local name=$2
    local color=$3
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${color}🛑 Stopping $name (Port $port)...${NC}"
        lsof -ti:$port | xargs kill -9 2>/dev/null
        echo -e "${GREEN}✓ $name stopped${NC}"
    else
        echo -e "${AMBER}ℹ️  No $name process found on port $port${NC}"
    fi
}

# Stop backend (port 5000)
kill_port 5000 "Backend" "$CORAL"

# Stop frontend (port 5173)
kill_port 5173 "Frontend" "$AMBER"

# Also kill any node processes that might be related
echo ""
echo -e "${TERRA}🧹 Cleaning up any remaining node processes...${NC}"

# Kill nodemon processes
pkill -f nodemon 2>/dev/null

# Kill vite processes
pkill -f vite 2>/dev/null

echo ""
echo -e "${GREEN}✓ All servers stopped successfully${NC}"
echo ""