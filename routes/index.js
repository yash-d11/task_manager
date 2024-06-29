var express = require('express');
var router = express.Router();
var Task = require("./task");
var users = require("./users");
const passport = require("passport");
var localStrategy = require('passport-local');
passport.use(new localStrategy(users.authenticate()));


function isloggedIn(req, res, next) {
  if (req.isAuthenticated()){ console.log("logged in"); return next();}
  else res.redirect('/login');
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/tasks',isloggedIn, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err); 
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});


router.post("/task",isloggedIn, async (req,res)=>{
 
  const { title, description, dueDate, priority, status } = req.body;

  console.log(req.body)
  try{
      
  const newTask = new Task({
    title,
    description,
    dueDate: new Date(dueDate), 
    priority,
    user: req.user._id,
    status,
  });
  

  const savedTask = await newTask.save();
        res.status(201).json(savedTask);
        
    } catch (err) {
        console.error('Error saving task:', err);
        res.status(500).json({ error: 'Failed to create task' });
    }
})

router.post('/register', (req, res, next) => {
  console.log(req.body)
  var newUser = {
    username: req.body.username,
  };
  users
    .register(newUser, req.body.password)
    .then((result) => {
      console.log("reached")
      passport.authenticate('local')(req, res, () => {
        
        res.sendStatus(201);
      });
    })
    .catch((err) => {
      console.log("error")
      res.send(err);
    });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    console.log("0")
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect('/login'); 
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      res.json("logged in") 
    });
  })(req, res, next);
}, (req, res) => {
  res.redirect('/'); 
});





router.get('/logout', (req, res) => {
 
  req.logout(err => {
    if (err) return next(err);
    res.json({ message: 'Logged out successfully' });
  });
});



router.delete('/:id', async (req, res) => {
  try {
      const taskId = req.params.id;
      const deletedTask = await Task.findByIdAndDelete(taskId);
      if (!deletedTask) {
          return res.status(404).json({ message: 'Task not found' });
      }
      res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


router.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

module.exports = router;
