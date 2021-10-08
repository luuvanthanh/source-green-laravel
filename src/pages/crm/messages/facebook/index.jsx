import { memo, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'dva';
import classnames from 'classnames';
import { Helmet } from 'react-helmet';
import { Menu, Dropdown, Input, Upload } from 'antd';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { isEmpty, head } from 'lodash';
import { variables, Helper } from '@/utils';
import Button from '@/components/CommonComponent/Button';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import { Scrollbars } from 'react-custom-scrollbars';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import Right from './menuRight';
import styles from './styles.module.scss';

const Index = memo(() => {
  const scrollbars = useRef();

  const dispatch = useDispatch();
  const [{ user, pages }] = useSelector(({ crmFB }) => [crmFB]);
  const [isActive, setIsActive] = useState(false);
  const [pageCurrent, setPageCurrent] = useState({});
  const [conversationCurrent, setConversationCurrent] = useState({});
  const [users, setUsers] = useState([]);
  const [messagers, setMessagers] = useState([]);
  const [message, setMessage] = useState(null);

  const responseFacebook = (response) => {
    console.log('responseFacebook', response);
    dispatch({
      type: 'crmFB/GET_USER',
      payload: response,
    });
  };

  useEffect(() => {
    if (user.userID) {
      dispatch({
        type: 'crmFB/GET_PAGES',
        payload: {
          user_access_token: user?.accessToken,
          user_id: user?.userID,
        },
        callback: (response) => {
          if (response) {
            const firstPage = head(response.data);
            setPageCurrent(firstPage);
          }
        },
      });
    }
  }, [user.userID]);

  useEffect(() => {
    if (pageCurrent.id) {
      dispatch({
        type: 'crmFB/GET_CONVERSATIONS',
        payload: {
          page_id: pageCurrent?.id,
          page_access_token: pageCurrent?.access_token,
        },
        callback: (response) => {
          if (response) {
            const firstUser = head(
              response?.data?.map((item) => ({
                ...item,
                sender: item?.senders?.data?.find((item) => item.id !== pageCurrent.id),
              })),
            );
            setConversationCurrent(firstUser);
            setUsers(
              response?.data?.map((item) => ({
                ...item,
                sender: item?.senders?.data?.find((item) => item.id !== pageCurrent.id),
              })),
            );
          }
        },
      });
    }
  }, [pageCurrent.id]);

  useEffect(() => {
    if (conversationCurrent.id) {
      dispatch({
        type: 'crmFB/GET_MESSAGES',
        payload: {
          conversation_id: conversationCurrent?.id,
          page_access_token: pageCurrent?.access_token,
        },
        callback: (response) => {
          if (response) {
            setMessagers(response.data);
            setTimeout(() => {
              scrollbars.current.scrollToBottom();
            }, 300);
          }
        },
      });
    }
  }, [conversationCurrent.id]);

  useEffect(() => {
    const socket = io('https://socket-crm-dev.dn.greenglobal.vn', {
      transports: ['websocket'],
    });
    socket.on('connect', () => {
      socket.emit('subscribe', {
        channel: 'facebook',
      });
    });
    if (conversationCurrent.id && user.userID) {
      socket.on('facebook.receive.message', (event) => {
        if (event) {
          dispatch({
            type: 'crmFB/GET_MESSAGES',
            payload: {
              conversation_id: conversationCurrent?.id,
              page_access_token: pageCurrent?.access_token,
            },
            callback: (response) => {
              if (response) {
                setMessagers(response.data);
                setTimeout(() => {
                  scrollbars.current.scrollToBottom();
                }, 300);
              }
            },
          });
        }
      });
    }
    return () => socket.close();
  }, [conversationCurrent.id, user.userID]);

  const onChangeConversation = (id) => {
    setConversationCurrent(users.find((item) => item.id === id));
  };

  const onPressEnter = (e) => {
    setMessagers((prev) => [
      ...prev,
      {
        id: uuidv4(),
        message,
        from: pageCurrent,
        created_time: moment(),
      },
    ]);
    setTimeout(() => {
      scrollbars.current.scrollToBottom();
    }, 300);
    setMessage(null);
    dispatch({
      type: 'crmFB/SEND_MESSAGES',
      payload: {
        page_access_token: pageCurrent?.access_token,
        recipient_id: conversationCurrent?.sender?.id,
        message: e?.target?.value,
      },
      callback: () => {},
    });
  };

  const menu = (
    <Menu>
      {pages.map(({ name, id }) => (
        <Menu.Item key={id}>{name}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="p20">
      <Helmet title="facebook" />
      <div className={classnames('row', styles.wrapper)}>
        {isEmpty(user) && (
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
          <div className={classnames(styles['left-container'])}>
            <div>
              <div className={classnames(styles['left-title'], 'col-lg-12')}>
                <img
                  src="/images/facebook/logoFacebook.svg"
                  alt="facebook"
                  className={styles.img}
                />
                <Dropdown overlay={menu}>
                  <p className={styles.title}>
                    {pageCurrent?.name} <DownOutlined />
                  </p>
                </Dropdown>
              </div>
              <div>
                <div
                  className={classnames(styles['left-search'], 'col-lg-12', {
                    [styles.active]: isActive,
                  })}
                >
                  <Input placeholder="Nhập" prefix={<SearchOutlined />} />
                  <Button
                    onClick={() => setIsActive((prev) => !prev)}
                    icon="equalizer"
                    className={styles.button}
                  />
                </div>
                <div
                  className={classnames(styles['left-search-model'], 'col-lg-12', {
                    [styles.active]: isActive,
                  })}
                >
                  <span className={classnames(styles['button-icon'], 'icon-price-tags')}> </span>
                  <span className={classnames(styles['button-icon'], 'icon-user')}> </span>
                  <span className={classnames(styles['button-icon'], 'icon-eye-blocked')}> </span>
                  <span className={classnames(styles['button-icon'], 'icon-undo2')}> </span>
                  <span className={classnames(styles['button-icon'], 'icon-phone1')}> </span>
                  <span className={classnames(styles['button-icon'], 'icon-phone-off')}> </span>
                  <Button
                    onClick={() => setIsActive((prev) => !prev)}
                    icon="cancel"
                    className={styles['button-icon-cancel']}
                  />
                </div>
              </div>
              <div className={classnames(styles['left-title-time'], 'col-lg-12')}>
                <span>Gần đây</span>
              </div>
              <Scrollbars
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={100}
                autoHeight
                autoHeightMax="calc(100vh - 250px)"
              >
                {users?.map(({ snippet, id, updated_time, can_reply, sender }) => (
                  <div
                    className={classnames(styles['left-main'], 'col-lg-12', {
                      [styles.active]: sender?.id === conversationCurrent?.sender?.id,
                    })}
                    key={id}
                    role="presentation"
                    onClick={() => onChangeConversation(id)}
                  >
                    <div className={styles['left-main-img']}>
                      <img
                        src="/images/facebook/messages01.png"
                        alt="facebook"
                        className={styles.img}
                      />
                      <span
                        className={classnames(
                          { [styles.radioOnl]: can_reply },
                          { [styles.radioOff]: !can_reply },
                        )}
                      />
                    </div>
                    <div className={styles['left-card-main']}>
                      <div className="d-flex justify-content-between">
                        <h3 className={styles.name}>{sender?.name}</h3>
                        <div className={styles.time}>
                          {Helper.getDate(updated_time, variables.DATE_FORMAT.HOUR)}
                        </div>
                      </div>
                      <p className={styles.title}>{snippet}</p>
                    </div>
                  </div>
                ))}
              </Scrollbars>
            </div>
          </div>
        </div>
        <div className="col-lg-6 pl10 pr10">
          <div className={classnames(styles['main-container'])}>
            <div className="row w-100">
              <div className={classnames(styles['main-title'], 'col-lg-12')}>
                {conversationCurrent?.sender?.picture?.data?.url && (
                  <img
                    src={conversationCurrent?.sender?.picture?.data?.url}
                    alt="facebook"
                    className={styles.img}
                  />
                )}
                <div className={styles['main-title-right']}>
                  <h3 className={styles.name}>{conversationCurrent?.sender?.name}</h3>
                  <p className={styles.title}>Chỉ định cuộc trò chuyện</p>
                </div>
              </div>
              <Scrollbars
                autoHide
                autoHideTimeout={1000}
                autoHideDuration={100}
                autoHeight
                autoHeightMax="calc(100vh - 270px)"
                className={styles['main-contents']}
                renderTrackHorizontal={(props) => (
                  <div {...props} className="track-horizontal" style={{ display: 'none' }} />
                )}
                renderThumbHorizontal={(props) => (
                  <div {...props} className="thumb-horizontal" style={{ display: 'none' }} />
                )}
                ref={scrollbars}
              >
                {Helper.onSortDates(messagers, 'created_time', 'asc')?.map(
                  ({ id, message, created_time, from }) => (
                    <div key={id}>
                      <div
                        className={classnames(styles['main-left-contents'], 'col-lg-12', {
                          [styles['main-contents-right']]:
                            from?.id !== conversationCurrent?.sender?.id,
                        })}
                      >
                        <p className={styles.content}>{message}</p>
                      </div>

                      <div
                        className={classnames(styles['main-left-contents-time'], 'col-lg-12', {
                          [styles['main-contents-time-right']]:
                            from?.id !== conversationCurrent?.sender?.id,
                        })}
                      >
                        <p>{Helper.getDate(created_time, variables.DATE_FORMAT.HOUR)}</p>
                      </div>
                    </div>
                  ),
                )}
              </Scrollbars>
              <div className={classnames(styles['main-input'], 'col-lg-12')}>
                <Input.TextArea
                  autoSize={{ minRows: 3, maxRows: 3 }}
                  placeholder="Nhập tin nhắn"
                  onPressEnter={onPressEnter}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className={styles.icon}>
                  <Upload className={styles['btn-Upload']}>
                    <span className="icon-attachment"> </span>
                  </Upload>
                  <Upload className={styles['btn-Upload']}>
                    <span className="icon-smile"> </span>
                  </Upload>
                  <Upload className={styles['btn-Upload']}>
                    <span className="icon-image"> </span>
                  </Upload>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3  pl10 pr10">
          <Right />
        </div>
      </div>
    </div>
  );
});

export default Index;
