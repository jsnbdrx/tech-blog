const router = require('express').Router();
const { User } = require('../../models');

// get all users GET /api/users
router.get('/', (req, res) => {
    User.findAll({
        attributes: {exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// get single user GET /api/users/[user id]
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                // include post, comment
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message:'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    });
});
// POST /api/users
router.post('/', (req, res) => {
    // expects username: test password: test123
    User.create({
        username: req.body.username,
        password: req.body.password
    })
    .then(dbUserData => {
        req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
            res.json(dbUserData);
    });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// add router.post for login route

// add router.post for logout route

// PUT api/users/[user id]
router.put('/:id', (req, res) => {
    //expects username: test password: test123
    User.update(req.body, {
        individualHooks: true,
        where: {
          id: req.params.id
        }
      })
        .then(dbUserData => {
          if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
          }
          res.json(dbUserData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
    });

    // DELETE /api/users/[user id]
    router.delete('/:id', (req, res) => {
        User.destroy({
          where: {
            id: req.params.id
          }
        })
          .then(dbUserData => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id' });
              return;
            }
            res.json(dbUserData);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      });
      
      module.exports = router;