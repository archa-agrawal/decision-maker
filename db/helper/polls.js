/**
 * This function takes poll object returned from
 * create post request and adds the data to the database
 * @param {*} db - pg pool object
 * @param {*} poll - poll object to be inserted to the database
 * @param {string} poll.creatorName
 * @param {string} poll.creatorEmail
 * @param {string} poll.title
 * @param {string} poll.description
 * @param {boolean} poll.isNameRequired
 * @param {Array} choices
 * @returns poll_id
 */
const createPoll = (db, poll) => {
  return db.query(`
  INSERT INTO polls(creator_name, creator_email, title, description, name_required)
  VALUES($1, $2, $3, $4, $5) RETURNING id`, [poll.creatorName, poll.creatorEmail, poll.title, poll.description, poll.isNameRequired])
    .then((data) => {
      const choices = poll.choices;
      for (const choice of choices) {
        db.query(`
    INSERT INTO choices(title, description, poll_id)
    VALUES($1, $2, ${data.rows[0].id})`, [choice.title, choice.description])
      }
      return data.rows[0].id;
    });
}



/**
 * This function takes poll_id and returns the poll object
 * and all its choices for the user to vote on
 * @param {*} db - pg pool object
 * @param {*} poll_id - poll_id to retrieve the poll from the database
 * @returns poll object
 */
const getPoll = (db, poll_id) => {


  const formatPoll = (data, obj) => { // format poll object to be returned to the client
    obj["pollId"] = data.rows[0].pollid;
    obj["question"] = data.rows[0].question;
    obj["description"] = data.rows[0].poll_description;
    obj["nameRequired"] = data.rows[0].name_required;
    obj["choices"] = [];

    for (const choice of data.rows) {
      let choiceObj = {};
      choiceObj["choiceId"] = choice.choiceid;
      choiceObj["title"] = choice.title;
      choiceObj["description"] = choice.description;
      obj["choices"].push(choiceObj);
    }
  }

  let poll = {}; // poll object to be returned to the client

  return db.query(`
  SELECT  polls.id AS pollId, polls.title AS question, polls.name_required, polls.description as poll_description, choices.id AS choiceId, choices.title AS title, choices.description AS description
  FROM choices
  JOIN polls ON poll_id = polls.id
  WHERE poll_id = $1;`, [poll_id])
    .then((data) => {
      formatPoll(data, poll);
      console.log(poll);
      return poll;
    });
}


module.exports = {
  createPoll,
  getPoll
}
