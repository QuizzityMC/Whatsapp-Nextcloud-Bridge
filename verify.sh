#!/bin/bash

echo "======================================"
echo "WhatsApp-Nextcloud Bridge Verification"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js version... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found"
    echo "Please install Node.js 18 or higher"
    exit 1
fi

# Check NPM
echo -n "Checking npm... "
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓${NC} v$NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not found"
    exit 1
fi

# Check node_modules
echo -n "Checking dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${YELLOW}!${NC} Not installed"
    echo "  Run: npm install"
fi

# Check .env file
echo -n "Checking configuration... "
if [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC} .env file exists"
    
    # Check if required variables are set
    echo ""
    echo "Configuration status:"
    
    check_var() {
        local var_name=$1
        local var_value=$(grep "^${var_name}=" .env | cut -d '=' -f2)
        
        if [ -z "$var_value" ] || [ "$var_value" = "your-"* ]; then
            echo -e "  ${YELLOW}!${NC} $var_name: Not configured"
            return 1
        else
            echo -e "  ${GREEN}✓${NC} $var_name: Configured"
            return 0
        fi
    }
    
    all_configured=true
    check_var "NEXTCLOUD_URL" || all_configured=false
    check_var "NEXTCLOUD_USERNAME" || all_configured=false
    check_var "NEXTCLOUD_PASSWORD" || all_configured=false
    check_var "NEXTCLOUD_TALK_TOKEN" || all_configured=false
    check_var "WHATSAPP_CHAT_ID" || all_configured=false
    
    if [ "$all_configured" = false ]; then
        echo ""
        echo -e "${YELLOW}⚠${NC}  Some configuration values need to be set"
        echo "  Edit .env and fill in the required values"
    fi
else
    echo -e "${RED}✗${NC} .env file not found"
    echo "  Run: cp .env.example .env"
    echo "  Then edit .env with your configuration"
fi

# Check syntax
echo ""
echo -n "Checking JavaScript syntax... "
if node --check src/index.js 2>/dev/null; then
    echo -e "${GREEN}✓${NC} No syntax errors"
else
    echo -e "${RED}✗${NC} Syntax errors found"
    exit 1
fi

echo ""
echo "======================================"
echo "Verification Complete"
echo "======================================"

if [ -f ".env" ] && [ "$all_configured" = true ]; then
    echo ""
    echo -e "${GREEN}Ready to start!${NC}"
    echo "Run: npm start"
else
    echo ""
    echo -e "${YELLOW}Setup required:${NC}"
    echo "1. Run: npm install"
    echo "2. Configure .env file"
    echo "3. Run: npm start"
fi

echo ""
