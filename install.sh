#!/bin/bash

# Ice Crumble POS - Install Script
# Installs all dependencies for backend and frontend

# Color codes matching design system
CORAL='\033[38;5;203m'    # Warm Coral
AMBER='\033[38;5;215m'    # Golden Amber
TERRA='\033[38;5;173m'    # Soft Terracotta
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "${CORAL}╔════════════════════════════════════════╗${NC}"
echo -e "${CORAL}║  Ice Crumble POS - Installing...      ║${NC}"
echo -e "${CORAL}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    echo -e "${AMBER}Please install Node.js and npm first${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm found: $(npm --version)${NC}"
echo -e "${GREEN}✓ node found: $(node --version)${NC}"
echo ""

# Install backend dependencies
echo -e "${CORAL}📦 Installing Backend Dependencies...${NC}"
cd backend

if npm install; then
    echo -e "${GREEN}✓ Backend dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Backend installation failed!${NC}"
    exit 1
fi

cd ..
echo ""

# Install frontend dependencies
echo -e "${AMBER}📦 Installing Frontend Dependencies...${NC}"
cd frontend

if npm install; then
    echo -e "${GREEN}✓ Frontend dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ Frontend installation failed!${NC}"
    exit 1
fi

cd ..
echo ""

echo -e "${CORAL}╔════════════════════════════════════════╗${NC}"
echo -e "${CORAL}║     ✅ Installation Complete!         ║${NC}"
echo -e "${CORAL}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${TERRA}💡 Next steps:${NC}"
echo -e "${AMBER}   1. Configure your MongoDB connection in backend/.env${NC}"
echo -e "${AMBER}   2. Run: ./start.sh${NC}"
echo ""