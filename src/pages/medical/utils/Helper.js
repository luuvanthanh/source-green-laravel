import { isArray, pickBy, isEmpty, get as getLodash, toString, omit, size } from 'lodash';
import Tag from '@/components/CommonComponent/Tag';
import Text from '@/components/CommonComponent/Text';
import { variables } from './variables';
import moment from 'moment';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.PENDING) {
      return <Tag color="primary">{variables.STATUS_NAME.PENDING}</Tag>;
    }
    return <Tag color="success">{variables.STATUS_NAME.PROCESSED}</Tag>;
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
