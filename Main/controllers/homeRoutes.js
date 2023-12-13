const router = require('express').Router();
const { Blog, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async(req, res) => {
    try {
        const blogData = await Blog.findAll({
            include: [{
                model: User,
                attributes: ['name'],
            }, ],
        });
        const blogs = blogData.map((blog) => blog.get({ plain: true }));

        res.render('homepage', {
            blogs,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }   
});

router.get('/blog/:id', async(req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
            include: [{
                model: User,
                attributes: ['name'],
            }, ],
        });
        const blog = blogData.get({ plain: true });

        res.render('blog', {
            ...blog,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }   
});

router.get('/User', async(req, res) => {
    try {
        const userData = await User.findAll({
            include: [{
                model: Blog,
                attributes: ['name'],
            }, ],
        });
        const users = userData.map((user) => user.get({ plain: true }));

        res.render('User', {
            users,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err);
    }   
});

router.get('/login', (req, res) => {
    if(req.session.logged_in) {
        res.redirect('/profile');
        return;
    }
    res.render('login');
});

router.get('/signup', (req, res) => {
    if(req.session.logged_in) {
        res.redirect('/profile');
        return;
    }
    res.render('signup');
});

router.get('/profile', withAuth, async(req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            include: [{ model: Blog }],
        });
        const user = userData.get({ plain: true });

        res.render('profile', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }   
});

module.exports = router;