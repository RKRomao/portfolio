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

// Load projects from file
let projects = [];
try {
  const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
  projects = JSON.parse(data);
} catch (err) {
  console.log('No projects file found, starting with empty array');
}

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

// Add current path to all responses
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Save projects to file
const saveProjects = () => {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
};

// Configuração do nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'koenig.romao@gmail.com',
    pass: 'ppdc maco mmtq pgut' // Você precisará configurar uma senha de app no Gmail
  }
});

// Rota POST para contato
app.post('/contact', (req, res) => {
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
  res.render('index', { projects, title: 'Home' });
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About Me' });
});

app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

app.get('/upload', (req, res) => {
  res.render('upload', { title: 'Upload Project' });
});

app.get('/project/:id', (req, res) => {
  const project = projects.find(p => p.id === parseInt(req.params.id));
  if (!project) {
    res.status(404).render('error', { title: 'Project Not Found' });
    return;
  }
  res.render('project', { project, title: project.title });
});

app.post('/upload', (req, res) => {
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
    
    // Get next ID
    const nextId = projects.length > 0 ? projects[projects.length - 1].id + 1 : 1;
    
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

    projects.push(newProject);
    saveProjects();
    
    res.redirect('/');
  });
});

// Rota POST para contato
app.post('/contact', (req, res) => {
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

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


