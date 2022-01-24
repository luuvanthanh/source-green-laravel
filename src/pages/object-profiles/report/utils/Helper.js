import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.NOT_APPLY) {
      return <Tag color="yellow">{variables.STATUS_NAME.NOT_APPLY}</Tag>;
    }
    if (type === variables.STATUS.APPLY) {
      return <Tag color="success">{variables.STATUS_NAME.APPLY}</Tag>;
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

}