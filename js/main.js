jQuery(document).ready( function() {
  if (Modernizr.localstorage) {
      var notes = localStorage['notes'];
      var masonry = new Masonry( "#notes", {
	  itemSelector: '.note-wrapXX' // TODO MASONRY
      });
// TODO MASONRY      masonry.appended($(".note-wrap"));

      console.log(localStorage);

      bindCreateButton(masonry);

      // populate notes
      if (!notes) {
    	console.log("no notes, creating localStorage");
	    localStorage['notes'] = JSON.stringify(["I am a note!"]);
      }
      else {
	console.log("populating notes");
	populateNotes(masonry);
//	masonry.layout();
      }
  } else {
      // no native support for HTML5 storage :(
      console.log("you need a browser that supports HTML5 storage for this site to work ):");
  }
});

function bindCreateButton(mason) {
  $(".btn-create").on("click", function(){
    var noteContents = $("#new-note-text").val().replace(/\n/g, '<br>');
    addNotes([makeNote(noteContents, mason)], mason);
    saveNote(noteContents);
    $("#new-note-text").val("");
  });
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
    var noteArray = JSON.parse(localStorage['notes']);
    var panelBody = $(this).closest(".panel-heading").siblings(".panel.body");
    noteArray.splice(noteArray.indexOf(panelBody.val())-1, 1);
    localStorage['notes'] = JSON.stringify(noteArray);
    console.log(localStorage);

    mason.destroy($(this).closest(".note-wrap"));  //TODO
    $(this).closest(".note-wrap").remove();
    mason.layout(); //TODO
  });

  // bind edit button
  editButton.on ("click", function(){
    $(this).attr("display", "none"); //TODO disables edit button

    var panelBody = $(this).closest(".panel-heading").siblings(".panel-body");
    var originalNote = panelBody.html();
    panelBody.html("<textarea class='form-control edit-area' rows='4'>" + originalNote.replace(/<br\s*[\/]?>/gi, "\n")  + "</textarea><button class='btn btn-default btn-save pull-right'>save</button>");

    // bind save button
    panelBody.children(".btn-save").on("click", function(){
      var noteParent = $(this).closest(".note-wrap");
      var newNote = noteParent.find("textarea").val().replace(/\n/g, '<br>');
      var noteArray = JSON.parse(localStorage['notes']);

      // editing the storage array using indexOf has a problem where if there is an exact duplicate of a note we might replace the wrong one if trying to keep chronological order. to solve this we can enter notes with a time-edited pair to sort. but I don't think sorting is a priority right now (:
        console.log(originalNote);
        console.log(noteArray[noteArray.indexOf(originalNote)])
      noteArray[noteArray.indexOf(originalNote)] = newNote;
      localStorage['notes'] = JSON.stringify(noteArray);
      console.log(localStorage);

      noteParent.find(".panel-body").html(newNote);
      //TODO re-enable edit button
    });
  });

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
    notes.push(makeNote(noteArray[i], mason));
  }

  addNotes(notes, mason);
}
