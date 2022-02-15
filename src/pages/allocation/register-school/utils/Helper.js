import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.DOES_NOT_SOLVE) {
      return <Tag color="yellow">{variables.STATUS_NAME.DOES_NOT_SOLVE}</Tag>;
    }
    if (type === variables.STATUS.NOT) {
      return <Tag color="danger">{variables.STATUS_NAME.NOT}</Tag>;
    }
    return <Tag color="success">{variables.STATUS_NAME.SOLVE}</Tag>;
  };
}
