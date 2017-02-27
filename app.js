


/*function list_jquery(hour, min, period, name){

  var id = hour + min + period;
  var item = hour + ':' + min + ' ' + period + ' ' + name;
  var end = '<div class="switch__toggle"> <div class="switch__handle"></div> </div> </label> </div> </li>';

  var input = '<input type="checkbox" id="'+ id + '" class="switch__input">';

  var jquery = '<li class="list__item" id="alarm' + id + '"><div class="list__item__center">' + item + 
  '</div> <div class="list__item__right"> <label class="switch">';

  jquery = jquery + input + end;

  return jquery;
}*/

function list_jquery(hour, min, period, name){

  var id = hour + min + period;
  var item = hour + ':' + min + ' ' + period + ' ' + name;
  var input_end = '<div class="switch__toggle"> <div class="switch__handle"></div> </div> </label> </div>';

  var input = '<input type="checkbox" id="'+ id + '" class="switch__input" checked>';
  var act_edit   = '<div class="swipeout-actions-left">' + '<a href="#" class="action2" id="edit_"' +id + '>Edit</a></div>';
  var act_delete = '<div class="swipeout-actions-right">' + '<a href="#" class="swipeout-delete" id ="delete_"' + id +'>Delete</a></div></li>';

  var jquery = '<li class="swipeout">' + '<div class="swipeout-content item-content">' + ' <div class="list__item__center">' + item + 
  '</div> <div class="list__item__right"> <label class="switch">';

  jquery = jquery + input + input_end + act_edit + act_delete;

  return jquery;
}

var myApp = new Framework7();
 
var $$ = Dom7;
 
$$('.action1').on('click', function () {
  myApp.alert('Action 1');
});
$$('.action2').on('click', function () {
  myApp.alert('Action 2');
});  


var Alarm = function(name, hour, min, period, id){
  this.Name = name;
  this.Hour = hour;
  this.Min = min;
  this.period = period;
  this.on = true;
  this.id = id;
  this.inStack = false;
  this.tracker = 0;

  this.getName = function(){
    return this.Name;
  }

  this.getHour = function(){
    return this.Hour;
  }

  this.getMin = function(){
    return this.Min;
  }

  this.getPeriod = function(){
    return this.period;
  }

  this.getStatus = function() {
    //this.on = $("#" + id).checked;
    return this.on;
  }

  this.getId = function() {
    return this.id;
  }

  this.getStack = function() {
    return this.inStack;
  }

  this.getTracker = function() {
    return this.tracker;
  }

  this.changeStatus = function() {
    if (this.on == true) {
      this.on = false;
    } else {
      this.on = true;
    }
  }

  this.changeIn = function() {
    if (this.inStack == true) {
      this.inStack = false;
    } else {
      this.inStack = true;
    }
  }

  this.setTracker = function(tra) {
    this.tracker = tra;
  }
}   


var Model = function(){
  var that = this;
  this.allAlarm = [];

  //return the list of alarms
  this.get_Allalarm = function(){
    return this.allAlarm;
  }

  //get the index of alarm
  this.get_index = function(hour, min, period){

    for(var i = 0; i < this.allAlarm.length; i++){
      var alarm = this.allAlarm[i];

      if(alarm.getHour() == hour && alarm.getMin() == min && alarm.getPeriod() == period){
        return i;
      }
    }
    return -1;
  }

  this.get_index_by_id = function(id) {
    for(var i = 0; i < this.allAlarm.length; i++){
      alarm = this.allAlarm[i];

      if(alarm.getId() == id) {
        return i;
      }
    }
    return -1;
  }

   //add new alarm to model
  this.add_Alarm = function(alarm){
    this.allAlarm.push(alarm);
    this.notify();
  }

  //delete an item by item
  this.delete_Alarm = function(index){
    this.allAlarm.splice(index, 1);
    this.notify();
  }

  this.change_Alarm = function(id) {
    var i = this.get_index_by_id(id);
    this.allAlarm[i].changeStatus();
    $('#'+id).attr('checked', this.allAlarm[i].getStatus());
    this.notify();
  }


}


// Add observer functionality to model objects
    _.assignIn(Model.prototype, {
        // Add an observer to the list
        addObserver: function(observer) {
            if (_.isUndefined(this._observers)) {
                this._observers = [];   // _observers : list of functions
            }
            this._observers.push(observer);
            observer(this, null);
        },

        // Notify all the observers on the list
        notify: function(args) {
            if (_.isUndefined(this._observers)) {
                this._observers = [];
            }
            _.forEach(this._observers, function(obs) {  // execute this function on each element in _observers
                obs(this, args);
            });
        }
    });


var View = function(Model){
  var that = this;
  this.updateView = function(obs, args){
    var allAlarm = Model.get_Allalarm();
    $(".list").empty();
    for(var i = 0; i < allAlarm.length; i++){
      var alarm = allAlarm[i];

      var hour = alarm.getHour();
      var min = alarm.getMin();
      var period = alarm.getPeriod();
      var name = alarm.getName();
      var id = alarm.getId();

      var jquery = list_jquery(hour, min, period, name);
      $(".list").append(jquery);
      $('#'+id).attr('checked', alarm.getStatus());

  
    }
    $(".list").find(".switch__input").click(function() {
      var status = Model.change_Alarm(this.id);
    })

  }

  Model.addObserver(this.updateView);
}

function gameSuccess(game) {
  pauseAudio();
  $("#"+game).hide();
  $("#mainmenu").show();
}

/* type game */ 
function genSentence() {
  var ran = Math.floor(Math.random() * 10);
    switch (ran) {
      case 0:
        return "A";
      case 1:
        return "B";
      case 2:
        return "Y";
      case 3:
        return "P";
      case 4:
        return "S";
      case 5:
        return "T";
      case 6:
        return "C";
      case 7:
        return "D";
      case 8:
        return "O";
      case 9:
        return "W";
    }
  }

var trueSentence = genSentence();
document.getElementById("sentence").innerHTML = trueSentence;
function confirm() {
  var userSentence = document.getElementById('typeBar').value;
  if (userSentence == trueSentence) {
    gameSuccess("selectmenu");
    trueSentence = genSentence();
    document.getElementById("sentence").innerHTML = trueSentence;
  } else {
    alert("FAIL");
  }
  document.getElementById('typeBar').value = null;
}
/* type game the end */



// Play audio
function playAudio(src) {
  // Create Media object from src
  my_media = new Audio(src);
  if (typeof my_media.loop == 'boolean') {
      my_media.loop = true;
  } else {
      my_media.addEventListener('ended', function() {
          this.currentTime = 0;
          this.play();
      }, false);
  }
  my_media.play();
}

// Pause audio 
function pauseAudio() {
  if (my_media == null) {
      console.log("my_media is null");
  }
  my_media.pause();
}

function alarmAudio(hrs, mins, id, tracker) {
  var time = new Date();
  var currentHrs = time.getHours();
  var currentMin = time.getMinutes();
  if (hrs == currentHrs && mins == currentMin && time.getSeconds() == 0) {
    playAudio('Rooster.mp3');
    $("#selectmenu").show();
    $("#mainmenu").hide();
    $("#addmenu").hide();
    //$('#'+id).attr('checked', false);
  }
  tracker = setTimeout('alarmAudio('+hrs+', '+mins+', "'+id+'", '+tracker+')', 1000);
  return tracker;
}



var audioView = function(Model) {
  var that = this;

  this.updateView = function() {
    var all_alarm = Model.get_Allalarm();
    var len = all_alarm.length;
    for(var i = 0; i < all_alarm.length; i++) {
      var alarm = all_alarm[i];
      var alarmHrs = alarm.getHour();
      var alarmMins = alarm.getMin();
      var alarmId = alarm.getId();
      var tracker = alarm.getTracker();
      if (alarm.getPeriod() == "PM") {
        var numHrs = parseInt(alarmHrs)+12;
      }
      if (alarm.getStatus() == true && alarm.getStack() == false) {
        tracker = alarmAudio(numHrs, alarmMins, alarmId, tracker);
        alarm.setTracker(tracker);
        alarm.changeIn();
      }
      if (alarm.getStatus() == false && alarm.getStack() == true) {
        clearTimeout(tracker);
        tracker = 0;
        alarm.setTracker(tracker);

        
        alarm.changeIn();
      }
    }
  };

  Model.addObserver(this.updateView);

}

function startApp(){
  var m = new Model();


  $("#mainmenu").show();
  $("#addmenu").hide();
  $("#selectmenu").hide();


//button connect to the add alram menu
  $('#addbutton').click(function(){
      //console.log('add button clicked.');
      $("#mainmenu").hide();
      $("#addmenu").show();
      $("#selectmenu").hide();
  });



  $(".button--large--quiet").click(function(){
      console.log('set button clicked.');
      var hour = document.getElementById('choose-hour').value;
      var min = document.getElementById('choose-min').value;
      var period = document.getElementById('choose-time').value;
      var name = document.getElementById('alarmname').value;
      var id = hour + min + period;
      var alarm =new Alarm(name, hour, min, period, id);
      m.add_Alarm(alarm);

      $("#mainmenu").show();
      $("#addmenu").hide();

    });



  var main_view = new View(m);
  var sound_view = new audioView(m);
}




















