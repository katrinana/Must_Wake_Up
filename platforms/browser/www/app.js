


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

var myApp = new Framework7();

var $$ = Dom7;

var pickerInline = myApp.picker({
    input: '#picker-date',
    container: '#picker-date-container',
    toolbar: false,
    rotateEffect: true,

 
    formatValue: function (p, values, displayValues) {
        //console.log("hour is" + values[0]);
        //console.log("Minutes is" + values[1]);
        //console.log("day period is " + values[2]);
        var timevalue = document.getElementById('picker-date').value;

        //console.log("value is " + timevalue)
        return values[0] + ' : ' + values[1] + ' ' + values[2];

    },
 
    cols: [
        // Space divider
        {
            divider: true,
            content: '  '
        },
        // Hours
        {
            values: (function () {
                var arr = [];
                for (var i = 1; i <= 12; i++) { arr.push(i); }
                return arr;
            })(),
        },
        // Divider
        {
            divider: true,
            content: ':'
        },
        // Minutes
        {
            values: (function () {
                var arr = [];
                for (var i = 0; i <= 59; i++) { arr.push(i < 10 ? '0' + i : i); }
                return arr;
            })(),
        },
        // day period
        {
            values: (function (){
                var arr = [];
                arr.push("AM");
                arr.push("PM");
                return arr;


            })(),
        }
    ]
});
 
/*$$('.action1').on('click', function () {
  myApp.alert('Action 1');
});
$$('.action2').on('click', function () {
  myApp.alert('Action 2');
}); */

function list_jquery(hour, min, period, name){

  var id = hour + min + period;
  var item = hour + ':' + min + ' ' + period + ' ' + name;
  var input_end = '<div class="switch__toggle"> <div class="switch__handle"></div> </div> </label> </div>';

  var input = '<input type="checkbox" id='+ id + ' class="switch__input" checked>';
  var act_edit   = '<div class="swipeout-actions-left">' + '<a href="#" class="action2" id="edit_"' +id + '>Edit</a></div>';
  var act_delete = '<div class="swipeout-actions-right" id=' + 'sldelete_' + id +'>' + '<a href="#" class="swipeout-delete" id ="delete_"' + id +'>Delete</a></div></li>';

  var jquery = '<li class="swipeout">' + '<div class="swipeout-content item-content">' + ' <div class="list__item__center">' + item + 
  '</div> <div class="list__item__right" id=' + 'sl' + id  + '> <label class="switch">';

  jquery = jquery + input + input_end + act_edit + act_delete;

  return jquery;
}




var Alarm = function(name, hour, min, period, id, game, music){
  this.Name = name;
  this.Hour = hour;
  this.Min = min;
  this.period = period;
  this.on = true;
  this.id = id;
  this.game = game;
  this.musicID = music;
  if (music == 1) {
    this.music = new Audio('Rooster.mp3');
  } else if (music == 2) {
    this.music = new Audio('Alarm-tone.mp3');
  } else if (music == 3) {
    this.music = new Audio('Coo.mp3');
  } else if (music == 4) {
    this.music = new Audio('clock.mp3');
  }
  //this.music = music;

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

  this.getMusicID = function() {
    return this.musicID;
  }

  this.changeStatus = function() {
    if (this.on == true) {
      this.on = false;
    } else {
      this.on = true;
    }
  }
}

/* save data in database */
var db;

var addStore = function(alarm) {
  console.log("addStore db");
  console.log(db.transaction(['alarmStore'], 'readwrite'));
  console.log(db.transaction(['alarmStore'], 'readwrite').objectStore('alarmStore'));
  var objectStore = db.transaction(['alarmStore'], 'readwrite').objectStore('alarmStore');
  var newAlarm = [{id: alarm.getId(), Name:alarm.getName(), Hour:alarm.getHour(), 
    Min:alarm.getMin(), period:alarm.getPeriod(), on: alarm.getStatus(), 
    game: alarm.getGame(), music: alarm.getMusicID()}];
  objectStore.add(newAlarm[0]);
  
}

var deleteStore = function(id) {
  var removeRequest = db.transaction('alarmStore', 'readwrite')
                        .objectStore('alarmStore').delete(id);
}   

var updateStore = function(id) {
  var objectStore = db.transaction(["alarmStore"], "readwrite").objectStore("alarmStore");
  var request = objectStore.get(id);
  request.onerror = function(event) {
    // Handle errors!
  };
  request.onsuccess = function(event) {
    // Get the old value that we want to update
    var data = event.target.result;
    
    // update the value(s) in the object that you want to change
    if (data.on == true) {
      data.on = false;
    } else {
      data.on = true;
    }
  
    // Put this updated object back into the database.
    var requestUpdate = objectStore.put(data);
  };
}


var Model = function(){
  var that = this;
  this.allAlarm = [];
  var tracker = 0;

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
    var id = alarm.getId();

    if(this.get_index_by_id(id) == -1){
      this.allAlarm.push(alarm);
      addStore(alarm);  // save to database
      this.notify();
    }else{
      console.log("alarm already exist!!");
    }
  }

  //delete an item by item
  this.delete_Alarm = function(id){
    deleteStore(id);
    var index = this.get_index_by_id(id);
    this.allAlarm.splice(index, 1);
  }

  this.change_Alarm = function(id) {
    var i = this.get_index_by_id(id);
    this.allAlarm[i].changeStatus();
    updateStore(id);

    $('#'+id).attr('checked', this.allAlarm[i].getStatus());

    this.notify();
  }

  this.get_Tracker = function() {
    return this.tracker;
  }

  this.set_Tracker = function(tra) {
    this.tracker = tra;
  }

  this.restoreDB = function() {
    var that = this;
    console.log(db);
    var objectStore = db.transaction('alarmStore').objectStore('alarmStore');
    objectStore.openCursor().onsuccess = function(event) {
      var cursor = event.target.result;
      if (cursor) {
        var newAlarm = new Alarm(cursor.value.Name, cursor.value.Hour,
                       cursor.value.Min, cursor.value.period, cursor.value.id, 
                       cursor.value.game, cursor.value.music);
        if (cursor.value.on == false) {
          newAlarm.changeStatus();
        }
        that.allAlarm.push(newAlarm);
        cursor.continue();
      }
      else {
        console.log("Got all customers: " + this.allAlarm); 
        that.notify();
      }
    };
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

    $(".list").find(".list__item__right").click(function() {
      console.log("s witch button click" + this.id);
      var newid = this.id.substring(2);
      //console.log("new id is " + newid);
      Model.change_Alarm(newid);
    })

    $(".list").find(".swipeout-actions-right").click(function() {
      console.log("delete button click" + this.id);
      var newid = this.id.substring(9);
      console.log("new id is " + newid);
      Model.delete_Alarm(newid);
    })

  }

  Model.addObserver(this.updateView);
}

function gameSuccess(game, music, id) {
  pauseAudio(music);
  $("#"+game).hide();
  $("#mainmenu").show();
  $('#'+id).attr('checked', false);
}

function gameDemoSuccess(game) {
  $("#"+game).hide();
  $("#mainmenu").show();
}


/* type game */ 

var typeGameEnd = false;
function genSentence() {
	return "haha";
  /*var ran = Math.floor(Math.random() * 10);
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
        return "Once you control your mind you can conquer your body";
      case 9:
        return "When you feel like fiving up, think about why you started";
    }*/
  }

var trueSentence = genSentence();
document.getElementById("sentence").innerHTML = trueSentence;
function confirm() {
  console.log("click confirm");
  var userSentence = document.getElementById('typeBar').value;
  if (userSentence == trueSentence) {
    typeGameEnd = true;
  } 
}

function typeStart(music, id) {
  var typeID = setInterval(function() {
    if (typeGameEnd == true) {
      clearInterval(typeID);
      gameSuccess("selectmenu", music, id);
      trueSentence = genSentence();
      document.getElementById("sentence").innerHTML = trueSentence;
      document.getElementById('typeBar').value = null;
      typeGameEnd = false;
    } else {
      confirm();
    }
  }, 1000);
}

function typeDemoStart() {
  var typeID = setInterval(function() {
    if (typeGameEnd == true) {
      clearInterval(typeID);
      gameDemoSuccess("selectmenu");
      trueSentence = genSentence();
      document.getElementById("sentence").innerHTML = trueSentence;
      document.getElementById('typeBar').value = null;
      typeGameEnd = false;
    } else {
      confirm();
    }
  }, 1000);
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
var MathGameEnd = 0;
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
                    MathGameEnd = 1;
                    //$("#nextsum").html("Thanks For Playing!");
                    //alert("Time To Finish Your Work!");
                    
                    
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



function mathGameStart(music, id) {
    // create a number of box and generate random number in array
    MathGameEnd = 0;
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

    var mathid = setInterval(function() {
      console.log("mathgame loop");
      if (MathGameEnd == 1) {
        gameSuccess("mathgame", music, id);
        clearInterval(mathid);
      }
    }, 1000);
    
}

function mathGameDemoStart() {
    // create a number of box and generate random number in array
    MathGameEnd = 0;
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

    var mathid = setInterval(function() {
      console.log("mathgame loop");
      if (MathGameEnd == 1) {
        gameDemoSuccess("mathgame");
        clearInterval(mathid);
      }
    }, 1000);
    
}

/* math game the end */

/* scan QR game */
var record_file;

function recordQR() {
    cordova.plugins.barcodeScanner.scan(
          function (result) {
              record_file = result.text;
          },
          function (error) {
              alert("Scanning failed: " + error);
          },
          {
              preferFrontCamera : false, // iOS and Android
              showFlipCameraButton : true, // iOS and Android
              showTorchButton : true, // iOS and Android
              torchOn: false, // Android, launch with the torch switched on (if available)
              prompt : "Place a barcode inside the scan area", // Android
              resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
              formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
              orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
              disableAnimations : true, // iOS
              disableSuccessBeep: false // iOS
          }
       );
}


function playQR(music, alarmId) {
    cordova.plugins.barcodeScanner.scan(
              function (result) {
                  if (result.text == record_file) {
                    alert("Game Pass, Time Wake Up");
                    gameSuccess("scanQR", music, alarmId);
                  } else {
                    alert("O O Not this One");
                    playQR(music, alarmId);
                  }
              },
              function (error) {
                  alert("Scanning failed: " + error);
              },
              {
                  preferFrontCamera : false, // iOS and Android
                  showFlipCameraButton : true, // iOS and Android
                  showTorchButton : true, // iOS and Android
                  torchOn: false, // Android, launch with the torch switched on (if available)
                  prompt : "Place a barcode inside the scan area", // Android
                  resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                  formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                  orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                  disableAnimations : true, // iOS
                  disableSuccessBeep: false // iOS
              }
           );
}

function demoplayQR() {
    cordova.plugins.barcodeScanner.scan(
              function (result) {
                  if (result.text == record_file) {
                    alert("Game Pass, Time Wake Up");
                    gameDemoSuccess("scanQR");
                  } else {
                    alert("O O Not this One");
                    playQR(music, alarmId);
                  }
              },
              function (error) {
                  alert("Scanning failed: " + error);
              },
              {
                  preferFrontCamera : false, // iOS and Android
                  showFlipCameraButton : true, // iOS and Android
                  showTorchButton : true, // iOS and Android
                  torchOn: false, // Android, launch with the torch switched on (if available)
                  prompt : "Place a barcode inside the scan area", // Android
                  resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                  formats : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                  orientation : "portrait", // Android only (portrait|landscape), default unset so it rotates with the device
                  disableAnimations : true, // iOS
                  disableSuccessBeep: false // iOS
              }
           );
}

/* scan QR */


/* jump game */
var jumpBotton=document.getElementById("jump-botton");
var flag=false,num=0;
var yy=new mobilePhoneShake({
  speed:9000,
  callback:function(x,y,z){
    num++;
    jumpBotton.querySelector("em").innerHTML=num;
    if (num == 10) {
      yy.stop();
      flag=true;
      document.getElementById("jump-info").innerHTML="Jump Done";
    }
  },
    onchange:function(x,y,z){
    //document.getElementById("msg").innerHTML="x:"+x+"<br>y:"+y+"<br>z:"+z;
  }
});

function jumpStart(music, alarmId) {
  flag=false;
  var jumpid = setInterval(function() {
      console.log("jump loop");
      if (flag == true) {
        gameSuccess("jump", music, alarmId);
        clearInterval(jumpid);
      }
    }, 1000);
  jumpBotton.onclick=function(){
    var j=this;
    j.innerHTML="Jump Complete：<em>0</em>"
    num=0;
    yy.start();
  }
}

/* jump game end */






//var my_media;
// Play audio
function playAudio(my_media) {
  // Create Media object from src
  //my_media = new Audio(src);
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
function pauseAudio(my_media) {
  if (my_media == null) {
      console.log("my_media is null");
  }
  my_media.pause();
}


function alarmAudio(alarmList) {
  var time = new Date();
  var currentHrs = time.getHours();
  var currentMin = time.getMinutes();
  for(var i = 0; i < alarmList.length; i++) {
    var alarm = alarmList[i];
    if (alarm.getStatus() == false) continue;
    var alarmHrs = alarm.getHour();
    var alarmMins = alarm.getMin();
    var alarmId = alarm.getId();
    var game = alarm.getGame();
    var music = alarm.getMusic();
    var alarmName = alarm.getName();
    var numHrs;
    if (alarm.getPeriod() == "PM" && alarmHrs != 12) {
      numHrs = parseInt(alarmHrs)+12;
    } else if (alarm.getPeriod() == "AM" && alarmHrs == 12) {
      numHrs = parseInt(alarmHrs)-12;
    } else {
      numHrs = parseInt(alarmHrs);
    }
    if (currentHrs == numHrs && currentMin == alarmMins && time.getSeconds() == 0) {
      console.log("enter ringing"+alarmId);
      document.addEventListener("deviceready", onDeviceReady, false);
      function onDeviceReady() {
        //console.log(navigator.notification);
        function onConfirm(buttonIndex) {
            //alert('You selected button ' + buttonIndex);
            playAudio(music);
            if (game == 1) {
              //typeStart(music);
              typeStart(music, alarmId);
              $("#selectmenu").show();              
            } else if (game == 2) {
              mathGameStart(music, alarmId);
              $("#mathgame").show();
            } else if (game == 3) {
              jumpStart(music, alarmId);
              $("#jump").show();
            } else if (game == 4) {
              playQR(music, alarmId);
              $("#scanQR").show();
            }
            $("#mainmenu").hide();
            $("#addmenu").hide();
        }
        
        navigator.notification.confirm(
            alarmName, // message
             onConfirm,            // callback to invoke with index of button pressed
            'Must Wake Up',           // title
            ['Yes! I am ready!']     // buttonLabels
        );
        navigator.notification.beep(2);
      }
      /*playAudio(music);
      if (game == 1) {
        //typeStart(music);
        typeStart(music, alarmId);
        $("#selectmenu").show();              
      } else if (game == 2) {
        mathGameStart(music, alarmId);
        $("#mathgame").show();
      } else if (game == 3) {
        jumpStart(music, alarmId);
        $("#jump").show();
      } else if (game == 4) {
        playQR(music, alarmId);
        $("#scanQR").show();
      }
      $("#mainmenu").hide();
      //$("#addmenu").hide();*/

    }
  }
  
}




var audioView = function(Model) {
  var that = this;

  this.updateView = function() {
    var all_alarm = Model.get_Allalarm();
    var len = all_alarm.length;
    var tracker = Model.get_Tracker();
    console.log("before clear is " + tracker);
    clearInterval(tracker);
    if (all_alarm.length!=0) {
      tracker = setInterval(function() {
        alarmAudio(all_alarm);
      }, 1000);
      console.log("after set is " + tracker);
      Model.set_Tracker(tracker);
    }
  };

  Model.addObserver(this.updateView);

}

window.onload = function(){
  var m = new Model();
  var skin = "white";
  window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
  // DON'T use "var indexedDB = ..." if you're not in a function.
  // Moreover, you may need references to some window.IDB* objects:
  window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
  window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
  var databaseName = 'alarmDB';
  var databaseVersion = 1;
  //indexedDB.deleteDatabase(databaseName);
  var openRequest = window.indexedDB.open(databaseName, databaseVersion);
  openRequest.onerror = function (event) {
      console.log(openRequest.errorCode);
  };
  openRequest.onsuccess = function (event) {
      // Database is open and initialized - we're good to proceed.
      db = openRequest.result;
      console.log("open db success");
      m.restoreDB();
      //return db;
  };
  openRequest.onupgradeneeded = function (event) {
      // This is either a newly created database, or a new version number
      // has been submitted to the open() call.
      db = event.target.result;
      console.log("upgrad db");
      db.onerror = function () {
          console.log(db.errorCode);
      };
  
      // Create an object store and indexes. A key is a data value used to organize
      // and retrieve values in the object store. The keyPath option identifies where
      // the key is stored. If a key path is specified, the store can only contain
      // JavaScript objects, and each object stored must have a property with the
      // same name as the key path (unless the autoIncrement option is true).
      var store = db.createObjectStore('alarmStore', { keyPath: 'id' });
  
      // Define the indexes we want to use. Objects we add to the store don't need
      // to contain these properties, but they will only appear in the specified
      // index of they do.
      //
      // syntax: store.createIndex(indexName, keyPath[, parameters]);
      //
      // All these values could have duplicates, so set unique to false
      store.createIndex('Name', 'Name', { unique: false });
      store.createIndex('Hour', 'Hour', { unique: false });
      store.createIndex('Min', 'Min', { unique: false });
      store.createIndex('period', 'period', { unique: false });
      store.createIndex('on', 'on', { unique: false });
      store.createIndex('game', 'game', { unique: false });
      store.createIndex('music', 'music', { unique: false });
      console.log("db upgrad");
  
  
  };

  $("#newtimepicker").hide();
  $("#selectmenu").hide();
  $("#mathgame").hide();
  $("#jump").hide();
  $("#scanQR").hide();
  $("#mainmenu").show();

  

//button connect to the add alram menu
  $('#addbutton').click(function(){
    document.getElementById('alarmname').value = null;

  console.log('add button clicked.');

      $("#newtimepicker").show();
      pickerInline.open();
      $("#selectmenu").hide();
      $("#mathgame").hide();
      $("#jump").hide();
      $("#scanQR").hide();
      $("#mainmenu").hide();
  });


  // game Demo 

  $('#typegameDemo').click(function() {
    typeDemoStart();
    $("#selectmenu").show();
  });

  $('#mathgameDemo').click(function() {
    mathGameDemoStart();
    $("#mathgame").show();
  });

  $('#shakegameDemo').click(function() {
    shakeDemoStart();
    $("#jump").show();
  });

  $('#scangameDemo').click(function() {
    recordQR();
    alert("QR code saved! Please scan next one!")
    demoplayQR();
    $("#scanQR").show();
  });




  $("#setbutton").click(function(){
      console.log('set button clicked.');
      var timevalue = document.getElementById('picker-date').value;
      var hour, min, period;

      //set hour, min and period
      if(timevalue.length == 9){
        hour = timevalue.substring(0,1);
        min = timevalue.substring(4,6);
        period = timevalue.substring(7);

      }else{
        hour = timevalue.substring(0,2);
        min = timevalue.substring(5,7);
        period = timevalue.substring(8);
      }

      console.log("hour is " + hour + " min is " + min + " period is " + period);

      var name = document.getElementById('alarmname').value;
      var game = document.getElementById('choose-game').value;
      var music = document.getElementById('choose-music').value;

      var id = hour + min + period;
      var alarm =new Alarm(name, hour, min, period, id, game, music);
      m.add_Alarm(alarm);

      if (game == 4) {
        recordQR();
      }

      document.getElementById('alarmname').value = null;

      $("#mainmenu").show();
      $("#newtimepicker").hide();

    });


  $("#backbutton").click(function(){

    document.getElementById('alarmname').value = null;

    $("#mainmenu").show();
    $("#newtimepicker").hide();

  });

  $("#changeskin").click(function(){
    console.log("skin change button clicked");

    if(skin == "dark"){
      document.getElementById('bodyitself').className = 'layout-white';
      document.getElementById("onsencss").href="lib/onsen/css/onsenui.css";
      document.getElementById("onsencomp").href="lib/onsen/css/onsen-css-components.css";
      skin ="white";
    }else{
      document.getElementById('bodyitself').className = 'layout-dark';
      document.getElementById("onsencss").href="lib/onsen2/css/onsenui.css";
      document.getElementById("onsencomp").href="lib/onsen2/css/onsen-css-components.css";
      skin ="dark";

    }



  });



  var main_view = new View(m);
  var sound_view = new audioView(m);
}




















