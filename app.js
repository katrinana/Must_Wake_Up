


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

  var input = '<input type="checkbox" id='+ id + ' class="switch__input" checked>';
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


var Alarm = function(name, hour, min, period, id, game, music){
  this.Name = name;
  this.Hour = hour;
  this.Min = min;
  this.period = period;
  this.on = true;
  this.id = id;
  this.game = game;
  this.music = music;
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

  this.getGame = function() {
    return this.game;
  }

  this.getMusic = function() {
    return this.music;
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
      console.log("switch button click");
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


/* fake now */
function endgame(num) {
  if (num == 1) {
    gameSuccess("jump");
  } if (num == 2) {
    gameSuccess("photo");
  }
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


/* math game */

function randomFromTo(from, to){
    return Math.floor(Math.random() * (to - from + 1) + from);
}

Array.prototype.clean = function(deleteValue) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == deleteValue) {
            this.splice(i, 1);
            i--;
        }
    }
    return this;
};

var sum = 0;
var tempindex = 0;
var numbers = new Array();

function generateRandomSum() {
    var looprand    = randomFromTo(1, 3);
    var total       = 0;
    var arrayIndex  = new Array();
    
    if (looprand > numbers.length) {
        looprand = numbers.length;
    }
    
    for (j=0; j<looprand; j++) {
        var randindex = randomFromTo(0, numbers.length - 1);
        randindex = getUnique(randindex, arrayIndex);
        
        total = total + numbers[randindex];
        arrayIndex[j] = randindex;
    }
    sum = total;
    $("#nextsum").html("Next Total: " + total);
}

function getUnique(index, arrayIn) {
    if ((jQuery.inArray(index, arrayIn) == -1)) {
        return index;
    } else {
        rindex = randomFromTo(0, numbers.length - 1);
        return getUnique(rindex, arrayIn);
    }
}

var sumtemp = 0;
var numtemp = new Array();

// store temporary index in array
var arrIndex = new Array();
function boxClick(obj) {
    if (!$(obj).hasClass("disable")) {
        var clickedindex = parseInt($(obj).attr("id").replace("num", ""));
        var temp = parseInt($(obj).find("p").html());
        
        if (!$(obj).hasClass("red")) {
            $(obj).addClass("red clicked");
            // store clicked index in array
            arrIndex[tempindex] = clickedindex;
            sumtemp = sumtemp + temp;
            tempindex++;
            
            // temporary sum is match
            if (sumtemp == sum) {
                $(".clicked").unbind("click");
                $(".clicked").removeAttr("id");
                $(".clicked").addClass("disable");
                $(".clicked").animate({
                                      backgroundColor: "#e3e3e3",
                                      color: "#e3e3e3",
                                      borderColor: "#e3e3e3"
                                      }, 500, function() {
                                      $(".disable").removeClass("clicked");
                                      });
                
                // change each box id
                var y = 0;
                $("#dimcontainer div.boxnum").each(function(index) {
                                                   if (!$(this).hasClass("disable")) {
                                                   $(this).attr("id", "num"+y);
                                                   y++;
                                                   }
                                                   });
                
                // delete matched number
                for ( z = 0; z < arrIndex.length; z++) {
                    delete numbers[arrIndex[z]];
                }
                
                // delete temporay index
                for ( e = 0; e <= arrIndex.length; e++) {
                    delete arrIndex[e];
                }
                arrIndex.clean(undefined);
                numbers.clean(undefined);
                
                sum = 0;
                sumtemp = 0;
                // reset index
                tempindex = 0;
                
                generateRandomSum();
                
                // Game Finished
                if (numbers.length == 0) {
                    $("#nextsum").html("Thanks For Playing!");
                    alert("Time To Finish Your Work!");
                    gameSuccess("mathgame");
                    start();
                    
                    
                }
            }
            
            // temporary sum not match
            if (sumtemp > sum) {
                $("#dimcontainer").effect("shake", { times: 1 }, "fast", function() {
                                          sumtemp = 0;
                                          $(".boxnum").removeClass("red");
                                          $(".clicked").removeClass("clicked");
                                          $("#sum").html(sumtemp);
                                          
                                          // delete the temporary array & reset index
                                          numtemp = new Array();
                                          tempindex = 0;
                                          });
            }
        } else {
            $(obj).removeClass("red");
            $(obj).removeClass("clicked");
            
            // remove clicked index
            for (x = 0; x < arrIndex.length; x++) {
                if (arrIndex[x] == clickedindex) {
                    arrIndex.splice(x, 1);
                }
            }
            tempindex--;
            
            sumtemp = sumtemp - temp;
        }
    }
}



function start() {
    // create a number of box and generate random number in array
    sum          = 0;
    sumtemp      = 0;
    tempindex    = 0;
    var val          = 3;
    var boxloop      = val * val;
    var boxleft      = ($(window).width() - (val * 78)) / 2;
    $("#dimcontainer").html('<div id="boxclear"></div>');
    $("#dimcontainer").css({
                           width: (val * 78) + "px",
                           left: boxleft + "px"
                           });
    
    for ( i = 0; i < boxloop; i++) {
        numbers[i] = randomFromTo(1, 15);
        $('#boxclear').before('<div class="boxnum" id="num'+i+'" '+
                              ' onclick="boxClick(this);"><p>'+numbers[i]+'</p></div>');
    }
    generateRandomSum();
    
}





/* math game the end */













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


function alarmAudio(hrs, mins, id, game, music) {
  var time = new Date();
  var currentHrs = time.getHours();
  var currentMin = time.getMinutes();
  if (hrs == currentHrs && mins == currentMin && time.getSeconds() == 0) {
    if (music == 1) {
      playAudio('Rooster.mp3');
    } else if (music == 2) {
      playAudio('Alarm-tone.mp3');
    } else if (music == 3) {
      playAudio('Coo.mp3');
    } else if (music == 4) {
      playAudio('clock.mp3');
    }

    if (game == 1) {
      $("#selectmenu").show();
    } else if (game == 2) {
      $("#mathgame").show();
    } else if (game == 3) {
      $("#jump").show();
    } else if (game == 4) {
      $("#photo").show();
    }
    $("#mainmenu").hide();
    $("#addmenu").hide();
    //$('#'+id).attr('checked', false);
  }
  var tracker = setTimeout('alarmAudio('+hrs+', '+mins+', "'+id+'", '+game+', '+music+')', 1000);
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
      var game = alarm.getGame();
      var music = alarm.getMusic();
      //var tracker = alarm.getTracker();
      console.log("enter queue: " + alarmId);
      if (alarm.getPeriod() == "PM") {
        var numHrs = parseInt(alarmHrs)+12;
      }
      if (alarm.getStatus() == true && alarm.getStack() == false) {
        var tracker = alarmAudio(numHrs, alarmMins, alarmId, game, music);
        alarm.setTracker(tracker);
        alarm.changeIn();
      }
      if (alarm.getStatus() == false && alarm.getStack() == true) {
        console.log(alarmId+ "is going to stop and its tracker is " + alarm.getTracker());
        clearTimeout(alarm.getTracker());
        var newtracker = 0;
        alarm.setTracker(newtracker);
        console.log("after clearTimeout tracker is " + alarm.getTracker());

        
        alarm.changeIn();
      }
    }
  };

  Model.addObserver(this.updateView);

}

function startApp(){
  var m = new Model();

  $("#addmenu").hide();
  $("#selectmenu").hide();
  $("#mathgame").hide();
  $("#jump").hide();
  $("#photo").hide();
  $("#mainmenu").show();
  

//button connect to the add alram menu
  $('#addbutton').click(function(){

    document.getElementById('alarmname').value = null;

      //console.log('add button clicked.');
      $("#mainmenu").hide();
      $("#addmenu").show();
      $("#selectmenu").hide();
      $("#mathgame").hide();
      var time = new Date();
      var currentHrs = time.getHours();
      var currentMin = time.getMinutes();
      if (currentHrs > 12) {
        $("#choose-hour").val(currentHrs-12);
        $("#choose-time").val("PM");
      } else {
        $("#choose-hour").val(currentHrs);
        $("#choose-time").val("AM");
      }
      $("#choose-min").val(currentMin);
  });



  $("#setbutton").click(function(){
      console.log('set button clicked.');
      var hour = document.getElementById('choose-hour').value;
                                   //console.log(hour);
                                   //console.log(currentMin + " " + mins);
                             
      var min = document.getElementById('choose-min').value;
      var period = document.getElementById('choose-time').value;
      var name = document.getElementById('alarmname').value;
      var game = document.getElementById('choose-game').value;
      var music = document.getElementById('choose-music').value;
      var id = hour + min + period;
      var alarm =new Alarm(name, hour, min, period, id, game, music);
      m.add_Alarm(alarm);

      document.getElementById('alarmname').value = null;

      $("#mainmenu").show();
      $("#addmenu").hide();

    });

  $("#backbutton").click(function(){

    document.getElementById('alarmname').value = null;

    $("#mainmenu").show();
    $("#addmenu").hide();

  });



  var main_view = new View(m);
  var sound_view = new audioView(m);
}




















