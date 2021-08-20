import Tag from '@/components/CommonComponent/Tag';
import moment from 'moment';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.NOT_RECEIVED) {
      return <Tag color="primary">{variables.STATUS_NAME.NOT_RECEIVED}</Tag>;
    }
    return <Tag color="success">{variables.STATUS_NAME.RECEIVED}</Tag>;
  };

  static tagStatusDrink = (type) => {
    if (type === variables.STATUS.NOT_DRINK) {
      return <Tag color="primary">{variables.STATUS_NAME.NOT_DRINK}</Tag>;
    }
    return <Tag color="success">{variables.STATUS_NAME.DRINK}</Tag>;
  };

  static getStartDate = (date, choose) => {
    if (date) {
      return moment(date);
    }
    return moment().startOf(choose || 'isoWeek');
  };

  static getEndDate = (date, choose) => {
    if (date) {
      return moment(date);
    }
    return moment().endOf(choose || 'isoWeek');
  };

  static getDayOfWeek = (date = 'Mon') => {
    const currentDate = date.toUpperCase();
    switch (currentDate) {
      case 'MON':
        return 'T2';
      case 'TUE':
        return 'T3';
      case 'WED':
        return 'T4';
      case 'THU':
        return 'T5';
      case 'FRI':
        return 'T6';
      case 'SAT':
        return 'T7';
      default:
        return 'CN';
    }
  };
}
