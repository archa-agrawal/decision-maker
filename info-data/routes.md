# Routes

  ## Core

  ### create new poll as user
    GET    /new                 # Page where we create new poll 
    POST   /new                 # to save new poll
  ### View and submit poll
    GET    /poll/:id            # Page for user to view poll
    POST   /poll/:id            # to submit poll
  ### View poll results
    GET    /Results             # Page to see poll results



  ## Stretch

  ### View and log-in
    GET    /login               # Page to log-in
    POST   /login               # log-in
  ### Edit existing Poll
    GET    /poll/edit/:id       # Page to edit existing poll
    POST   /poll/edit/:id       # submit updated poll
