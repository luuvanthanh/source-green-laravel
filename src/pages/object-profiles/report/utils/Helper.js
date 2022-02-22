import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.REGISTED ) {
      return <Tag color="yellow">{variables.STATUS_NAME.REGISTED }</Tag>;
    }
    if (type === variables.STATUS.DISTRIBUTED ) {
      return <Tag color="success">{variables.STATUS_NAME.DISTRIBUTED }</Tag>;
    }
    if (type === variables.STATUS.OFFICAL ) {
      return <Tag color="primary">{variables.STATUS_NAME.OFFICAL }</Tag>;
    }
    if (type === variables.STATUS.WITHDRAW_APPLICATION ) {
      return <Tag color="danger">{variables.STATUS_NAME.WITHDRAW_APPLICATION }</Tag>;
    }
    if (type === variables.STATUS.STOP_STUDYING ) {
      return <Tag color="danger">{variables.STATUS_NAME.STOP_STUDYING }</Tag>;
    }
    return <Tag color="success">{variables.STATUS_NAME.VERIFIED}</Tag>;
  };

}