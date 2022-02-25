import { memo, useEffect, useState, useRef } from 'react';
import { Menu, Dropdown, Input, Skeleton, Tag, Select, Image, Upload, List, Form } from 'antd';
import { DownOutlined, SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import FormItem from '@/components/CommonComponent/FormItem';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';
import { head, isEmpty } from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import Text from '@/components/CommonComponent/Text';
import { variables, Helper } from '@/utils';
import InfiniteScroll from 'react-infinite-scroller';
import Button from '@/components/CommonComponent/Button';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import MultipleImageUpload from './UploadAvatar';
import styles from './styles.module.scss';


const sex = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
  { id: 'OTHER', name: 'Khác' },
];
const { Item: ListItem } = List;
const { Option } = Select;
const Index = memo(() => {
  const scrollbars = useRef();

  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const [{ user, pages, tags, relationships, employeeFB }, loading] = useSelector(({ crmFBDevV1, loading: { effects } }) => [
    crmFBDevV1,
    effects,
  ]);
  //note
  console.log("employeeFB", employeeFB);
  const [detailLead, setDetailLead] = useState({});
  const [noteValue, setNoteValue] = useState([]);
  const [noteModal, setNoteModal] = useState(false);
  const [dayOfBirth, setDayOfBirth] = useState(null);

  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(undefined);
  const [isAction, setIsAction] = useState(false);
  const [pageCurrent, setPageCurrent] = useState([]);
  const [page, setPage] = useState([]);
  const [pageID, setPageID] = useState([]);
  const [conversationCurrent, setConversationCurrent] = useState({});
  const [users, setUsers] = useState([]);
  const [messagers, setMessagers] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageFile, setMessageFile] = useState(null);
  const [messageFinalFile, setMessageFinalFile] = useState(null);
  const [employees, setEmployees] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(true);
  const [loadingMessageUser, setLoadingMessageUser] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectEmployee, setSelectEmployee] = useState(undefined);

  const [searchParent, setSearchParent] = useState({
    page: 1,
    limit: 10,
    total: 1,
    hasMore: true,
    loading: false,
  });
  // console.log("usser", users)
  const [searchUser, setSearchUser] = useState({
    page: 1,
    limit: 7,
    total: 1,
    hasMore: true,
    loading: false,
  });

  const mounted = useRef(false);
  const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);

  const responseFacebook = (response) => {
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
        payload: { page_id_facebook: (pageCurrent.map(i => i.id).join(',')) },
        callback: (response) => {
          if (response) {
            setPage(response.data);
            setPageID([response.data[0]]);
          }
        },
      });
      dispatch({
        type: 'crmFBDevV1/GET_EMPLOYEE_FACEBOOK',
        payload: {},
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
      mountedSet(setSearchUser, { ...searchUser, loading: true });
      dispatch({
        type: 'crmFBDevV1/GET_CONVERSATIONS',
        payload: {
          page_id_facebook: pageCurrent[0]?.id,
          ...searchUser,
          page: searchUser.page,
        },
        callback: (response) => {
          if (response) {
            setLoadingUser(false);
            formRef.setFieldsValue({
              data: [""]
            });
            // console.log("responseresponse", response)
            setSelectEmployee(response?.parsePayload);
            setUsers(response?.parsePayload);
            setLoadingMessageUser(false);
            const firstUser = head(
              response?.parsePayload?.map((item) => ({
                ...item,
              })),
            );
            setConversationCurrent(firstUser);
            mountedSet(setSearchUser, { ...searchUser, total: response.meta.pagination.total });
          }
        },
      });
      dispatch({
        type: 'crmFBDevV1/GET_TAGS',
        payload: {},
      });
      dispatch({
        type: 'crmFBDevV1/GET_RELATIONSHIPS',
        payload: {},
      });
    }
  }, [page.length]);



  useEffect(() => {
    if (conversationCurrent?.id) {
      setLoadingMessage(true);
      setLoadingMessageUser(true);
      setDetailLead({});
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
            setLoadingMessage(false);
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
                  // const firstUser = head(
                  //   response?.parsePayload?.map((item) => ({
                  //     ...item,
                  //   })),
                  // );
                  setSelectEmployee(response?.parsePayload);
                  setNoteValue(response?.parsePayload[0]?.userFacebookInfo?.note);
                  users[users.findIndex(i => i.id === conversationCurrent?.id)] = (response?.parsePayload?.find((item) => ({ ...item })));
                }
              },
            });
            setLoadingMessageUser(false);
            if (conversationCurrent?.userFacebookInfo?.status === 'LEAD') {
              dispatch({
                type: 'crmFBDevV1/GET_LEAD',
                payload: conversationCurrent,
                callback: (response) => {
                  if (response) {
                    setDetailLead(response?.parsePayload);
                  }
                },
              });
            }
          }
        },
      });
    }
  }, [conversationCurrent?.id]);

  console.log("USERRSD", selectEmployee)
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
                      if (conversationCurrent?.userFacebookInfo?.status === 'LEAD') {
                        dispatch({
                          type: 'crmFBDevV1/GET_LEAD',
                          payload: conversationCurrent,
                          callback: (response) => {
                            if (response) {
                              setDetailLead(response?.parsePayload);
                            }
                          },
                        });
                      }
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

  const uploadFiles = (a) => {
    mountedSet(setFiles, (prev) => prev ? [...prev, a] : [a]);
  };

  const uploadFile = (a) => {
    mountedSet(setFile, (prev) => prev ? [...prev, a] : [a]);
  };

  const onChangeConversation = (id) => {
    setNoteModal(false);
    setEmployees(false);
    setSelectEmployee(undefined);
    setConversationCurrent(users.find((item) => item.id === id));
    setSearchParent({
      page: 1,
      limit: 10,
      total: 0,
      hasMore: true,
      loading: false,
    });
  };
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
    setMessage(undefined);
    scrollbars.current.scrollToBottom();
    mountedSet(setFiles, undefined);
    mountedSet(setFile, undefined);
    setMessageFinalFile(messageFile);
    dispatch({
      type: 'crmFBDevV1/SEND_MESSAGES',
      payload: {
        page_access_token: pageCurrent?.find(i => i.id === pageID[0]?.attributes?.page_id_facebook)?.access_token,
        recipient_id: conversationCurrent?.userFacebookInfo?.user_id,
        page_id: pageCurrent?.find(i => i.id === pageID[0]?.attributes?.page_id_facebook)?.id,
        message: e?.target?.value,
        urls: files?.length > 0 ? JSON.stringify(files) : JSON.stringify(file),
      },
      callback: () => {
        setMessage(undefined);
        mountedSet(setFiles, undefined);
        mountedSet(setFile, undefined);
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
    const checkHttp = attributes?.content?.lastIndexOf("https://");
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
            <>
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
            </>

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
            <>
              <div className={styles['messager-video']}>
                <video controls width={300} className={styles.video} >
                  <source src={attributes?.content} />
                </video>
              </div>
              <div className={styles['messager-send']}>
                <p className={styles.time}>
                  {Helper.getDate(attributes?.created_at, variables.DATE_FORMAT.HOUR)}
                </p>
              </div>
            </>
          )}
          {attributes?.from === conversationCurrent?.user_facebook_info_id && (
            <div className={styles['messager-recieve']}>
              <video controls width={300} className={styles.video}>
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
    if (check === '.mp3' || checkAudio !== -1) {
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

  const onSnippet = (attributes, from, to, name) => {

    const check = attributes?.substr(-4, 4);
    const checkHttp = attributes?.lastIndexOf("https://");
    if (pageID[0]?.id === from) {
      if (check === '.jpg' || check === '.png') {
        return (
          <>
            <p className={styles.norm}>Bạn Đã gửi một ảnh</p>
          </>
        );

      }
      if (check === '.mp4') {
        return (
          <>
            <p className={styles.norm}>Bạn Đã gửi một video</p>
          </>
        );
      } if (check && checkHttp !== -1) {
        return (
          <>
            <p className={styles.norm}>Bạn Đã gửi một file</p>
          </>
        );
      }
      return (
        <>
          <p className={styles.norm}>Bạn: {attributes}</p>
        </>
      );
    }
    if (pageID[0]?.id !== from) {
      if (check === '.jpg' || check === '.png') {
        return (
          <>
            <p className={styles.norm}>{name} Đã gửi một ảnh</p>
          </>
        );

      }
      if (check === '.mp4') {
        return (
          <>
            <p className={styles.norm}>{name} Đã gửi một video</p>
          </>
        );
      } if (check && checkHttp !== -1) {
        return (
          <>
            <p className={styles.norm}>{name} Đã gửi một file</p>
          </>
        );
      }
      return (
        <>
          <p className={styles.norm}>{attributes}</p>
        </>
      );
    }
  };

  const preventDefault = (e, page) => {
    setLoadingMessageUser(true);
    setLoadingUser(true);
    setLoadingMessage(true);
    setUsers(undefined);
    setMessagers([]);
    setNoteModal(false);
    setNoteValue();
    setConversationCurrent({});
    dispatch({
      type: 'crmFBDevV1/GET_CONVERSATIONS',
      payload: { page_id_facebook: e },
      callback: (response) => {
        if (response) {
          mountedSet(setSearchParent, ({
            page: 1,
            limit: 10,
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
          setLoadingUser(false);
          // if (conversationCurrent?.userFacebookInfo?.status === 'LEAD') {
          //   dispatch({
          //     type: 'crmFBDevV1/GET_LEAD',
          //     payload: {},
          //   });
          // }
        }
      },
    });
    dispatch({
      type: 'crmFBDevV1/GET_TAGS',
      payload: {},
    });
  };

  const handleInfiniteOnLoadMessages = () => {
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

  const handleInfiniteOnLoadUser = () => {
    mountedSet(setSearchUser, { ...searchUser, loading: true });
    // if (messagers.length >= searchUser.total) {
    //   mountedSet(setSearchUser, { ...searchUser, hasMore: false, loading: false });
    //   return;
    // }

    dispatch({
      type: 'crmFBDevV1/GET_CONVERSATIONS',
      payload: {
        page_id_facebook: pageCurrent[0]?.id,
        ...searchUser,
        page: searchUser.page + 1,
      },
      callback: (response, error) => {
        if (response) {
          mountedSet(setUsers, users.concat(response?.parsePayload));
          mountedSet(setSearchUser, {
            ...searchUser,
            total: response.meta.pagination.total,
            page: searchUser.page + 1,
            loading: false,
          });
        }
        if (error) {
          message.error('Lỗi hệ thống.');
          mountedSet(setSearchUser, { ...searchUser, hasMore: false, loading: false });
        }
      },
    });
  };

  //NOTE
  const onChangeNote = (value) => {
    mountedSet(setNoteValue, value);
  };
  const handleNote = () => {
    dispatch({
      type: 'crmFBDevV1/UPDATE_NOTE',
      payload: { noteValue, conversationCurrent },
      callback: (response) => {
        if (response) {
          setNoteModal(false);
        }
      },
    });
  };

  //STUDENT
  const onChaneDate = (e) => {
    mountedSet(setDayOfBirth, e);
  };

  const onFinish = (values) => {
    const items = values?.data?.map((item, index) => ({
      ...item,
      birth_date: Helper.getDateTime({
        value: Helper.setDate({
          ...variables.setDateData,
          originValue: item.birth_date,
        }),
        format: variables.DATE_FORMAT.DATE_AFTER,
        isUTC: false,
      }),
    }));
    const payload = { ...values, student_info: items?.length > 0 ? items : [], user_facebook_info_id: conversationCurrent?.user_facebook_info_id };
    dispatch({
      type: 'crmFBDevV1/ADD_LEAD',
      payload,
      callback: (response, error) => {
        if (response) {
          setConversationCurrent([]);
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
                setNoteValue(response?.parsePayload[0]?.userFacebookInfo?.note);
                setConversationCurrent(firstUser);
                users[users.findIndex(i => i.id === conversationCurrent?.id)] = (response?.parsePayload?.find((item) => ({ ...item })));
                if (conversationCurrent?.userFacebookInfo?.customer_lead_id) {
                  dispatch({
                    type: 'crmFBDevV1/GET_LEAD',
                    payload: conversationCurrent,
                    callback: (response) => {
                      if (response) {
                        setDetailLead(response?.parsePayload);
                      }
                    },
                  });
                }
              }
            },
          });
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  console.log("FFFF", conversationCurrent?.userFacebookInfo?.employeeFacebook?.employee_fb_name);
  console.log("FVFVF", employeeFB)
  const onChangeEmployeeFb = (e) => {
    dispatch({
      type: 'crmFBDevV1/ADD_EMPLOYEE_FACEBOOK',
      payload: { user_facebook_info_id: conversationCurrent?.userFacebookInfo?.id, employee_facebook_id: e },
      callback: (response) => {
      },
    });
  };

  const onChangeEmployeeFbs = (e) => {
    setEmployees(true);
    dispatch({
      type: 'crmFBDevV1/ADD_EMPLOYEE_FACEBOOK',
      payload: { user_facebook_info_id: conversationCurrent?.userFacebookInfo?.id, employee_facebook_id: e },
      callback: (response) => {
      },
    });
  };

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
            <Select value={pageID[0]?.attributes?.name} bordered={false} onChange={(e) => preventDefault(e, page)}>
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

            <div>
              {loadingUser
                && (
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
                )}
              {!loadingUser &&
                <Scrollbars
                  autoHide
                  autoHideTimeout={1000}
                  autoHideDuration={100}
                  autoHeight
                  autoHeightMax="calc(100vh - 300px)"
                >
                  <InfiniteScroll
                    hasMore={!searchUser.loading && searchUser.hasMore}
                    initialLoad={searchUser.loading}
                    loadMore={handleInfiniteOnLoadUser}
                    pageStart={0}
                    useWindow={false}
                  >
                    {
                      users?.map(({ id, can_reply, userFacebookInfo, snippet, time, noti_inbox, from, to }) => (
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
                                  <div>{onSnippet(snippet, from, to, userFacebookInfo?.user_name)}</div>
                                </div>
                                <p className={styles.time}>
                                  {time?.substr(-5, 5)}
                                </p>
                              </>
                              :
                              <>
                                <div className={styles['user-info-notseen']}>
                                  <h3 className={styles.title}>{userFacebookInfo?.user_name}</h3>
                                  <div>{onSnippet(snippet, from, to, userFacebookInfo?.user_name)}</div>
                                  <p className={styles.time}>
                                    {time?.substr(-5, 5)}
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
                      ))
                    }

                  </InfiniteScroll>
                </Scrollbars>
              }
            </div>
          </div>
        </div>
        <div className={styles['main-container']}>
          {
            loadingUser &&
            (
              <div className={styles['main-container-info']}>
                <div className={styles['avatar-container']}>
                  <Skeleton.Input className="w-100 h-100  rounded-circle" active size="default" />
                  {/* <span className={classnames(styles.dot, { [styles.active]: true })} />
                  <img src={conversationCurrent?.userFacebookInfo?.avatar} alt="facebook" className={styles.img} /> */}
                </div>
                <div style={{ height: '22px', width: '150px' }} className="d-flex pl10 align-items-center">
                  <Skeleton.Input className="w-100 h-100" active size="default" />
                </div>
              </div>
            )
          }
          {
            !loadingUser &&
            (
              <div className={styles['main-container-info']}>
                <div className={styles['avatar-container']}>
                  <span className={classnames(styles.dot, { [styles.active]: true })} />
                  <img src={conversationCurrent?.userFacebookInfo?.avatar} alt="facebook" className={styles.img} />
                </div>
                <div className={styles['user-info']}>
                  <h3 className={styles.title}>{conversationCurrent?.userFacebookInfo?.user_name}</h3>
                  {
                    selectEmployee && conversationCurrent?.userFacebookInfo?.employeeFacebook?.employee_fb_name &&(
                      <Select defaultValue={selectEmployee[0]?.userFacebookInfo?.employeeFacebook?.employee_fb_name} bordered={false} onChange={(e) => onChangeEmployeeFb(e)}>
                        {employeeFB?.map((i, index) =>
                          <Option value={i?.id} key={index}> sss{i?.employee_fb_name}</Option>
                        )}
                      </Select>
                    )
                  }

                  {
                    (loading['crmFBDevV1/GET_CONVERSATIONSID']) &&  (

                      !selectEmployee  ? 
                      <Select defaultValue='Chọn nhan  vienn' bordered={false} onChange={(e) => onChangeEmployeeFb(e)} >
                        {employeeFB?.map((i, index) =>
                          <Option value={i?.id} key={index}> {i?.employee_fb_name}</Option>
                        )}
                      </Select> : 
                    <>aaaaaa</>
                    )}
                </div>
              </div>
            )
          }
          <div className={styles['messager-container']}>

            <div>

              {loadingMessage && (
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
                  <div className={styles['messager-group']}>
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
                </Scrollbars>
              )}

              {!loadingMessage && (
                <div className="border-bottom">
                  <Scrollbars autoHide
                    autoHideTimeout={1000}
                    autoHideDuration={100}
                    autoHeight
                    autoHeightMax={files?.length > 0 ? "calc(100vh - 364px)" : "calc(100vh - 320px)"}
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
                      loadMore={handleInfiniteOnLoadMessages}
                      style={{ display: 'flex', flexDirection: 'column-reverse' }}
                      scrollableTarget="scrollableDiv"
                      pageStart={1}
                      useWindow={false}
                      isReverse
                    >

                      {messagers?.map(({ attributes, ulr }) => (
                        <div className={styles['messager-item']} key={ulr} style={{ display: 'flex', flexDirection: 'column-reverse' }}>
                          <div className={styles['messager-item']} >
                            <div>{onStatus(attributes, ulr)}</div>
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
            <Upload {...props}
              callback={(file) => uploadFile(file)}
              removeFiles={(file) => mountedSet(setFile, file)}
            >
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
              <div style={{ height: '100px', width: '100px' }}>
                <Skeleton.Input className="w-100 h-100  rounded-circle" active size="default" />
              </div>
              <div style={{ height: '100px', width: '150px' }} className="d-flex align-items-center">
                <Skeleton.Input className="w-100 pl10 pb10" active size="default" />
              </div>
            </div>
            <div className={styles['actions-container']}>
              <Skeleton.Input className="w-100" active size="default" />
            </div>
            <Scrollbars
              autoHide
              autoHideTimeout={1000}
              autoHideDuration={100}
              autoHeight
              autoHeightMax="calc(100vh - 450px)"
            >
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
              <Skeleton.Input className="w-100 p20" active size="default" />
            </Scrollbars>
          </div>
        )}
        {!loadingMessageUser && (
          <div className={styles['info-container']}>
            <div className={styles['user-container']}>
              <div className={styles['avatar-container']}>
                <img src={conversationCurrent?.userFacebookInfo?.avatar} alt="facebook" className={styles.img} />
              </div>
              <div className='pl10'>
                <div className={styles['user-info']}>
                  <p className={styles.norm}>{conversationCurrent?.userFacebookInfo?.status === 'LEAD' ?
                    detailLead?.full_name
                    : conversationCurrent?.userFacebookInfo?.user_name}</p>
                </div>
                <div className={styles['status-container']}>
                  <div className={styles['tags-container']}>
                    {
                      conversationCurrent?.userFacebookInfo?.status === 'LEAD' ?
                        <span>{detailLead?.statusCare
                          ?.map((item, index) => (
                            <div key={index}>
                              {item?.statusParentLead?.name}
                            </div>
                          ))
                          .pop()}</span>
                        :
                        <span>Chưa là khách hàng</span>
                    }
                  </div>
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
              autoHeightMax="calc(100vh - 350px)"
            >
              {
                conversationCurrent?.userFacebookInfo?.status === 'LEAD' && conversationCurrent?.userFacebookInfo?.customer_lead_id === detailLead?.id ?

                  <div className={styles['contact-container']}>
                    <div className={styles['information-parents']}>
                      <h3 className={styles.title}>THÔNG TIN CHUNG</h3>
                      <div className={styles['contact-items']}>
                        <p className={styles.label}>Họ và tên</p>
                        <h3 className={styles.name}>{detailLead?.full_name}</h3>
                      </div>
                      <div className={styles['contact-items']}>
                        <p className={styles.label}>Giới tính</p>
                        <h3 className={styles.name}>
                          {detailLead?.sex === "MALE" ? "Nam" : ""}
                          {detailLead?.sex === "FEMALE" ? "Nữ" : ""}
                          {detailLead?.sex === "OTHER" ? "Khác" : ""}
                        </h3>
                      </div>
                      <div className={styles['contact-items']}>
                        <p className={styles.label}>Ngày sinh</p>
                        <h3 className={styles.name}>{detailLead?.birth_date}</h3>
                      </div>
                      <div className={styles['contact-items']}>
                        <p className={styles.label}>Điện thoại</p>
                        <h3 className={styles.name}>{detailLead?.phone}</h3>
                      </div>
                      <div className={styles['contact-items']}>
                        <p className={styles.label}>Email</p>
                        <h3 className={styles.name}>{detailLead?.email}</h3>
                      </div>
                      <div className={styles['contact-items']}>
                        <p className={styles.label}>Địa chỉ</p>
                        <h3 className={styles.name}>{detailLead?.address}</h3>
                      </div>
                    </div>
                    <div className={styles['information-students']}>
                      <h3 className={styles.title}>THÔNG TIN HỌC SINH</h3>
                      {
                        detailLead?.studentInfo?.map((item, index) =>
                          <div key={index}>
                            <div className={styles['students-titles']}>
                              <div type="form-title" className={styles.titleContent}>
                                Học sinh {index + 1}
                              </div>
                            </div>
                            <div className={styles['contact-items']}>
                              <p className={styles.label}>Họ và tên</p>
                              <h3 className={styles.name}>{item?.full_name}</h3>
                            </div>
                            <div className={styles['contact-items']}>
                              <p className={styles.label}>Giới tính</p>
                              <h3 className={styles.name}>
                                {item?.sex === "MALE" ? "Nam" : ""}
                                {item?.sex === "FEMALE" ? "Nữ" : ""}
                                {item?.sex === "OTHER" ? "Khác" : ""}
                              </h3>
                            </div>
                            <div className={styles['contact-items']}>
                              <p className={styles.label}>Ngày sinh</p>
                              <h3 className={styles.name}>{item.birth_date} ({item?.age_month} Tháng tuổi)</h3>
                            </div>
                            <div className={styles['contact-items']}>
                              <p className={styles.label}>Mối quan hệ</p>
                              <h3 className={styles.name}>{item?.categoryRelationship?.name}</h3>
                            </div>
                          </div>
                        )
                      }
                    </div>
                  </div>
                  :
                  <Form layout="vertical" ref={formRef} onFinish={onFinish}>
                    <div className={styles['contact-container']}>
                      <div className={styles['information-parents']}>
                        <h3 className={styles.title}>THÔNG TIN CHUNG</h3>
                        <div className={styles['contact-item']}>
                          <label className={styles.labelRequired}>
                            <p>Họ và tên</p>
                          </label>
                          <FormItem
                            name="user_full_name"
                            type={variables.INPUT}
                            className={styles.norm}
                            rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                          />
                        </div>
                        <div className={styles['contact-item']}>
                          <label className={styles.labelRequired}>
                            <p>Giới tính</p>
                          </label>
                          <FormItem
                            options={['id', 'name']}
                            data={sex}
                            placeholder="Chọn"
                            name='sex'
                            className={styles.norm}
                            type={variables.SELECT}
                            rules={[variables.RULES.EMPTY_INPUT]}
                          />
                        </div>
                        <div className={styles['contact-item']}>
                          <p className={styles.label}>Ngày sinh</p>
                          <FormItem
                            name="user_birth_date"
                            className={styles.norm}
                            type={variables.DATE_PICKER}
                            disabledDate={(current) => current > moment()}
                          />
                        </div>
                        <div className={styles['contact-item']}>
                          <label className={styles.labelRequired}>
                            <p>Điện thoại</p>
                          </label>
                          <FormItem
                            name="user_phone"
                            className={styles.norm}
                            type={variables.INPUT}
                            rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                          />
                        </div>
                        <div className={styles['contact-item']}>
                          <p className={styles.label}>Email</p>
                          <FormItem
                            name="user_email"
                            className={styles.norm}
                            type={variables.EMAIL}
                          />
                        </div>
                        <div className={styles['contact-item']}>
                          <p className={styles.label}>Địa chỉ</p>
                          <FormItem
                            name="user_address"
                            className={styles.norm}
                            type={variables.INPUT}
                          />
                        </div>
                      </div>
                      <div className={styles['information-students']}>
                        <h3 className={styles.title}>THÔNG TIN HỌC SINH</h3>
                        <Form.List name="data">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map((field, index) => (
                                <div
                                  key={field.key}
                                  className='border-bottom'
                                >
                                  <div className={styles['students-title']}>
                                    <div type="form-title" className={styles.titleContent}>
                                      Học sinh {index + 1}
                                    </div>
                                    {fields.length > 0 && (
                                      <DeleteOutlined
                                        onClick={() => {
                                          remove(index);
                                        }}
                                      />
                                    )}
                                  </div>
                                  <div className="row">
                                    <div className="col-lg-12">
                                      <div className={styles['contact-item']}>
                                        <p className={styles.label}>Họ và tên</p>
                                        <FormItem
                                          name={[field.name, 'full_name']}
                                          className={styles.norm}
                                          fieldKey={[field.fieldKey, 'full_name']}
                                          type={variables.INPUT}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className={styles['contact-item']}>
                                        <p className={styles.label}>Giới tính</p>
                                        <FormItem
                                          data={sex}
                                          className={styles.norm}
                                          name={[field.name, 'sex']}
                                          fieldKey={[field.fieldKey, 'sex']}
                                          type={variables.SELECT}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className={styles['contact-item']}>
                                        <p className={styles.label}>Ngày sinh</p>
                                        <FormItem
                                          name={[field.name, 'birth_date']}
                                          className={styles.norm}
                                          fieldKey={[field.fieldKey, 'birth_date']}
                                          type={variables.DATE_PICKER}
                                          onChange={onChaneDate}
                                        />
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className={styles['contact-item']}>
                                        <p className={styles.label}>Tháng tuổi</p>
                                        {
                                          file?.age_month ?
                                            <Form.Item >
                                              <Text size="normal" className={styles.norm}>
                                                {file?.age_month}
                                              </Text>
                                            </Form.Item>
                                            : <Form.Item name={[field.name, 'age_month']} className={styles.norm}>
                                              {dayOfBirth &&
                                                moment().diff(moment(dayOfBirth), 'month')} Tháng tuổi
                                            </Form.Item >
                                        }
                                      </div>
                                    </div>
                                    <div className="col-lg-12">
                                      <div className={styles['contact-item']}>
                                        <p className={styles.label}>Mối quan hệ</p>
                                        <FormItem
                                          data={relationships}
                                          className={styles.norm}
                                          name={[field.name, 'category_relationship_id']}
                                          fieldKey={[field.fieldKey, 'category_relationship_id']}
                                          type={variables.SELECT}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                              <div className={styles['students-add']}>
                                <pane
                                  color="success"
                                  ghost
                                  className="icon-plus-circle"
                                  onClick={() => {
                                    add();
                                  }}
                                />
                              </div>
                            </>
                          )}
                        </Form.List>
                      </div>
                      <div className={styles['menuRight-add']}>
                        <Button color="success" htmlType="submit" className="w-100">
                          Thêm phụ huynh Lead
                        </Button>
                      </div>
                    </div>
                  </Form>
              }

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
                  <span className="icon-write-plus" onClick={() => setNoteModal(!noteModal)} role="presentation" />
                </div>
                <div className={styles['note-body']}>
                  <div>
                    {noteModal ?
                      <div>
                        <Input.TextArea className={styles.text} autoSize={{ minRows: 4, maxRows: 4 }} value={noteValue} onChange={(e) => onChangeNote(e.target.value)} />
                        <div className='d-flex justify-content-end pt5 align-items-center'>
                          <p
                            className="btn-delete mr10"
                            role="presentation"
                            onClick={() => setNoteModal(false)}
                          >
                            Hủy
                          </p>
                          <Button
                            key="submit"
                            color="success"
                            type="primary"
                            className={styles['cheack-btn-ok']}
                            onClick={handleNote}
                          >
                            Lưu
                          </Button>
                        </div>
                      </div>
                      :
                      <div className='d-flex justify-content-between'>
                        {noteValue}

                      </div>
                    }
                  </div>
                </div>
              </div>

            </Scrollbars>
          </div>
        )}
      </div>
    </div>
  );
});

export default Index;