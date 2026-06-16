const express = require('express');
const fileUpload = require('express-fileupload');
const path = require('path');
const engine = require('ejs-mate');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;
const PROJECTS_FILE = path.join(__dirname, 'data/projects.json');

// Load projects from file dynamically on request
const loadProjects = () => {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading projects:', err);
  }
  return [];
};

// Use ejs-locals for all ejs templates
app.engine('ejs', engine);

// Middleware
console.log('Serving static files from:', path.join(__dirname, 'public'));

// Serve static files from the 'public' directory
app.use('/public', express.static(path.join(__dirname, 'public'), {
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    res.set('x-timestamp', Date.now())
  }
}));

// Also serve from root for backward compatibility
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files under BASE_PATH to ensure compatibility on both local server and subpath deploys
const BASE_PATH = '/portfolio';
app.use(`${BASE_PATH}/css`, express.static(path.join(__dirname, 'public/css')));
app.use(`${BASE_PATH}/js`, express.static(path.join(__dirname, 'public/js')));
app.use(`${BASE_PATH}/images`, express.static(path.join(__dirname, 'public/images')));
app.use(`${BASE_PATH}/uploads`, express.static(path.join(__dirname, 'public/uploads')));
app.use(`${BASE_PATH}/files`, express.static(path.join(__dirname, 'public/files')));

app.use(express.urlencoded({ extended: true }));

// Configure file upload
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  debug: true
}));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up locals
app.locals.title = 'Ricardo Portfolio';

// Load translations JSON dictionary
const TRANSLATIONS_FILE = path.join(__dirname, 'data/translations.json');
const loadTranslations = () => {
  try {
    if (fs.existsSync(TRANSLATIONS_FILE)) {
      return JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading translations:', err);
  }
  return { pt: {}, en: {} };
};

// Add language and translation helpers to all responses
app.use((req, res, next) => {
  res.locals.basePath = BASE_PATH;
  res.locals.currentPath = req.path;
  
  // Detect active language from path prefix
  const isEn = req.path.startsWith(`${BASE_PATH}/en`) || req.path === `${BASE_PATH}/en`;
  const lang = isEn ? 'en' : 'pt';
  res.locals.lang = lang;
  
  // Translation function (loads translations dynamically so edits to translations.json are immediately hot-loaded)
  res.locals.t = (key) => {
    const translations = loadTranslations();
    const val = translations[lang] && translations[lang][key];
    return val !== undefined ? val : key;
  };
  
  // Dynamic link builder helper
  res.locals.linkTo = (path) => {
    if (lang === 'en') {
      return `${BASE_PATH}/en${path === '/' ? '' : path}`;
    }
    return `${BASE_PATH}${path}`;
  };

  // Toggle language URL helper
  res.locals.toggleLangUrl = isEn
    ? req.path.replace(`${BASE_PATH}/en`, BASE_PATH)
    : req.path.replace(BASE_PATH, `${BASE_PATH}/en`);
  
  next();
});

// Middleware to restrict route to local requests only
const localOnly = (req, res, next) => {
  const isLocal = req.hostname === 'localhost' || 
                  req.hostname === '127.0.0.1' || 
                  req.ip === '::1' || 
                  req.ip === '127.0.0.1' ||
                  req.connection.remoteAddress === '::1' || 
                  req.connection.remoteAddress === '127.0.0.1';
  if (!isLocal) {
    return res.status(403).send('Access Denied: This operation is only permitted locally.');
  }
  next();
};

// Save projects to file
const saveProjects = (localProjects) => {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(localProjects, null, 2));
};

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'koenig.romao@gmail.com',
    pass: 'ppdc maco mmtq pgut' // Você precisará configurar uma senha de app no Gmail
  }
});

// Rota POST para contato (suporta rotas PT e EN)
app.post([`${BASE_PATH}/contact`, `${BASE_PATH}/en/contact`], (req, res) => {
  const { name, email, subject, message } = req.body;

  const mailOptions = {
    from: email,
    to: 'koenig.romao@gmail.com',
    replyTo: email,
    subject: `Contact Form: ${subject}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Failed to send message' });
    } else {
      console.log('Email sent:', info.response);
      res.json({ success: true, message: 'Message sent successfully' });
    }
  });
});

// Routes
app.get('/', (req, res) => {
  res.redirect(BASE_PATH);
});

// Portuguese Routes
app.get(BASE_PATH, (req, res) => {
  res.render('index', { projects: loadProjects(), title: 'Home' });
});

app.get(`${BASE_PATH}/about`, (req, res) => {
  res.render('about', { title: 'About Me' });
});

app.get(`${BASE_PATH}/contact`, (req, res) => {
  res.render('contact', { title: 'Contact' });
});

// English Routes
app.get(`${BASE_PATH}/en`, (req, res) => {
  res.render('index', { projects: loadProjects(), title: 'Home' });
});

app.get(`${BASE_PATH}/en/about`, (req, res) => {
  res.render('about', { title: 'About Me' });
});

app.get(`${BASE_PATH}/en/contact`, (req, res) => {
  res.render('contact', { title: 'Contact' });
});

app.get(`${BASE_PATH}/upload`, localOnly, (req, res) => {
  res.render('upload', { title: 'Upload Project' });
});

// Dynamic project page route (supports double subpath mapping to handle relative ./portfolio resolution)
app.get([
  `${BASE_PATH}/project/:id`, 
  `${BASE_PATH}${BASE_PATH}/project/:id`,
  `${BASE_PATH}/en/project/:id`,
  `${BASE_PATH}/en${BASE_PATH}/project/:id`
], (req, res) => {
  const localProjects = loadProjects();
  const project = localProjects.find(p => p.id === parseInt(req.params.id));
  if (!project) {
    res.status(404).send('Project Not Found');
    return;
  }
  const lang = res.locals.lang;
  const projectTitle = project['title_' + lang] || project.title;
  res.render('project', { project, title: projectTitle });
});

app.post(`${BASE_PATH}/upload`, localOnly, (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: 'No files were uploaded.' });
  }

  const { image } = req.files;
  
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(image.mimetype)) {
    return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG and GIF are allowed.' });
  }

  // Generate a unique filename
  const fileName = uuidv4() + path.extname(image.name);
  const uploadPath = path.join(__dirname, 'public/uploads', fileName);

  image.mv(uploadPath, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).json({ error: 'Failed to upload file.' });
    }
    
    // Load fresh projects list
    const localProjects = loadProjects();
    
    // Get next ID
    const nextId = localProjects.length > 0 ? localProjects[localProjects.length - 1].id + 1 : 1;
    
    const newProject = {
      id: nextId,
      title: req.body.title || 'New Project',
      description: req.body.description || 'No description provided.',
      detailedDescription: req.body.detailedDescription || '',
      technologies: req.body.technologies || '',
      features: req.body.features || '',
      image: '/uploads/' + fileName,
      tags: req.body.tags ? req.body.tags.split(',') : [],
      projectUrl: req.body.projectUrl || '',
      githubUrl: req.body.githubUrl || '',
      createdAt: new Date().toISOString()
    };

    localProjects.push(newProject);
    saveProjects(localProjects);
    
    res.redirect(BASE_PATH);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


