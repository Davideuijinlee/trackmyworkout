class Exercise{
    constructor(id, date, exercise, sets, reps, weight, rest, updateExercise=()=>{}, deleteExercise=()=>{}){
        this.data = {
            id,
            date,
            exercise,
            sets,
            reps,
            weight,
            rest
        }

        this.updateExercise = updateExercise;
        this.deleteExercise = deleteExercise;

        this.domElements = {
			row: null,
			date: null,
			exercise: null,
			sets: null,
			reps: null,
            weight: null,
            rest: null,
            options: null,
		}
    }

    render(){
        const {date, exercise, sets, reps, weight, rest} = this.data;
        const dateElement = $('<td>').text(date);
        const exerciseElement = $('<td>').text(exercise);
        const setsElement = $('<td>').text(sets);
        const repsElement = $('<td>').text(reps);
        const weightElement = $('<td>').text(weight);
        const restElement = $('<td>').text(rest);
        const updateButton = $('<button>').text('update').on('click', this.handleDelete);
		const deleteButton = $('<button>').text('delete').on('click', this.handleDelete);
        const optionsElements = $('<td>').append(updateButton, deleteButton);
        const tableRow = $('<tr>').append(dateElement, exerciseElement, setsElement, repsElement, weightElement, restElement, optionsElements);

        this.domElements = {
			row: tableRow,
			date: dateElement,
			exercise: exerciseElement,
			sets: setsElement,
			reps: repsElement,
            weight: weightElement,
            rest: restElement,
            options: optionsElements
        }
        return this.domElements.row;
    }
    handleDelete(){
		this.deleteCallback(this.data.id);
		this.domElements.row.remove();
	}
}