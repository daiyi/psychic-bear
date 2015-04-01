jQuery(document).ready( function() {
  if (Modernizr.localstorage) {
      var notes = localStorage['notes'];
      var masonryTile = new Masonry( ".row", {
	  itemSelector: '.note-wrap'
      });

      console.log(localStorage);

      // bind note create button
      $(".btn-create").on("click", function(){
	  var noteContents = $("#new-note-text").val().replace(/\n/g, '<br/>');
	  addNote(noteContents, masonryTile);
	  saveNote(noteContents);
	  $("#new-note-text").val("");
      });

      // populate notes
      if (!notes) {
	console.log("no notes, creating localStorage");
	localStorage['notes'] = "['I am a note!']";
      }
      else {
	console.log("populating notes");
	populateNotes(masonryTile);
      }
  } else {
      // no native support for HTML5 storage :(
      console.log("you need a browser that supports HTML5 storage for this site to work ):");
  }
});


function addNotes(notes, mason) {
  var i = 0;
  for (i; i < notes.length; i++) {
    notes[i].insertAfter($("#new-note-wrap"));
  }
  mason.appended(notes);
  
}

function makeNote(text) {
  var noteWrap = $("<div>", { class: "col-md-3 col-s-12 note-wrap" });
  var note = $("<div>", { class: "panel panel-success note" });
  var noteHeader = $("<div>", { class: "panel-heading", "align": "right" });
  var noteBody = $("<div>", { class: "panel-body" });
  var deleteButton = $("<button>", { class: "btn-xs btn-default btn-delete", type: "button" });
  var editButton = $("<button>", { class: "btn-xs btn-default btn-edit", type:"button" });

  var noteObj =  noteWrap.append(note.append(noteHeader.append(editButton.append('edit')).append(deleteButton.append('x'))).append(noteBody.append(text)));

  return noteObj;
}


function saveNote(text) {
  var noteArray = JSON.parse(localStorage['notes']);
  noteArray.push(text);
  localStorage['notes'] = JSON.stringify(noteArray);
}

function populateNotes(mason) {
  var noteArray = JSON.parse(localStorage['notes']);
  var i = 0;
  var notes = []

  for (i; i < noteArray.length; i++) {
    notes.push(makeNote(noteArray[i]));
  }

  addNotes(notes, mason);
}
