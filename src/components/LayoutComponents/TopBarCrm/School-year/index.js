import { memo } from 'react';
import { useSelector } from 'dva';
import { isEmpty } from 'lodash';
import styles from './style.module.scss';

const Index = memo(() => {
  const [{ user }] = useSelector(({ user }) => [user]);

  return (
    <>
    {!isEmpty(user?.schoolYear?.id)  && (
      <div className={styles['wrapper-container']}>
       <h3 className={styles?.title}>Năm học: </h3>
       <h3 className={styles?.content}>{user?.schoolYear?.yearFrom} - {user?.schoolYear?.yearTo}</h3>
    </div>
    )}
    </>
  );
});

export default Index;
