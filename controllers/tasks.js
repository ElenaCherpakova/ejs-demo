const Task = require('../models/Task');

const addTask = (req, res) => {
  res.render('pages/addTask');
};

const createTask = async (req, res) => {
  try {
    // check if req.body.complete property exists. If it does, the task should be marked as completed.
    if (req.body.complete) {
      req.body.completed = true;
    }
    await Task.create(req.body);
    req.session.pendingMessage = 'Task added successfully';
    res.redirect('/tasks');

    // If the create fails, the user is given a message, which might be
    // a schema validation error, and the add page is rendered again.
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.locals.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(', ');
    } else {
      res.locals.message = 'Something went wrong';
    }
    res.render('pages/addTask');
  }
};

const deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    req.session.pendingMessage = 'The task was deleted!';
    res.redirect('/tasks');
  } catch (err) {
    req.session.pendingMessage = 'Something went wrong';
    res.redirect('/tasks');
  }
};

//rendering the editPage task for a specific task
const editTask = async (req, res) => {
  try {
    //find a task by Id and render the editTask page with the details of the specific task.
    const task = await Task.findById(req.params.id);
    res.render('pages/editTask', { task });
  } catch (err) {
    req.session.pendingMessage = 'Something went wrong';
    res.redirect('/tasks');
  }
};

//updating task in db
const updateTask = async (req, res) => {
  // assign task to false assuming that no task has been found yet in db.
  let task = false;
  try {
    if (req.body.complete) {
      req.body.completed = true;
    }
    // retrieve the task from the database make sure it exists in db
    task = await Task.findById(req.params.id);
    // update the task in the db with the specified ID using the req.body as the new values
    //run validation
    await Task.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });
    // if success -> display a success msg and redirect to the page with the list of tasks
    req.session.pendingMessage = 'The task was updated!';
    res.redirect('/tasks');
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.locals.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(', ');
    } else {
      res.locals.message = 'Something went wrong';
    }
    // if task is found renders editTask passing task as data to view
    if (task) {
      res.render('pages/editTask', { task });
    } else {
      req.session.pendingMessage = 'Something went wrong.';
      res.redirect('/tasks');
    }
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.render('pages/tasks', { tasks });
  } catch (err) {
    res.locals.message = 'Something went wrong';
    res.render('pages/tasks', { tasks: [] });
  }
};

module.exports = {
  addTask,
  createTask,
  deleteTask,
  editTask,
  updateTask,
  getTasks,
};
