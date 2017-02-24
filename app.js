window.fn = {};

window.fn.open = function() {
  var menu = document.getElementById('menu');
  menu.open();
};

window.fn.load = function(page) {
  var content = document.getElementById('content');
  var menu = document.getElementById('menu');
  content.load(page)
    .then(menu.close.bind(menu));
};

function alarmstate(name){
	console.log('switch button clicked', name);
}

function gettime() {
  var h = document.getElementById('choose-hour').value;
  var m = document.getElementById('choose-min').value;
  var zone = document.getElementById('choose-time').value;

  console.log('hour is', h);
  console.log('min is', m);
  console.log("AM PM is ", zone);
}
function addOption(event) {
  const option = document.createElement('option');
  let text = document.getElementById('optionLabel').value;
  option.innerText = text;
  text = '';
  document.getElementById('dynamic-sel').appendChild(option);
}