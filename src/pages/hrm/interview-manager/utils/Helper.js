import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.NOT_INTERVIEWED_YET) {
      return <Tag color="yellow">{variables.STATUS_NAME.NOT_INTERVIEWED_YET}</Tag>;
    }
    if (type === variables.STATUS.INTERVIEWED) {
      return <Tag color="blue">{variables.STATUS_NAME.INTERVIEWED}</Tag>;
    }
    if (type === variables.STATUS.NO_SALARY_APPROVAL) {
      return <Tag color="secondary">{variables.STATUS_NAME.NO_SALARY_APPROVAL}</Tag>;
    }
    if (type === variables.STATUS.DO_NOT_APPROVECANDIDATES) {
      return <Tag color="primary">{variables.STATUS_NAME.DO_NOT_APPROVECANDIDATES}</Tag>;
    }
    if (type === variables.STATUS.PENDING) {
      return <Tag color="danger">{variables.STATUS_NAME.PENDING}</Tag>;
    }
    return <Tag color="success">{variables.STATUS_NAME.APPROVED}</Tag>;
  };

}
