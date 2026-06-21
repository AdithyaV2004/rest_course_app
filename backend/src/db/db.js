const courses = [
    {
    id: "course_1",
    title: "Node.js Basics",
    description: "Learn Node.js",
    price: 499,
    createdBy: "admin_1"
  },
  {
    id: "course_2",
    title: "Coding Harness",
    description: "Learn Agentic AI",
    price: 799,
    createdBy: "admin_1"
  }
];

const users = [
  {
    id: "user_1",
    username: "rahul",
    password: "123456",
    role: "user",
    wallet: 0,
    purchasedCourses: [],
    token: null
  }
];

module.exports= {
    users:users, 
    courses:courses
};