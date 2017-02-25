

function alarmstate(name){
	console.log('switch button clicked', name);
}

function list_jquery(hour, min, period, name){

  var id = hour + min + period;
  var item = hour + ':' + min + ' ' + period + ' ' + name;
  var end = '<div class="switch__toggle"> <div class="switch__handle"></div> </div> </label> </div> </li>';

  var input = '<input type="checkbox" id=switch' + id + ' class="switch__input" checked>';

  var jquery = '<li class="list__item" id=' + id + '>' + '<div class="list__item__center">' + item + 
  '</div> <div class="list__item__right"> <label class="switch">';

  jquery = jquery + input + end;

  //console.log('jquery list ', jquery); 

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


var Alarm = function(name, hour, min, period){
  this.Name = name;
  this.Hour = hour;
  this.Min = min;
  this.period = period;

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

      $(".list").append(jquery);

      id ='switch' + hour + min + period;

      $(document).ready(function(){
        $('#'+id).click(function(){
          console.log('clicked ', id);
        });
      });

    }

  }

  Model.addObserver(this.updateView);
}

var addView = function(Model){
  this.updateView = function(obs, args){

    $(".button--large--quiet").click(function(){

        console.log('set button clicked.');

      var hour = document.getElementById('choose-hour').value;
      var min = document.getElementById('choose-min').value;
      var period = document.getElementById('choose-time').value;
      var name = document.getElementById('alarmname').value;

      var alarm = Alarm(name, hour, min, period);

      Model.add_Alarm(alarm);

      $("#mainmenu").show();
      $("#addmenu").hide();

    });


    $('#addbutton').click(function(){
      console.log('add button clicked.');

      $("#mainmenu").hide();
      $("#addmenu").show();
    });


  }
}


function startApp(){
  console.log('start app.');
  var m = new Model();


  $("#mainmenu").show();
  $("#addmenu").hide();
 

  $('#addbutton').click(function(){
      console.log('add button clicked.');

      $("#mainmenu").hide();
      $("#addmenu").show();
  });



  $(".button--large--quiet").click(function(){

      console.log('set button clicked.');

      var hour = document.getElementById('choose-hour').value;
      var min = document.getElementById('choose-min').value;
      var period = document.getElementById('choose-time').value;
      var name = document.getElementById('alarmname').value;
      var alarm =new Alarm(name, hour, min, period);

      m.add_Alarm(alarm);
      $("#mainmenu").show();
      $("#addmenu").hide();

    });

  var main_view = new View(m);
  //var add_view = new addView(m);
}




















