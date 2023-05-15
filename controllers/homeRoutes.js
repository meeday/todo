const router = require("express").Router();
const { Todo, User } = require("../models");
const withAuth = require("../utils/withAuth");

router.get("/", withAuth, async (req, res) => {
  try {
    const todoData = await Todo.findAll({
      where: {
        user_id: req.session.user_id,
      },
      include: [
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const todos = todoData.map((todo) => todo.get({ plain: true }));
    res.render("homepage", {
      todos,
      logged_in: req.session.logged_in,
    });
    return;
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("login");
});

router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/");
    return;
  }
  res.render("register");
});

module.exports = router;
