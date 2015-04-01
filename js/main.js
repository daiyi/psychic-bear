jQuery(document).ready( function() {
  if (Modernizr.localstorage) {
      var notes = localStorage['notes'];
      var masonry = new Masonry( "#notes", {
	  itemSelector: '.note-wrap'
      });
      masonry.appended($(".note-wrapXX"));  // TODO

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
	masonry.layout();
      }
  } else {
      // no native support for HTML5 storage :(
      console.log("you need a browser that supports HTML5 storage for this site to work ):");
  }
});

function bindCreateButton(mason) {
  $(".btn-create").on("click", function(){
    var noteContents = $("#new-note-text").val().replace(/\n/g, '<br/>');
    addNotes([makeNote(noteContents, mason)], mason);
    saveNote(noteContents);
    $("#new-note-text").val("");
  });
}

function addNotes(notes, mason) {
  var i = 0;
  for (i; i < notes.length; i++) {
    notes[i].insertAfter($("#new-note-wrap"));
  }
  mason.appended(notes);
  
}

function makeNote(text, mason) {
  var noteWrap = $("<div>", { class: "col-md-3 col-s-12 note-wrap" });
  var note = $("<div>", { class: "panel panel-success note" });
  var noteHeader = $("<div>", { class: "panel-heading", "align": "right" });
  var noteBody = $("<div>", { class: "panel-body" });
  var deleteButton = $("<button>", { class: "btn-xs btn-default btn-delete", type: "button" });
  var editButton = $("<button>", { class: "btn-xs btn-default btn-edit", type:"button" });

  deleteButton.on("click", function(){
    var noteArray = JSON.parse(localStorage['notes']);
    var panelBody = $(this.closest(".panel-heading")).siblings(".panel.body");
    noteArray.splice(noteArray.indexOf(panelBody.val())-1, 1);
    localStorage['notes'] = JSON.stringify(noteArray);
    console.log(localStorage);

    mason.destroy(this.closest(".note-wrap"));  //TODO
    this.closest(".note-wrap").remove();
    mason.layout(); //TODO
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
