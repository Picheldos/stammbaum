const { spawn } = require('child_process');
const path = require('path');
const bin = path.join(process.cwd(), 'node_modules', '.bin', 'next');
(async () => {
  const child = spawn(bin, ['build'], { cwd: process.cwd(), shell: true, windowsHide: false });
  child.stdout.on('data', (d) => { process.stdout.write(d); });
  child.stderr.on('data', (d) => { process.stderr.write(d); });
  child.on('close', (code) => { console.log('BUILD EXIT ' + code); });
})();