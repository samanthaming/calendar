

$( document ).ready(function() {

  /***************************
   * FUNCTIONS
   ***************************/

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
      return calendarContent.append('<div class="calendar-column current">' + counter + "</div>");
    } else {
      return calendarContent.append('<div class="calendar-column">' + counter + "</div>");
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
    $calendarContent.append('<div class="calendar-row">');
    for(var ir = 0; ir < 7; ir++ ){

      if(ir == day_index || counter > 0){
        counter++;
        $thisCalendarColumn($calendarContent, counter, thisMonth);
      }else{
        $notThisCalendarColumn($calendarContent, counter);
      }
    }
    $calendarContent.append('</div>');

    // Rest of the row
    while (counter < last_date) {
      $calendarContent.append('<div class="calendar-row">');
      for(var nr = 0; nr < 7; nr++ ){
        counter++;
        if(counter <= last_date){
          $thisCalendarColumn($calendarContent, counter, thisMonth);
        }else{
          $notThisCalendarColumn($calendarContent, counter);
        }
      }
      $calendarContent.append('</div>');
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

    calendarTitle(month, year);
    calendar(day_index, last_date, month);

    $('#next-month').on('click', function(e) {
      e.preventDefault();
      if(month < 11){
        month ++;
        day_index = dayIndex(month);
        last_date = lastDate(year, month);
        calendarTitle(month, year);
        calendar(day_index, last_date, month);
      }
    });

    $('#prev-month').on('click', function(e) {
      e.preventDefault();
      if(month > 0){
        month --;
        day_index = dayIndex(month);
        last_date = lastDate(year, month);
        calendarTitle(month, year);
        calendar(day_index, last_date, month);
      }
    });

});
