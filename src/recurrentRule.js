// import * as rrule from 'rrule';
import rrule from 'rrule';
const { rrulestr, RRuleSet } = rrule;


async function main() {
  
  function convertDateToGoogleCalendarFormat(dateInput) {
    // Format any date type to google recurring id suffix.
    // recurring_id has this format: 3c6feep8mkgejdbcvd2tr7gh3c_20240628T010000Z
    //
    // It will change date format
    // from: 2024-06-28T08:00:00+07:00
    // to: 20240628T010000Z
    //
    let date = new Date(dateInput);
    let year = date.getUTCFullYear();
    let month = ('0' + (date.getUTCMonth() + 1)).slice(-2); // Adding leading zero
    let day = ('0' + date.getUTCDate()).slice(-2);
    let hours = ('0' + date.getUTCHours()).slice(-2);
    let minutes = ('0' + date.getUTCMinutes()).slice(-2);
    let seconds = ('0' + date.getUTCSeconds()).slice(-2);

    let googleDatetime = `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
    return googleDatetime;
  }
  
  function generateRecurrentRuleDatetime(ruleString, start) {
    let dstart = `DTSTART:${convertDateToGoogleCalendarFormat(start)}\n`;
    let ruleObj = rrulestr(dstart + ruleString);
    let today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setMilliseconds(0);
    let oneDayLater = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
    let dates = ruleObj.between(today, oneDayLater);
    
    if (!dates.length) {
      return null;
    }
    
    console.log('Generated datetime: ', dates);
    
    let ruleDatetime = dates[0];
    // if (start) {
    //   ruleDatetime.setHours(start.getUTCHours());
    //   ruleDatetime.setMinutes(start.getUTCMinutes());
    //   ruleDatetime.setSeconds(0);
    //   ruleDatetime.setMilliseconds(0);
    // }
    return ruleDatetime;
  }
  
  function dateFromStringRecurrentRule(rule) {
    // Parse a RRule string, return a RRule object
    let ruleObj = rrulestr(rule);
    
    // let ruleSetter = new RRuleSet(ruleObj);
    // ruleSetter.dtstart(new Date('2024-07-08T01:00:00Z'));
    
    // let ruleObj = rrule.rrulestr(rule);
    // console.log(ruleObj);
    
    let today = new Date();
    let oneDayLater = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
    let oneWeekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    let dates = ruleObj.between(today, oneWeekLater);
    console.log(dates);
    
    return ruleObj;
  }
  
  // dateFromStringRecurrentRule('RRULE:FREQ=WEEKLY;BYDAY=FR,MO,TH,TU,WE;UNTIL=20240722T000000Z');
  generateRecurrentRuleDatetime('RRULE:FREQ=WEEKLY', new Date('2024-01-09T01:00:00Z'));
  
}


main();