

exports.eol = "\r\n";

var _wmu_project;

exports.init = function() {
  
  _wmu_project = {
  };

  return _wmu_project;
}

exports.getAll = function() {
    return _wmu_project;
};

exports.parseDef = function (str) {

  var parsedDef = str.replace(/^\|/,"").replace(/[\r\n\|]+$/,"").split(/[\r\n\|]+/);
  var allVar = {
    'block-type': parsedDef[0]
  };
  for (let x=1; x < parsedDef.length; x++) {
      let nameValue = parsedDef[x].split("=");
      if (nameValue.length === 1) {
          allVar['block-align'] = nameValue[0];
      } else {
          allVar[nameValue[0]] = nameValue[1];
      }
  }
  return allVar;
}

exports.alignmentClass = function (str) {
  if (/^-+:$/.test(str)) {
    return "right";
  } else if (/^-+:-+$/.test(str)) {
    return "center";
  } else if (/^:-+$/.test(str)) {
    return "left";
  } else if (/^:-+:$/.test(str)) {
    return "fill"; // :-: fill = table: 100%, cell: justify
  }
  return null;
}










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