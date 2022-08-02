// Client facing scripts here
var count = 1;
$(function() {           //shorthand for $(document).ready(function() {

  $("#add-entry").click(function() { //Add a new entry to the form evert time button is pressed

    $("#choices").append(
      `
        <div class="row">
          <div class="col-6">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="choice-item" name="choices[${count}][title]">
              <label for="floatingInput">choice title</label>
            </div>
          </div>
          <div class="col-6">
            <div class="form-floating mb-3">
              <input type="text" class="form-control" id="choice-description" name="choices[${count}][description]">
              <label for="floatingInput">choice description</label>
            </div>
          </div>
        </div>
      `
    );
    count++;
  });
/*
  $("#create-button").click(function() {

    const poll = {
      creatorName: $(`input[id=name]`).val(),
      creatorEmail: $(`input[id=email]`).val(),
      isNameRequired: false,
      title: $(`input[id=poll-title]`).val(),
      description: $(`input[id=poll-description]`).val(),
      choices: []
    }

    if ($("#checkbox").is(":checked")) {
      poll.isNameRequired = true
    }
    $(`input[id=checkbox]`).val()

    const choiceDescriptions = []
    const choiceTitles = []
    $("input[id=choice-description").each(function(input) {
      let desc = $(this).val()
      choiceDescriptions.push(desc)
    })
    $("input[id=choice-item").each(function(input) {
      let item = $(this).val()
      choiceTitles.push(item)
    })
    for (let i = 0; i < choiceTitles.length; i++) {
      poll.choices.push({'title' : choiceTitles[i], 'description' : choiceDescriptions[i]})
    }
    $

    console.log(poll)
    fetch("/create", {
      method: 'POST',
      redirect: "follow",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(poll)
    }).then((response)=>{
      if(response.redirected){
          window.location.href = response.url;
      }
  })
    $.post("/create", {
      method: 'POST',
      contentType: 'application/json; charset=utf-8',
      data: JSON.stringify(poll)
    })

  })

*/

  let options = Sortable.create(sort, { animation: 150 }); // makes options container sortable

  let initialOrder = options.toArray(); // saves the initial order of the options

  $('#reset-order').click(function() {  // resets the order of the options
    options.sort(initialOrder);
  });

});
