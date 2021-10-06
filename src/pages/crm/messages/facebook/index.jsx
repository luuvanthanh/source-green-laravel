import { memo } from 'react';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import MenuLeft from './menuLeft';
import Main from './main';
import Right from './menuRight';
import styles from './styles.module.scss';

const Index = memo(() => (
  <div className="p20">
    <Helmet title="facebook" />
    <div className={classnames('row', styles.wrapper)}>
      <div className="col-lg-3 pl10 pr10">
        <MenuLeft />
      </div>
      <div className="col-lg-6  pl10 pr10">
        <Main />
      </div>
      <div className="col-lg-3  pl10 pr10">
        <Right />
      </div>
    </div>
  </div>
));

export default Index;
