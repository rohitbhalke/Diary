(function($){

	var deleteButton,updateButton,popUpForm;
	$(function(){

		deleteButton = $(".delete");
		updateButton = $(".update");
		popUpForm = ($("#editNote"));
		popUpForm.css({"display":"none"});
		deleteButton.on("click",deleteNote);
		//deleteButton.unbind().bind('click', deleteNote);
		updateButton.click(update);
		$(document).on("click",offPopUp);
	});

	function deleteNote(e){
		var self = $(this);

		$.ajax({
			url: '/notes',
			type: 'DELETE',
			data: {id: self.data("id"),customId : $(self.closest("li")).find(".id").html()},

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
		popUpForm.css({"display":"block"});
		updatePopUpForm(self);

	};

	function updatePopUpForm(self){
		var title = $("#editTitle"),
			description = $("#editDescription"),
			customId = $("#id"),
			save = $("#save"),
			cancel = $("#cancel");

		var oldTitle = $(self.closest("li")).find(".title"),
			oldDescription = $(self.closest("li")).find(".description"),
			oldTime = $(self.closest("li")).find(".time"),
			oldId = $(self.closest("li")).find(".id");
		//console.log(oldTitle.html(),oldDescription.html());


		(title).val(oldTitle.html());
		(description).val(oldDescription.html());
		customId.val(oldId.html());
		save.click(function(){
			var updatedNote={
				time : new Date(),
				title : title.val(),
				description : description.val(),
				customId :customId.val(),
				id : $(self).data("id")
			};
			/*updatedNote.time = new Date();
			 updatedNote.title = title.val();
			 updatedNote.description = description.val();
			 updatedNote.id = $(self).data("id");
			 ;*/

			UpdateDOM(oldTitle,oldDescription,oldTime,updatedNote);

			$.ajax({
				url: '/notes',
				type: 'PUT',
				data: updatedNote,
				dataType: "json",
				success: function(result) {
					// Do something with the result
					console.log("Updated");
				}

			});

			removePopUp(title,description);
		});

		cancel.click(function(){
			removePopUp(title,description);
		});

		//	return updatedNote;

	}


	function removePopUp(title,description){
		console.log("Clicked");
		title.val("");
		description.val("");
		popUpForm.css({"display":"none"});
	}

	function UpdateDOM(oldTitle,oldDescription,oldTime,updatedNote){
		console.log("In");
		oldTitle.html(updatedNote.title);
		oldDescription.html(updatedNote.description);
		oldTime.html(updatedNote.time);
	}

	function offPopUp(e){

		if((popUpForm.css("display")==="block")){
			if(!$(e.target.parentNode.parentNode).is(popUpForm) && !(( $(e.target).is(("#updates"))) || $(e.target).is(("#editSpan"))))
				popUpForm.css({"display":"none"})
		}
	}

})(jQuery);