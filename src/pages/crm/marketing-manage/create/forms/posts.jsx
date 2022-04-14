import { memo, useRef, useState, useEffect } from 'react';
import { Form, Modal, Checkbox } from 'antd';
import { get, isEmpty } from 'lodash';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Table from '@/components/CommonComponent/Table';
import classnames from 'classnames';
import { useLocation, useParams, useHistory } from 'umi';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { useSelector, useDispatch } from 'dva';
import Button from '@/components/CommonComponent/Button';
import { Helper, variables } from '@/utils';
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
  const [page, setPage] = useState([]);
  const [checkModal, setCheckModal] = useState(false);
  const [dataModal, setDataModal] = useState({});

  const [checkPage, setCheckPage] = useState([]);



  const local = JSON?.parse(localStorage.getItem('pageCurrent'));


  useEffect(() => {
    const page = JSON?.parse(localStorage.getItem('pageCurrent'));
    if (page?.length > 0) {
      setPage(page);
    }
  }, [local?.length > 0]);

  const handleOk = () => {
    if (checkPage?.length > 0) {
      dispatch({
        type: 'crmMarketingManageAdd/ADD_FACEBOOK',
        payload: {
          article_id: dataModal?.id,
          data_page: checkPage?.map(i =>
          ({
            page_id: i?.id,
            page_access_token: i.access_token,
          })
          )
        },
        callback: (response, error) => {
          setCheckModal(false);
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
    }
  };

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const onChangeModal = (record) => {
    setCheckModal(true);
    setDataModal(record);
  };
  /**
   * Function header table
   */
  const header = () => {
    const columns = [
      {
        title: 'Thời gian ',
        key: 'date',
        width: 80,
        className: "min-width-80",
        render: (record) => Helper.getDate(record.created_at, variables.DATE_FORMAT.DATE),
      },
      {
        title: 'Hình ảnh ',
        key: 'img',
        width: 80,
        className: "min-width-80",
        render: (record) => <AvatarTable fileImage={Helper.getPathAvatarJson(record?.file_image)} />,
      },
      {
        title: 'Bài viết',
        key: 'name',
        width: 200,
        className: "min-width-200",
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
        className: "min-width-100",
        render: (record) => (
        <p  role="presentation" onClick={() => history.push(`/crm/tiep-thi/quan-ly-chien-dich-marketing/chi-tiet/${record.id}/chi-tiet-bai-viet`)}>
          {record?.quantity_reaction || 0}</p>)
      },
      {
        title: 'Lượt share',
        key: 'img',
        width: 100,
        className: "min-width-100",
        render: (record) => (
          <p  role="presentation" onClick={() => history.push(`/crm/tiep-thi/quan-ly-chien-dich-marketing/chi-tiet/${record.id}/chi-tiet-bai-viet`)}>
            {record?.quantity_share || 0}</p>)
      },
      {
        title: 'Lượt comment',
        key: 'img',
        width: 100,
        className: "min-width-100",
        render: (record) => (
          <p  role="presentation" onClick={() => history.push(`/crm/tiep-thi/quan-ly-chien-dich-marketing/chi-tiet/${record.id}/chi-tiet-bai-viet`)}>
            {record?.quantity_comment || 0}</p>)
      },
      {
        title: 'Đăng lên',
        key: 'action',
        width: 130,
        className: classnames('min-width-130', 'max-width-130'),
        fixed: 'right',
        render: (record) => (
          <>
            {isEmpty(JSON?.parse(localStorage.getItem('pageCurrent'))) && (
              <div
                role="presentation"
                className={stylesModule['loginFacebook-container']}
              >
                <div className={classnames('icon-facebook', stylesModule.loginIcon)} />
                <div className={stylesModule.login} role="presentation">
                  Login FB
                </div>
              </div>
            )}
            {!isEmpty(JSON?.parse(localStorage.getItem('pageCurrent'))) && (
              <Button
                color="primary"
                icon="facebook"
                size="small"
                className={stylesModule['button-fb']}
                onClick={() => onChangeModal(record)}
              >
                Đăng bài
              </Button>
            )}
          </>
        ),
      },
    ];
    return columns;
  };

  useEffect(() => {
    if(page?.length > 0){
    const details = page?.map(i =>
    ({
      page_id: i?.id,
      page_access_token: i.access_token,
    }));
    dispatch({
      type: 'crmMarketingManageAdd/GET_POSTS',
      payload: {
        marketing_program_id: params.id,
        data_page: JSON.stringify(details),
      }
    });
    }
  }, [page?.length > 0]);

  const handleCancel = () => {
    setCheckModal(false);
  };

  const onChangeCheckBox = (e) => {
    setCheckPage(e);
  };

  return (
    <>
      <Modal
        title="Đăng fanpage"
        centered
        className={stylesModule['wrapper-modal-check']}
        visible={checkModal}
        onOk={handleOk}
        onCancel={handleCancel}
        width={400}
        footer={[
          <div key="back" className={stylesModule['wrapper-modal-footer']}>
            <p
              key="back"
              role="presentation"
              onClick={handleCancel}
              className={stylesModule['button-cancel']}
            >
              Đóng
            </p>
            <Button
              htmlType="submit"
              color="success"
              type="primary"
              onClick={handleOk}
              loading={effects['crmMarketingManageAdd/ADD_FACEBOOK']}
            >
              Đăng bài
            </Button>
          </div>
        ]}
      >
        <Pane className={stylesModule['wrapper-modal-content']}>
          <div className={stylesModule['wrapper-modal-title']}>
            <h3 className={stylesModule.title}>Bài viết</h3>
            <p className={stylesModule.content}>{dataModal?.name}</p>
          </div>
          <div>
            <Pane className="row">
              <Pane className="col-lg-12">
                <Heading style={{ marginBottom: 12 }} className={stylesModule['modal-name']}>
                  Đăng bài lên fanpage
                </Heading>
              </Pane>

              <Checkbox.Group style={{ width: '100%' }} onChange={onChangeCheckBox}>
                {page?.map((i, index) =>
                  <Pane className="col-lg-12 pb10" key={index}>
                    <Checkbox value={i} className={stylesModule['modal-check']}>{i?.name}</Checkbox>
                  </Pane>)
                }

              </Checkbox.Group>
            </Pane>
          </div>
        </Pane>
      </Modal>
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
