import { Injectable } from '@angular/core';
import { camelCase } from 'lodash';
@Injectable({
  providedIn: 'root'
})

export class UtilitiesService {

  public camelizeKeys = (obj) => {
    //console.log('teestttt');
    if (Array.isArray(obj)) {
      return obj.map(v => this.camelizeKeys(v));
    } else if (obj !== null && obj.constructor === Object) {
      return Object.keys(obj).reduce(
        (result, key) => ({
          ...result,
          // [camelCase(key)]: this.camelizeKeys(obj[key]),
          [key.charAt(0).toLowerCase() + key.substring(1)]: this.camelizeKeys(obj[key]),
        }),
        {},
      );
    }
    return obj;
  }

  public calculateAge = (birthday: Date) => {
    let age = 0;
    if (birthday) {
      const timeDiff = Math.abs(Date.now() - new Date(birthday).getTime());
      // so 26 years and 140 days would be considered as 26, not 27.
      age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    } else {
      age = 0;
    }
    return age;
  }

  public checkDateIsGreaterThanToday = (dateToCheck: Date) => {
    const today = new Date();

    if (dateToCheck > today) {
      return true;
    } else {
      return false;
    }
  }

  public getDateRange = (range: string) => {
    switch (range) {
      case 'LastYear':
        return this.lastYear(new Date());
      case 'LastMonth':
        return this.lastMonth(new Date());
      case 'LastWeek':
        return this.lastWeek(new Date());
      case 'ThisYear':
        return this.thisYear(new Date());
      case 'ThisMonth':
        return this.thisMonth(new Date());
      case 'ThisWeek':
        return this.thisWeek(new Date());
      case 'Today':
        return this.today();
      case 'All':
        return null;
    }
  }

  public thisYear = (date: Date): DateRange => {
    const range: DateRange = {
      start: null,
      end: null
    };
    range.start = new Date(date.getFullYear(), 0, 1);   // month index
    range.end = new Date(date.getFullYear(), 11, 31);

    return range;
  }

  public thisMonth = (date: Date): DateRange => {
    const range: DateRange = {
      start: null,
      end: null
    };
    range.start = new Date(date.getFullYear(), date.getMonth(), 1);
    range.end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return range;
  }

  public thisWeek = (date: Date): DateRange => {
    const range: DateRange = {
      start: null,
      end: null
    };
    range.start = new Date(date.setDate(date.getDate() - date.getDay()));
    range.end = new Date(date.setDate(date.getDate() - date.getDay() + 6));

    return range;
  }

  public lastYear = (date: Date): DateRange => {
    const range: DateRange = {
      start: null,
      end: null
    };
    range.start = new Date(date.getFullYear() - 1, 0, 1);
    range.end = new Date(date.getFullYear() - 1, 11, 31);

    return range;
  }

  public lastMonth = (date: Date): DateRange => {
    const range: DateRange = {
      start: null,
      end: null
    };
    range.start = new Date(date.getFullYear(), date.getMonth() - 1, 1);
    range.end = new Date(date.getFullYear(), date.getMonth() - 1 + 1, 0);

    return range;
  }

  public lastWeek = (date: Date): DateRange => {
    const range: DateRange = {
      start: null,
      end: null
    };
    const currentWeek = date.getDate() - date.getDay();
    range.start = new Date(date.setDate(currentWeek - 7)); // new Date(date.setDate(date.getDate() - 7));
    range.end = new Date(date.setDate(date.getDate() - date.getDay() + 6));

    return range;
  }

  public today = (): DateRange => {
    const range: DateRange = {
      start: null,
      end: null
    };
    range.start = new Date();
    range.end = new Date();

    return range;
  }

  public allRange = (): DateRange => {
    const range: DateRange = {
      start: null,
      end: null
    };
    return range;
  }

}

interface DateRange {
  start: Date;
  end: Date;
}
