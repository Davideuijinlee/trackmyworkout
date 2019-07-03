class Exercise{
    constructor(id, date, exercise, sets, reps, weight, rest, updateExercise=()=>{}, deleteExercise=()=>{}, cancelUpdate=()=>{}, saveUpdate=()=>{}, cancelDelete=()=>{}, deletePerm=()=>{},displayAllExercises=()=>{}){
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
        this.cancelUpdate = cancelUpdate;
        this.saveUpdate = saveUpdate;
        this.cancelDelete = cancelDelete;
        this.deletePerm = deletePerm;
        this.displayAllExercises = displayAllExercises;

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
        const {id, date, exercise, sets, reps, weight, rest} = this.data;
        const dateDiv = $('<div>').addClass('row_data dateInfo').text(date).attr('edit_type', 'click').attr('col_name', 'date').attr('id', `${this.data.id}`);
        const exerciseDiv = $('<div>').addClass('row_data exerciseInfo').text(exercise).attr('edit_type', 'click').attr('col_name', 'exercise');
        const setsDiv = $('<div>').addClass('row_data setsInfo').text(sets).attr('edit_type', 'click').attr('col_name', 'sets');
        const repsDiv = $('<div>').addClass('row_data repsInfo').text(reps).attr('edit_type', 'click').attr('col_name', 'reps');
        const weightDiv = $('<div>').addClass('row_data weightInfo').text(weight).attr('edit_type', 'click').attr('col_name', 'weight');
        const restDiv = $('<div>').addClass('row_data restInfo').text(rest).attr('edit_type', 'click').attr('col_name', 'rest');
        const dateElement = $('<td>').append(dateDiv).addClass('tdContainer');
        const exerciseElement = $('<td>').append(exerciseDiv).addClass('tdContainer');
        const setsElement = $('<td>').append(setsDiv).addClass('tdContainer');
        const repsElement = $('<td>').append(repsDiv).addClass('tdContainer');
        const weightElement = $('<td>').append(weightDiv).addClass('tdContainer');
        const restElement = $('<td>').append(restDiv).addClass('tdContainer');
        const updateButton = $('<i>').attr('row_id', id).addClass('fa fa-edit iconBtn updateBtn btn_edit').on('click', this.handleUpdate);
        const saveButton = $('<i>').attr('row_id', id).addClass('fa fa-save iconBtn btn_save').on('click', this.handleSave).hide();
        const cancelButton = $('<i>').attr('row_id', id).addClass('fa fa-times iconBtn btn_cancel').on('click', this.cancelUpdate).hide();
        const deleteButton = $('<i>').addClass('fa fa-trash iconBtn btn_delete').on('click', this.handleDelete);
        const yesDelete = $('<i>').addClass('fa fa-check iconBtn btn_yes').on('click', this.permanentlyDeleteExercise).hide();
        const noDelete = $('<i>').addClass('fa fa-times iconBtn btn_no').on('click', this.denyDeleteExercise).hide();

        const optionsElements = $('<td>').append(updateButton, saveButton, deleteButton, cancelButton, yesDelete, noDelete).addClass('tdContainer');;
        const tableRow = $('<tr>').attr('row_id', id).addClass('rowClass').append(dateElement, exerciseElement, setsElement, repsElement, weightElement, restElement, optionsElements);

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

    handleDelete=()=>{
		this.deleteExercise(this.data.id, this.confirmDeleteExercise, this.data.exercise, this.data.date);
    }

    permanentlyDeleteExercise=()=>{
        let tbody = $("#displayArea");

        this.deletePerm(this.data.id)
        this.domElements.row.remove();
        if (tbody.children().length == 0) {
			let emptyDiv = $('<div>').addClass('emptyTableMsg').text('There are currently no exercises')
			tbody.append(emptyDiv);
		}
    }

    denyDeleteExercise=()=>{
        this.cancelDelete();
    }

    handleUpdate=(id)=>{
		this.updateExercise(this.data.id);
    }
    
    handleSave=()=>{
        let{id, date, sets, reps, weight, rest} = this.data
        this.saveUpdate(id, date, sets, reps, weight, rest)

    }
}