#!/bin/bash

# Ice Crumble POS - Start Script
# Starts both backend and frontend servers

# Color codes matching design system
CORAL='\033[38;5;203m'    # Warm Coral
AMBER='\033[38;5;215m'    # Golden Amber
TERRA='\033[38;5;173m'    # Soft Terracotta
IVORY='\033[38;5;230m'    # Creamy Ivory
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${CORAL}╔════════════════════════════════════════╗${NC}"
echo -e "${CORAL}║     Ice Crumble POS - Starting...     ║${NC}"
echo -e "${CORAL}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if node_modules exist
if [ ! -d "backend/node_modules" ]; then
    echo -e "${RED}❌ Backend dependencies not found!${NC}"
    echo -e "${AMBER}Run: ./install.sh${NC}"
    exit 1
fi

if [ ! -d "frontend/node_modules" ]; then
    echo -e "${RED}❌ Frontend dependencies not found!${NC}"
    echo -e "${AMBER}Run: ./install.sh${NC}"
    exit 1
fi

# Check if ports are already in use
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${RED}❌ Port 5000 is already in use!${NC}"
    echo -e "${AMBER}Run: ./stop.sh to kill existing processes${NC}"
    exit 1
fi

if lsof -Pi :5173 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${RED}❌ Port 5173 is already in use!${NC}"
    echo -e "${AMBER}Run: ./stop.sh to kill existing processes${NC}"
    exit 1
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo -e "${TERRA}🛑 Shutting down servers...${NC}"
    
    # Kill backend process
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo -e "${CORAL}✓ Backend stopped${NC}"
    fi
    
    # Kill frontend process
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo -e "${AMBER}✓ Frontend stopped${NC}"
    fi
    
    # Kill any remaining node processes on these ports
    lsof -ti:5000 | xargs kill -9 2>/dev/null
    lsof -ti:5173 | xargs kill -9 2>/dev/null
    
    echo -e "${GREEN}✓ All servers stopped successfully${NC}"
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT SIGTERM

# Start backend server
echo -e "${CORAL}🚀 Starting Backend Server (Port 5000)...${NC}"
cd backend
npm run dev > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Check if backend started successfully
if ! ps -p $BACKEND_PID > /dev/null; then
    echo -e "${RED}❌ Backend failed to start!${NC}"
    echo -e "${AMBER}Check backend.log for details${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Backend running (PID: $BACKEND_PID)${NC}"
echo ""

# Start frontend server
echo -e "${AMBER}🚀 Starting Frontend Server (Port 5173)...${NC}"
cd frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 3

# Check if frontend started successfully
if ! ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${RED}❌ Frontend failed to start!${NC}"
    echo -e "${AMBER}Check frontend.log for details${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo -e "${GREEN}✓ Frontend running (PID: $FRONTEND_PID)${NC}"
echo ""
echo -e "${CORAL}╔════════════════════════════════════════╗${NC}"
echo -e "${CORAL}║         🎉 All Systems Ready!         ║${NC}"
echo -e "${CORAL}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${AMBER}📱 Frontend: ${NC}http://localhost:5173"
echo -e "${CORAL}🔧 Backend:  ${NC}http://localhost:5000"
echo ""
echo -e "${TERRA}💡 Logs saved to: backend.log & frontend.log${NC}"
echo -e "${TERRA}⚠️  Press Ctrl+C to stop all servers${NC}"
echo ""

# Keep script running and wait for Ctrl+C
wait