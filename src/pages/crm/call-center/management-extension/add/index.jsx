import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'umi';
import { Form } from 'antd';
import styles from '@/assets/styles/Common/common.scss';
import classnames from 'classnames';
import { get } from 'lodash';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Loading from '@/components/CommonComponent/Loading';
import Table from '@/components/CommonComponent/Table';
import { useDispatch, useSelector } from 'dva';
import Heading from '@/components/CommonComponent/Heading';

function Index() {
  const [formRef] = Form.useForm();
  const dispatch = useDispatch();
  const { params } = useRouteMatch();
  const history = useHistory();

  const [
    { error },
    loading,
    { menuLeftCRM },
  ] = useSelector(({ loading: { effects }, seasonalContractsAdd, menu }) => [
    seasonalContractsAdd,
    effects,
    menu,
  ]);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'seasonalContractsAdd/GET_DETAILS_DATA',
        payload: {
          id: params.id,
        },
      });
    }
  }, []);

  const header = () => {
    const columns = [
      {
        title: 'Máy lẻ',
        key: 'extension',
        className: 'min-width-80',
        width: 80,
        render: (record) => get(record, 'extension'),
      },
      {
        title: 'Loại cuộc gọi',
        key: 'type_call',
        width: 150,
        className: 'min-width-150',
        render: (record) => get(record, 'type_call'),
      },
      {
        title: 'Số điện thoại',
        key: 'phone_number',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'phone_number'),
      },
      {
        title: 'Trạng thái',
        key: 'status',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'status'),
      },
      {
        title: 'Call ID',
        key: 'call_id',
        width: 80,
        className: 'min-width-80',
        render: (record) => get(record, 'call_id'),
      },
    ];
    return columns;
  };

  const onFinish = () => {};

  return (
    <>
      <Breadcrumbs last="Tạo mới" menu={menuLeftCRM} />
      <Form className={styles['layout-form']} layout="vertical" form={formRef} onFinish={onFinish}>
        <div className={styles['content-form']}>
          <Loading
            isError={error.isError}
            params={{ error, type: 'container', goBack: '/quan-ly-nhan-su/hop-dong-thoi-vu' }}
          >
            <div className="row">
              <div className="col-lg-10 offset-lg-1">
                <div className={classnames(styles['content-children'], 'mt0')}>
                  <Heading type="form-title" className="mb15">
                    Thông tin máy lẻ
                  </Heading>
                  <div className="row">
                    <div className="col-lg-4">
                      <FormItem label="Tài khoản" name="username" type={variables.INPUT} disabled />
                    </div>
                    <div className="col-lg-4">
                      <FormItem label="Mật khẩu" name="password" type={variables.INPUT} disabled />
                    </div>
                    <div className="col-lg-4">
                      <FormItem label="Hostname" name="hostname" type={variables.INPUT} disabled />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-4">
                      <FormItem label="Port" name="port" type={variables.INPUT} disabled />
                    </div>
                    <div className="col-lg-4">
                      <FormItem label="Path" name="path" type={variables.INPUT} disabled />
                    </div>
                    <div className="col-lg-4">
                      <FormItem
                        label="Nhân viên trực tổng đài"
                        name="saler"
                        type={variables.SELECT}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-lg-12">
                      <div className="ant-col ant-form-item-label">
                        <label htmlFor="table">
                          <span>Thông tin cuộc gọi</span>
                        </label>
                      </div>
                      <Table
                        columns={header()}
                        // dataSource={data}
                        pagination={false}
                        className={classnames('mb15', styles['statistical-table'])}
                        isEmpty
                        params={{
                          header: header(),
                          type: 'table',
                        }}
                        bordered
                        rowKey={(record) => record.id}
                        scroll={{ x: '100%' }}
                      />
                    </div>
                  </div>
                </div>

                <div className={classnames('d-flex', 'justify-content-between', 'mt-4')}>
                  <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                    Hủy
                  </p>
                  <Button
                    color="success"
                    htmlType="submit"
                    loading={
                      loading['seasonalContractsAdd/ADD'] || loading['seasonalContractsAdd/UPDATE']
                    }
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            </div>
          </Loading>
        </div>
      </Form>
    </>
  );
}

export default Index;
