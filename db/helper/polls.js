'use strict'
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
    let submissionId;
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

        submissionId = data.rows[0].submission_id;
        // console.log(submissionId);
        const results = []

        for (const choice of submission.choices) {
          values = [submissionId, choice.choiceId, choice.order];

          results.push(
            db.query(`
              INSERT INTO results(submission_id, choice_id, choice_order)
              VALUES($1, $2, $3)
              RETURNING submission_id
              `, values
            )
          )      // inserts each choice into the results table
        }
        return Promise.all(results)
      })
      .then(() => {
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
    ORDER BY results.choice_order;`, [submission_id] )
  .then((data) => {
    return data.rows;
  });
}
const getDataFromPollId = (db, pollId) => {
  return db.query(
    `SELECT creator_name AS creatorName, creator_email AS creatorEmail, title
     FROM polls
     WHERE id = $1`, [pollId]
  )
}



const getTotalResults = (db, poll_id) => {

  let resultObj = {};

  //get poll title and description
  return db.query(`
    SELECT title, description
    FROM polls
    WHERE id = $1;`, [poll_id] )
    .then((data) => {
      let poll = {};
      poll.title = data.rows[0].title;
      poll.description = data.rows[0].description;
      resultObj.poll = poll;
      //get choices
      return db.query(`
        SELECT title, description, id
        FROM choices
        WHERE poll_id = $1;`, [poll_id] )
        .then((data) => {
          let numberOfChoices = Object.keys(data.rows[0]).length;
          resultObj.poll.numOfChoices = numberOfChoices;
          resultObj.poll.choices = data.rows;
          // console.log(resultObj)

          //get results
          return db.query(`
          SELECT results.choice_order, choices.id
          FROM results
          JOIN choices ON results.choice_id = choices.id
          JOIN polls ON choices.poll_id = polls.id
          WHERE polls.id = $1
          ORDER BY results.choice_order;`, [poll_id] )
            .then((data) => {
             let allSubmissions = data.rows;

              allSubmissions.forEach(submission => {
                if (submission.choice_order === 1) {
                  submission.pointValue = numberOfChoices;
                } else {
                  submission.pointValue = numberOfChoices - submission.choice_order + 1;
                }
              });

              //add sum of points value for each id to the resultObj.poll.choices with matching ID
              resultObj.poll.choices.forEach(choice => {
                let sum = 0;
                allSubmissions.forEach(submission => {
                  if (submission.id === choice.id) {
                    sum += submission.pointValue;
                  }
                });
                choice.sum = sum;
              }
              );
              resultObj.poll.choices.sort((a, b) => b.sum - a.sum );
              return resultObj;
            });
        });
      });
    }














// const getTotalResults = (db, poll_id) => {
//   return db.query(`
//   SELECT polls.id AS poll_id, polls.title AS poll_title, polls.description AS poll_desc, submissions.id AS submission_id, results.id AS result_id, choices.id AS choice_id, choice_order, choices.title AS choice_title, choices.description AS choice_desc, submissions.user_name, count(choices.*) AS total_options
//   FROM polls
//   JOIN submissions ON submissions.poll_id = polls.id
//   JOIN results ON results.submission_id = submissions.id
//   JOIN choices ON choices.id = results.choice_id
//   WHERE polls.id = $1
//   GROUP BY polls.id, submissions.id, results.id, choices.id, choice_order, choices.title, choices.description, submissions.user_name
//   ORDER BY choice_order;`, [poll_id] )
//   .then((data) => {
//     let resultObj = {};
//     resultObj.poll_id = data.rows[0].poll_id;
//     resultObj.poll_title = data.rows[0].poll_title;
//     resultObj.poll_desc = data.rows[0].poll_desc;
//     resultObj.topScore = data.rows[0].total_options;
//     resultObj.submissions = [];
//     for (const submission of data.rows) {
//       let submissionObj = {};
//       submissionObj.submission_id = submission.submission_id;
//       if (submission.user_name) {
//         submissionObj.user_name = submission.user_name;
//       }
//       submissionObj.choices = [];
//       for (const choice of data.rows) {
//         let choiceObj = {};
//         choiceObj.choice_id = choice.choice_id;
//         choiceObj.choice_order = choice.choice_order;
//         choiceObj.choice_title = choice.choice_title;
//         choiceObj.choice_desc = choice.choice_desc;
//         submissionObj.choices.push(choiceObj);
//       }
//       resultObj.submissions.push(submissionObj);
//     }
//     console.log(resultObj);
//     return data.rows;
//   })
// }






module.exports = {
  getResults,
  saveSubmission,
  createPoll,
  getPoll,
  formatResults,
  nameRequiredCheck,
  getDataFromPollId,
  getTotalResults
}



