#!/bin/bash

# Kill any existing React development servers
echo "Killing existing React development servers..."
pkill -f "react-scripts" 2>/dev/null
pkill -f "npm start" 2>/dev/null

# Wait a moment for processes to terminate
sleep 2

# Start the development server with increased memory allocation
echo "Starting React development server with increased memory allocation..."
NODE_OPTIONS="--max-old-space-size=4096" npm start
