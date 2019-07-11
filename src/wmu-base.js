
var _wmu_project;

exports.init = function() {
  
  _wmu_project = {
  };

  return _wmu_project;
}

exports.getAll = function() {
    return _wmu_project;
};


//export 
class User {

  get firstName() {
    return this.firstName;
  }

  get lastName() {
    return this.lastName;
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  get age() {
    return this.age;
  }

  constructor(firstName, lastName, age) {
    this.setName(firstName, lastName);
    this.setAge(age);
  }

  setName(firstName, lastName) {
    if (this.validName(firstName) && this.validName(lastName)) {
      this.firstName = firstName;
      this.lastName = lastName;
    }
  }

  setAge(age) {
    if (age >= 18) {
      this.age = age;
    } else {
      throw new Error('User age must be greater than 18');
    }
  }

  // private 
  validName(name) {
    if (name.length > 0 && /^[a-zA-Z]+$/.test(name)) {
      return true
    } else {
      throw new Error('Invalid name format');
    }
  }
}