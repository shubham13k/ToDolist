exports.getDate=function (){
  var today= new Date();

    var currentDay= today.getDay();
    var day="";

    

    var options={
        weekday: "long",
        day: "numeric",
        month:"long"
    };
    return today.toLocaleDateString("en-US",options);
    
}

module.exports