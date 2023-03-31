import { memo } from 'react';
import { Helmet } from 'react-helmet';
import styles from '@/assets/styles/Common/common.scss';

const Index = memo(() => (
  <>
    <Helmet title="Trang chờ" />
    <div className={styles['wraper-container-home']}>
      <div className={styles.block}>
        <div className={styles.item}>
          <img className={styles.img} src="/images/webForm.png" alt="bmi" />
        </div>
        <p className={styles.note}>vui lòng chọn menu bên trái</p>
      </div>
    </div>
  </>
));
export default Index;
