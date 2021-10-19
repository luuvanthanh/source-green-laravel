import moment from 'moment';
import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.COMING_EVENTS) {
      return <Tag color="yellow">{variables.STATUS_NAME.COMING_EVENTS}</Tag>;
    }
    if (type === variables.STATUS.PAST_EVENTS) {
      return <Tag color="success">{variables.STATUS_NAME.PAST_EVENTS}</Tag>;
    }
    if (type === variables.STATUS.PENDING) {
      return <Tag color="primary">{variables.STATUS_NAME.PENDING}</Tag>;
    }
    if (type === variables.STATUS.EXPIRE) {
      return <Tag color="danger">{variables.STATUS_NAME.EXPIRE}</Tag>;
    }
    if (type === variables.STATUS.VALID) {
      return <Tag color="danger">{variables.STATUS_NAME.VALID}</Tag>;
    }
    return <Tag color="success">{variables.STATUS_NAME.VERIFIED}</Tag>;
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
