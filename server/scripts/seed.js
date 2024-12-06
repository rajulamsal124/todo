const mongoose = require('mongoose');
const Todo = require('../models/Todo');

// MongoDB connection string
const mongoURI = 'mongodb://admin:password123@localhost:27017/todo-app?authSource=admin';

// Initial todos data
const initialTodos = [
  {
    text: 'Complete project documentation',
    completed: false,
    priority: 'high'
  },
  {
    text: 'Review pull requests',
    completed: true,
    priority: 'medium'
  },
  {
    text: 'Setup development environment',
    completed: false,
    priority: 'high'
  },
  {
    text: 'Update dependencies',
    completed: false,
    priority: 'low'
  },
  {
    text: 'Write unit tests',
    completed: false,
    priority: 'medium'
  }
];

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Clear existing todos
    await Todo.deleteMany({});
    console.log('Cleared existing todos');

    // Insert new todos
    const insertedTodos = await Todo.insertMany(initialTodos);
    console.log('Successfully seeded todos:', insertedTodos);

    // Close the connection
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});
