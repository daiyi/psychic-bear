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

// takes text and returns  html-friendly text (eg <br>)
function textToHtml(text) {
    return text.replace(/\n/g, '<br>');
}

// takes text and returns raw (eg \n, &nbsp;)
function textToRaw(text){
    return text.replace(/<br\s*[\/]?>/gi, "\n");
}

function bindCreateButton(mason) {
    $(".btn-create").on("click", function(){
        var noteContents = textToHtml($("#new-note-text").val().trim());
        if (noteContents != "") {
            saveNoteToStorage(noteContents);
            addNote(makeNote(noteContents, mason), mason);
            $("#new-note-text").val("");
        }
    });
}

function addNote(note, mason) {
    note.insertAfter($("#new-note-wrap"));
    //TODO MASONRY    mason.appended($(notes[i]));
    
}
function addNotes(notes, mason) {
    for (var i=0; i < notes.length; i++) {
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
        var originalNote = noteBody.html();
        noteBody.html("<textarea class='form-control edit-area' rows='4'>" + textToRaw(originalNote) + "</textarea><button class='btn btn-default btn-save pull-right'>save</button>");

        console.log("editing note object: " + originalNote);
        console.log(localStorage['notes']);

        // bind save button
        noteBody.children(".btn-save").on("click", function(){
            var newNote = textToHtml(noteWrap.find("textarea").val());

            console.log("newNote = " + newNote);
            deleteNoteInStorage(originalNote);

            saveNoteToStorage(newNote);      
            addNote(makeNote(newNote, mason), mason);

            console.log("saved note object edits: " + newNote);
            console.log(localStorage['notes']);
            
            // delete old note
            noteWrap.remove();
        });
        
        // removes edit button while in edit mode
        $(this).remove();
    });

    var noteObj =  noteWrap.append(note.append(noteHeader.append(editButton.append('edit')).append(deleteButton.append('delete'))).append(noteBody.append(text)));

    console.log("made note object: " + text);
    console.log(localStorage['notes']);
    return noteObj;
}


function saveNoteToStorage(text) {
    var noteArray = JSON.parse(localStorage['notes']);
    noteArray.push(textToHtml(text));
    localStorage['notes'] = JSON.stringify(noteArray);
}

function deleteNoteInStorage(text) {
    console.log("deleting: " + text);
    var noteArray = JSON.parse(localStorage['notes']);
    var indexOfText = noteArray.indexOf(textToHtml(text));
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

