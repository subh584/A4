// Importing the required modules
const fs = require('fs');
const path = require('path');

var dataDirectory = path.join(__dirname, 'data');

// Defined class Data with a constructor
class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

var dataCollection = null;

// Function to read the contents of the JSON file
function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/students.json', 'utf8', (err, dataFromSomeFile) => {
      if (err) {
        console.log(err);
        reject(err);
        return; // exit the function
      }

      fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
        if (err) {
          console.log(err);
          reject(err);
          return;
        }

        const studentData = JSON.parse(dataFromSomeFile);
        const courseData = JSON.parse(courseDataFromFile);
        dataCollection = new Data(studentData, courseData);
        resolve();
      });

    });
  });
}

// Promise to retrieve all students
function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.students.length > 0) {
      resolve(dataCollection.students);
    } else {
      reject("No results returned");
    }
  });
}

// Promise to retrieve all TA's
function getTAs() {
  return new Promise((resolve, reject) => {
    const TAs = dataCollection.students.filter(student => student.TA);
    if (TAs.length > 0) {
      resolve(TAs);
    } else {
      reject("No results returned");
    }
  });
}

// Promise to retrieve all courses
function getCourses() {
  return new Promise((resolve, reject) => {
    if (dataCollection && dataCollection.courses.length > 0) {
      resolve(dataCollection.courses);
    } else {
      reject("No results returned");
    }
  });
}

function getStudentsByCourse(course) {
  return new Promise((resolve, reject) => {
    const students = dataCollection.students.filter(student => student.course === course);

    if (students.length === 0) {
      reject("No results returned");
    } else {
      resolve(students);
    }
  });
}

function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
    const student = dataCollection.students.find(student => student.studentNum === num);

    if (!student) {
      reject("No results returned");
    } else {
      resolve(student);
    }
  });
}

function addStudent(studentData) {
  return new Promise((resolve, reject) => {
    if (studentData.TA === undefined) {
      studentData.TA = false;
    } else {
      studentData.TA = true;
    }
    studentData.studentNum = dataCollection.students.length + 1;

    dataCollection.students.push(studentData);
    resolve(studentData);
  });
}

// Exporting the required functions within the class Data
module.exports = {
  initialize,
  getAllStudents,
  getTAs,
  getCourses,
  getStudentsByCourse,
  getStudentByNum,
  addStudent
};
