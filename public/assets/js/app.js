
//-----------SAVE ARTICLE----------------
 //Waits for user to click on Save button next to article. This sends AJAX
 //call to /api/saved/:id so it can change state of saved to true in db.
 //then it console.logs "saved".
  $(document).on("click", ".data-Save", function() {
    var thisId = $(this).attr("data-id");
    $.ajax({
      type: "GET",
      url: "/api/saved/" + thisId,
    })
    console.log("article saved");
  });

  // --------- DELETE ARTICLE ------------
  //Waits for user to click on Delete button next to article. This sends AJAX
  //call to /api/deleted/:id so it can delete the article from the db.
  //then it console.logs "starting to be deleted."
  $(document).on("click", ".data-Delete", function() {
    var thisId = $(this).attr("data-id");
    console.log(thisId);
    $.ajax({
      type: "DELETE",
      url: "/api/deleted/" + thisId,
    })
    console.log("article deleted");
  });


// ------------- SHOW ARTICLE NOTES --------------
//waits for user to click on Article Notes button
//then empties out modal, grabs the data-id from the article, and sends an AJAX call
// to /api/notes/:id to see if there are any existing notes.
// if there are, the object is sent back and we separate it out into the modal.
$(document).on("click", ".data-Notes", function() {

  $("#notes").empty();
  $("#existingNotes").empty();

  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/api/notes/" + thisId,
    success: function(data){
      console.log(data);

      $("#notes").append("<p><input id='titleInput' name='title' ></p>");
      $("#notes").append("<p><textarea id='bodyInput' name='body'></textarea></p>");
      $("#notes").append("<button type='button' class='btn btn-primary savenote' data-id='" + data._id + "'>Save Note</button>");

      if (data.note) {
        for (var i = 0; i < data.note.length; i++) {
        console.log("Note title" + data.note[i].title);
        console.log("Note body: " + data.note[i].body);
        console.log("Note id is: " + data.note[i]._id);
        $("#existingNotes").append("<p>" + data.note[i].title + "<span class='close deleteNote' data-id='" + data.note[i]._id + "'>X</span></p><hr>");
        }
      }
      else{
        $("#existingNotes").prepend("<p>There are no notes, yet</p>");
      }
    }
  });
});

// ----------------- SAVE ARTICLE NOTES ---------------
// Waits for user to click Save on the notes modal. Grabs the data-id from the article
// and sends it POST AJAX to /articles/:id along with the note title and note body.
// the response is sent back as a promise and we console.log it. Finally, we clear those two 
//input fields
$(document).on("click", ".savenote", function() {
  console.log("is this thing saving?");
  var thisId = $(this).attr("data-id");
  var title = $("#titleInput").val()

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleInput").val(),
      body: $("#bodyInput").val(),
    }
  })
    .then(function(data) {
      console.log(data);
      var i = data.note.length;
      i--;
      var id = data.note[i];
      $("#existingNotes").append("<p>" + title + "<span class='close deleteNote' data-id='" + id + "'>X</span></p><hr>");
      $("#titleInput").val("");
      $("#bodyInput").val("");
    });

 
});

// ---------- DELETE ARTICLE NOTE ----------- 
$(document).on("click", ".deleteNote", function() {
  var selected = $(this).parent();
  var row = $(this).parent().next();
  var thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    type: "DELETE",
    url: "/api/notes/" + thisId,
    success: function(response){
      selected.remove();
      row.remove();
    }
  })
  console.log("note deleted");
});