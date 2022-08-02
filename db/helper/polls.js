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
  let id;
  return db.query(`
  INSERT INTO polls(creator_name, creator_email, title, description, name_required)
  VALUES($1, $2, $3, $4, $5) RETURNING id`, [poll.creatorName, poll.creatorEmail, poll.title, poll.description, poll.isNameRequired])
    .then((data) => {
      id = data.rows[0].id;
      const choices = poll.choices;
      const choiceInserts = [];
      for (const choice of choices) {
        if (choice.title) {
          choiceInserts.push(db.query(
            `
              INSERT INTO choices(title, description, poll_id)
              VALUES($1, $2, ${data.rows[0].id})
            `, [choice.title, choice.description]
          ))
        }
      };
      return Promise.all(choiceInserts);
    })
    .then(() => id);
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


// format submission to be  saved to db

const formatResults = (data, id) => {
  let obj = data;
  let submission = {};
  submission.pollId = parseInt(id);
  if (obj.user_name) {
    submission.name = obj.user_name;
  }
  delete obj['user_name'];
  submission.choices = [];
  let keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    let choiceObj = {};
    let choice_id = undefined;
      choice_id = keys[i].slice(6);
      choiceObj['choiceId'] = parseInt(choice_id);
      choiceObj.order = keys.indexOf(keys[i]) + 1;
      submission.choices.push(choiceObj);
  };

  return submission;  // returns submissions as descrbed ub descrption.txt

}


/**
 * This function takes poll_id and returns true or false depending if name is required for the poll
 * @param {*} db - pg pool object
 * @param {*} poll_id - poll_id to retrieve the poll from the database
 * @returns poll object
 */

 const nameRequiredCheck = (db, poll_id) => {  // check if name is required for the poll
  return db.query(`
  SELECT name_required
  FROM polls
  WHERE id = $1;`, [poll_id])
    .then((data) => {
      return data.rows[0].name_required;
    });
}



/**
 * This function takes an object containing poll_id, name, and choices and saves it to the database
 * @param {*} db - pg pool object
 * @param {*} submission - object containing poll_id, username and choices
 * @returns poll object
 */
  const saveSubmission = (db, submission) => {
    let values = [submission.pollId]
    if (submission.name) {
      values.push(submission.name);
    } else {
      values.push(null);
    }
    return db.query(`
    INSERT INTO submissions(poll_id, user_name)
    values ($1, $2)
    returning submissions.id as submission_id;
    `, values)                                  // inserts into submissions table and returns the id to be used in the results table
      .then((data) => {

        let submissionId = data.rows[0].submission_id;
        // console.log(submissionId);

        for (const choice of submission.choices) {
          values = [submissionId, choice.choiceId, choice.order];
          db.query(`
          INSERT INTO results(submission_id, choice_id, choice_order)
          VALUES($1, $2, $3)
          RETURNING submission_id`, values)       // inserts each choice into the results table
        }
        return submissionId;
      });
  }



/**
 * This function takes a submission ID and returns the related results
 * @param {*} db - pg pool object
 * @param {*} submission_id - object containing poll_id, username and choices
 * @returns poll object
 */
const getResults = (db, submission_id) => {
  return db.query(`
  SELECT results.choice_order, choices.title, choices.description, polls.title AS poll_title, polls.description AS poll_desc
  FROM results
  JOIN choices ON results.choice_id = choices.id
  JOIN polls ON choices.poll_id = polls.id
  WHERE submission_id = $1
  ORDER BY results.choice_order;`, [submission_id])
    .then((data) => {

      return Promise.all(data.rows);
    });
}




module.exports = {
  getResults,
  saveSubmission,
  createPoll,
  getPoll,
  formatResults,
  nameRequiredCheck
}
