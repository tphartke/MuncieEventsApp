export default class DateParser {

      extractTimeFromDate(dateTime){
        //time format is yyyy-mm-ddThh:mm:ss-04:00
        var date = String(dateTime).split("T");
        var times = date[1].split("-");
        var timeUnformatted = times[0].split(":");
        var hours = timeUnformatted[0];
        var minutes = timeUnformatted[1];
        var modifier = "am";
        if(hours > 12){
          hours -= 12;
          modifier = "pm";
        }
        hours = this.filterOutZeroPadding(hours);
        var finalTime = hours + ":" + minutes + modifier;
        return finalTime;
        }

      formatDate(date){
        //date formate is yyyy-mm-dd
        var dates = date.split("-");
        var year = dates[0];
        var day = this.formatDayNumber(dates[2]);
        var month = this.getShorthandMonthByNumber(dates[1]);
        return month + " " + day + ", " + year;
      }

      formatDayNumber(dayNumber){
        dayNumber = this.filterOutZeroPadding(dayNumber);
        var daySuffix = this.deriveDayNumberSuffix(dayNumber);
        const formattedDayNumber = dayNumber + daySuffix;
        return formattedDayNumber;
      }
   
      filterOutZeroPadding(dateOrTimeNumber) {
        if (String(dateOrTimeNumber).charAt(0) == "0") {
          dateOrTimeNumber = String(dateOrTimeNumber).substring(1);
        }
        return dateOrTimeNumber;
      }
    
      deriveDayNumberSuffix(dayNumber) {
        const lastDigitLocation = String(dayNumber).length - 1;
        const dayNumberLastDigit = String(dayNumber).charAt(lastDigitLocation);
        var daySuffix = "th";
        if((dayNumber != "11") & (dayNumber != "12") & (dayNumber != "13")){
          switch (dayNumberLastDigit) {
            case ("1"):
              daySuffix = "st";
              break;
            case ("2"):
              daySuffix = "nd";
              break;
            case ("3"):
              daySuffix = "rd";
              break;
          }
        }
        return daySuffix;
      }

      getShorthandMonthByNumber(month){
        switch(month){
          case("01"):
            return "Jan";
          case("02"):
            return "Feb";
          case("03"):
            return "Mar";
          case("04"):
            return "Apr";
          case("05"):
            return "May";
          case("06"):
            return "Jun";
          case("07"):
            return "Jul";
          case("08"):
            return "Aug";
          case("09"):
            return "Sep";
          case("10"):
            return "Oct"
          case("11"):
            return "Nov";
          case("12"):
            return "Dec";
        }
      }

      static navigationOptions = {
        drawerLabel: 'Home',
      };
}
