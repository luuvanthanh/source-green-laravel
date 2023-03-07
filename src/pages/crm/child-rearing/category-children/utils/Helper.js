import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatusSend = (type) => {
    if (type === variables.STATUS.POSTED) {
      return <Tag color="success">{variables.STATUS_NAME_SEND.POSTED}</Tag>;
    }
    return <Tag color="primary">{variables.STATUS_NAME_SEND.DRAFT}</Tag>;
  };
}
