const express = require("express");
const app = express();

// make json files into js objects (req.body)
app.use(express.json());

const cors = require('cors');
app.use(cors());
// put all the authentication routes under /api
const authRoutes = require('./routes/auth.js');
app.use('/api', authRoutes);

// put all the task routes under /api
const taskRoutes = require('./routes/task.js');
app.use('/api', taskRoutes);

// put all user routes under /api
const userRoutes = require('./routes/users.js');
app.use('/api', userRoutes);

// put all the file routes under /api
const fileRoutes = require('./routes/files.js');
app.use('/api', fileRoutes);

// put all the notification routes under /api
const notiRoutes = require('./routes/notifications.js');
app.use('/api', notiRoutes);

//put all the comments routes under /api
const commentsRoutes = require('./routes/comments.js');
app.use('/api', commentsRoutes);

// get the app running 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
