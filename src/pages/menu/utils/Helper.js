import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.CONFIRMING) {
      return <Tag color="yellow">{variables.STATUS_NAME.CONFIRMING}</Tag>;
    }
    return <Tag color="success">{variables.STATUS_NAME.CONFIRMED}</Tag>;
  };
}
