import { memo } from 'react';
import { useDispatch, useSelector } from 'dva';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { isEmpty } from 'lodash';
import MenuLeft from './menuLeft';
import Main from './main';
import Right from './menuRight';
import styles from './styles.module.scss';

const Index = memo(() => {
  const dispatch = useDispatch();
  const { userCRM } = useSelector(({ userCRM }) => ({ userCRM }));

  const responseFacebook = (response) => {
    console.log('response', response);
    dispatch({
      type: 'userCRM/GET_USER',
      payload: response,
    });
  };

  return (
    <div className="p20">
      <Helmet title="facebook" />
      <div className={classnames('row', styles.wrapper)}>
        {isEmpty(userCRM) && (
          <div className={styles['wrapper-login']}>
            <FacebookLogin
              appId={APP_ID_FB}
              autoLoad={false}
              fields="name,email,picture,birthday"
              scope="public_profile,pages_show_list,pages_manage_metadata, pages_manage_posts, pages_read_engagement, pages_read_user_content, pages_manage_engagement, pages_messaging"
              callback={responseFacebook}
              render={(renderProps) => (
                <button
                  onClick={renderProps.onClick}
                  type="button"
                  className={styles['button-login']}
                >
                  Login FB
                </button>
              )}
            />
          </div>
        )}
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
