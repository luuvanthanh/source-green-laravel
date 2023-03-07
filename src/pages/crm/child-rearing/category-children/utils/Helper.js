import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatusSend = (type) => {
    if (type) {
      return <Tag color="success">{variables.STATUS_NAME_SEND.SEND}</Tag>;
    }
    return <Tag color="yellow">{variables.STATUS_NAME_SEND.NOT_SEND}</Tag>;
  };
}
