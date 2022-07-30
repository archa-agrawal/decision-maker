/**
 * This function takes poll object returned from
 * create post request and adds the data to the database
 * @param {*} db - pg pool object
 * @param {*} poll - poll object to be inserted to the database
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

const getPoll = (db, pollId) => {
}


module.exports = {
  createPoll,
  getPoll
}
