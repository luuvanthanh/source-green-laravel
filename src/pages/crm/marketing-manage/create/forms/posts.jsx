import { memo, useRef, useState, useEffect } from 'react';
import { Form } from 'antd';
import { head, get, isEmpty, } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import classnames from 'classnames';
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
  } = useSelector(({ loading, crmMarketingManageAdd }) => ({
    loading,
    posts: crmMarketingManageAdd.posts,
  }));
  const loading = effects[`crmMarketingManageAdd/GET_POSTS`];
  const dispatch = useDispatch();
  const params = useParams();
  const formRef = useRef();
  const mounted = useRef(false);
  const history = useHistory();
  const { pathname } = useLocation();
  const [pageCurrent, setPageCurrent] = useState({});
  const [{ user }] = useSelector(({ crmMarketingManageAdd }) => [crmMarketingManageAdd]);

  const responseFacebook = (response) => {
    dispatch({
      type: 'crmMarketingManageAdd/GET_USER',
      payload: response,
    });
  };

  useEffect(() => {
    dispatch({
      type: 'crmMarketingManageAdd/GET_PAGES',
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
  }, []);
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
        className: 'min-width-150',
        width: 150,
        render: (record) => Helper.getDate(record.created_at, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Hình ảnh ',
        key: 'img',
        className: 'min-width-100',
        width: 100,
        render: (record) => <AvatarTable fileImage={Helper.getPathAvatarJson(record.file_image)} />,
      },
      {
        title: 'Bài viết',
        key: 'name',
        className: 'min-width-250',
        width: 250,
        render: (record) => (
          <p
            role="presentation"
            className={stylesModule['wrapper-posts']}
            onClick={() => history.push(`${pathname}/${record.id}/chi-tiet`)}
          >
            {record?.name}
          </p>
        ),
      },
      {
        title: 'Đăng lên',
        key: 'action',
        width: 320,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="facebook"
              size="small"
              className={stylesModule['button-fb']}
              onClick={() => onFinish(record.id)}
            >
              Fanpage
            </Button>
            <Button
              color="primary"
              icon="sphere"
              size="normal"
              className={stylesModule['button-Website']}
            >
              Website
            </Button>
            <Button color="success" icon="mobile" className={stylesModule['button-Mobile']}>
              Mobile App
            </Button>
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
      <div className={classnames('row', stylesModule.wrapper)}>
        {isEmpty(user) && (
          <div className={stylesModule['wrapper-login']}>
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
                  className={stylesModule['button-login']}
                >
                  Login FB
                </button>
              )}
            />
          </div>
        )}
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
                scroll={{ x: '100%' }}
              />
            </Pane>
          </Pane>
        </Form>
      </div>
    </>
  );
});

export default Index;