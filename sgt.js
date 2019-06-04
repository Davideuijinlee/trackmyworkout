


class SGT_template{
	/* constructor - sets up sgt object 
	params: (object) elementConfig - all pre-made dom elements used by the app
	purpose: 
		- Instantiates a model and stores pre-made dom elements it this object
		- Additionally, will generate an object to store created students 
		who exists in our content management system (CMS)
	return: undefined
	ESTIMATED TIME: 1 hour
	*/
	constructor(elementConfig){
			// startTests();
	// SGT = new SGT_template({
	// 	addButton: $("#addButton"),
	// 	cancelButton: $("#cancelButton"),
	// 	nameInput: $("#studentName"),
	// 	courseInput: $("#studentCourse"),
	// 	gradeInput: $("#studentGrade"),
	// 	displayArea: $("#displayArea"),
	// 	averageArea: $(".avgGrade")
	// });
	// SGT.addEventHandlers();
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

	/* addEventHandlers - add event handlers to premade dom elements
	adds click handlers to add and cancel buttons using the dom elements passed into constructor
	params: none
	return: undefined
	ESTIMATED TIME: 15 minutes
	*/

	addEventHandlers(){
		$(this.elementConfig.addButton).on('click', this.handleAdd);
		$(this.elementConfig.cancelButton).on('click', this.handleCancel);
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
	// 	displayArea: $("#displayArea")
	// 	nameInput: $("#studentName"),
	// 	courseInput: $("#studentCourse"),
	// 	gradeInput: $("#studentGrade"),
	// debugger;
		this.studentName = this.elementConfig.nameInput.val();
		this.studentCourse = this.elementConfig.courseInput.val();
		this.studentGrade = this.elementConfig.gradeInput.val();
		this.createStudentForm(this.studentName, this.studentCourse, this.studentGrade);
		
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
	displayAllStudents(){

		$('#displayArea').empty();
		for (var id in this.data) {
			var studentRow = this.data[id].render();
			$('#displayArea').append(studentRow);
		}
		this.displayAverage();

	}
	/* displayAverage - get the grade average and display it
	purpose: grab the average grade from the model, and show it on the dom
	params: none
	return: undefined 
	ESTIMATED TIME: 15 minutes

	*/

	displayAverage(){
 
		var studentCounter = 0;
		var studentGradeTotal = 0;
		for (var id in this.data) {
			var studentGrade = this.data[id].data.grade;
			studentGradeTotal += studentGrade;
			studentCounter++;
	}
	var gradeAverage = studentGradeTotal/studentCounter;
	$('.avgGrade').text(gradeAverage.toFixed(2));
}
	/* createStudent - take in data for a student, make a new Student object, and add it to this.data object

		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	purpose: 
			If no id is present, it must pick the next available id that can be used
			when it creates the Student object, it must pass the id, name, course, grade, 
			and a reference to SGT's deleteStudent method
	params: 
		name : the student's name
		course : the student's course
		grade: the student's grade
		id: the id of the student
	return: false if unsuccessful in adding student, true if successful
	ESTIMATED TIME: 1.5 hours
	*/
	createStudentForm(name, course, grade){
		this.sendDataToServer(name, course, grade);
	}

	createStudent(name, course, grade, id){
		if(name && course && grade){
			var student = new Student(id, name, course, grade, this.DeleteDatatoServer);
			this.data[id] = student;
		}
	}
		// var idNumberArray = [];
		// var student = null;
		// if(this.data.hasOwnProperty(id) === false && id) {
		// 	student = new Student(id, name, course, grade, this.deleteStudent);
		// 	this.data[id] = student;
		// 	return true;
		// } else if(!id) {
		// 	var idArray = Object.keys(this.data);
		// 	for(var idIndex = 0; idIndex < idArray.length; idIndex++){
		// 		var numberID = parseInt(idArray[idIndex]);
		// 		idNumberArray.push(numberID);
		// 	}
		// 	var lastID = idNumberArray[idNumberArray.length - 1];
		// 	var newID = lastID + 1
		// 	student = new Student(newID, name, course, grade, this.deleteStudent);
		// 	this.data[lastID + 1] = student;
		// 	return true;
		// } else {
		// 	return false;
		// }


	/* doesStudentExist - 
		determines if a student exists by ID.  returns true if yes, false if no
	purpose: 
			check if passed in ID is a value, if it exists in this.data, and return the presence of the student
	params: 
		id: (number) the id of the student to search for
	return: false if id is undefined or that student doesn't exist, true if the student does exist
	ESTIMATED TIME: 15 minutes
	*/
	doesStudentExist(id){
		if(this.data.hasOwnProperty(id) === true){
			return true;
		}
		else{
			return false;
		}

	}
	/* readStudent - 
		get the data for one or all students
	purpose: 
			determines if ID is given or not
			if ID is given, return the student by that ID, if present
			if ID is not given, return all students in an array
	params: 
		id: (number)(optional) the id of the student to search for, if any
	return: 
		a singular Student object if an ID was given, an array of Student objects if no ID was given
		ESTIMATED TIME: 45 minutes
	*/
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
	//AJAX
	getDataFromServer(){
		$.ajax({    
			url: 'api/grades',
			dataType: 'json',
			method: 'get',
			data: {api_key: 'ygZe9pkcvR'},
			success: function(response){
				console.log(response);
				for (var index in response.data){
					SGT.createStudent(
						response.data[index].name,
						response.data[index].course,
						response.data[index].grade,
						response.data[index].id
					)};
				SGT.displayAllStudents();
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
		debugger;
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
