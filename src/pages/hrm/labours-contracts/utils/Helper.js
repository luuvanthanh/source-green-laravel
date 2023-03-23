import Tag from '@/components/CommonComponent/Tag';
import { Badge } from 'antd';
import { variables } from './variables';

export default class Helpers {
  static tagStatus = (type) => {
    if (type === variables.STATUS.DA_HET_HAN) {
      return <Tag color="danger">{variables.STATUS_NAME.DA_HET_HAN}</Tag>;
    }
    if (type === variables.STATUS.GAN_HET_HAN) {
      return (
        <Tag color="yellow">
          <Badge status="error" />
          {variables.STATUS_NAME.GAN_HET_HAN}
        </Tag>
      );
    }
    if (type === variables.STATUS.CHUA_DEN_HAN) {
      return <Tag color="yellow">{variables.STATUS_NAME.CHUA_DEN_HAN}</Tag>;
    }
    return <Tag color="success">{variables.STATUS_NAME.DANG_HIEU_LUC}</Tag>;
  };
}
