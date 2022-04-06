import { memo, useRef, useState, useEffect } from 'react';
import { Form } from 'antd';
import { head, get, isEmpty } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Table from '@/components/CommonComponent/Table';
import { useLocation, useParams, useHistory } from 'umi';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { useSelector, useDispatch } from 'dva';
import Button from '@/components/CommonComponent/Button';
import { Helper, variables } from '@/utils';
import styles from '@/assets/styles/Common/common.scss';
import stylesModule from '../../styles.module.scss';

const Index = memo(() => {
  const {
    loading: { effects },
    posts,
    users,
  } = useSelector(({ loading, crmMarketingManageAdd }) => ({
    loading,
    posts: crmMarketingManageAdd.posts,
    users: crmMarketingManageAdd.user,
  }));
  const loading = effects[`crmMarketingManageAdd/GET_POSTS`];
  const dispatch = useDispatch();
  const params = useParams();
  const formRef = useRef();
  const mounted = useRef(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const [pageCurrent, setPageCurrent] = useState({});
  const [getToken, setGetToket] = useState({});

  const responseFacebook = (response) => {
    dispatch({
      type: 'crmMarketingManageAdd/GET_USER',
      payload: response,
    });
  };


  useEffect(() => {
    if (users?.userID) {
      dispatch({
        type: 'crmFBDevV1/GET_TOKEN',
        payload: {
          user_access_token: users?.accessToken,
        },
        callback: (response) => {
          if (response) {
            setGetToket(response);
          }
        },
      });
    }
  }, [users?.userID]);

  useEffect(() => {
    if (getToken?.user_access_token) {
      dispatch({
        type: 'crmFBDevV1/GET_PAGES',
        payload: {
          user_access_token: getToken?.user_access_token,
          user_id: users?.userID,
        },
        callback: (response) => {
          if (response) {
            const firstPage = head(response.data);
            setPageCurrent(firstPage);
            sessionStorage.setItem('user', JSON.stringify(response.data));
          }
        },
      });
    }
  }, [getToken?.user_access_token]);

  const onFinish = (values) => {
    dispatch({
      type: 'crmMarketingManageAdd/ADD_FACEBOOK',
      payload: {
        article_id: values,
        page_id: pageCurrent?.id,
        page_access_token: pageCurrent.access_token,
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: get(item, 'source.pointer'),
                  errors: [get(item, 'detail')],
                },
              ]);
            });
          }
        }
      },
    });
  };

  // useEffect(() => {
  //   responseFacebook();
  // }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  /**
   * Function header table
   */
  const header = () => {
    const columns = [
      {
        title: 'Thời gian ',
        key: 'date',
        width: 80,
        render: (record) => Helper.getDate(record.created_at, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Hình ảnh ',
        key: 'img',
        width: 80,
        render: (record) => <AvatarTable fileImage={Helper.getPathAvatarJson(record?.file_image)} />,
      },
      {
        title: 'Bài viết',
        key: 'name',
        width: 200,
        render: (record) => (
          <p
            role="presentation"
            className={stylesModule['wrapper-posts']}
            onClick={() => history.push(`/crm/tiep-thi/quan-ly-chien-dich-marketing/chi-tiet/${record.id}/chi-tiet-bai-viet`)}
          >
            {record?.name}
          </p>
        ),
      },
      {
        title: 'Lượt like',
        key: 'img',
        width: 100,
        render: (record) => record?.postFacebookInfo?.quantity_reaction || 0,
      },
      {
        title: 'Lượt share',
        key: 'img',
        width: 100,
        render: (record) => record?.postFacebookInfo?.quantity_share || 0,
      },
      {
        title: 'Lượt comment',
        key: 'img',
        width: 100,
        render: (record) => record?.postFacebookInfo?.quantity_comment || 0,
      },
      {
        title: 'Đăng lên',
        key: 'action',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <>
              {isEmpty(users?.userID) && (
                <div>
                  <FacebookLogin
                    appId={APP_ID_FB}
                    autoLoad={false}
                    fields="name,email,picture,birthday"
                    scope="public_profile,pages_show_list,pages_manage_metadata, pages_manage_posts, pages_read_engagement, pages_read_user_content, pages_manage_engagement, pages_messaging"
                    callback={responseFacebook}
                    render={(renderProps) => (
                      <Button
                        onClick={renderProps.onClick}
                        type="button"
                        size="small"
                        color="primary"
                      >
                        Login FB
                      </Button>
                    )}
                  />
                </div>
              )}
              {!isEmpty(users?.userID) && (
                <Button
                  color="primary"
                  icon="facebook"
                  size="small"
                  className={stylesModule['button-fb']}
                  onClick={() => onFinish(record.id)}
                >
                  Fanpage
                </Button>
              )}
            </>
            {/* <Button
              color="primary"
              icon="sphere"
              size="normal"
              className={stylesModule['button-Website']}
            >
              Website
            </Button>
            <Button color="success" icon="mobile" className={stylesModule['button-Mobile']}>
              Mobile App
            </Button> */}
          </div>
        ),
      },
    ];
    return columns;
  };

  useEffect(() => {
    dispatch({
      type: 'crmMarketingManageAdd/GET_POSTS',
      payload: {
        marketing_program_id: params.id,
      },
    });
  }, []);

  return (
    <>
      <div >
        <Form layout="vertical" ref={formRef} onFinish>
          <Pane className="card">
            <Pane style={{ padding: 20 }} className="pb-0">
              <Heading type="page-title">Danh sách bài viết</Heading>
            </Pane>
            <Pane style={{ padding: 20 }}>
              <Form layout="vertical">
                <Pane className="row" style={{ display: 'flex', paddingRight: 20 }}>
                  <Button
                    className="ml-auto mb10"
                    color="success"
                    icon="plus"
                    onClick={() => history.push(`${pathname}/them-bai-viet`)}
                  >
                    Tạo mới
                  </Button>
                </Pane>
              </Form>
              <Table
                columns={header()}
                dataSource={posts}
                pagination={false}
                loading={loading}
                className="table-edit"
                isEmpty
                params={{
                  header: header(),
                  type: 'table',
                }}
                bordered={false}
                rowKey={(record) => record.id}
                scroll={{ x: '100%', y: 'calc(100vh - 150px)' }}
              />
            </Pane>
          </Pane>
        </Form>
      </div>
    </>
  );
});

export default Index;
