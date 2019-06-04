class Exercise{
    constructor(id, date, exercise, sets, reps, weight, updateExercise=()=>{}, deleteExercise=()=>{}){
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
            rest,
            options: {
                updateButton: null,
                deleteButton: null
            }
		}
    }

    render(){
        const {date, exercise, sets, reps, weight, rest} = this.data;
        const date = $('<td>').text(date);
        const exercise = $('<td>').text(exercise);
        const sets = $('<td>').text(sets);
        const reps = $('<td>').text(reps);
        const weight = $('<td>').text(weight);
        const rest = $('<td>').text(rest);
        const tableRow = $('<tr>').append(date, exercise, sets, reps, weight, rest);

        this.domElements = {
			row: tableRow,
			date,
			exercise,
			sets,
			reps,
            weight,
            rest,
            options: {
                updateButton,
                deleteButton
            }
		}
    }
    handleDelete(){
		this.deleteCallback(this.data.id);
		this.domElements.row.remove();
	}
}