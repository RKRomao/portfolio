const http = require('http');
const fs = require('fs');
const path = require('path');

// Set environment variables for the temporary server run
process.env.PORT = 3001;

// Helper to copy directory recursively
function copyDirSync(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  let entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    let srcPath = path.join(src, entry.name);
    let destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Starting temporary server on port 3001 to generate static pages...');

// Start the Express app
require('./app.js');

// Give the server 1.5 seconds to start up completely
setTimeout(() => {
  console.log('Server started. Copying public files to docs...');
  
  // Copy public folder to docs to make sure all css, js, images, and uploads are synchronized
  if (fs.existsSync('./public')) {
    copyDirSync('./public', './docs');
  }

  // Fetch a path from the server and save it to a static HTML file
  function fetchAndSave(urlPath, destFilePath) {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:3001${urlPath}`, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`Failed to fetch ${urlPath}: status code ${res.statusCode}`));
          return;
        }

        const dir = path.dirname(destFilePath);
        fs.mkdirSync(dir, { recursive: true });

        const fileStream = fs.createWriteStream(destFilePath);
        res.pipe(fileStream);

        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ Saved ${urlPath} -> ${destFilePath}`);
          resolve();
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
  }

  async function generate() {
    try {
      // Fetch main pages (Portuguese)
      await fetchAndSave('/portfolio', './docs/index.html');
      await fetchAndSave('/portfolio/about', './docs/about.html');
      await fetchAndSave('/portfolio/contact', './docs/contact.html');

      // Fetch main pages (English)
      await fetchAndSave('/portfolio/en', './docs/en/index.html');
      await fetchAndSave('/portfolio/en/about', './docs/en/about.html');
      await fetchAndSave('/portfolio/en/contact', './docs/en/contact.html');

      // Fetch dynamic projects from the database
      const projectsFile = path.join(__dirname, 'data/projects.json');
      if (fs.existsSync(projectsFile)) {
        const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
        for (const project of projects) {
          // Generate Portuguese project pages
          await fetchAndSave(`/portfolio/project/${project.id}`, `./docs/project/${project.id}/index.html`);
          await fetchAndSave(`/portfolio/portfolio/project/${project.id}`, `./docs/portfolio/project/${project.id}/index.html`);
          
          // Generate English project pages
          await fetchAndSave(`/portfolio/en/project/${project.id}`, `./docs/en/project/${project.id}/index.html`);
          await fetchAndSave(`/portfolio/en/portfolio/project/${project.id}`, `./docs/en/portfolio/project/${project.id}/index.html`);
        }
      }

      console.log('Static site generation complete successfully!');
      process.exit(0);
    } catch (err) {
      console.error('Error generating static site:', err);
      process.exit(1);
    }
  }

  generate();
}, 1500);
