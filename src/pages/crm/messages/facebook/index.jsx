import { memo } from 'react';
import { Helmet } from 'react-helmet';
import MenuLeft from './menuLeft';
import Main from './main';
import Right from './menuRight';

const Index = memo(() => {
  const marginProps = { style: { padding: 20 } };

  return (
    <div {...marginProps}>
      <Helmet title="facebook" />
      <div className="row">
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
  );
});

export default Index;
