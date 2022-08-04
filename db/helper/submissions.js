"use strict";

// format submission to be  saved to db
const formatResults = (data, id) => {
  let obj = data;
  let submission = {};
  submission.pollId = parseInt(id);
  if (obj.creatorName) {
    submission.name = obj.creatorName;
  }

  delete obj["creatorName"];
  submission.choices = [];
  let keys = Object.keys(obj);

  for (let i = 0; i < keys.length; i++) {
    let choiceObj = {};
    choiceObj["choiceId"] = parseInt(keys[i].slice(6));
    choiceObj.order = keys.indexOf(keys[i]) + 1;
    submission.choices.push(choiceObj);
  }

  return submission; // returns submissions as descrbed ub descrption.txt
};

/**
 * This function takes an object containing poll_id, name, and choices and saves it to the database
 * @param {*} db - pg pool object
 * @param {*} submission - object containing poll_id, username and choices
 * @returns poll object
 */
const saveSubmission = (db, submission) => {
  let submissionId;
  let values = [submission.pollId];
  if (submission.name) {
    values.push(submission.name);
  } else {
    values.push(null);
  }
  return db
    .query(
      `
    INSERT INTO submissions(poll_id, user_name)
    values ($1, $2)
    returning submissions.id as submission_id;
    `,
      values
    ) // inserts into submissions table and returns the id to be used in the results table
    .then((data) => {
      submissionId = data.rows[0].submission_id;
      const results = [];

      for (const choice of submission.choices) {
        values = [submissionId, choice.choiceId, choice.order];

        results.push(
          db.query(
            `
              INSERT INTO results(submission_id, choice_id, choice_order)
              VALUES($1, $2, $3)
              RETURNING submission_id
              `,
            values
          )
        ); // inserts each choice into the results table
      }
      return Promise.all(results);
    })
    .then(() => {
      return submissionId;
    });
};

/**
 * This function takes a submission ID and returns the related results
 * @param {*} db - pg pool object
 * @param {*} submissionId - object containing poll_id, username and choices
 * @returns poll object
 */
const getResults = (db, submissionId) => {
  return db
    .query(
      `
    SELECT results.choice_order, choices.title, choices.description,
    polls.title AS poll_title, polls.description AS poll_desc, submissions.user_name
    FROM results
    JOIN choices ON results.choice_id = choices.id
    JOIN polls ON choices.poll_id = polls.id
    JOIN submissions ON results.submission_id = submissions.id
    WHERE submission_id = $1
    ORDER BY results.choice_order;`,
      [submissionId]
    )
    .then((data) => {
      return data.rows;
    });
};

const getTotalResults = (db, pollId) => {
  let poll = {};

  return db
    .query(
      `
      SELECT title, description FROM polls
      WHERE id = $1;
    `,
      [pollId]
    )
    .then((pollData) => {
      poll.title = pollData.rows[0]?.title;
      poll.description = pollData.rows[0]?.description;

      return db.query(
        `
      SELECT choice_id, choices.title AS title, choices.description AS description,
      SUM(
        (select count(id) from choices where poll_id = $1) - choice_order + 1
      )AS total_votes
      FROM results JOIN choices ON choice_id = choices.id
      WHERE choices.poll_id = $1
      GROUP BY choice_id, choices.title, choices.description
      ORDER BY total_votes DESC;
      `,
        [pollId]
      );
    })
    .then((choiceData) => {
      poll.choices = choiceData.rows;
      return poll;
    });
};
module.exports = {
  getResults,
  saveSubmission,
  formatResults,
  getTotalResults,
};
