// Client facing scripts here

$(function() {           //shorthand for $(document).ready(function() {

  $("#add-entry").click(function() {  //Add a new entry to the form evert time button is pressed
    $("#entry-list").append(
      `<div class="entry-container">
        <li><input class="entry-input" type='text' name='entry'><input type='text' name='description'></li>
      </div>`
    );
  });









});
