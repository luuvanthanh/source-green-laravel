import { memo, useEffect, useState, useRef } from 'react';
import { Menu, Dropdown, Input, Skeleton, Tag, Select, Image, Upload, List } from 'antd';
import { DownOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';
import { head, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { variables, Helper } from '@/utils';
import InfiniteScroll from 'react-infinite-scroller';
import Button from '@/components/CommonComponent/Button';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import MultipleImageUpload from './UploadAvatar';
import styles from './styles.module.scss';

const { Item: ListItem } = List;
const { Option } = Select;
const Index = memo(() => {
  const scrollbars = useRef();

  const dispatch = useDispatch();
  const [{ user, pages, tags, users }, loading] = useSelector(({ crmFBDevV1, loading: { effects } }) => [
    crmFBDevV1,
    effects,
  ]);

  const [parents, setParents] = useState([]);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(undefined);
  const [isAction, setIsAction] = useState(false);
  const [pageCurrent, setPageCurrent] = useState([]);
  const [page, setPage] = useState([]);
  const [pageID, setPageID] = useState([]);
  const [conversationCurrent, setConversationCurrent] = useState({});
  const [, setUsers] = useState([]);
  const [messagers, setMessagers] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageFile, setMessageFile] = useState(null);
  const [messageFinalFile, setMessageFinalFile] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [loadingMessageUser, setLoadingMessageUser] = useState(false);

  const [searchParent, setSearchParent] = useState({
    page: 1,
    limit: 15,
    total: 1,
    hasMore: true,
    loading: false,
  });
  console.log("searchParent", searchParent)
  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const responseFacebook = (response) => {
    console.log('response', response);
    if (response.userID) {
      dispatch({
        type: 'crmFBDevV1/GET_USER',
        payload: response,
      });
    }
  };

  useEffect(() => {
    if (user.userID) {
      dispatch({
        type: 'crmFBDevV1/GET_PAGES',
        payload: {
          user_access_token: user?.accessToken,
          user_id: user?.userID,
        },
        callback: (response) => {
          if (response) {
            setPageCurrent(response.data);
          }
        },
      });
    }
  }, [user.userID]);

  useEffect(() => {
    if (pageCurrent.length > 0) {
      dispatch({
        type: 'crmFBDevV1/ADD_CONVERSATIONS',
        payload: { data_page: pageCurrent?.map(i => ({ page_access_token: i?.access_token, page_id: i?.id })), },
        callback: () => { }
      });
      dispatch({
        type: 'crmFBDevV1/ADD_EMPLOYEE',
        payload: { data_page: pageCurrent?.map(i => ({ page_access_token: i?.access_token, page_id: i?.id })), },
        callback: () => { }
      });
      dispatch({
        type: 'crmFBDevV1/GET_PAGESDB',
        payload: {},
        callback: (response) => {
          if (response) {
            setPage(response.data);
            setPageID([response.data[0]]);
          }
        },
      });
    }
  }, [pageCurrent.length]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (page.length > 0) {
      setLoadingMessageUser(true);
      dispatch({
        type: 'crmFBDevV1/GET_CONVERSATIONS',
        payload: { page_id_facebook: pageCurrent[0]?.id },
        callback: (response) => {
          if (response) {
            setLoadingMessageUser(false);
            const firstUser = head(
              response?.parsePayload?.map((item) => ({
                ...item,
              })),
            );
            setConversationCurrent(firstUser);
            setUsers(
              response?.parsePayload?.map((item) => ({
                ...item,
              })),
            );
          }
        },
      });
      dispatch({
        type: 'crmFBDevV1/GET_TAGS',
        payload: {},
      });
    }
  }, [page.length]);



  useEffect(() => {
    if (conversationCurrent?.id) {
      setLoadingMessage(true);
      mountedSet(setSearchParent, { ...searchParent, loading: true });
      dispatch({
        type: 'crmFBDevV1/GET_MESSAGES',
        payload: {
          ...searchParent,
          page: searchParent.page,
          conversation_id: conversationCurrent?.id,
        },
        callback: (response) => {
          if (response) {

            mountedSet(setMessagers, response.data);
            mountedSet(setSearchParent, { ...searchParent, total: response.meta.pagination.total });
            setLoadingMessage(false);
            if (response) {
              setMessagers(response.data);
              scrollbars.current.scrollToBottom();
              setTimeout(() => {
              }, 300);
            }
            dispatch({
              type: 'crmFBDevV1/GET_CONVERSATIONSID',
              payload: { conversation_id: conversationCurrent?.id, },
              callback: (response) => {
                if (response) {
                  const firstUser = head(
                    response?.parsePayload?.map((item) => ({
                      ...item,
                    })),
                  );
                  setConversationCurrent(firstUser);
                  users[users.findIndex(i => i.id === conversationCurrent?.id)] = (response?.parsePayload?.find((item) => ({ ...item })));
                  // users[users.findIndex(i => i.id === conversationCurrent?.id)] = (response?.parsePayload?.find((item) => ({ ...item })));
                }
              },
            });

          }
        },
      });
    }
  }, [conversationCurrent?.id]);



  useEffect(() => {
    const socket = io('https://socket-crm-dev.dn.greenglobal.vn', {
      transports: ['websocket'],
    });
    socket.on('connect', () => {
      socket.emit('subscribe', {
        channel: 'facebook',
      });
    });

    if (conversationCurrent?.id) {
      socket.on('facebook.message.receive', (event, data) => {
        console.log("data", data);
        console.log("event", event);
        if (event) {
          dispatch({
            type: 'crmFBDevV1/GET_CONVERSATIONSCALL',
            payload: {},
            callback: (response) => {
              if (response) {
                if ((users.findIndex(i => i?.from === data?.to && i?.to === data?.from || i?.from === data?.from && i?.to === data?.to)) !== - 1) {
                  users.splice(users.findIndex(i => i?.from === data?.to && i?.to === data?.from || i?.from === data?.from && i?.to === data?.to), 1);
                  users.unshift(response?.parsePayload?.find(i => i?.from === data?.to && i?.to === data?.from || i?.from === data?.from && i?.to === data?.to));
                }
                // if ((users.findIndex(i => i?.from === data?.to && i?.to === data?.from || i?.from === data?.from && i?.to === data?.to)) === - 1) {
                //   users.unshift(response?.parsePayload?.find(i => i?.from === data?.to && i?.to === data?.from || i?.from === data?.from && i?.to === data?.to));
                // }
              }
            },
          });
          dispatch({
            type: 'crmFBDevV1/GET_MESSAGES',
            payload: {
              ...searchParent,
              conversation_id: conversationCurrent?.id,
            },
            callback: (response) => {
              if (response) {
                mountedSet(setMessagers, response.data);
                mountedSet(setSearchParent, { ...searchParent, total: response.meta.pagination.total });
                if (response) {
                  setMessagers(response.data);
                  scrollbars.current.scrollToBottom();
                  setTimeout(() => {
                  }, 300);
                }
                dispatch({
                  type: 'crmFBDevV1/GET_CONVERSATIONSID',
                  payload: { conversation_id: conversationCurrent?.id, },
                  callback: (response) => {
                    if (response) {
                      const firstUser = head(
                        response?.parsePayload?.map((item) => ({
                          ...item,
                        })),
                      );
                      setConversationCurrent(firstUser);
                      users[users.findIndex(i => i.id === conversationCurrent?.id)] = (response?.parsePayload?.find((item) => ({ ...item })));
                    }
                  },
                });

              }
            },
          });
        }
      });
    }
    return () => socket.close();
  }, [conversationCurrent?.id, user?.userID]);

  const uploadFiles = (files) => {
    mountedSet(setFiles, (prev) => [...prev, files]);
  };
  // console.log("files", files)
  const onChangeConversation = (id) => {
    setConversationCurrent(users.find((item) => item.id === id));
    setSearchParent({
      page: 1,
      limit: 15,
      total: 0,
      hasMore: true,
      loading: false,
    });
  };
  console.log("mess", messagers)
  const onPressEnter = (e) => {
    setMessagers((prev) => [
      {
        id: uuidv4(),
        attributes: { content: e?.target?.value },
        ulr: messageFile,
        from: pageCurrent,
        created_time: moment(),
      },
      ...prev,
    ]);
   
    scrollbars.current.scrollToBottom();
    setMessage(undefined);
    setFiles(undefined);
    setMessageFinalFile(messageFile);
    dispatch({
      type: 'crmFBDevV1/SEND_MESSAGES',
      payload: {
        page_access_token: pageCurrent?.find(i => i.id === pageID[0]?.attributes?.page_id_facebook)?.access_token,
        recipient_id: conversationCurrent?.userFacebookInfo?.user_id,
        page_id: pageCurrent?.find(i => i.id === pageID[0]?.attributes?.page_id_facebook)?.id,
        message: e?.target?.value,
        urls: JSON.stringify(file),
      },
      callback: (response) => {
        setMessagers(messagers);
      },
    });
  };
  const menu = (
    <Menu>
      {pages.map(({ name, id }) => (
        <Menu.Item key={id}>{name}</Menu.Item>
      ))}
    </Menu>
  );

  const onSelectColor = (e) => {
    dispatch({
      type: 'crmFBDevV1/ADD_TAGS',
      payload: {
        user_facebook_info_tag: e.map((i) => ({ tag_id: i })),
        user_facebook_info_id: conversationCurrent?.userFacebookInfo?.id,
      },
      callback: () => {
        dispatch({
          type: 'crmFBDevV1/GET_CONVERSATIONSID',
          payload: { conversation_id: conversationCurrent.id },
          callback: (response) => {
            if (response) {
              const firstUser = head(
                response?.parsePayload?.map((item) => ({
                  ...item,
                })),
              );
              setConversationCurrent(firstUser);
              users[users.findIndex(i => i.id === conversationCurrent?.id)] = (response?.parsePayload?.find((item) => ({ ...item })));
            }
          },
        });
      },
    });
  };

  const onUploadFile = (filex) => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: filex,
      callback: (response) => {
        if (response) {
          setFile([...file, response?.results[0]?.fileInfo?.url]);
          setMessageFile([...file, response?.results[0]?.fileInfo?.url]);
        }
      },
    });
  };

  const props = {
    beforeUpload: () => null,
    customRequest({ file }) {
      onUploadFile(file);
    },
    showUploadList: true,
  };

  const onStatus = (attributes, ulr) => {
    const check = attributes?.content?.substr(-4, 4);
    const checkHttp = attributes?.content?.lastIndexOf("http://");
    const checkAudio = attributes?.content?.lastIndexOf("audioclip");

    const a = ulr?.map(i => i?.substring(i.length, i.length - 4));
    const b = (messageFile?.map(i => `https://erp-clover-file.demo.greenglobal.com.vn${i}`));
    //const arrFile = a?.join();
    // const checkfile = (arrFile?.indexOf(".npg, jpeg") !== -1);
    //  const audio = new Audio('/images/facebook/soundMesenger.mp3');
    //  const  as   =  audio.play();
    if (check === '.jpg' || check === '.png' || check === 'jpeg' || check === '.bmp' || check === '.dib' || check === 'heic' || check === 'heif' || check === '.gif'
      || check === '.iff' || check === 'jfef' || check === '.jp2' || check === 'jpe' || check === 'jpeg' || check === '.psd' || check === '.tif'
      || check === 'HEIF' || check === '.IFF' || check === 'JFIF' || check === '.JP2' || check === '.JPE' || check === 'JPEG' || check === 'JPG'
      || check === '.PNG' || check === '.PSD' || check === '.TIF' || check === 'jpe' || check === 'TIFF' || check === 'WBMP' || check === 'WEBP' || check === 'HIEC') {
      return (
        <>
          {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-item']}>
              <div className={styles['messager-sendImg']}>
                <Image
                  width={200}
                  height={200}
                  src={attributes?.content}
                  className={styles['messager-img']}
                />
              </div>
              <div className={styles['messager-send']}>
                <p className={styles.time}>
                  {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
                </p>
              </div>
            </div>

          )}
          {attributes?.from === conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-recieve']}>
              <Image
                width={200}
                height={200}
                src={attributes?.content}
              />
              <p className={styles.time}>
                {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
              </p>
            </div>
          )}

        </>

      );

    }
    // if (arrFile?.indexOf(".png")) {
    //   return (
    //     <>
    //       {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
    //         b?.map((item, index) => (
    //           <div className={styles['messager-item']} key={index}>
    //             <div className={styles['messager-sendImg']}>
    //               <div className={styles['messager-loading']}>
    //                 <div className={styles['messager-loader']} />
    //               </div>
    //               <Image
    //                 width={200}
    //                 height={200}
    //                 src={item}
    //                 className={styles['messager-img']}
    //               />
    //             </div>
    //           </div>
    //         ))
    //       )}
    //     </>

    //   );

    // }
    if (check === '.mp4' && checkAudio === -1) {

      return (
        <>
          {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-item']}>
              <div className={styles['messager-video']}>
                <video controls  width={300} className={styles.video} >
                  <source src={attributes?.content} />
                </video>
              </div>
              <div className={styles['messager-send']}>
                <p className={styles.time}>
                  {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
                </p>
              </div>
            </div>
          )}
          {attributes?.from === conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-recieve']}>
              <video controls  width={300} className={styles.video}>
                <source src={attributes?.content} />
              </video>
              <p className={styles.time}>
                {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
              </p>

            </div>
          )}
        </>
      );
    }
    if (check === '.mp3' || checkAudio !== -1 ) {
      return (
        <>
          {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-item']}>
              <div className={styles['messager-mp3']}>
                <video controls height={50} width={'50%'} className={styles.video}>
                  <source src={attributes?.content} />
                </video>
              </div>
              <div className={styles['messager-send']}>
                <p className={styles.time}>
                  {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
                </p>
              </div>
            </div>
          )}
          {attributes?.from === conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-recieve']}>
              <div className={styles['messager-mp3']} >
                <video controls height={50} width={'50%'} className={styles.video}>
                  <source src={attributes?.content} />
                </video>
              </div>
              <p className={styles.time}>
                {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
              </p>

            </div>
          )}
        </>
      );
    }
    // if (arrFile?.indexOf(".mp4")) {
    //   return (
    //     <>
    //       {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
    //         <div className={styles['messager-item']}>
    //           <div className={styles['messager-video']}>
    //             <video controls height={200} width={300} className={styles.video} >
    //               <source src={attributes?.content} />
    //             </video>
    //           </div>
    //           <div className={styles['messager-send']}>
    //             <p className={styles.time}>
    //               <Spin />
    //             </p>
    //           </div>
    //         </div>
    //       )}
    //     </>
    //   );
    // } 
    if (check && checkHttp !== -1) {
      return (
        <>
          {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
            <>
              <div className={styles['messager-item']}>
                <div className={styles['messager-send']}>
                  <div className={styles['messager-file']}>
                    <a href={attributes?.content} download={files} className='icon-download' style={{ color: "white" }} />
                    <div className='d-flex'>
                      <p className='pr10'>Một file đính kèm</p>
                      <img src="/images/facebook/messagesFile.png" alt="facebook" className={styles.icon} />
                    </div>
                  </div>
                  <p className={styles.time}>
                    {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
                  </p>
                </div>
              </div>
            </>
          )}
          {attributes?.from === conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-recieve']}>
              <div className={styles['messager-file']}>
                <div className='d-flex'>
                  <img src="/images/facebook/messagesFile.png" alt="facebook" className={styles.icon} />
                  <p className='pl10'>Một file đính kèm</p>
                </div>
                <a href={attributes?.content} download={files} className='icon-download' />
              </div>
              <p className={styles.time}>
                {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
              </p>
            </div>
          )}
        </>
      );
    }
    // if (b?.length > 0) {
    //   return (
    //     <>
    //       {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
    //         b.map((item, index) => (
    //           <>
    //             <div className={styles['messager-item']} key={index}>
    //               <div className={styles['messager-send']}>
    //                 <div className={styles['messager-file']}>
    //                   <a href={attributes?.content} download={files} className='icon-download' style={{ color: "white" }} />
    //                   <div className='d-flex'>
    //                     <p className='pr10'>Một file đính kèm</p>
    //                     <img src="/images/facebook/messagesFile.png" alt="facebook" className={styles.icon} />
    //                   </div>
    //                 </div>
    //                 <p className={styles.time}>
    //                   <Spin />
    //                 </p>
    //               </div>
    //             </div>
    //           </>
    //         ))
    //       )}
    //       {attributes?.from === conversationCurrent?.user_facebook_info_id && (
    //         <div className={styles['messager-recieve']}>
    //           <div className={styles['messager-file']}>
    //             <div className='d-flex'>
    //               <img src="/images/facebook/messagesFile.png" alt="facebook" className={styles.icon} />
    //               <p className='pl10'>Một file đính kèm</p>
    //             </div>
    //             <a href={attributes?.content} download={files} className='icon-download' />
    //           </div>
    //           <p className={styles.time}>
    //             {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
    //           </p>
    //         </div>
    //       )}
    //     </>
    //   );
    // }
    return (
      <>
        {attributes?.from !== conversationCurrent?.user_facebook_info_id && (
          <div className={styles['messager-item']}>
            <div className={styles['messager-send']}>
              <div className={styles['messager-content']}>{attributes?.content}</div>
              <p className={styles.time}>
                {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
              </p>
            </div>
          </div>
        )}
        {attributes?.from === conversationCurrent?.user_facebook_info_id && (
          <div className={styles['messager-recieve']}>
            {/* <audio controls loop autoplay>
              <source src="/images/facebook/soundMesenger.mp3" type="audio/mpeg"  controls loop autoplay/>
            </audio> */}
            <div className={styles['messager-content']}>{attributes?.content}</div>
            <p className={styles.time}>
              {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
            </p>
          </div>
        )}
      </>
    );
  };

  const onSnippet = (attributes) => {
    const check = attributes?.content?.substr(-4, 4);
    const checkHttp = attributes?.content?.lastIndexOf("http://");
    if (check === '.jpg' || check === '.png') {
      return (
        <>
          <p className={styles.norm}>Đã gửi một ảnh</p>
        </>
      );

    }
    if (check === '.mp4') {
      return (
        <>
          <p className={styles.norm}>Đã gửi một video</p>
        </>
      );
    } if (check && checkHttp !== -1) {
      return (
        <>
          <p className={styles.norm}>Đã gửi một file</p>
        </>
      );
    }

    return (
      <>
        <p className={styles.norm}>{attributes}</p>
      </>
    );
  };
  //console.log("page", page)
  const preventDefault = (e, page) => {
    setUsers(undefined);
    setMessagers([]);
    setConversationCurrent({});
    dispatch({
      type: 'crmFBDevV1/GET_CONVERSATIONS',
      payload: { page_id_facebook: e },
      callback: (response) => {
        if (response) {

         mountedSet(setSearchParent, ({ page: 1,
          limit: 15,
          total: 0,
          hasMore: true,
          loading: false,
        }));
          const firstUser = head(
            response?.parsePayload?.map((item) => ({
              ...item,
            })),
          );
          setConversationCurrent(firstUser);
          setPageID(page?.filter(i => i?.attributes?.page_id_facebook === e));
          setUsers(
            response?.parsePayload?.map((item) => ({
              ...item,
            })),
          );
          setLoadingMessage(true);
        }
      },
    });
    dispatch({
      type: 'crmFBDevV1/GET_TAGS',
      payload: {},
    });
  };

  const handleInfiniteOnLoadParent = () => {
    mountedSet(setSearchParent, { ...searchParent, loading: true });
    if (messagers.length >= searchParent.total) {
      mountedSet(setSearchParent, { ...searchParent, hasMore: false, loading: false });
      return;
    }

    dispatch({
      type: 'crmFBDevV1/GET_MESSAGES',
      payload: {
        ...searchParent,
        page: searchParent.page + 1,
        conversation_id: conversationCurrent?.id,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setMessagers, messagers.concat(response.data));
          mountedSet(setSearchParent, {
            ...searchParent,
            total: response.meta.pagination.total,
            page: searchParent.page + 1,
            loading: false,
          });
        }
        if (error) {
          message.error('Lỗi hệ thống.');
          mountedSet(setSearchParent, { ...searchParent, hasMore: false, loading: false });
        }
      },
    });
  };

  //console.log("page?.map[0]?.id",page[0]?.attributes?.name)
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
            <Select value={pageID[0]?.attributes?.name} style={{ width: 120 }} bordered={false} onChange={(e) => preventDefault(e, page)}>
              {page?.map((i, index) =>
                <Option value={i?.attributes?.page_id_facebook} key={index} className={styles.norm}> {i?.attributes?.name}</Option>
              )}
            </Select>
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
                {loading['crmFBDevV1/GET_PAGES'] ||
                  (loading['crmFBDevV1/GET_CONVERSATIONS'] && (
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
                {(!loading['crmFBDevV1/GET_PAGES'] || !loading['crmFBDevV1/GET_CONVERSATIONS']) &&
                  users?.map(({ id, can_reply, userFacebookInfo, snippet, time, noti_inbox }) => (
                    <div
                      className={classnames(styles['user-item'], {
                        [styles['user-item-active']]:
                          userFacebookInfo?.id === conversationCurrent?.userFacebookInfo?.id,
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
                            src={userFacebookInfo?.avatar}
                            alt="facebook"
                            className={styles.img}
                          />
                        </div>
                        {noti_inbox === "SEEN" ?
                          <>
                            <div className={styles['user-info']}>
                              <h3 className={styles.title}>{userFacebookInfo?.user_name}</h3>
                              <div>{onSnippet(snippet, userFacebookInfo?.user_name)}</div>
                            </div>
                            <p className={styles.time}>
                              {time}
                            </p>
                          </>
                          :
                          <>
                            <div className={styles['user-info-notseen']}>
                              <h3 className={styles.title}>{userFacebookInfo?.user_name}</h3>
                              <div>{onSnippet(snippet, userFacebookInfo?.user_name)}</div>
                              <p className={styles.time}>
                                {time}
                              </p>
                            </div>
                          </>
                        }
                      </div>
                      {userFacebookInfo?.userFacebookInfoTag.map((i, index) =>
                        <div className='mt5' key={index}>
                          <Tag style={{ backgroundColor: `${i?.tag?.color_code}` }}>{i?.tag?.name}</Tag>
                        </div>
                      )}
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
              <img src={conversationCurrent?.userFacebookInfo?.avatar} alt="facebook" className={styles.img} />
            </div>
            <div className={styles['user-info']}>
              <h3 className={styles.title}>{conversationCurrent?.userFacebookInfo?.user_name}</h3>
              <p className={styles.norm}>Chỉ định cuộc trò chuyện</p>
            </div>
          </div>
          <div className={styles['messager-container']}>

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
                <div className="border-bottom">
                  <Scrollbars autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={100}
                    autoHeight
                    autoHeightMax="calc(100vh - 320px)"
                    renderTrackHorizontal={(props) => (
                      <div {...props} className="track-horizontal" style={{ display: 'none' }} />
                    )}
                    renderThumbHorizontal={(props) => (
                      <div {...props} className="thumb-horizontal" style={{ display: 'none' }} />
                    )}
                    ref={scrollbars}>
                    <InfiniteScroll
                      hasMore={!searchParent.loading && searchParent.hasMore}
                      initialLoad={searchParent.loading}
                      loadMore={handleInfiniteOnLoadParent}
                      style={{ display: 'flex', flexDirection: 'column-reverse' }}
                      scrollableTarget="scrollableDiv"
                      pageStart={1}
                      useWindow={false}
                      isReverse
                    >

                      {messagers?.map(({ attributes, ulr }, index) => (
                        <div className={styles['messager-item']} key={ulr} style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                          <div className={styles['messager-item']} >
                            <div>{onStatus(attributes, ulr)}</div>
                            <div>{index}</div>
                          </div>
                        </div>
                      ))}

                    </InfiniteScroll>
                  </Scrollbars>
                </div>
              )}
            </div>

          </div>
          <div className={styles['messages-container']}>
            <Upload {...props}>
              <div className={styles['chat-icon']}>
                <span className="icon-attachment" />
              </div>
            </Upload>
            <MultipleImageUpload
              files={files}
              callback={(files) => uploadFiles(files)}
              removeFiles={(files) => mountedSet(setFiles, files)}
            />
            <div className='d-flex'>
              <div className={styles['chat-container']}>
                <Input.TextArea
                  autoSize={{ minRows: 1, maxRows: 1 }}
                  width={80}
                  placeholder="Nhập tin nhắn"
                  onPressEnter={onPressEnter}
                  className={styles.input}
                  value={message}
                  onChange={(e) => setMessage(e?.target?.value)}
                />
                <div className={styles['group-icon']}>
                  {/* <span className="icon-attachment" /> */}

                  <pane className="icon-smile" />
                </div>

                {/* <MultipleImageUpload
                      //  files={files}
                      //   callback={(files) => uploadFiles(files)}
                      // removeFiles={(files) => mountedSet(setFiles, files)}
        setMessage> */}

              </div>


            </div>
          </div>

        </div>
        {loadingMessageUser && (
          <div className={styles['info-container']}>
            <div className={styles['user-container']}>
              <div className={styles['avatar-container']}>
                <img src={conversationCurrent?.userFacebookInfo?.avatar} alt="facebook" className={styles.img} />
              </div>
              <div className={styles['user-info']}>
                <p className={styles.norm}>{conversationCurrent?.userFacebookInfo?.user_name}</p>
              </div>
              <div className={styles['status-container']}>
                <div className={styles['tags-container']}>
                  <span>Chưa là khách hàng</span>
                </div>
                <Button color="success" className={styles['group-button']}>
                  Thêm Lead
                </Button>
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
                  <Skeleton.Input className="w-100" active size="default" />
                </div>
                <div className={styles['contact-item']}>
                  <p className={styles.label}>Số điện thoại</p>
                  <Skeleton.Input className="w-100" active size="default" />
                </div>
                <div className={styles['contact-item']}>
                  <p className={styles.label}>Email</p>
                  <Skeleton.Input className="w-100" active size="default" />
                </div>
                <div className={styles['contact-item']}>
                  <p className={styles.label}>Địa chỉ</p>
                  <Skeleton.Input className="w-100" active size="default" />
                </div>
                <div className={styles['contact-item']}>
                  <p className={styles.label}>Facebook id</p>
                  <Skeleton.Input className="w-100" active size="default" />
                </div>
              </div>
              <div className={styles['tags-container']}>
                <h3 className={styles.title}>GẮN TAGS</h3>
                <div >
                  <Select
                    showArrow
                    value={conversationCurrent?.userFacebookInfo?.userFacebookInfoTag?.map((item) => item?.tag?.id)}
                    mode="multiple"
                    className={styles['wrapper-tags']}
                    onChange={(e) => onSelectColor(e)}
                    tagRender={({ label, value, color_code, closable, onClose }) => {
                      const itemTag = tags.find(item => item.id === value);
                      return (
                        <Tag
                          color={itemTag?.color_code || color_code}
                          closable={closable}
                          onClose={onClose}
                          className={styles['tags-content']}
                        >
                          {label}
                        </Tag>
                      );
                    }}
                  >
                    {tags.map((item, index) => (
                      <Option
                        value={item?.id}
                        key={index}
                        style={{ backgroundColor: `${item.color_code}` }}
                      >
                        {item?.name}
                      </Option>
                    ))}
                  </Select>
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
        )}
        {!loadingMessageUser && (
          <div className={styles['info-container']}>
            <div className={styles['user-container']}>
              <div className={styles['avatar-container']}>
                <img src={conversationCurrent?.userFacebookInfo?.avatar} alt="facebook" className={styles.img} />
              </div>
              <div className={styles['user-info']}>
                <p className={styles.norm}>{conversationCurrent?.userFacebookInfo?.user_name}</p>
              </div>
              <div className={styles['status-container']}>
                <div className={styles['tags-container']}>
                  <span>Chưa là khách hàng</span>
                </div>
                <Button color="success" className={styles['group-button']}>
                  Thêm Lead
                </Button>
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
                  {/* <p className={styles.norm}>22/07/1997</p> */}
                </div>
                <div className={styles['contact-item']}>
                  <p className={styles.label}>Số điện thoại</p>
                  {/* <p className={styles.norm}>093548930</p> */}
                </div>
                <div className={styles['contact-item']}>
                  <p className={styles.label}>Email</p>
                  {/* <p className={styles.norm}>email@gmail.com</p> */}
                </div>
                <div className={styles['contact-item']}>
                  <p className={styles.label}>Địa chỉ</p>

                </div>
                <div className={styles['contact-item']}>
                  <p className={styles.label}>Facebook id</p>
                  {/* <p className={styles.norm}>facebook.com/thuttn</p> */}
                </div>
              </div>
              <div className={styles['tags-container']}>
                <h3 className={styles.title}>GẮN TAGS</h3>
                <div >
                  <Select
                    showArrow
                    value={conversationCurrent?.userFacebookInfo?.userFacebookInfoTag?.map((item) => item?.tag?.id)}
                    mode="multiple"
                    className={styles['wrapper-tags']}
                    onChange={(e) => onSelectColor(e)}
                    tagRender={({ label, value, color_code, closable, onClose }) => {
                      const itemTag = tags.find(item => item.id === value);
                      return (
                        <Tag
                          color={itemTag?.color_code || color_code}
                          closable={closable}
                          onClose={onClose}
                          className={styles['tags-content']}
                        >
                          {label}
                        </Tag>
                      );
                    }}
                  >
                    {tags.map((item, index) => (
                      <Option
                        value={item?.id}
                        key={index}
                        style={{ backgroundColor: `${item.color_code}` }}
                      >
                        {item?.name}
                      </Option>
                    ))}
                  </Select>
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
        )}
      </div>
    </div>
  );
});

export default Index;