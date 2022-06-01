const newLocal = './data/chat.json';
fetch(newLocal)
  .then(response => response.json())
  .then(json => console.log(json));