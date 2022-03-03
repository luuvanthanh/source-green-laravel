import { memo, useEffect, useState, useRef } from 'react';
import { Menu, Dropdown, Input, Skeleton, Tag } from 'antd';
import { DownOutlined, SearchOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';
import { head, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { variables, Helper } from '@/utils';
import Button from '@/components/CommonComponent/Button';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import styles from './styles.module.scss';

const Index = memo(() => {
  const scrollbars = useRef();

  const dispatch = useDispatch();
  const [{ user, pages }, loading] = useSelector(({ crmFBDev, loading: { effects } }) => [
    crmFBDev,
    effects,
  ]);
  const [isAction, setIsAction] = useState(false);
  const [pageCurrent, setPageCurrent] = useState({});
  const [conversationCurrent, setConversationCurrent] = useState({});
  const [users, setUsers] = useState([]);
  const [messagers, setMessagers] = useState([]);
  const [message, setMessage] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState(false);

  const responseFacebook = (response) => {
    console.log('response', response);
    if (response.userID) {
      dispatch({
        type: 'crmFBDev/GET_USER',
        payload: response,
      });
    }
  };

  useEffect(() => {
    if (user.userID) {
      dispatch({
        type: 'crmFBDev/GET_PAGES',
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
    if (pageCurrent?.id) {
      dispatch({
        type: 'crmFBDev/GET_CONVERSATIONS',
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
    if (conversationCurrent?.id) {
      setLoadingMessage(true);
      dispatch({
        type: 'crmFBDev/GET_MESSAGES',
        payload: {
          conversation_id: conversationCurrent?.id,
          page_access_token: pageCurrent?.access_token,
        },
        callback: (response) => {
          setLoadingMessage(false);
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
    if (conversationCurrent?.id && user?.userID) {
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
  }, [conversationCurrent?.id, user?.userID]);

  const onChangeConversation = (id) => {
    setConversationCurrent(users.find((item) => item.id === id));
  };

  const onPressEnter = (e) => {
    if (e?.target?.value && e?.target?.value !== '') {
      setMessagers((prev) => [
        ...prev,
        {
          id: uuidv4(),
          message: e?.target?.value,
          from: pageCurrent,
          created_time: moment(),
        },
      ]);
      setTimeout(() => {
        scrollbars.current.scrollToBottom();
      }, 300);
      setMessage(undefined);
      dispatch({
        type: 'crmFB/SEND_MESSAGES',
        payload: {
          page_access_token: pageCurrent?.access_token,
          recipient_id: conversationCurrent?.sender?.id,
          message: e?.target?.value,
        },
        callback: () => {},
      });
    }
  };

  const menu = (
    <Menu>
      {pages.map(({ name, id }) => (
        <Menu.Item key={id}>{name}</Menu.Item>
      ))}
    </Menu>
  );
console.log("messagers",messagers);
  return (
    <div className={styles.wrapper}>
      <div className={styles['heading-container']}>
        <h3 className={styles.title}>Fanpage</h3>
      </div>
      <div className={styles['wrapper-container']}>
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
                  <span className="icon-facebook" />
                  Login FB
                </button>
              )}
            />
          </div>
        )}
        <div className={styles['sidebar-container']}>
          <div className={styles['sidebar-header']}>
            <img src="/images/facebook/logoFacebook.svg" alt="facebook" className={styles.icon} />
            <Dropdown overlay={menu} trigger={['click']}>
              <p className={styles.norm}>
                {pageCurrent?.name} <DownOutlined />
              </p>
            </Dropdown>
          </div>
          <div className={styles['sidebar-actions']}>
            {!isAction && (
              <Input
                placeholder="Nhập"
                prefix={<SearchOutlined />}
                className={styles.input}
                suffix={
                  <span
                    className="icon-equalizer"
                    role="presentation"
                    onClick={() => setIsAction((prev) => !prev)}
                  />
                }
              />
            )}
            {isAction && (
              <div className={styles['actions-container']}>
                <span className={classnames(styles.icon, 'icon-price-tags')} />
                <span className={classnames(styles.icon, 'icon-user')} />
                <span className={classnames(styles.icon, 'icon-eye-blocked')} />
                <span className={classnames(styles.icon, 'icon-undo2')} />
                <span className={classnames(styles.icon, 'icon-phone1')} />
                <span className={classnames(styles.icon, 'icon-phone-off')} />
                <span
                  className={classnames(styles.icon, 'icon-cancel')}
                  role="presentation"
                  onClick={() => setIsAction((prev) => !prev)}
                />
              </div>
            )}
          </div>
          <div className={styles['info-content']}>
            <p className={styles.norm}>Gần đây</p>
          </div>
          <div className={styles['user-container']}>
            <Scrollbars
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={100}
              autoHeight
              autoHeightMax="calc(100vh - 355px)"
            >
              <div>
                {loading['crmFBDev/GET_PAGES'] ||
                  (loading['crmFBDev/GET_CONVERSATIONS'] && (
                    <>
                      <div className={classnames(styles['user-item'], {})} role="presentation">
                        <div className={styles['user-content']}>
                          <div className={styles['avatar-container']}>
                            <Skeleton.Avatar active size="default" shape="circle" />
                          </div>
                          <div className={styles['user-info']}>
                            <Skeleton.Input className="w-100" active size="default" />
                          </div>
                        </div>
                      </div>
                      <div className={classnames(styles['user-item'], {})} role="presentation">
                        <div className={styles['user-content']}>
                          <div className={styles['avatar-container']}>
                            <Skeleton.Avatar active size="default" shape="circle" />
                          </div>
                          <div className={styles['user-info']}>
                            <Skeleton.Input className="w-100" active size="default" />
                          </div>
                        </div>
                      </div>
                      <div className={classnames(styles['user-item'], {})} role="presentation">
                        <div className={styles['user-content']}>
                          <div className={styles['avatar-container']}>
                            <Skeleton.Avatar active size="default" shape="circle" />
                          </div>
                          <div className={styles['user-info']}>
                            <Skeleton.Input className="w-100" active size="default" />
                          </div>
                        </div>
                      </div>
                      <div className={classnames(styles['user-item'], {})} role="presentation">
                        <div className={styles['user-content']}>
                          <div className={styles['avatar-container']}>
                            <Skeleton.Avatar active size="default" shape="circle" />
                          </div>
                          <div className={styles['user-info']}>
                            <Skeleton.Input className="w-100" active size="default" />
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                {(!loading['crmFBDev/GET_PAGES'] || !loading['crmFBDev/GET_CONVERSATIONS']) &&
                  users?.map(({ snippet, id, updated_time, can_reply, sender }) => (
                    <div
                      className={classnames(styles['user-item'], {
                        [styles['user-item-active']]:
                          sender?.id === conversationCurrent?.sender?.id,
                      })}
                      key={id}
                      role="presentation"
                      onClick={() => onChangeConversation(id)}
                    >
                      <div className={styles['user-content']}>
                        <div className={styles['avatar-container']}>
                          <span
                            className={classnames(styles.dot, { [styles.active]: can_reply })}
                          />
                          <img
                            src="/images/facebook/messages01.png"
                            alt="facebook"
                            className={styles.img}
                          />
                        </div>
                        <div className={styles['user-info']}>
                          <h3 className={styles.title}>{sender?.name}</h3>
                          <p className={styles.norm}>{snippet}</p>
                        </div>
                        <p className={styles.time}>
                          {Helper.getDate(updated_time, variables.DATE_FORMAT.HOUR)}
                        </p>
                      </div>
                      <div className={styles['user-actions']}>
                        <div className={styles['user-actions-item']}>
                          <div className={styles.dot} />
                          <p className={styles.norm}>Không cung này của iền học phí </p>
                        </div>
                        <div className={styles['user-actions-item']}>
                          <div className={classnames(styles.dot, styles.yellow)} />
                          <p className={styles.norm}>Quan tâm...</p>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </Scrollbars>
          </div>
        </div>
        <div className={styles['main-container']}>
          <div className={styles['main-container-info']}>
            <div className={styles['avatar-container']}>
              <span className={classnames(styles.dot, { [styles.active]: true })} />
              <img src="/images/facebook/messages01.png" alt="facebook" className={styles.img} />
            </div>
            <div className={styles['user-info']}>
              <h3 className={styles.title}>{conversationCurrent?.sender?.name}</h3>
              <p className={styles.norm}>Chỉ định cuộc trò chuyện</p>
            </div>
          </div>
          <div className={styles['messager-container']}>
            <Scrollbars
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={100}
              autoHeight
              autoHeightMax="calc(100vh - 410px)"
              renderTrackHorizontal={(props) => (
                <div {...props} className="track-horizontal" style={{ display: 'none' }} />
              )}
              renderThumbHorizontal={(props) => (
                <div {...props} className="thumb-horizontal" style={{ display: 'none' }} />
              )}
              ref={scrollbars}
            >
              <div>
                {loadingMessage && (
                  <div className={styles['messager-group']}>
                    <p className={styles.date}>Chủ nhật, 31/05/2021</p>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-send']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-recieve']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-send']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-recieve']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-send']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-recieve']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-send']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-recieve']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-send']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                    <div className={styles['messager-item']}>
                      <div className={styles['messager-recieve']}>
                        <Skeleton.Input className="w-100" active size="default" />
                      </div>
                    </div>
                  </div>
                )}
                {!loadingMessage && (
                  <div className={styles['messager-group']}>
                    <p className={styles.date}>Chủ nhật, 31/05/2021</p>
                    {Helper.onSortDates(
                      messagers.filter((item) => item.message),
                      'created_time',
                      'asc',
                    )?.map(({ id, message, created_time, from }) => (
                      <div className={styles['messager-item']} key={id}>
                        {from?.id !== conversationCurrent?.sender?.id && (
                          <div className={styles['messager-item']}>
                            <div className={styles['messager-send']}>
                              <div className={styles['messager-content']}>{message}</div>
                              <p className={styles.time}>
                                {Helper.getDate(created_time, variables.DATE_FORMAT.HOUR)}
                              </p>
                            </div>
                          </div>
                        )}
                        {from?.id === conversationCurrent?.sender?.id && (
                          <div className={styles['messager-recieve']}>
                            <div className={styles['messager-content']}>{message}</div>
                            <p className={styles.time}>
                              {Helper.getDate(created_time, variables.DATE_FORMAT.HOUR)}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Scrollbars>
          </div>
          <div className={styles['chat-container']}>
            <Input.TextArea
              autoSize={{ minRows: 4, maxRows: 4 }}
              placeholder="Nhập tin nhắn"
              onPressEnter={onPressEnter}
              className={styles.input}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className={styles['group-icon']}>
              <span className="icon-attachment" />
              <span className="icon-smile" />
              <span className="icon-image" />
            </div>
          </div>
        </div>
        <div className={styles['info-container']}>
          <div className={styles['group-button']}>
            <Button color="success" icon="circle">
              Thêm Lead
            </Button>
          </div>
          <div className={styles['user-container']}>
            <div className={styles['avatar-container']}>
              <img src="/images/facebook/messages01.png" alt="facebook" className={styles.img} />
            </div>
            <div className={styles['user-info']}>
              <p className={styles.norm}>Trần Thị Ngọc Thư</p>
              <div className={styles['tags-container']}>
                <span>Chưa là khách hàng</span>
              </div>
            </div>
          </div>
          <div className={styles['actions-container']}>
            <Button color="white" icon="email-plus" />
            <Button color="white" icon="phone-plus" />
            <Button color="white" icon="calendar-plus" />
            <Button color="white" icon="add-file-plus" />
          </div>
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={100}
            autoHeight
            autoHeightMax="calc(100vh - 450px)"
          >
            <div className={styles['contact-container']}>
              <div className={styles['contact-item']}>
                <p className={styles.label}>Ngày sinh</p>
                <p className={styles.norm}>22/07/1997</p>
              </div>
              <div className={styles['contact-item']}>
                <p className={styles.label}>Số điện thoại</p>
                <p className={styles.norm}>093548930</p>
              </div>
              <div className={styles['contact-item']}>
                <p className={styles.label}>Email</p>
                <p className={styles.norm}>email@gmail.com</p>
              </div>
              <div className={styles['contact-item']}>
                <p className={styles.label}>Địa chỉ</p>
                <p className={styles.norm}>44 Ngô Quyền, Sơn Trà, Đà Nẵng</p>
              </div>
              <div className={styles['contact-item']}>
                <p className={styles.label}>Facebook id</p>
                <p className={styles.norm}>facebook.com/thuttn</p>
              </div>
            </div>
            <div className={styles['tags-container']}>
              <h3 className={styles.title}>GẮN TAGS</h3>
              <Input placeholder="Nhập" prefix={<SearchOutlined />} />
              <div className={styles['tags-block']}>
                <Tag color="#f50" className="p5 m5" closable>
                  Không cung cấp TT
                </Tag>
                <Tag color="#2db7f5" className="p5 m5" closable>
                  Quan tâm khuyến mãi
                </Tag>
              </div>
            </div>
            <div className={styles['note-container']}>
              <div className={styles['note-heading']}>
                <h3 className={styles.title}>GHI CHÚ</h3>
                <span className="icon-write-plus" />
              </div>
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
            </div>
          </Scrollbars>
        </div>
      </div>
    </div>
  );
});

export default Index;
