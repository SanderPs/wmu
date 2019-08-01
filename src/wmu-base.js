

exports.eol = "\r\n";
exports.eolIn = /\r?\n/;

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
  let isHeader = /(h|header)\d/.test(parsedDef[0]);
  let blockType = isHeader ? 'h' : parsedDef[0]

  var allVar = {
    'block-type': blockType
  };

  if (isHeader) {
    allVar['level'] = parsedDef[0].match(/\d/)[0];
  }

  for (let x=1; x < parsedDef.length; x++) {
      let nameValue = parsedDef[x].split("=");
      if (nameValue.length === 1) {
        if (/^\d+$/.test(nameValue[0])) {
          allVar['number'] = parseInt(nameValue[0], 10);
        } else {
          if (/[:-]+/.test(nameValue[0])) {
            allVar['block-align'] = nameValue[0];
          } else {
            allVar['title'] = nameValue[0]; // todo: dit is niet lekker
          }
        }
      } else {
        if (nameValue[0].length===0) {
          // just a '=' without name -> default
          switch (blockType) {
            case 'header':
            case 'h':
              allVar['title'] = nameValue[1];
              break;
            case 'code':
            case 'c':
              allVar['language'] = nameValue[1];
              break;
            case 'block':
            case 'b':
              allVar['format'] = nameValue[1];
              break;
            case 'img':
            case 'i':
              allVar['src'] = nameValue[1];
              break;
            case 'footnote':
            case 'fn':
              allVar['id'] = nameValue[1];
              break;
          }
        } else {
          allVar[nameValue[0]] = nameValue[1];
        }
      }
  }
  return allVar;
}

exports.alignmentClass = function (str, isBlock) {
  let prefix = isBlock ? 'block-' : 'text-';
  if (/^-+:$/.test(str)) {
    return prefix + 'right';
  } else if (/^-+:-+$/.test(str)) {
    return prefix + 'center';
  } else if (/^:-+$/.test(str)) {
    return prefix + 'left';
  } else if (/^:-+:$/.test(str)) {
    return prefix + 'fill'; // :-: fill = table: 100%, cell: justify
  }
  return null;
}

exports.classAttr = function() {
  let result = this.classList.apply(null, arguments);
  return (result.length ? ' class="' + result + '"' : '');
}

exports.classList = function () {
  let result = [];
  for (var i = 0; i < arguments.length; i++) {
    if (arguments[i] && arguments[i].length)
      result.push(arguments[i]);
  }
  return result.join(' ');
}

exports.valignmentClass = function (str) {
  if (/_/.test(str)) {
    return 'v-bottom';
  } else if (/-/.test(str)) {
    return 'v-middle';
  } else if (/T/.test(str)) {
    return 'v-top';
  }
  return '';
}

// based on: https://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
exports.newElementId = function(str) {
  return 'id_' + hashCode(str); // todo: keep list and check
}

function hashCode(str,max){
  var hash = 0;
  if (!str.length) return hash;
  for (i = 0; i < str.length; i++) {
    char = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(max?hash%max:hash);
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