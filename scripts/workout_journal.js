class workoutJournal{

	constructor(elementConfig){
		this.data = {};
		this.elementConfig = elementConfig;
		this.exerciseName = null;
		this.exerciseSets = null;
		this.exerciseReps = null;
		this.exerciseWeight = null;
		this.exerciseRest = null;
		this.handleAdd = this.handleAdd.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.deleteExercise = this.deleteExercise.bind(this);
		this.getDataFromServer = this.getDataFromServer.bind(this);
		this.sendDataToServer = this.sendDataToServer.bind(this);
		this.handleDataSuccess = this.handleDataSuccess.bind(this);
		this.DeleteDatatoServer = this.DeleteDatatoServer.bind(this);
	}

	addEventHandlers(){
		const {addButton, cancelButton, updateButton} = this.elementConfig;
		addButton.on('click', this.handleAdd);
		updateButton.on('click', this.handleUpdate);
		cancelButton.on('click', this.handleCancel);
	}

	clearInputs(){
		$(this.elementConfig.exerciseInput).val('');
		$(this.elementConfig.setInput).val('');
		$(this.elementConfig.repInput).val('');
		$(this.elementConfig.weightInput).val('');
		$(this.elementConfig.restInput).val('');
	}

	handleCancel(){
		this.clearInputs();
	}

	handleAdd(){
		console.log('clicked')
		const {exerciseInput, setInput, repInput, weightInput, restInput} = this.elementConfig;
		this.exerciseName = exerciseInput.val();
		this.exerciseSets = setInput.val();
		this.exerciseReps = repInput.val();
		this.exerciseWeight = weightInput.val();
		this.exerciseRest = restInput.val();
		this.createExerciseForm(this.exerciseName, this.exerciseSets, this.exerciseReps, this.exerciseWeight, this.exerciseRest);
	}

	displayAllExercises(){
		$('#displayArea').empty();
		for (let id in this.data) {
			let exerciseRow = this.data[id].render();
			$('#displayArea').append(exerciseRow);
		}
	}


// 	displayAverage(){
 
// 		var studentCounter = 0;
// 		var studentGradeTotal = 0;
// 		for (var id in this.data) {
// 			var studentGrade = this.data[id].data.grade;
// 			studentGradeTotal += studentGrade;
// 			studentCounter++;
// 	}
// 	var gradeAverage = studentGradeTotal/studentCounter;
// 	$('.avgGrade').text(gradeAverage.toFixed(2));
// }

	createExerciseForm(exercise, sets, reps, weight, rest){
		this.sendDataToServer(exercise, sets, reps, weight, rest);
	}

	createExercise(id, date, exercise, sets, reps, weight, rest){
		if(date && exercise && sets && reps && weight && rest){
			const exerciseElement = new Exercise(id, date, exercise, sets, reps, weight, rest, this.DeleteDatatoServer, this.DeleteDatatoServer);
			this.data[id] = exerciseElement;
		}
	}

	doesExerciseExist(id){
		if(this.data.hasOwnProperty(id) === true){
			return true;
		}
		else{
			return false;
		}

	}

	readStudent(id){
		if(id === undefined){
			return Object.values(this.data);
		}
		else{
			if(this.data.hasOwnProperty(id) === true){
				return this.data[id];
			}
			
			else{
				return false;
			}
		}
	}
	/* updateStudent - 
		not used for now.  Will be used later
		pass in an ID, a field to change, and a value to change the field to
	purpose: 
		finds the necessary student by the given id
		finds the given field in the student (name, course, grade)
		changes the value of the student to the given value
		for example updateStudent(2, 'name','joe') would change the name of student 2 to "joe"
	params: 
		id: (number) the id of the student to change in this.data
		field: (string) the field to change in the student
		value: (multi) the value to change the field to
	return: 
		true if it updated, false if it did not
		ESTIMATED TIME: no needed for first versions: 30 minutes
	*/
	updateStudent(){

	}
	/* deleteStudent - 
		delete the given student at the given id
	purpose: 
			determine if the ID exists in this.data
			remove it from the object
			return true if successful, false if not
			this is often called by the student's delete button through the Student handleDelete
	params: 
		id: (number) the id of the student to delete
	return: 
		true if it was successful, false if not
		ESTIMATED TIME: 30 minutes
	*/
	deleteExercise(id){
		if(this.doesExerciseExist(id)){
			delete this.data[id];
			return true;
		} else{
			return false;
		}
	}

	getDataFromServer(){
		$.ajax({    
			url: 'public/api/get_exercise.php',
			dataType: 'json',
			method: 'get',
			success: function(response){
				for (let index in response){
					journal.createExercise(
						response[index].id,
						response[index].date,
						response[index].exercise,
						response[index].sets,
						response[index].reps,
						response[index].weight,
						response[index].rest
					)};
					journal.displayAllExercises();
			}
		});
	}

	sendDataToServer(exercise, sets, reps, weight, rest){
		
		console.log('send data', exercise, sets, reps, weight, rest)
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

	handleDataSuccess(response){
		if(response.success){
			this.clearInputs();
			this.getDataFromServer();
		}
		// else optional
	}

	DeleteDatatoServer(id){
		console.log('id', id)
		$.ajax({
			url: 'public/api/delete_exercise.php',
			dataType: 'json',
			method: 'post',
			data:{
				id
			},
			success: function(){
				this.getDataFromServer();
				return true;
			}
		})
	}
}
