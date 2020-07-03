const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
//const passport = require("passport");
const pgConfig = require("./../dbConfig.js");
const { Client } = require("pg");

let currentConfig = pgConfig.pgConfigProduction;
if (process.env.NODE_ENV === "debug") {
  currentConfig = pgConfig.pgConfigLocal;
}
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
//const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", async (req, response) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);
  const input = req.body;


  const client = new Client(currentConfig);

  // Check validation
  if (!isValid) {
    console.log("invalid input: " + JSON.stringify(errors));
    return response.status(400).json(errors);
  }
  try {

    console.log("register.");
    const newUser = req.body;
    await client.connect();

    console.log("connected");
    bcrypt.genSalt(10, async (err, salt) => {
      bcrypt.hash(input.password, salt, async (err, hash) => {
        if (err) throw err;

        client.query('INSERT INTO users (name, email, password, location, address)' +
          'VALUES ($1, $2, $3, $4, $5)',
          [newUser.name, newUser.email, hash, newUser.location, newUser.address])
          .then(user => {
            client.end();
            return response.status(201).json(user);
          })
          .catch(err => {
            console.log(err);
            return response.status(500).json(newUser);
          });
      });
    });

  }
  catch (e) {
    console.log("exception catched: " + e);
    return response.status(500).json(req.body);
  }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", async (req, response) => {
  // Form validation
  const newReq = req.body;
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    console.log("invalid input: " + JSON.stringify(errors));
    return response.status(400).json(errors);
  }
  console.log('Login: ' + newReq.email);
  const client = new Client(currentConfig);
  await client.connect();
  client.query('SELECT * FROM users WHERE email = $1 OR id = $2 LIMIT 1',
    [newReq.email, newReq.id])
    .then(res => {

      //no record found
      if (res.rows === undefined || res.rows.length == 0) {
        console.log(`error: user doesn't exist`, [newReq.email]);
        errors.email = "email not found";//emailnotfound
        return response.status(500).json(errors);
      }

      // Check password
      const row = res.rows[0];
      console.log('res: ' + JSON.stringify(res));
      console.log('row: ' + JSON.stringify(row));
      bcrypt.compare(newReq.password, row.password).then(isMatch => {
        if (isMatch) {
          // User matched
          // Create JWT Payload
          const payload = {
            id: row.id,
            name: row.name
          };

          // Sign token
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
                response.json({
                  success: true,
                  token: "Bearer " + token
                });
            }
          );
        } else {
          return response
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      })
        .catch(err => {
          console.log("bcrypt error:" + err);
          return response.status(500).json(newReq);
        })
        .then(() => client.end())
    });
});



// @route POST api/users/loginFB
// @desc Login user and return JWT token
// @access Public
router.post("/loginFB", async (req, response) => {
  // Form validation
  const newReq = req.body;
  var newUserId=-1;
  console.log(`Login with facebook: ${JSON.stringify(newReq)}`);
  const client = new Client(currentConfig);
  await client.connect();
  client.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [newReq.email])
    .then(res => {
      //no record found, new FB user
      if (res.rows === undefined || res.rows.length == 0) {
        console.log(` fb user doesn't exist (${newReq.email}), adding to the DB`);
        client.query('INSERT INTO users (name, email, password, location, address)' +
          'VALUES ($1, $2, $3, $4, $5) RETURNING id',
          [newReq.name, newReq.email, newReq.accessToken, "(0,0)", ""])
          .then(user => {
            client.end();
            // return response.status(201).json(user);
            console.log(`New record created: ${JSON.stringify(user)}`);
            newUserId=user; 
          })
          .catch(err => {
            client.end();
            
            console.log(`Inserting user failed:  ${err}`);
            return response.status(500).json(err);
          });
      }
      else
      {
        newUserId = res.rows[0];
        console.log(`Known user logged-in via fb: ${newReq.email}`);
      }

      // Check password
      const row = res.rows[0];
      const payload = {
        id: newUserId,
        name: row.name
      };

      // Sign token
      jwt.sign(
        payload,
        keys.secretOrKey,
        {
          expiresIn: 31556926 // 1 year in seconds
        },
        (err, token) => {
          response.json({
            success: true,
            token: "Bearer " + token
          });
        }
      );
    })
  .catch(err => {
    console.log("fb user error:" + err);
    return response.status(500).json(newReq);
  });
  
})
// @route GET api/users
// @desc get public user properties
// @access Public
router.get("/:id", async (req, response) => {
  // Find the user
  const client = new Client(currentConfig);
  await client.connect().catch(err => {
    console.log(err);
    return response.status(500).json(err);
  });
  client.query(`SELECT id, name, 100 AS rate,
    (SELECT COUNT (1) FROM meals WHERE host_id = $1) AS meals_created
    FROM users WHERE id = $1`, [req.params.id])//
    .then(user => {
      client.end();
      response.json(user.rows);
    })
    .catch(err => {
      client.end();
      console.log(err);
      return response.status(500).json("No user");
    }
    );
});

// @route GET api/system
// @desc system informaion
// @access Public
router.get("/system/:id", async (req, response) => {
  // Find the user
  const client = new Client(currentConfig);
  await client.connect();
  client.query('SELECT * FROM versions')
    .then(ver => {
      client.end();
      var payload = ver.rows;

      response.json(payload);
    })
    .catch(err => {
      client.end();
      console.log(err);
      return response.status(500).json("Failed to get version");
    });
});

// @route GET api/system
// @desc system informaion
// @access Public
router.get("/stats/:id", async (req, response) => {
  if (req.params.id != 12345) {
    return response.status(500).json("access denied.");
  }
  // Find the user
  const client = new Client(currentConfig);
  await client.connect();
  client.query(`select id, name,
	(select count (1) from follow where followie=u.id) as followers,
	(select count (1) from follow where follower=u.id) as followies, 
	(select count (1) from meals where host_id=u.id) as meals_hosted,
	(select count (1) from attends where user_id=u.id) as attends
from users as u;
`)
    .then(res => {
      client.end();
      var payload = res.rows;
      console.log("Sending stats");
      response.json(payload);
    })
    .catch(err => {
      client.end();
      console.log(err);
      return response.status(500).json("Failed to get stats");
    });
});

module.exports = router;
