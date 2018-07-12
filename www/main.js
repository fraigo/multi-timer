function pad(num, size) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}

window.addmsg=function(msg){
  var elem=document.createElement("PRE");
  elem.innerHTML=msg;
  document.body.appendChild(elem);
}
window.onerror=window.addmsg;

function playAudio(id) {
  if (window.Media){
    var audioElement = document.getElementById(id);
    var url = audioElement.getAttribute('src');
    var my_media = new window.Media("/android_asset/www/"+url,
      // success callback
      function () {  },
      // error callback
      function (err) { addmsg("playAudio():Audio Error: " + err); }
    );
      // Play audio
    my_media.play();
  }
  else{
    var audioElement = document.getElementById(id);
    audioElement.play();
  }
  
}

angular.module('app', [])
  .controller('controller', function($scope) {
    var app = this;
    var min=60;
    app.timers=[
      {time:7*min, current:0, saved:0, active:1, color: '#8F8'},
      {time:20*min, current:0, saved:0, color: '#FF8'},
      {time:7*min, current:0, saved:0, color: '#8F8'},
      {time:20*min, current:0, saved:0, color: '#FF8'},
      {time:7*min, current:0, saved:0, color: '#8F8'}
    ];
    app.currentTimer=0;
    app.start=function(index){
      var timer=app.timers[index];
      if (!timer.start){
        timer.start=new Date();
      }
      timer.proc=setTimeout(function(){
        if (timer.current<timer.time){
          timer.current=Math.round((new Date()-timer.start)/1000)+timer.saved;
          timer.currentMinutes=app.timeFormat(timer.current);
          timer.timeMinutes=app.timeFormat(timer.time);  
          $scope.$apply();
          app.start(index);
        }else{
          timer.finished=1;
          app.pause(index);
          app.ring(timer);
          $scope.$apply();
        }
      },1000);
    },
    app.pause=function(index){
      var timer=app.timers[index];
      timer.saved=timer.current;
      timer.start=0;
      clearTimeout(timer.proc);
      timer.proc=0;
    }
    app.width=function(timer){
      return Math.round(timer.current*100/timer.time)+"%";
    },
    app.timeFormat=function(seconds){
      var timeFormat=pad(Math.floor(seconds/60),2)+":"+pad(seconds%60,2);
      return timeFormat;
    },
    app.ring=function(timer){
      playAudio("alarm");
      timer.ringing=setTimeout(function(){
        app.ring(timer);
      },2000)    
    },
    app.stopRinging=function(index){
      var timer=app.timers[index];
      clearTimeout(timer.ringing);
      timer.ringing=0;
      timer.active=0;
      app.currentTimer++;
      app.timers[index+1].active=1;
    }
  })
