const myFunc = myarray => checkIt(myarray);

const checkIt = myarray =>
  myarray.map(elem => {
    if (elem % 2 === 0) {
      return "its even";
    } else {
      return "its odd";
    }
  });
console.log(myFunc([1, 2, 3, 4]));
