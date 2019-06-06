class workoutJournal{

	constructor(elementConfig){
		this.data = {};
		this.elementConfig = elementConfig;
		this.studentName = null;
		this.studentCourse = null;
		this.studentGrade = null;
		this.handleAdd = this.handleAdd.bind(this);
		this.handleCancel = this.handleCancel.bind(this);
		this.deleteStudent = this.deleteStudent.bind(this);
		this.getDataFromServer = this.getDataFromServer.bind(this);
		this.sendDataToServer = this.sendDataToServer.bind(this);
		this.handleDataSuccess = this.handleDataSuccess.bind(this);
		this.DeleteDatatoServer = this.DeleteDatatoServer.bind(this);
	}

	addEventHandlers(){
		const {addButton, cancelButton, updateButton} = this.elementConfig;
		$(addButton).on('click', this.handleAdd);
		$(updateButton).on('click', this.handleUpdate);
		$(cancelButton).on('click', this.handleCancel);
	}
	/* clearInputs - take the three inputs stored in our constructor and clear their values
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	clearInputs(){
		$(this.elementConfig.nameInput).val('');
		$(this.elementConfig.courseInput).val('');
		$(this.elementConfig.gradeInput).val('');
	}
	/* handleCancel - function to handle the cancel button press
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/
	handleCancel(){
		this.clearInputs();
	}
	/* handleAdd - function to handle the add button click
	purpose: grabs values from inputs, utilizes the model's add method to save them, then clears the inputs and displays all students
	params: none
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	handleAdd(){
		const {exerciseInput, setInput, repInput, weightInput, restInput} = this.elementConfig;
		this.exerciseName = exerciseInput.val();
		this.exerciseSets = setInput.val();
		this.exerciseReps = repInput.val();
		this.exerciseWeight = weightInput.val();
		this.exerciseRest = restInput.val();
		this.createExerciseForm(this.exerciseName, this.exerciseSets, this.exerciseReps, this.exerciseWeight, this.exerciseRest);
		
		// this.displayAllStudents();
	}
	/* displayAllStudents - iterate through all students in the model
	purpose: 
		grab all students from model, 
		iterate through the retrieved list, 
		then render every student's dom element
		then append every student to the dom's display area
		then display the grade average
	params: none
	return: undefined
	ESTIMATED TIME: 1.5 hours
	*/
	displayAllExercises(){
		$('#displayArea').empty();
		for (let id in this.data) {
			console.log('render display', this.data);
			let exerciseRow = this.data[id].render();
			console.log('exerciseRow', exerciseRow);
			$('#displayArea').append(exerciseRow);
		}
		// this.displayAverage();
	}
	/* displayAverage - get the grade average and display it
	purpose: grab the average grade from the model, and show it on the dom
	params: none
	return: undefined 
	ESTIMATED TIME: 15 minutes

	*/

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

	createExerciseForm(date, exercise, sets, reps, weight, rest){
		this.sendDataToServer(exercise, sets, reps, weight, rest);
	}

	createExercise(id, date, exercise, sets, reps, weight, rest){
		// debugger;
		if(date && exercise && sets && reps && weight && rest){
			const exerciseElement = new Exercise(id, date, exercise, sets, reps, weight, rest, this.DeleteDatatoServer, this.DeleteDatatoServer);
			this.data[id] = exerciseElement;
			console.log('data', this.data)
		}
	}

	doesStudentExist(id){
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
	deleteStudent(id){
		if(this.doesStudentExist(id)){
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
				console.log('ajax response', response);
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

	sendDataToServer(name, course, grade){
		$.ajax({
			url: 'api/grades',
			dataType: 'json',
			method: 'post',
			data: {
				'api_key': 'ygZe9pkcvR',
				'name': name,
				'course': course,
				'grade': grade,
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
		$.ajax({
			url: 'api/grades?student_id=' + id,
			dataType: 'json',
			method: 'delete',
			success: function(){
				this.getDataFromServer();
				return true;
			}
		})
	}
}
