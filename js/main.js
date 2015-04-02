jQuery(document).ready( function() {
  if (Modernizr.localstorage) {
      var notes = localStorage['notes'];
      var masonry = new Masonry( "#notes", {
	  itemSelector: '.note-wrapXX' // TODO MASONRY
      });
// TODO MASONRY      masonry.appended($(".note-wrap"));

      console.log("html5 storage detected! initial storage: ");
      console.log(localStorage);

      bindCreateButton(masonry);

      // populate notes
      if (!notes) {
    	console.log("no notes, creating localStorage");
	    localStorage['notes'] = JSON.stringify(["I am a note!"]);
      }
      else {
	    populateNotes(masonry);
        // masonry.layout();
      }
  } else {
      // no native support for HTML5 storage :(
      console.log("you need a browser that supports HTML5 storage for this site to work ):");
  }
});

function bindCreateButton(mason) {
  $(".btn-create").on("click", function(){
    var noteContents = $("#new-note-text").val().replace(/\n/g, '<br>');
    saveNoteToStorage(noteContents);
    addNotes([makeNote(noteContents, mason)], mason);
    $("#new-note-text").val("");
  });
}

function bindDeleteButton() {

}

function addNotes(notes, mason) {
  var i = 0;
  for (i; i < notes.length; i++) {
    notes[i].insertAfter($("#new-note-wrap"));
//TODO MASONRY    mason.appended($(notes[i]));
  }
  
}

function makeNote(text, mason) {
  var noteWrap = $("<div>", { class: "col-md-3 col-sm-4 col-xs-12 note-wrap" });
  var note = $("<div>", { class: "panel panel-success note" });
  var noteHeader = $("<div>", { class: "panel-heading", "align": "right" });
  var noteBody = $("<div>", { class: "panel-body" });
  var deleteButton = $("<button>", { class: "btn-xs btn-default btn-delete", type: "button" });
  var editButton = $("<button>", { class: "btn-xs btn-default btn-edit", type:"button" });

  // bind delete button
  deleteButton.on("click", function(){
    console.log("noteBody.html() = " + noteBody.html());
    deleteNoteInStorage(noteBody.html());
    
    //TODO MASONRY    
    //  mason.destroy($(this).closest(".note-wrap"));
    noteWrap.remove();
    //TODO MASONRY    
    //  mason.layout();
  });

  // bind edit button
  editButton.on ("click", function(){
    $(this).attr("display", "none"); //TODO disables edit button
    var originalNote = noteBody.html();
    noteBody.html("<textarea class='form-control edit-area' rows='4'>" + originalNote.replace(/<br\s*[\/]?>/gi, "\n")  + "</textarea><button class='btn btn-default btn-save pull-right'>save</button>");

    console.log("editing note object: " + originalNote);
    console.log(localStorage['notes']);

    // bind save button
    noteBody.children(".btn-save").on("click", function(){
      var newNote = noteWrap.find("textarea").val().replace(/\n/g, '<br>');

      // editing the storage array using indexOf has a problem where if there is an exact duplicate of a note we might replace the wrong one if trying to keep chronological order. to solve this we can enter notes with a time-edited pair to sort. but I don't think sorting is a priority right now (:

      console.log("newNote = " + newNote);
      deleteNoteInStorage(originalNote);

      saveNoteToStorage(newNote);      
      addNotes([makeNote(newNote, mason)], mason);

      console.log("saved note object edits: " + newNote);
      console.log(localStorage['notes']);
      
      // delete old note
      noteWrap.remove();
    });
  });

  var noteObj =  noteWrap.append(note.append(noteHeader.append(editButton.append('edit')).append(deleteButton.append('delete'))).append(noteBody.append(text)));

  console.log("made note object: " + text);
  console.log(localStorage['notes']);
  return noteObj;
}


function saveNoteToStorage(text) {
  var noteArray = JSON.parse(localStorage['notes']);
  noteArray.push(text);
  localStorage['notes'] = JSON.stringify(noteArray);
}

function deleteNoteInStorage(text) {
  console.log("deleting: " + text);
  var noteArray = JSON.parse(localStorage['notes']);
  var indexOfText = noteArray.indexOf(text);
  if (indexOfText >= 0) {
    console.log("deleting array index: " + indexOfText);
    noteArray.splice(indexOfText, 1);
    localStorage['notes'] = JSON.stringify(noteArray);
  }
  else {
    console.log("nope, index of item to be deleted = " + indexOfText);
    }
  console.log(localStorage['notes']);
}

function populateNotes(mason) {
  var noteArray = JSON.parse(localStorage['notes']);
  var i = 0;
  var notes = []

  for (i; i < noteArray.length; i++) {
    notes.push(makeNote(noteArray[i], mason));
  }

  addNotes(notes, mason);
}

