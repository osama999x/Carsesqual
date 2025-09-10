const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];
if (!moduleName) {
  console.error('❌ Please provide a module name.');
  process.exit(1);
}

const targetName = moduleName; // 👈 Use the name as-is, no pluralization

try {
  console.log(`🚀 Generating module: ${targetName}`);
  execSync(`npx nest g module ${targetName}`, { stdio: 'inherit' });

  console.log(`🛠 Generating controller: ${targetName}`);
  execSync(`npx nest g co ${targetName} --no-spec`, { stdio: 'inherit' });

  console.log(`⚙️ Generating service: ${targetName}`);
  execSync(`npx nest g service ${targetName}/providers/${targetName} --no-spec --flat`, {
    stdio: 'inherit',
  });

  const baseDir = path.join(process.cwd(), 'src', targetName);
  const folders = ['dtos', 'enums', 'interfaces', 'constants'];

  folders.forEach(folder => {
    const folderPath = path.join(baseDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`📁 Created folder: ${folderPath}`);
    }
  });

  console.log('✅ Module generation completed successfully.');
} catch (error) {
  console.error('❌ An error occurred during module generation:', error.message);
  process.exit(1);
}
