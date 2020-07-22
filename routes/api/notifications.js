const express = require("express");
const router = express.Router();
const pgConfig = require("../dbConfig.js");
const { Client } = require("pg");

let currentConfig = pgConfig.pgConfigProduction;
//if (process.env.NODE_ENV === "debug")
{
  currentConfig = pgConfig.pgConfigLocal;
}

// @route GET api/notifications
// @desc get list og user's notifications
// @access Public
router.get("/:id", async (req, response)=> {
  const id = req.params.id;
  if (isNaN(id)) {
    console.log("error, empty id");
    return response.status(400).json("Error in getting notifications: empty id");
  }
  console.log(`get notifications for ${id}.`);
  const client = new Client(currentConfig);
  await client.connect();
  client.query(`SELECT * FROM  notifications WHERE user_id=$1 AND status<3`, [id])
  .then(resp => {
    return response.json(resp.rows);
  })
  .catch(err => {
    console.log(err); 
    return response.status(500).json(err); 
  })
  .finally(() => {
    client.end();
  });
});


// @route PUT api/notifications
// @desc sets notification's status
// @access Public!??
router.put("/:id", async (req, response)=> {
  const id = req.params.id;
  if (isNaN(id)) {
    console.log("error, empty id");
    return response.status(400).json("Error in getting notifications: empty id");
  }
  const note=req.body;
  console.log(`change notification's status ${id} for ${JSON.stringify(note)}`); 
  const client = new Client(currentConfig);
  const query=`UPDATE notifications SET "status"=$1 WHERE "id"=$2 RETURNING id`;

  console.log(query); 
  await client.connect();
  client.query(query, [note.status, id])
  .then(resp => {
    console.log("notification status done.");
    return response.json(resp.rows);
  })
  .catch(err => {
    console.error(err); 
    return response.status(500).json(err); 
  })
  .finally(() => {
    client.end();
  });
});

router.post("/token/:id", async (req, response)=> {
  const id = req.params.id;
  const token = req.body.token;

  console.log(`Insert Google Firebase Token ID: ${token} for ${id}`); 
  const client = new Client(currentConfig);
  const query = `
    INSERT INTO user_tokens (user_id, token_type, token) 
    SELECT $1, 0, $2 
    WHERE NOT EXISTS (
      SELECT 1 FROM user_tokens WHERE user_id=$3 AND token=$4
    ) 
    RETURNING token`;
  await client.connect();
  client.query(query, [id, token, id, token])
  .then(resp => {
    console.log(`Google Firebase Token ID responsed`);
    return response.json(resp.rows);
  })
  .catch(err => {
    console.log(err); 
    return response.status(500).json(err); 
  })
  .finally(() => {
    client.end();
  });
});

router.post("/send-message", async (req, response)=> {
  console.log(`Message: ${req.body.message} from ${req.body.sender} to ${req.body.receiver}`);

  const client = new Client(currentConfig);

  const message =
  {
    title: 'Message', 
    body: req.body.message, 
    icon: 'resources/Message-Bubble-icon.png', 
    click_action: '/User/req.body.receiver',
    receiver: req.body.receiver,
    meal_id:  -1,
    sender: req.body.sender,
    type: 0
  }

  const result = await addNotification(message);
  console.log(`Notification added.`);
  return response.json(result);
});

module.exports = router;