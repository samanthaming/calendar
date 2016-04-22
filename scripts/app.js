
$( document ).ready(function() {


  /***************************
   * FUNCTIONS
   ***************************/

  function weatherCodeIcon(code){
    var html = '';
    html += '<i class="wi ';
    switch(code){
      case "11": // showers
        html += 'wi-rain';
        break;
      case "26": // cloudy
        html += 'wi-cloud';
        break;
      case "28": // mostly cloudy(day)
        html += 'wi-cloudy';
        break;
      case "30": // partly cloudy(day)
        html += 'wi-day-cloudy';
        break;
      case "32": // sunny
        html += 'wi-day-sunny';
        break;
      case "34": // mostly sunny
        html += 'wi-day-sunny-overcast';
        break;
      case "39": // scattered showers
        html += 'wi-showers';
        break;
      default:
        html += 'invisible';
    }
    html += '"></i>';
    return html;
  }

  function idGenerator() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  }

  function pluralize(number, singular, plural) {
    return number  === 1 ? singular : plural;
  }

  function GetMonthName(monthNumber) {
    var months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthNumber];
  }

  function getMonthNumber(monthName){
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.indexOf(monthName);
  }

  function dayIndex(month){
    var first_day = new Date(GetMonthName(month) + ' ' + 1 + ' ' + year).toDateString().substring(0, 3);
    return day_name.indexOf(first_day);
  }

  function lastDate(year, month){
    return new Date(year, month + 1, 0).getDate();
  }

  function $thisCalendarColumn(calendarContent, counter, month, events, year){
    var d = new Date();
    var currentDate = d.getDate();
    var currentMonth = d.getMonth();
    var currentYear = d.getFullYear();
    var html = "";

    var count = eventCount(events,month, counter);

    html += '<div class="calendar-column';
    if (counter == currentDate && currentMonth == month && currentYear == year) {
      html += ' current';
    }
    html += '"';
    html += 'data-year="'+ year +'" data-date="'+ counter +'" data-month="'+ month+'">';
    html += '<span>'+ counter +'</span>';
    html += '<div class="event-num">';

    if(eventCount > 0){
      html += "3";
    }
    html +=  '</div>';
    html += '<div class="weather"></div>';
    html +=  '</div>';

    return calendarContent.append(html);
  }

  function $notThisCalendarColumn(calendarContent, counter, month, year){
    return calendarContent.append('<div class="calendar-column calendar-column-muted" data-year="'+ year +'" data-date="'+ counter +'" data-month="'+ month +'">' +
      '<span>'+ counter +'</span>' +
      '<div class="event-num"></div>' +
      '<div class="weather"></div>' +
      "</div>");
  }

  function previousCounter(year, month, day_index){
    var prevMonth = month - 1;
    var prevLastDate = lastDate(year, prevMonth);
    return prevLastDate - day_index + 1;
  }

  function calendarEnd(day_index, row){
    // default, show 6 weeks
    row = typeof row !== 'undefined' ? row : 6;
    return day_index === 0 ? 42 : row * 7 - 7;
  }

  function calendar(day_index, last_date, year, month, events){
    var counter = 0;
    var $calendarContent = $('.calendar-content');
    var prevCounter = previousCounter(year, month, day_index);
    var aheadCounter = 1;
    var end_loop = calendarEnd(day_index);

    $calendarContent.html(""); // clear calendar

    // First row
    for(var ir = 0; ir < 7; ir++ ){

      if(ir == day_index || counter > 0){
        counter++;
        $thisCalendarColumn($calendarContent, counter, month, events, year);
      }else{
        $notThisCalendarColumn($calendarContent, prevCounter, month - 1, year);
        prevCounter++;
      }
    }

    // Rest of the row
    while (counter < end_loop ) {
      for(var nr = 0; nr < 7; nr++ ){
        counter++;
        if(counter <= last_date){
          $thisCalendarColumn($calendarContent, counter, month, events, year);
        }else{
          $notThisCalendarColumn($calendarContent, aheadCounter, month + 1, year);
          aheadCounter++;
        }
      }
    }
  }

  function $calendarTitle(month, year){
    $('.calendar-header-title').html(GetMonthName(month) + " " + year);
  }

  function $eventLine(title, type, id){
    html = '<li data-id="'+ id +'">';
    switch(type){
      case "Appointment":
        html += '<span class="event-type event-type-appt">';
        break;
      case "Task":
        html += '<span class="event-type event-type-task">';
        break;
      default:
        html += '<span class="event-type event-type-meet">';
    }
    html += type + '</span>';
    html += title;
    html += '<span class="remove-event">';
    html += '<i class="fa fa-trash-o" aria-hidden="true"></i>';
    html += '</span>';
    html += '</li>';
    return html;
  }

  function eventCount(events, month, date, year){
    return _.where(events, {month: parseInt(month), date: parseInt(date), year: parseInt(year)}).length;
  }

  function addEventCount(){
    // Loop through calendar-content
    var month, date, count;
    $('.calendar-content').find('.calendar-column').each(function(index, element) {
      $this = $(this);
      month = $this.data('month');
      date  = $this.data('date');
      year  = $this.data('year');
      count = eventCount(events, month, date, year);
      if (count > 0) {
        $this.find('.event-num').html('<span>'+
          count +
          pluralize(count, ' event', ' events') +
          '</span');
      }else{
        $this.find('.event-num').html('');
      }
    });
  }

  function addWeather(){
    // Loop through the weather api
    $.getJSON( "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%3D9807%20&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function( data ) {
      var forecasts = data.query.results.channel.item.forecast;
      var forecastDate, forecastMonth, forecastYear, weatherIcon;

      for (var i = 0; i < forecasts.length; i++) {
        forecastDate = parseInt(forecasts[i].date.slice(0,2), 10);
        forecastMonth = getMonthNumber(forecasts[i].date.slice(3,6));
        forecastYear = parseInt(forecasts[i].date.slice(6,11));
        weatherIcon = weatherCodeIcon(forecasts[i].code);

        $('[data-date="'+forecastDate+'"][data-month="'+forecastMonth+'"][data-year="'+forecastYear+'"]').find('.weather').html(forecasts[i].text +'<span>'+ weatherIcon + '</span>');
      }

    });
  }

  function loadCalendarHeader(month, year){
    day_index = dayIndex(month);
    last_date = lastDate(year, month);
    $calendarTitle(month, year);
    calendar(day_index, last_date, year, month);

    addEventCount();
    addWeather();
  }
  /***************************
   * VARIABLES
   ***************************/

    var day_name = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();
    var day_index = dayIndex(month);
    var last_date = lastDate(year, month);
    var events = [];

    /***************************
     * EVENTS
     ***************************/

    $calendarTitle(month, year);
    calendar(day_index, last_date, year, month, events);
    addWeather();

    $('#next-month').on('click', function(e) {
      e.preventDefault();

      if(month < 11){
        month ++;
      }else{
        month = 0;
        year ++;
      }

      loadCalendarHeader(month, year);
    });

    $('#prev-month').on('click', function(e) {
      e.preventDefault();

      if(month > 0){
        month --;
      }else{
        month = 11;
        year --;
      }

      loadCalendarHeader(month, year);
    });


    $('.calendar-content').on('click', '.calendar-column', function(){
      var $this = $(this);
      var $createEvent = $('#create-event');
      var $eventList = $('.event-list');
      var date = $this.data('date');
      var month = $this.data("month");
      var year = $this.data("year");
      var current_events = _.where(events, {month: month, date: date, year: year});
      var html;

      $('#myModal').modal('show');

      $('.modal-title').html("Events for " + GetMonthName(month) + " " + date + ", " + year);
      $createEvent.find('input[name="month"]').val(month);
      $createEvent.find('input[name="date"]').val(date);
      $createEvent.find('input[name="year"]').val(year);

      $eventList.html('');
      for (var i = 0; i < current_events.length; i++) {
        html = $eventLine(current_events[i].title, current_events[i].type, current_events[i].id);
        $eventList.prepend(html); // descending order, newest at top
      }

    });

    $('#create-event').on('submit', function(e) {
      e.preventDefault();
      $this = $(this);
      var title = $this.find('input[name="title"]').val();
      var date = $this.find('input[name="date"]').val();
      var month = $this.find('input[name="month"]').val();
      var year = $this.find('input[name="year"]').val();
      var type = $this.find('select[name="type"]').val();
      var thisEventNum = $('.calendar-column[data-date="' + date + '"]').find('.event-num');
      var currentNum = parseInt(thisEventNum.text()) || 0;
      var id = idGenerator();
      var formData = {
        id: id,
        month: parseInt(month),
        date: parseInt(date),
        year: parseInt(year),
        type: type,
        title: title
      };

      events.push(formData); // add data to array
      $this.find('input[name="title"]').val(''); // clear form
      html = $eventLine(title, type, id);
      $('.event-list').prepend(html);

      addEventCount();
    });

    // Remove Event
    $('.event-list').on('click', '.remove-event',function() {
        var $this = $(this);
        var parent = $this.parent();
        var id = parent.data('id');

        parent.fadeOut('300', function() {
          $(this).remove();
        });

        events = _.without(events, _.findWhere(events, {id: id})); // remove event

        addEventCount();
    });
});
