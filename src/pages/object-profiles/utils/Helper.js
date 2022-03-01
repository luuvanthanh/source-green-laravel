import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.REGIST) {
      return <Tag color="primary">{variables.STATUS_NAME.REGIST}</Tag>;
    }
    if (type === variables.STATUS.REGISTED) {
      return <Tag color="danger">{variables.STATUS_NAME.REGISTED}</Tag>;
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
    if (type === variables.STATUS.DISTRIBUTED) {
      return <Tag color="yellow">{variables.STATUS_NAME.DISTRIBUTED}</Tag>;
    }
    if (type === variables.STATUS.OFFICAL) {
      return <Tag color="success">{variables.STATUS_NAME.OFFICAL}</Tag>;
    }
    if (type === variables.STATUS.WITHDRAW_APPLICATION) {
      return <Tag color="secondary">{variables.STATUS_NAME.WITHDRAW_APPLICATION}</Tag>;
    }
    if (type === variables.STATUS.STOP_STUDYING) {
      return <Tag color="primary">{variables.STATUS_NAME.STOP_STUDYING}</Tag>;
    }
    return <Tag color="primary">{variables.STATUS_NAME.REGIST}</Tag>;
  };

  static tagStatusAccount = (type) => {
    if (type === variables.STATUS.NO_IMAGE) {
      return <Tag color="primary">{variables.STATUS_NAME.NO_IMAGE}</Tag>;
    }
    if (type === variables.STATUS.HANDLING_IMAGE) {
      return <Tag color="primary">{variables.STATUS_NAME.HANDLING_IMAGE}</Tag>;
    }
    if (type === variables.STATUS.HANDLING_IMAGE_FAILED) {
      return <Tag color="danger">{variables.STATUS_NAME.HANDLING_IMAGE_FAILED}</Tag>;
    }
    if (type === variables.STATUS.HANDLING_IMAGE_SUCCESSFUL) {
      return <Tag color="success">{variables.STATUS_NAME.HANDLING_IMAGE_SUCCESSFUL}</Tag>;
    }
    if (type === variables.STATUS.DELETED) {
      return <Tag color="danger">{variables.STATUS_NAME.DELETED}</Tag>;
    }
    if (type === variables.STATUS.SYSTEM_ERROR) {
      return <Tag color="danger">{variables.STATUS_NAME.SYSTEM_ERROR}</Tag>;
    }
    return null;
  };
}
