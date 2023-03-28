import { memo } from 'react';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => (
  <div className={styles['wraper-container-home']}>
    <h3 className={styles['wraper-text']}>Hồ sơ đối tượng</h3>
  </div>
));
export default Index;
