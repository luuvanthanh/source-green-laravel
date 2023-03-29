import { memo } from 'react';
import { Helmet } from 'react-helmet';

import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => (
  <>
    <Helmet title="Trang chờ" />
    <div className={styles['wraper-container-home']}>
      <h3 className={styles['wraper-text']}>Thời khóa biểu</h3>
    </div>
  </>
));
export default Index;
