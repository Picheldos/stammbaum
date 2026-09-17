const { execFileSync } = require('child_process');
const fs = require('fs');
try {
    const out = execFileSync('npx.cmd', ['tsc', '--noEmit', '--project', 'tsconfig.json'], {
        cwd: process.cwd(),
        encoding: 'utf8',
        timeout: 120000,
        windowsHide: false
    });
    fs.writeFileSync('tmp-tsc-result.txt', out + '\nTSC_CLEAN');
} catch (e) {
    const msg = (e.stderr || e.stdout || e.message || 'error').toString();
    fs.writeFileSync('tmp-tsc-result.txt', msg + '\nTSC_FAIL');
}
console.log('done');
