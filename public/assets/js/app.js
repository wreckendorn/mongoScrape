

  //THIS WORKS
  $(document).on("click", ".data-Save", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      type: "GET",
      url: "/api/saved/" + thisId,
    })
    console.log("saved");
  });


//THIS IS WORKING so far...
$(document).on("click", ".data-Notes", function() {
  console.log("firing up the notes");
  // Empty the notes from the note section
  $("#notes").empty();
  $("noteTitle").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");
console.log(thisId);
  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/api/notes/" + thisId,
    success: function(data){
      console.log(data[0]);
      // The title of the article
      $("#articleTitle").append(data[0].title);

      if (data.note) {
        // Place the title of the note in the title input
        $("#noteTitle").append(data.note.title);
        // Place the body of the note in the body textarea
        $("#noteBody").val(data.note.body);
      }
      else{
        $("#notes").append("<p>There are no notes, yet</p>");
      }
      // An input to enter a new title
      $("#notes").append("<p><input id='title' name='title' ></p>");
      // A textarea to add a new note body
      $("#notes").append("<p><textarea id='note' name='body'></textarea></p>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button type='button' class='btn btn-primary' data-id='" + data._id + "id='savenote'>Save Note</button>");

      // If there's a note in the article
      
    }
    });
});

$(document).on("click", "#savenote", function() {
  // Save the selected element
  var selected = $(this);
  console.log(selected);
  // Make an AJAX POST request
  // This uses the data-id of the update button,
  // which is linked to the specific note title
  // that the user clicked before
  $.ajax({
    type: "POST",
    url: "/articles/" + selected.attr("data-id"),
    dataType: "json",
    data: {
      title: $("#title").val(),
      note: $("#note").val()
    },
    // On successful call
    success: function(data) {
      // Clear the inputs
      $("#note").val("");
      $("#title").val("");
      // Revert action button to submit
      $("#action-button").html("<button id='make-new'>Submit</button>");
      // Grab the results from the db again, to populate the DOM
      getResults();
    }
  });
});