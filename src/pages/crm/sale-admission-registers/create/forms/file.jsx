import { memo, useRef, useEffect } from 'react';
import { Form, Radio } from 'antd';
import { isEmpty, get } from 'lodash';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import Table from '@/components/CommonComponent/Table';
import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  data: crmSaleAdmissionAdd.data,
  details: crmSaleAdmissionAdd.details,
  error: crmSaleAdmissionAdd.error,
  branches: crmSaleAdmissionAdd.branches,
  classes: crmSaleAdmissionAdd.classes,
  city: crmSaleAdmissionAdd.city,
  district: crmSaleAdmissionAdd.district,
});
const General = memo(({ dispatch, loading: { effects }, match: { params }, details, error, data }) => {
  const formRef = useRef();
  const mounted = useRef(false);
  const loadingSubmit =
    effects[`crmSaleAdmissionAdd/ADD`] ||
    effects[`crmSaleAdmissionAdd/UPDATE`] ||
    effects[`crmSaleAdmissionAdd/UPDATE_STATUS`];
  const loading = effects[`crmSaleAdmissionAdd/GET_DETAILS`];

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'crmSaleAdmissionAdd/UPDATE' : 'crmSaleAdmissionAdd/ADD',
      payload: params.id
        ? { ...details, ...values, id: params.id }
        : { ...values, status: 'WORKING' },
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
    return mounted.current;
  }, []);

  const header = () => {
    const columns = [
      {
        title: 'STT',
        key: 'type',
        className: 'min-width-150',
        width: 150,
        dataIndex: 'full_name',
      },
      {
        title: 'Tên giấy tờ',
        key: 'type',
        className: 'min-width-150',
        width: 150,
      },
      {
        title: 'Tình trạng',
        key: 'format',
        className: 'min-width-250',
        width: 250,
        render: (record) => (
          <>
            <Radio.Group
            >
              <Radio value={record.full_name}>Đã nhận</Radio>
              <Radio value={record.full_name}>Chưa nhận</Radio>
            </Radio.Group>
          </>
        ),
      },
      {
        title: 'File đính kèm',
        key: 'name',
        className: 'min-width-150',
        width: 150,
      },
      {
        title: 'Thao tác',
        key: 'action',
        width: 100,
        fixed: 'right',
        render: () => (
          <div className={styles['list-button']}>
            <button
              type="button"
              className={styles['button-circle']}
            >
              <span className="icon-remove" />
            </button>
          </div>
        ),
      },
    ];
    return columns;
  };

  return (
    <Form layout="vertical" ref={formRef} onFinish={onFinish}>
      {/* <Pane className="card"> */}
      <Loading loading={loading} isError={error.isError} params={{ error }}>
        <Pane className="card">
          <Pane className="border-bottom">
            <Pane className="p20">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Thông tin hồ sơ
              </Heading>
              <div className={stylesModule['wrapper-table']}>
                <Table
                  columns={header()}
                  dataSource={data}
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
              </div>
            </Pane>
          </Pane>
          <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
            <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2">
              Lưu
            </Button>
          </Pane>
        </Pane>
      </Loading>
    </Form>
  );
});

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  data: [],
};

export default withRouter(connect(mapStateToProps)(General));
