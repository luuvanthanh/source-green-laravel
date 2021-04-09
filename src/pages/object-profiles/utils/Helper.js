import { isArray, pickBy, isEmpty, get as getLodash, toString, omit, size } from 'lodash';
import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.REGIST) {
      return <Tag color="primary">{variables.STATUS_NAME.REGIST}</Tag>;
    }
    if (type === variables.STATUS.JOIN_CLASS) {
      return <Tag color="success">{variables.STATUS_NAME.JOIN_CLASS}</Tag>;
    }
    if (type === variables.STATUS.LEAVE_SCHOOL) {
      return <Tag color="danger">{variables.STATUS_NAME.LEAVE_SCHOOL}</Tag>;
    }
    return <Tag color="primary">{variables.STATUS_NAME.REGIST}</Tag>;
  };
}
