import { db } from './src/db/dexieDB'; // Adjust the path according to your project structure

const users = ['User1', 'User2', 'User3'];
const columns = ['To Do', 'In Progress', 'In Review', 'Done'];

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getRandomTitle = () => {
  const prefixes = ['PROJ-', 'TASK-', 'BUG-', 'FEAT-', 'EPIC-', 'STORY-', 'SPIKE-'];
  const numbers = ['123', '456', '789', '321', '654', '987', '159', '753', '246', '369'];
  return `${getRandomElement(prefixes)}${getRandomElement(numbers)}`;
};

const getRandomDescription = () => {
  const descriptions = [
    'Implement a new feature to improve user experience.',
    'Fix the critical bug that is causing system crashes.',
    'Refactor the codebase to increase performance and maintainability.',
    'Research and evaluate potential solutions for the identified problem.',
    'Enhance the existing functionality to meet the updated requirements.',
    'Develop a dashboard to provide real-time insights and analytics.',
    'Integrate a payment gateway to enable seamless transactions.',
    'Optimize the application for better responsiveness and scalability.',
    'Implement a robust authentication and authorization system.',
    'Design and develop a mobile-friendly user interface.',
    'Investigate and resolve performance bottlenecks in the application.',
    'Implement a notification system to keep users informed of updates.',
    'Conduct a comprehensive security audit and address any vulnerabilities.',
    'Develop a microservices-based architecture to improve modularity.',
    'Implement a caching mechanism to enhance the application\'s response time.',
    'Integrate the application with a third-party API to fetch additional data.',
    'Implement a search and filtering functionality to improve data navigation.',
    'Develop a data visualization component to present complex information.',
    'Optimize the database schema to improve query performance.',
    'Implement a reporting and analytics module to generate insightful reports.'
  ];
  return getRandomElement(descriptions);
};

const createDummyTasks = async () => {
  for (const user of users) {
    for (const column of columns) {
      for (let i = 1; i <= 5; i++) { // Adjust the number of tasks per user and column as needed
        const task = {
          title: getRandomTitle(),
          description: getRandomDescription(),
          type: getRandomElement(['Bug', 'Story', 'Feature', 'Task']),
          assignee: user,
          column: column,
        };
        await db.tasks.add(task);
      }
    }
  }
  console.log('Dummy tasks added successfully!');
};

createDummyTasks().catch((err) => {
  console.error('Error adding dummy tasks:', err);
});