@echo off
echo Stopping any running Node.js processes...
taskkill /F /IM node.exe /T > nul 2>&1

echo Starting code-graph-rag-mcp...
start "CodeGraphRAGMCP" cmd /c "code-graph-rag-mcp ."
echo Starting server...
start "Server" cmd /c "npm run dev"
cd ..

echo Client started successfully.