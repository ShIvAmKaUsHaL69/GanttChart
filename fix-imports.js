import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to process
const directories = [
  'server/models',
  'server/controllers',
  'server/routes',
  'server/middleware',
  'server/config',
];

// Function to convert require/module.exports to import/export
async function convertFile(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    // Fix imports
    content = content.replace(/const\s+([^=]+)\s*=\s*require\(['"](.*)['"]\)/g, 
      (match, importName, importPath) => {
        // Add .js extension if it's a relative path without extension
        if (importPath.startsWith('.') && !importPath.endsWith('.js')) {
          importPath = `${importPath}.js`;
        }
        return `import ${importName} from '${importPath}'`;
      });
    
    // Fix exports
    content = content.replace(/module\.exports\s*=\s*([^;]+)/g, 'export default $1');
    
    // Fix individual exports (e.g., exports.someFunc = ...)
    if (content.includes('exports.')) {
      // First, collect all export functions
      const exportMatches = content.match(/exports\.([^=\s]+)\s*=\s*/g) || [];
      const exportNames = exportMatches.map(match => {
        return match.replace(/exports\.([^=\s]+)\s*=\s*/, '$1');
      });
      
      // Replace individual exports with regular function declarations
      content = content.replace(/exports\.([^=\s]+)\s*=/g, 'const $1 =');
      
      // Add a named export statement at the end if we found any exports
      if (exportNames.length > 0) {
        content += `\n\nexport { ${exportNames.join(', ')} };`;
      }
    }
    
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`Converted ${filePath}`);
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Process all JS files in the specified directories
async function processDirectory(dir) {
  const fullPath = path.join(__dirname, dir);
  const files = await fs.readdir(fullPath);
  
  for (const file of files) {
    if (file.endsWith('.js')) {
      await convertFile(path.join(fullPath, file));
    }
  }
}

// Main function
async function main() {
  try {
    for (const dir of directories) {
      await processDirectory(dir);
    }
    console.log('All files converted successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 