@echo off
echo ========================================================
echo Pushing TSTACK WEB to https://github.com/asandragrant-sketch/TSTACK.git
echo ========================================================
cd /d "C:\Users\dell\.gemini\antigravity\scratch\tstack-web"
"C:\Users\dell\.gemini\antigravity\scratch\git\cmd\git.exe" push -u origin main
echo ========================================================
echo Done!
pause
