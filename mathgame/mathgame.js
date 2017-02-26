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
                    $("#btnstart").animate({
                                           height: 'toggle'
                                           });
                    
                
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


$(document).ready(function(){
                  $("button").click(function(){
                                    $("#btnstart").animate({
                                                     height: 'toggle'
                                                     });
                                    
                                    });
                  });
                                                     
                                                    
                  
