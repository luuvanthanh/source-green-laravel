import { memo, useRef, useEffect } from 'react';
import { Form } from 'antd';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Table from '@/components/CommonComponent/Table';
import { useLocation, useParams, useHistory } from 'umi';
import AvatarTable from '@/components/CommonComponent/AvatarTable';
import { useSelector, useDispatch } from 'dva';
import FormItem from '@/components/CommonComponent/FormItem';
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
        render: () => (
          <div className={styles['list-button']}>
            <Button
              color="primary"
              icon="facebook"
              size="small"
              className={stylesModule['button-fb']}
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
      <Form layout="vertical" ref={formRef} onFinish>
        <Pane className="card">
          <Pane style={{ padding: 20 }} className="pb-0">
            <Heading type="page-title">Danh sách bài viết</Heading>
          </Pane>
          <Pane style={{ padding: 20 }}>
            <Form layout="vertical">
              <Pane className="row" style={{ display: 'flex', paddingRight: 20 }}>
                <Pane className="col-lg-5">
                  <FormItem
                    type={variables.INPUT_SEARCH}
                    name="keyWord"
                    placeholder="Nhập từ khóa tìm kiếm"
                  />
                </Pane>
                <Button
                  className="ml-auto"
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
    </>
  );
});

export default Index;
