import { memo, useEffect, useState, useRef } from 'react';
import classnames from 'classnames';
import { useDispatch, useSelector } from 'dva';
import { isEmpty } from 'lodash';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import styles from './style.module.scss';

const Index = memo(() => {
  const dispatch = useDispatch();
  const [{ user }] = useSelector(({ crmFBDevV1, loading: { effects } }) => [crmFBDevV1, effects]);

  const [pageCurrent, setPageCurrent] = useState([]);
  const [page, setPage] = useState([]);
  const [pageID, setPageID] = useState([]);
  const [userToken, setUserToken] = useState(undefined);

  const [getToken, setGetToket] = useState(undefined);


  const responseFacebook = (response) => {
    if (response.userID) {
      dispatch({
        type: 'crmFBDevV1/GET_USER',
        payload: response,
      });
    }
  };

  //

  const hours = 20;
  const now = new Date().getTime();
  const setupTime = localStorage.getItem('setupTimeCRM');

  if (now - setupTime > hours * 60 * 60) {
    localStorage.clear();
  }

  useEffect(() => {
    if (user?.userID) {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('setupTimeCRM', now);
    }
  }, [user?.userID]);

  useEffect(() => {
    if (getToken?.user_access_token) {
      localStorage.setItem('token', JSON.stringify(getToken));
    }
  }, [getToken?.user_access_token]);

  useEffect(() => {
    if (pageCurrent?.length > 0) {
      localStorage.setItem('pageCurrent', JSON.stringify(pageCurrent));
    }
  }, [pageCurrent?.length > 0]);

  useEffect(() => {
    if (page?.length > 0) {
      localStorage.setItem('page', JSON.stringify(page));
    }
  }, [page?.length > 0]);

  //

  useEffect(() => {
    const a = JSON?.parse(localStorage?.getItem('user'));
    if (a?.userID) {
      setUserToken(a);
    } else {
      setUserToken(undefined);
    }
  }, []);

  useEffect(() => {
    if (user?.userID) {
      dispatch({
        type: 'crmFBDevV1/GET_TOKEN',
        payload: {
          user_access_token: user?.accessToken,
        },
        callback: (response) => {
          if (response) {
            setGetToket(response);
          }
        },
      });
    }
  }, [user?.userID]);

  useEffect(() => {
    if (getToken?.user_access_token) {
      dispatch({
        type: 'crmFBDevV1/GET_PAGES',
        payload: {
          user_access_token: getToken?.user_access_token,
          user_id: user?.userID,
        },
        callback: (response) => {
          if (response) {
            setPageCurrent(response.data);
          }
        },
      });
    }
  }, [getToken?.user_access_token]);

  useEffect(() => {
    if (pageCurrent.length > 0) {
      dispatch({
        type: 'crmFBDevV1/ADD_CONVERSATIONS',
        payload: {
          data_page: pageCurrent?.map((i) => ({
            page_access_token: i?.access_token,
            page_id: i?.id,
          })),
        },
        callback: () => {},
      });
      dispatch({
        type: 'crmFBDevV1/ADD_EMPLOYEE',
        payload: {
          data_page: pageCurrent?.map((i) => ({
            page_access_token: i?.access_token,
            page_id: i?.id,
          })),
        },
        callback: () => {},
      });
      dispatch({
        type: 'crmFBDevV1/ADD_PAGE_FACEBOOK',
        payload: {
          data_page: pageCurrent?.map((i) => ({
            name: i?.name,
            page_id_facebook: i?.id,
          })),
        },
        callback: () => {},
      });
      dispatch({
        type: 'crmFBDevV1/GET_PAGESDB',
        payload: { page_id_facebook: pageCurrent.map((i) => i.id).join(',') },
        callback: (response) => {
          if (response) {
            setPage(response.data);
            setPageID([response.data[0]]);
          }
        },
      });
    }
  }, [pageCurrent.length]);

  return (
    <div>
      {!isEmpty(JSON?.parse(localStorage?.getItem('user'))) ? (
        <div role="presentation" className={styles['loginFacebook-container']}>
          <img src={userToken?.picture?.data?.url} alt="icon" className={styles.avt} />
          <div className={styles.login} role="presentation">
            {userToken?.name}
          </div>
        </div>
      ) : (
        <div className={styles['wrapper-login']}>
          <FacebookLogin
            appId={APP_ID_FB}
            autoLoad={false}
            fields="name,email,picture,birthday"
            scope="public_profile,pages_show_list,pages_manage_metadata, pages_manage_posts, pages_read_engagement, pages_read_user_content, pages_manage_engagement, pages_messaging"
            callback={responseFacebook}
            render={(renderProps) => (
              <div
                role="presentation"
                onClick={renderProps.onClick}
                className={styles['loginFacebook-container']}
              >
                <div className={classnames('icon-facebook', styles.loginIcon)} />
                <div className={styles.login} role="presentation">
                  Login FB
                </div>
              </div>
            )}
          />
        </div>
      )}
    </div>
  );
});

export default Index;
