import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.NEW) {
      return <Tag color="yellow">{variables.STATUS_NAME.NEW}</Tag>;
    }
    if (type === variables.STATUS.IN_PROGRESS) {
      return <Tag color="success">{variables.STATUS_NAME.IN_PROGRESS}</Tag>;
    }
    if (type === variables.STATUS.VALIDATING) {
      return <Tag color="primary">{variables.STATUS_NAME.VALIDATING}</Tag>;
    }
    if (type === variables.STATUS.CLOSED) {
      return <Tag color="success">{variables.STATUS_NAME.CLOSED}</Tag>;
    }
    return <Tag color="danger">{variables.STATUS_NAME.CLOSED}</Tag>;
  };
}
