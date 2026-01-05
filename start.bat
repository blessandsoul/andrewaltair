@echo off
echo Stopping any running Node.js processes...
taskkill /F /IM node.exe /T > nul 2>&1

echo Starting Andrew Altair Next.js App...
cd fresh
start "AndrewAltair" cmd /c "npm run dev"

echo Server started successfully on http://localhost:3000