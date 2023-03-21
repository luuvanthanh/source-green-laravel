import { memo } from 'react';
import stylesModule from './styles.module.scss';

const Index = memo(() => (
  <div className={stylesModule['wraper-container']}>
    <h3 className={stylesModule['wraper-text']}> Chương trình học thể chất</h3>
  </div>
));
export default Index;
