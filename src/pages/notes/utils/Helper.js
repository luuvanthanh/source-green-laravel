import { isArray, pickBy, isEmpty, get as getLodash, toString, omit, size } from 'lodash';
import Tag from '@/components/CommonComponent/Tag';
import Text from '@/components/CommonComponent/Text';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.CONFIRMING) {
      return <Tag color="yellow">{variables.STATUS_NAME.CONFIRMING}</Tag>;
    }
    if (type === variables.STATUS.CONFIRMED) {
      return <Tag color="success">{variables.STATUS_NAME.CONFIRMED}</Tag>;
    }
    return <Tag color="success">{variables.STATUS_NAME.CONFIRMED}</Tag>;
  };
}
