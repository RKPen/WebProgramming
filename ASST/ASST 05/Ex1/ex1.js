function generateAndCheckToken() {
  const netaccount = document.getElementById('netaccount').value;

  if (!netaccount) {
    alert('Please enter an AUBNet account.');
    return;
  }

  const token = generateToken(netaccount);

  checkTokenAvailability(token);
}

function generateToken(netaccount) {
  // Extract alphabetic and numeric parts
  const alphabeticPart = netaccount.match(/[a-zA-Z]+/g).join('');
  const numericPart = netaccount.match(/\d+/g)[0];
  
  // Convert alphabetic part to ASCII codes
  const asciiCodes = alphabeticPart.split('').map(char => char.charCodeAt(0)).join('');
  
  // Convert numeric part to hexadecimal
  const hexNum = '0x' + parseInt(numericPart, 10).toString(16).toUpperCase();
  
  // Combine the two parts to form the final token
  const token = asciiCodes + hexNum;

  document.getElementById('token').value = token;
  
  return token;
}


function checkTokenAvailability(token) {
  const xhr = new XMLHttpRequest();
  const method = "GET";
  const url = "tokens.txt";
  const netaccount = document.getElementById('netaccount').value;
  xhr.open(method, url, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        const tokens = xhr.responseText.split("\n");
        for(let i = 0; i < tokens.length; i++){
          line = tokens[i].split(": ");
        }
        const conflicts = [];
        tokens.forEach((line) => {
          const [name , t] = line.split(": ");
          if (t == token) {
            conflicts.push(name);
          }
          else{
            document.getElementById('token').style.backgroundColor = "green";
            document.getElementById('token').value = token;
            console.log("token is available");
          }
        });

        if (conflicts.length > 0) {
          // show red X and conflicts with label
          const conflictsLabel = document.createElement("label");
          conflictsLabel.textContent = "Conflicts with: ";
          const conflictsInput = document.createElement("input");
          conflictsInput.type = "text";
          conflictsInput.disabled = true;
          conflictsInput.value = conflicts.join(', ');
          document.getElementById('token').style.backgroundColor = "red";
          const x = document.createElement("span");
          x.textContent = "X";
          x.style.color = "red";
          document.getElementById('token').parentNode.appendChild(x);
          document.getElementById('token').parentNode.appendChild(conflictsLabel);
          document.getElementById('token').parentNode.appendChild(conflictsInput);

          // create help me button
          const helpMe = document.createElement("button");
          helpMe.textContent = "Help me!";
          document.querySelector('form').appendChild(helpMe);

          let attempt = 1;
          let index = 1;

          //define getPermutations functions 
          function getPermutations(arr, size) {
            const permutations = [];
            if (size === 1) return arr.map((value) => [value]);
            arr.forEach((value, index, arr) => {
              const rest = [...arr.slice(0, index), ...arr.slice(index + 1)];
              const innerPermutations = getPermutations(rest, size - 1);
              innerPermutations.forEach((p) => permutations.push([value, ...p]));
            })};
          // handle help me button clicks
          helpMe.addEventListener("click", (e) => {
            e.preventDefault();
            switch (attempt) {
              case 1:
                //  permutate alphabetic part
                const alphabeticArr = netaccount.match(/[a-zA-Z]+/g)[0].split('');
                const permutations = getPermutations(alphabeticArr, 2);
                const newAlphabetic = permutations[index % permutations.length];
                const newNet = newAlphabetic.join('') + numericArr;
                const newToken = generateToken(newNet);
                checkTokenAvailability(newToken);
                index++;
                break;
              case 2:
                //  permutate numeric part
                const numericArr = netaccount.match(/\d+/g)[0].split('');
                const numericPermutations = getPermutations(numericArr, 2);
                const newNumeric = numericPermutations[index % numericPermutations.length];
                const newNet2 = alphabeticArr + newNumeric.join('');
                const newToken2 = generateToken(newNet2);
                checkTokenAvailability(newToken2);
                index++;
                break;
              case 3:
                //  permutate both parts
                const newAlphabetic2 = permutations[index % permutations.length];
                const newNumeric2 = numericPermutations[index % numericPermutations.length];
                const newNet3 = newAlphabetic2.join('') + newNumeric2.join('');
                const newToken3 = generateToken(newNet3);
                checkTokenAvailability(newToken3);
                index++;
                break;
                default:
            }
          })
        }
      }
    }
  };
  xhr.send();
}

