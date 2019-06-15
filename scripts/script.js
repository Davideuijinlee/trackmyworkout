$(document).ready( startJournal );

let journal;
function startJournal(){

	journal = new workoutJournal({
		addButton: $("#addButton"),
		updateButton: $("#updateButton"),
		cancelButton: $("#cancelButton"),
		exerciseInput: $("#exercise"),
		setInput: $("#sets"),
		repInput: $("#reps"),
		weightInput: $("#weight"),
		restInput: $("#rest"),
		displayArea: $("#displayArea"),
	});

	journal.addEventHandlers();
	journal.deleteData();
	journal.getDataFromServer();
	journal.selectDate();
}






