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
    if (type === variables.STATUS.STORE) {
      return <Tag color="yellow">{variables.STATUS_NAME.STORE}</Tag>;
    }
    return <Tag color="primary">{variables.STATUS_NAME.REGIST}</Tag>;
  };

  static tagStatusAccount = (type) => {
    if (type === variables.STATUS.NO_IMAGE || type === variables.STATUS.HANDLING_IMAGE_FAILED) {
      return <Tag color="yellow">{variables.STATUS_NAME.NO_IMAGE}</Tag>;
    }
    return <Tag color="success">Đã đăng ký</Tag>;
  };
}
