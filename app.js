


function list_jquery(hour, min, period, name){

  var id = hour + min + period;
  var item = hour + ':' + min + ' ' + period + ' ' + name;
  var end = '<div class="switch__toggle"> <div class="switch__handle"></div> </div> </label> </div> </li>';

  var input = '<input type="checkbox" id="'+ id + '" class="switch__input" checked>';

  var jquery = '<li class="list__item" id="alarm' + id + '"><div class="list__item__center">' + item + 
  '</div> <div class="list__item__right"> <label class="switch">';

  jquery = jquery + input + end;

  return jquery;
}



function gettime() {
  var h = document.getElementById('choose-hour').value;
  var m = document.getElementById('choose-min').value;
  var zone = document.getElementById('choose-time').value;
  var name = document.getElementById('alarmname').value;

  console.log('hour is', h);
  console.log('min is', m);
  console.log("AM PM is ", zone);
  console.log("alarm name is ", name);

  var output = list_jquery(h, m, zone, name);

  console.log('jquery is : ', output);


}


var Alarm = function(name, hour, min, period, id){
  this.Name = name;
  this.Hour = hour;
  this.Min = min;
  this.period = period;
  this.on = true;
  this.id = id;

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
    return this.on;
  }

  this.getId = function() {
    return this.id;
  }

  this.changeStatus = function() {
    if (this.on == true) {
      this.on = false;
    } else {
      this.on = true;
    }
    console.log("status changes to "+ this.on);
  }
}   


var Model = function(){
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
    var alarm;
    for(var i = 0; i < this.allAlarm.length; i++){
      alarm = this.allAlarm[i];

      if(alarm.getId == id) break;
    }
    alarm.changeStatus();
    //this.notify();
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

      var jquery = list_jquery(hour, min, period, name);

      //console.log(jquery);

      $(".list").append(jquery);

  
    }
    $(".list").find(".switch__input").click(function() {
      console.log(this.id + "switched !!!!");
      Model.change_Alarm(this.id);
    })

  }

  Model.addObserver(this.updateView);
}


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

function alarmAudio(hrs, mins) {
  var time = new Date();
  var currentHrs = time.getHours();
  var currentMin = time.getMinutes();
  //console.log("set "+ hrs + " " + mins);
  if (hrs == currentHrs && mins == currentMin && time.getSeconds() == 0) {
    playAudio('Rooster.mp3');
    console.log("set "+ hrs + " " + mins);
    $("#selectmenu").show();
    $("#mainmenu").hide();
    $("#addmenu").hide();
    return true;
  }
  setTimeout("alarmAudio("+hrs+", "+mins+")", 1000);
}

/*function playAlarmSound(Model) {
  var all_alarm = Model.get_Allalarm();
  for(var i = 0; i < all_alarm.length; i++) {
    console.log("enter playAlarmSound " + i);
    var alarm = all_alarm[i];
    var alarmHrs = alarm.getHour();
    var alarmMins = alarm.getMin();
    if (alarm.getPeriod() == "PM") {
      console.log("pm");
      alarmHrs+=12;
    }
    if (alarm.getStatus == false) continue;
    alarmAudio(alarmHrs, alarmMins);
  }
}*/


/* type game */ 
function genSentence() {
  var ran = Math.floor(Math.random() * 10);
    switch (ran) {
      case 0:
        return "A little progress each day adds up to big results";
      case 1:
        return "Be the best version of you";
      case 2:
        return "You have to fight though the bad days to earn the best days";
      case 3:
        return "Push harder than yesterday if you want a different tomorrow";
      case 4:
        return "Stay positive work hard and make it happen";
      case 5:
        return "The struggle you're in today is developing the strength you need for tomorrow";
      case 6:
        return "There is no elevator to success. You have to take the stairs";
      case 7:
        return "Stop saying I wish and start saying I will";
      case 8:
        return "Once you control you mind you can conquer your body";
      case 9:
        return "When you feel like fiving up, think about why you started";
    }
  }

var trueSentence = genSentence();
document.getElementById("sentence").innerHTML = trueSentence;  

function confirm() {
  var userSentence = document.getElementById('typeBar').value;
  if (userSentence == trueSentence) {
    pauseAudio();
    $("#selectmenu").hide();
    $("#mainmenu").show();
  } else {
    document.getElementById("result").innerHTML = "FAIL";
  }
}
/* type game the end */

var audioView = function(Model) {
  /*this.playAudio = function(src) {
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
  };

  this.pauseAudio = function() {
    if (my_media == null) {
        console.log("my_media is null");
    }
    my_media.pause();
  };*/

  /*this.alarmAudio = function(hrs, mins) {
    var time = new Date();
    var currentHrs = time.getHours();
    var currentMin = time.getMinutes();
    //console.log("current "+ currentHrs + " " + currentMin);
    if (hrs == currentHrs && mins == currentMin && time.getSeconds() == 0) {
      alter("time out ~~~");
      playAudio('Rooster.mp3');
    }
    setTimeout("this.alarmAudio("+hrs+", "+mins+")", 1000);
  };*/

  this.updateView = function() {
    console.log("enter playAlarmSound ");
    var all_alarm = Model.get_Allalarm();
    for(var i = 0; i < all_alarm.length; i++) {
      console.log("enter playAlarmSound " + i);
      var alarm = all_alarm[i];
      var alarmHrs = alarm.getHour();
      var alarmMins = alarm.getMin();
      if (alarm.getPeriod() == "PM") {
        console.log("pm");
        var numHrs = parseInt(alarmHrs)+12;
      }
      if (alarm.getStatus == false) continue;
      var bool = alarmAudio(numHrs, alarmMins, alarm);
      if (bool == true) {
        Model.change_Alarm(alarm.getId());
      }
    }
  };

  Model.addObserver(this.updateView);

}

function startApp(){
  //console.log('start app.');
  var m = new Model();


  $("#mainmenu").show();
  $("#addmenu").hide();
  $("#selectmenu").hide();

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


      /*console.log("name ", name);
      console.log("hour ", hour);
      console.log("min ", min);
      console.log("period ", period);
      console.log("id ", id);*/


      var alarm =new Alarm(name, hour, min, period, id);

      /*console.log("name ", alarm.getName());
      console.log("hour ", alarm.getHour());
      console.log("min ", alarm.getMin());
      console.log("period ", alarm.getPeriod());*/




      m.add_Alarm(alarm);

      $("#mainmenu").show();
      $("#addmenu").hide();

    });



  var main_view = new View(m);
  var sound_view = new audioView(m);
}




















