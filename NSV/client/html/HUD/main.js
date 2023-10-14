var healthbar = new ProgressBar.Circle(health, {
    strokeWidth: 6,
    easing: 'easeInOut',
    duration: 1400,
    color: '#c842f5',
    trailColor: '#eee',
    trailWidth: 1,
    text: {
        value:'&#10084;',
        alignToBottom: false
    },
    svgStyle: null
  });
  
  healthbar.animate(1.0);

  var protectbar = new ProgressBar.Circle(protect, {
    strokeWidth: 6,
    easing: 'easeInOut',
    duration: 1400,
    color: '#c842f5',
    trailColor: '#eee',
    trailWidth: 1,
    text: {
        value:'&#10012;',
        alignToBottom: false
    },
    svgStyle: null
  });
  
  protectbar.animate(1.0);

  var foodbar = new ProgressBar.Circle(food, {
    strokeWidth: 6,
    easing: 'easeInOut',
    duration: 1400,
    color: '#c842f5',
    trailColor: '#eee',
    trailWidth: 1,
    text: {
        value:'&#127860;',
        alignToBottom: false
    },
    svgStyle: null
  });
  
  foodbar.animate(1.0);

  var drinkbar = new ProgressBar.Circle(drink, {
    strokeWidth: 6,
    easing: 'easeInOut',
    duration: 1400,
    color: '#c842f5',
    trailColor: '#eee',
    trailWidth: 1,
    text: {
        value:'&#129380;',
        alignToBottom: false
    },
    svgStyle: null
  });
  
  drinkbar.animate(1.0);


function uhr() {
var Jetzt = new Date();
var Tag = Jetzt.getDate();
var Monat = Jetzt.getMonth() + 1;
var Jahr = Jetzt.getFullYear();
var Stunden = Jetzt.getHours();
var Minuten = Jetzt.getMinutes();
var Sekunden = Jetzt.getSeconds();
var NachVollMinute = ((Minuten < 10) ? ":0" : ":");
document.getElementById("time1").innerHTML= Stunden + NachVollMinute + Minuten;
}
window.setInterval("uhr()", 5000)
  



if ('alt' in window) {
  alt.on('SetHealth', v => healthbar.animate(v / 100))
  alt.on('SetArmour', v => protectbar.animate(v / 100))
  alt.on('SetHunger', v => foodbar.animate(v / 100))
  alt.on('SetThirst', v => drinkbar.animate(v / 100))
}