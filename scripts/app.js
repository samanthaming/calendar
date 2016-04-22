



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

    if (counter == currentDate && currentMonth == thisMonth) {
      return calendarContent.append('<div class="calendar-column current" data-month="' +
        thisMonth + '">' +
        counter +
        "</div>");
    } else {
      return calendarContent.append('<div class="calendar-column" data-date="'+counter+'" data-month="'+ thisMonth+'">' +
        '<span>'+ counter +'</span>' +
        '<div class="event-num"></div>' +
        "</div>");
    }
  }

  function $notThisCalendarColumn(calendarContent, counter){
    return calendarContent.append('<div class="calendar-column">' + '<span class="invisible">0</span>' + "</div>");
  }

  function calendar(day_index, last_date, thisMonth){
    var counter = 0;
    var $calendarContent = $('.calendar-content');

    // clear calendar
    $calendarContent.html("");

    // First row
    for(var ir = 0; ir < 7; ir++ ){

      if(ir == day_index || counter > 0){
        counter++;
        $thisCalendarColumn($calendarContent, counter, thisMonth);
      }else{
        $notThisCalendarColumn($calendarContent, counter);
      }
    }

    // Rest of the row
    while (counter < last_date) {
      for(var nr = 0; nr < 7; nr++ ){
        counter++;
        if(counter <= last_date){
          $thisCalendarColumn($calendarContent, counter, thisMonth);
        }else{
          $notThisCalendarColumn($calendarContent, counter);
        }
      }
    }
  }

  function calendarTitle(month, year){
    $('.calendar-header-title').html(GetMonthName(month) + " " + year);
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

    calendarTitle(month, year);
    calendar(day_index, last_date, month, events);

    $('#next-month').on('click', function(e) {
      e.preventDefault();
      if(month < 11){
        month ++;
        day_index = dayIndex(month);
        last_date = lastDate(year, month);
        calendarTitle(month, year);
        calendar(day_index, last_date, month, events);
      }
    });

    $('#prev-month').on('click', function(e) {
      e.preventDefault();
      if(month > 0){
        month --;
        day_index = dayIndex(month);
        last_date = lastDate(year, month);
        calendarTitle(month, year);
        calendar(day_index, last_date, month, events);
      }
    });

    $('.calendar-content').on('click', '.calendar-column', function(){
      var $this = $(this);
      var $createEvent = $('#create-event');
      var $eventList = $('.event-list');
      var date = $this.data('date');
      var month = $this.data("month");
      var current_events = _.where(events, {month: month, date: date});

      $('#myModal').modal('show');

      $createEvent.find('input[name="month"]').val(month);
      $createEvent.find('input[name="date"]').val(date);

      $eventList.html('');
      for (var i = 0; i < current_events.length; i++) {
        $eventList.append('<li>'+current_events[i].title+'</li>');
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

      var formData = {
        id: idGenerator(),
        month: parseInt(month),
        date: parseInt(date),
        type: type,
        title: title
      };

      events.push(formData); // add data to array
      $this.find('input[name="title"]').val(''); // clear form
      $('.event-list').append('<li>'+title+'</li>');

      // Update calendar to show event count
      thisEventNum.html('');
      thisEventNum.html('<span>' + (currentNum + 1) + pluralize(currentNum + 1, " event", " events") +'</span>');
    });
});
