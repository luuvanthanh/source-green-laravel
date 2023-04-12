import Tag from '@/components/CommonComponent/Tag';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.USING) {
      return <Tag color="primary">{variables.STATUS_NAME.USING}</Tag>;
    }
    return <Tag color="primary">{variables.STATUS_NAME.CLEARANCE}</Tag>;
  };

  static tagStatusRecruimentUser = (type) => {
    if (type === variables.STATUS_USER_RECRUIMENT.UNCONFIMRED) {
      return <Tag color="danger">{variables.STATUS_USER_RECRUIMENT_NAME.UNCONFIMRED}</Tag>;
    }
    if (type === variables.STATUS_USER_RECRUIMENT.NOT_ACHIEVED) {
      return <Tag color="sucsecs">{variables.STATUS_USER_RECRUIMENT_NAME.NOT_ACHIEVED}</Tag>;
    }
    return <Tag color="primary">{variables.STATUS_USER_RECRUIMENT_NAME.PASS}</Tag>;
  };
}
