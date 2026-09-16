@echo off
node node_modules/typescript/bin/tsc.js --noEmit > tmp-tsc-result.txt 2>&1
if %ERRORLEVEL%==0 (echo TSC_CLEAN >> tmp-tsc-result.txt) else (echo TSC_FAIL >> tmp-tsc-result.txt)