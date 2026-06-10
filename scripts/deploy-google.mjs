import { spawnSync } from 'node:child_process';

const projectId = process.argv[2] || process.env.FIREBASE_PROJECT_ID;

if (!projectId) {
  console.error('\n缺少 Firebase 项目 ID。');
  console.error('用法：npm run deploy:google -- your-firebase-project-id');
  console.error('如果还没有项目，先到 https://console.firebase.google.com/ 创建一个 Web 项目。\n');
  process.exit(1);
}

const isWindows = process.platform === 'win32';

run(isWindows ? 'npm.cmd' : 'npm', ['run', 'build']);
run(isWindows ? 'npx.cmd' : 'npx', [
  '--yes',
  'firebase-tools',
  'deploy',
  '--only',
  'hosting',
  '--project',
  projectId
]);

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: false
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
