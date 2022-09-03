# Decision Maker

Decision maker is an app that helps a group decide the best option by ranking the given choices.
Users can create a poll with as many choices they want. The app uses Mailgun API to mail the link of the poll to creators. They can vote on the poll they created and share the link of the polls with others to get their vote. Users(voters) can rank their choices by dragging and dropping them putting their most preferred choice on top and the least preferred at the bottom. App uses SortableJS library for drag and drop functionality. The creator of the poll can access the poll results using the result link at any time. This app uses Borda count ranking method to rank the choices of all the voters and give a result with the sorted list of choices (most voted on the top).

## Final Product

!["screenshot of create poll page"](https://github.com/archa-agrawal/decision-maker/blob/master/info-data/Screen%20Shot%202022-09-03%20at%2011.00.08%20AM.png?raw=true)
!["screenshot of subit poll page"](https://github.com/archa-agrawal/decision-maker/blob/master/info-data/Screen%20Shot%202022-09-03%20at%2011.02.42%20AM.png?raw=true)
!["screenshot of result page"](https://github.com/archa-agrawal/decision-maker/blob/master/info-data/Screen%20Shot%202022-09-03%20at%2011.03.14%20AM.png?raw=true)

## Getting Started

1. [Create](https://github.com/archa-agrawal/decision-maker) a new repository by forking this repository.
2. Clone your repository onto your local device.
3. Install dependencies using the `npm install` command.
4. Start the web server using the `npm start` command. The app will be served at <http://localhost:8080/>.
5. Go to <http://localhost:8080/> in your browser.

## Dependencies

- Node 10.x or above
- NPM 5.x or above
- PG 6.x
- Express
- Mailgun
- Sortable JS
- bootstrap
- sass
- dotenv
- ejs
- nodemon
