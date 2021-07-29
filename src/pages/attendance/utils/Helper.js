import { toNumber } from 'lodash';
import Tag from '@/components/CommonComponent/Tag';
import moment from 'moment';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.PENDING) {
      return <Tag color="yellow">{variables.STATUS_NAME.PENDING}</Tag>;
    }
    if (type === variables.STATUS.VERIFIED) {
      return <Tag color="success">{variables.STATUS_NAME.VERIFIED}</Tag>;
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
    if (type === variables.STATUS.CANCEL) {
      return <Tag color="danger">{variables.STATUS_NAME.CANCEL}</Tag>;
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

  static getDateSearch = (date, type = 'startDate') => {
    if (date) {
      return moment(date);
    }
    return type === 'startDate' ? moment.utc().local().startOf('month') : moment.utc().local().endOf('month');
  }

  static getDayOfWeek = (date = 0) => {
    switch (toNumber(date)) {
      case 1:
        return 'T2';
      case 2:
        return 'T3';
      case 3:
        return 'T4';
      case 4:
        return 'T5';
      case 5:
        return 'T6';
      case 6:
        return 'T7';
      default:
        return 'CN';
    }
  };
}
