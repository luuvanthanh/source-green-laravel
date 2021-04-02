import { isArray, pickBy, isEmpty, get as getLodash, toString, omit, size } from 'lodash';
import Tag from '@/components/CommonComponent/Tag';
import Text from '@/components/CommonComponent/Text';
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
    return <Tag color="danger">{variables.STATUS_NAME.VALID}</Tag>;
  };
}
