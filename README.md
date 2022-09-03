# Decision Maker

Decision maker is an app that helps a group decide the best option by ranking the given choices.
Users can create a poll with as many choices they want. The app uses Mailgun API to mail the link of the poll to creators. They can vote on the poll they created and share the link of the polls with others to get their vote. Users(voters) can rank their choices by dragging and dropping them putting their most preferred choice on top and the least preferred at the bottom. App uses SortableJS library for drag and drop functionality. The creator of the poll can access the poll results using the result link at any time. This app uses Borda count ranking method to rank the choices of all the voters and give a result with the sorted list of choices (most voted on the top).

## Final Product

!["screenshot of create poll page"](https://github.com/archa-agrawal/tweeter/blob/master/public/images/Screen%20Shot%202022-07-21%20at%208.34.40%20PM.png)
!["screenshot of subit poll page"](https://github.com/archa-agrawal/tweeter/blob/master/public/images/Screen%20Shot%202022-07-21%20at%208.36.31%20PM.png)
!["screenshot of result page"](https://github.com/archa-agrawal/tweeter/blob/master/public/images/Screen%20Shot%202022-07-21%20at%208.37.46%20PM.png)

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information

- username: `labber`
- password: `labber`
- database: `midterm`

3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Reset database: `npm run db:reset`

- Check the db folder to see what gets created and seeded in the SDB

7. Run the server: `npm run local`

- Note: nodemon is used, so you should not have to restart your server

8. Visit `http://localhost:8080/`

## Warnings & Tips

- Do not edit the `layout.css` file directly, it is auto-generated by `layout.scss`
- Split routes into their own resource-based file names, as demonstrated with `users.js` and `widgets.js`
- Split database schema (table definitions) and seeds (inserts) into separate files, one per table. See `db` folder for pre-populated examples.
- Use the `npm run db:reset` command each time there is a change to the database schema or seeds.
  - It runs through each of the files, in order, and executes them against the database.
  - Note: you will lose all newly created (test) data each time this is run, since the schema files will tend to `DROP` the tables and recreate them.

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
