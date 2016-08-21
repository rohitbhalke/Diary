(function($){

	var deleteButton,updateButton,popUpForm, removeMedia, newNote, newNoteCancelButton, addNewNote, objectId;
	$(function(){

		deleteButton = $(".delete");
		updateButton = $(".update");
		popUpForm = ($("#editNote"));
		removeMedia = $('.removeMedia');
		addNewNote = $('#add');
		newNote = $("#newnote");
		newNoteCancelButton = $("#newnote #cancel");
		objectId = $('#objectId');
		registerEvents();

	});


	function registerEvents(){
		deleteButton.on("click",deleteNote);
		updateButton.click(update);
		removeMedia.on('click', removemedia);
		//$(document).on("click",offPopUp);
		addNewNote.on('click',function(){
			newNote.slideDown('slow', function(){
				newNote.toggleClass('hide');
			});
			//newNote.toggleClass('hide');
		});
		newNoteCancelButton.on('click',function(){
			newNote.slideUp('slow', function(){
				newNote.toggleClass('hide');
			});
			//newNote.toggleClass('hide');
		})
	}

	function deleteNote(e){
		var self = $(this);

		$.ajax({
			url: '/notes',
			type: 'DELETE',
			data: {
				id: objectId.data('id'),
				customId: self.data('noteid')
			},

			success: function(result) {
				// Do something with the result

				location.reload();
				console.log("Deleted");
			}
		});


	};

	function update(){
		var self = this;
		console.log("update");
		popUpForm.toggleClass('show');
		updatePopUpForm(self);

	};

	function removemedia(){
		var noteId = $(this).data('noteid'),
			imagePath = $(this).data('imagepath');
		var node = {
			objectId : objectId.data('id'),
			noteId : noteId,
			imagePath :imagePath,
			action : 'removemedia',
		};
		$.ajax({
			url: '/notes',
			type: 'PUT',
			data: node,
			success: function(result) {
				// Do something with the result
				location.reload();
				console.log("Updated");
			}
		})
	}

	function updatePopUpForm(self){
		var title = $("#editTitle"),
			description = $("#editDescription"),
			parentCard = $(self).parent().parent(),
			customId = $(parentCard).find(".noteId").text(),
			save = $("#save"),
			cancel = $("#editNote #cancel");

		var oldTitle = $(parentCard).find(".title"),
			oldDescription = $(parentCard).find(".desc");

		(title).val(oldTitle.html());
		(description).val(oldDescription.html());

		save.on('click',function(e){
			var updatedNote={
				time : new Date(),
				title : title.val(),
				description : description.val(),
				customId :customId,
				id : objectId.data('id')
			};

			UpdateDOM(oldTitle,oldDescription,undefined,updatedNote);

			$.ajax({
				url: '/notes',
				type: 'PUT',
				data: updatedNote,
				dataType: "json",
				success: function(result) {
					console.log("Updated");
				}

			});

			removePopUp(title,description);
		});

		cancel.on('click',function(e){
			removePopUp(title,description);
			e.preventBubble();
		});
	}


	function removePopUp(title,description){
		console.log("Clicked");
		title.val("");
		description.val("");
		popUpForm.toggleClass('show');

	}

	function UpdateDOM(oldTitle,oldDescription,oldTime,updatedNote){
		console.log("In");
		oldTitle.html(updatedNote.title);
		oldDescription.html(updatedNote.description);
		//oldTime.html(updatedNote.time);
	}

})(jQuery);