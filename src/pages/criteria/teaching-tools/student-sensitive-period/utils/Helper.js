import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.NOT_SEND) {
      return <Tag color="yellow">{variables.STATUS_NAME.NOT_SEND}</Tag>;
    }
    return <Tag color="success">{variables.STATUS_NAME.SEND}</Tag>;
  };
}
