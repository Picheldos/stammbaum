@echo off
npx tsc --noEmit --project tsconfig.json > "%~dp0tmp-tsc-result.txt" 2>&1
if %ERRORLEVEL%==0 echo TSC_CLEAN >> "%~dp0tmp-tsc-result.txt"
if %ERRORLEVEL% GTR 0 echo TSC_FAIL >> "%~dp0tmp-tsc-result.txt"
exit /b 0