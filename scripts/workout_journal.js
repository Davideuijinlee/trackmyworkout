class workoutJournal {

	constructor(elementConfig) {
		this.data = {};
		this.elementConfig = elementConfig;
		this.exerciseName = null;
		this.exerciseSets = null;
		this.exerciseReps = null;
		this.exerciseWeight = null;
		this.exerciseRest = null;
	}

	addEventHandlers() {
		const { addButton, cancelButton, updateButton } = this.elementConfig;
		addButton.on('click', this.handleAdd);
		cancelButton.on('click', this.handleCancel);
	}

	clearInputs() {
		$(this.elementConfig.exerciseInput).val('');
		$(this.elementConfig.setInput).val('');
		$(this.elementConfig.repInput).val('');
		$(this.elementConfig.weightInput).val('');
		$(this.elementConfig.restInput).val('');
	}

	handleCancel = () => {
		this.clearInputs();
	}

	handleAdd = () => {
		const { exerciseInput, setInput, repInput, weightInput, restInput } = this.elementConfig;
		this.exerciseName = exerciseInput.val();
		this.exerciseSets = setInput.val();
		this.exerciseReps = repInput.val();
		this.exerciseWeight = weightInput.val();
		this.exerciseRest = restInput.val();
		this.createExerciseForm(this.exerciseName, this.exerciseSets, this.exerciseReps, this.exerciseWeight, this.exerciseRest);
	}

	displayAllExercises() {

		$('#displayArea').empty();
		for (let id in this.data) {
			let exerciseRow = this.data[id].render();
			$('#displayArea').append(exerciseRow);
		}
	}

	createExerciseForm(exercise, sets, reps, weight, rest) {
		this.sendDataToServer(exercise, sets, reps, weight, rest);
	}

	createExercise(id, date, exercise, sets, reps, weight, rest) {
		if (date && exercise && sets && reps && weight && rest) {
			const exerciseElement = new Exercise(id, date, exercise, sets, reps, weight, rest, this.updateExercise, this.DeleteDatatoServer, this.cancelUpdate, this.saveUpdate);
			this.data[id] = exerciseElement;
		}
	}

	cancelUpdate = () => {
		$(document).on('click', '.btn_cancel', function (event) {
			event.preventDefault();

			const tbl_row = $(this).closest('tr');

			const row_id = tbl_row.attr('row_id');

			tbl_row.find('.btn_save').hide();
			tbl_row.find('.btn_cancel').hide();

			tbl_row.find('.btn_edit').show();
			tbl_row.find('.btn_delete').show();

			tbl_row.find('.row_data')
				.attr('edit_type', 'click')
				.attr('contenteditable', 'false')
				.css({
					'padding': '',
					'border-right': 'none',
					'background-color': ''
				})

			tbl_row.find('.row_data').each(function (index, val) {
				$(this).html($(this).attr('original_entry'));
			});
		});
	}

	saveUpdate = (id) => {
		$(document).on('click', '.btn_save', function (event) {
			event.preventDefault();
			const tbl_row = $(this).closest('tr');
			const row_id = tbl_row.attr('row_id');


			tbl_row.find('.btn_save').hide();
			tbl_row.find('.btn_cancel').hide();

			tbl_row.find('.btn_edit').show();
			tbl_row.find('.btn_delete').show();

			tbl_row.find('.row_data')
				.attr('edit_type', 'click')
				.attr('contenteditable', 'false')
				.css({
					'padding': '',
					'border-right': 'none',
					'background-color': 'none'
				})
			$(this).closest('div').attr('contenteditable', 'false')


			let arr = {}
			tbl_row.find('.row_data').each(function (index, val) {
				let col_name = $(this).attr('col_name');
				let col_val = $(this).html();
				arr[col_name] = col_val;
			});
			$.extend(arr, { row_id: row_id });
			$('.post_msg').html('<pre class="bg-success">' + JSON.stringify(arr, null, 2) + '</pre>')
			let { date, exercise, sets, reps, weight, rest } = arr;
			journal.updateData(row_id, date, exercise, sets, reps, weight, rest);
		});

	}


	updateExercise = (id) => {
		$(document).on('click', '.btn_edit', function (event) {
			event.preventDefault();
			const tbl_row = $(this).closest('tr');

			const row_id = tbl_row.attr('row_id');

			tbl_row.find('.btn_save').show();
			tbl_row.find('.btn_cancel').show();

			tbl_row.find('.btn_edit').hide();
			tbl_row.find('.btn_delete').hide();

			tbl_row.find('.row_data')
				.attr('contenteditable', 'true')
				.attr('edit_type', 'button')
				.css({
					'background-color': '#3d3f3f',
					'padding': '3px',
					'border-right': '2px solid #eee',
		})


		tbl_row.find('.row_data').each(function (index, val) {
			$(this).attr('original_entry', $(this).html());
		});
	});
}



getDataFromServer = () => {
	$.ajax({
		url: 'public/api/get_exercise.php',
		dataType: 'json',
		method: 'get',
		success: function (response) {
			for (let index in response) {
				journal.createExercise(
					response[index].id,
					response[index].date,
					response[index].exercise,
					response[index].sets,
					response[index].reps,
					response[index].weight,
					response[index].rest
				)
			};
			journal.displayAllExercises();
		}
	});
}

getSpecificDate = (date) => {
	this.data = {};
	$.ajax({
		url: 'public/api/get_specific_date.php',
		dataType: 'json',
		method: 'get',
		data: {
			date
		},
		success: function (response) {
			for (let index in response) {
				journal.createExercise(
					response[index].id,
					response[index].date,
					response[index].exercise,
					response[index].sets,
					response[index].reps,
					response[index].weight,
					response[index].rest
				)
			};
			journal.displayAllExercises();
		}
	});
}

getDateRange = (startDate, endDate) => {
	this.data = {};
	$.ajax({
		url: 'public/api/get_date_range.php',
		dataType: 'json',
		method: 'get',
		data: {
			startDate,
			endDate
		},
		success: function (response) {
			for (let index in response) {
				journal.createExercise(
					response[index].id,
					response[index].date,
					response[index].exercise,
					response[index].sets,
					response[index].reps,
					response[index].weight,
					response[index].rest
				)
			};
			journal.displayAllExercises();
		}
	});
}

sendDataToServer = (exercise, sets, reps, weight, rest) => {

	$.ajax({
		url: 'public/api/add_exercise.php',
		dataType: 'json',
		method: 'post',
		data: {
			exercise,
			sets,
			reps,
			weight,
			rest
		},
		success: this.handleDataSuccess,
	})
}

handleDataSuccess = (response) => {
	if (response.success) {
		this.clearInputs();
		this.getDataFromServer();
	}
}

DeleteDatatoServer = (id) => {
	$.ajax({
		url: 'public/api/delete_exercise.php',
		dataType: 'json',
		method: 'post',
		data: {
			id
		},
		success: this.getDataFromServer=()=>{}
	})
}

updateData = (id, date, exercise, sets, reps, weight, rest) => {
	$.ajax({
		url: 'public/api/update_exercise.php',
		dataType: 'json',
		method: 'post',
		data: {
			id,
			date,
			exercise,
			sets,
			reps,
			weight,
			rest
		},
		success: function () {
			journal.getDataFromServer();
			return true;
		}
	})
}

selectDate=()=>{
		$('#datetimepicker6').datetimepicker({
			format: 'MM/DD/YYYY',
			useCurrent: false, 
		});
		
        $('#datetimepicker7').datetimepicker({
			format: 'MM/DD/YYYY',
			useCurrent: false, 
		});
		
		let startDate = '';
		let endDate = '';
        $('#datetimepicker6').on('dp.change', function (e) {
			$('#datetimepicker7').data('DateTimePicker').minDate(e.date);
			startDate = $("#datetimepicker6").find("input").val();
			if(startDate && endDate){
				journal.getDateRange(startDate, endDate);
			} else if(startDate && !endDate){
				journal.getSpecificDate(startDate);
			}
		});
		
        $("#datetimepicker7").on("dp.change", function (e) {
			$('#datetimepicker6').data("DateTimePicker").maxDate(e.date);
			endDate = $("#datetimepicker7").find('input').val();
			console.log('end', endDate, 'start', startDate)
			if(startDate){
				journal.getDateRange(startDate, endDate);
			}
		});
		
		$('.refreshBtn').on('click', function(){
			$("#datetimepicker6").find('input').val('');
			$("#datetimepicker7").find('input').val('');
			startDate = '';
			endDate = '';
			console.log('end', endDate, 'start', startDate)
			journal.getDataFromServer();
		});
}
}
