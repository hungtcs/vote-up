import moment from 'moment';

export class DateUtil {
  public static pattern: string = 'YYYY-MM-DD HH:mm:ss';

  public static format(value: Date, format: string = DateUtil.pattern): string | null {
    if(value === null || value === undefined) {
      return null;
    }
    return moment(value).format(format);
  }

  public static parse(value: Date|string, format: string = DateUtil.pattern): Date | null {
    if(value === null || value === undefined) {
      return null;
    }
    if(value instanceof Date) {
      return value;
    }
    if(typeof(value) === 'string' && value.length > 0) {
      return moment(value, format).toDate();
    }
    return null;
  }

}
