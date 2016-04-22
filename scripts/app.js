


$( document ).ready(function() {

    function GetMonthName(monthNumber) {
      var months = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
      return months[monthNumber];
    }


    var day_name = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];


    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth();


    function dayIndex(month){
        var first_day = new Date(GetMonthName(month) + ' ' + 1 + ' ' + year).toDateString().substring(0, 3);
        return day_name.indexOf(first_day);
    }

    function lastDate(year, month){
      return new Date(year, month + 1, 0).getDate();
    }


    // var first_day = firs tDay(month);
    var day_index = dayIndex(month);
    var last_date = lastDate(year, month);

    // Header

    $('.calendar-header-title').html(GetMonthName(month) + " " + year);

    $('#next-month').on('click', function(e) {
      e.preventDefault();
      if(month < 11){
        month ++;
        day_index = dayIndex(month);
        last_date = lastDate(year, month);
        console.log(day_index);
        $('.calendar-header-title').html(GetMonthName(month) + " " + year);
        calendar(day_index, last_date);
      }
    });

    $('#prev-month').on('click', function(e) {
      e.preventDefault();
      if(month > 0){
        month --;
        day_index = dayIndex(month);
        last_date = lastDate(year, month);
        console.log(day_index);
        $('.calendar-header-title').html(GetMonthName(month) + " " + year);
        calendar(day_index, last_date);
      }
    });


    // Days

    function calendar(day_index, last_date){
      var counter = 0;
      var $calendarContent = $('.calendar-content');

      // clear calendar
      $calendarContent.html("");

      $calendarContent.append('<div class="calendar-row">');
      for(var i = 0; i < 7; i++ ){

        if(i == day_index || counter > 0){
          counter++;
          $calendarContent.append('<div class="calendar-column">' + counter + "</div>");

        }else{
          $calendarContent.append('<div class="calendar-column">' + counter + "</div>");
        }
      }
      $calendarContent.append('</div>');

      // Rest of the row
      while (counter < last_date) {
        $calendarContent.append('<div class="calendar-row">');
        for(var nr = 0; nr < 7; nr++ ){
          counter++;
          $calendarContent.append('<div class="calendar-column">' + counter + "</div>");
        }
        $calendarContent.append('</div>');
      }
    }

    calendar(day_index, last_date);



});
