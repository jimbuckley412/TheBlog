const sequelize = require('../config/connection');
const { User, Blog, Comment } = require('../models');

const userData = require('./userData.json');
const blogData = require('./blogData.json');
const commentData = require('./commentData.json');

const seedDatabase = async () => {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
        individualHooks: true,
        returning: true,
    });
    const Blog = await Blog.bulkCreate(blogData, {
        individualHooks: true,
        returning: true,
    });
    const Comment = await Comment.bulkCreate(commentData, {
        individualHooks: true,
        returning: true,
    });

    for (const Blog of blogData) {
        await Blog.create({
            ...blog,
            user_id: users[Math.floor(Math.random() * users.length)].id,
        });
    }

    process.exit(0);
};

seedDatabase();