$( document ).ready(function() {

  /***************************
   * FUNCTIONS
   ***************************/

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

  function dayIndex(month){
    var first_day = new Date(GetMonthName(month) + ' ' + 1 + ' ' + year).toDateString().substring(0, 3);
    return day_name.indexOf(first_day);
  }

  function lastDate(year, month){
    return new Date(year, month + 1, 0).getDate();
  }

  function $thisCalendarColumn(calendarContent, counter, thisMonth){
    var d = new Date();
    var currentDate = d.getDate();
    var currentMonth = new Date().getMonth();
    var html = "";

    html += '<div class="calendar-column';
    if (counter == currentDate && currentMonth == thisMonth) {
      html += ' current';
    }
    html += '"';
    html += 'data-date="'+ counter +'" data-month="'+ thisMonth+'">';
    html +=  '<span>'+ counter +'</span>';
    html +=  '<div class="event-num"></div>';
    html +=  "</div>";

    return calendarContent.append(html);
  }

  function $notThisCalendarColumn(calendarContent, counter, month){
    return calendarContent.append('<div class="calendar-column calendar-column-muted" data-date="'+ counter +'" data-month="'+ month +'">' +
      '<span>'+ counter +'</span>' +
      '<div class="event-num"></div>' +
      "</div>");
  }

  function previousCounter(year, month, day_index){
    var prevMonth = month - 1;
    var prevLastDate = lastDate(year, prevMonth);
    return prevLastDate - day_index + 1;
  }

  function calendar_end(day_index, row){
    // default, show 6 weeks
    row = typeof row !== 'undefined' ? row : 6;
    return day_index === 0 ? 42 : row * 7 - 7;
  }

  function calendar(day_index, last_date, year, month){
    var counter = 0;
    var $calendarContent = $('.calendar-content');
    var prevCounter = previousCounter(year, month, day_index);
    var aheadCounter = 1;
    var end_loop = calendar_end(day_index);

    $calendarContent.html(""); // clear calendar

    // First row
    for(var ir = 0; ir < 7; ir++ ){

      if(ir == day_index || counter > 0){
        counter++;
        $thisCalendarColumn($calendarContent, counter, month);
      }else{
        $notThisCalendarColumn($calendarContent, prevCounter, month - 1);
        prevCounter++;
      }
    }

    // Rest of the row
    while (counter < end_loop ) {
      for(var nr = 0; nr < 7; nr++ ){
        counter++;
        if(counter <= last_date){
          $thisCalendarColumn($calendarContent, counter, month);
        }else{
          $notThisCalendarColumn($calendarContent, aheadCounter, month + 1);
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
    html += title;
    switch(type){
      case "Appointments":
        html += '<span class="event-type event-type-appt">';
        break;
      case "Tasks":
        html += '<span class="event-type event-type-task">';
        break;
      default:
        html += '<span class="event-type event-type-meet">';
    }
    html += type + '</span>';
    html += '<span class="remove-event">';
    html += '<i class="fa fa-times" aria-hidden="true"></i>';
    html += '</span>';
    html += '</li>';
    return html;
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
    calendar(day_index, last_date, year, month);

    $('#next-month').on('click', function(e) {
      e.preventDefault();
      if(month < 11){
        month ++;
        day_index = dayIndex(month);
        last_date = lastDate(year, month);
        $calendarTitle(month, year);
        calendar(day_index, last_date, year, month);
      }
    });

    $('#prev-month').on('click', function(e) {
      e.preventDefault();
      if(month > 0){
        month --;
        day_index = dayIndex(month);
        last_date = lastDate(year, month);
        $calendarTitle(month, year);
        calendar(day_index, last_date, year, month);
      }
    });

    $('.calendar-content').on('click', '.calendar-column', function(){
      var $this = $(this);
      var $createEvent = $('#create-event');
      var $eventList = $('.event-list');
      var date = $this.data('date');
      var month = $this.data("month");
      var current_events = _.where(events, {month: month, date: date});
      var html;

      $('#myModal').modal('show');

      $('.modal-title').html("Events for " + GetMonthName(month) + " " + date);
      $createEvent.find('input[name="month"]').val(month);
      $createEvent.find('input[name="date"]').val(date);

      $eventList.html('');
      for (var i = 0; i < current_events.length; i++) {
        html = $eventLine(current_events[i].title, current_events[i].type, current_events[i].id);
        $eventList.append(html);
      }
    });

    $('#create-event').on('submit', function(e) {
      e.preventDefault();
      $this = $(this);
      var title = $this.find('input[name="title"]').val();
      var date = $this.find('input[name="date"]').val();
      var month = $this.find('input[name="month"]').val();
      var type = $this.find('select[name="type"]').val();
      var thisEventNum = $('.calendar-column[data-date="' + date + '"]').find('.event-num');
      var currentNum = parseInt(thisEventNum.text()) || 0;
      var id = idGenerator();
      var formData = {
        id: id,
        month: parseInt(month),
        date: parseInt(date),
        type: type,
        title: title
      };

      events.push(formData); // add data to array
      $this.find('input[name="title"]').val(''); // clear form
      html = $eventLine(title, type, id);
      $('.event-list').append(html);

      thisEventNum.html('');
      thisEventNum.html('<span>' + (currentNum + 1) + pluralize(currentNum + 1, " event", " events") +'</span>');
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
    });

});
