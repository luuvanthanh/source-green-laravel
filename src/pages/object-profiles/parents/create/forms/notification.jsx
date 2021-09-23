import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { head, isEmpty } from 'lodash';
import Loading from '@/components/CommonComponent/Loading';
import Table from '@/components/CommonComponent/Table';
import Select from '@/components/CommonComponent/Select';

const mapStateToProps = ({ loading, OPParentsAdd }) => ({
  loading,
  details: OPParentsAdd.details,
  error: OPParentsAdd.error,
  employees: OPParentsAdd.employees,
});
const Curator = memo(({ dispatch, loading: { effects }, match: { params }, details, error }) => {
  const formRef = useRef();

  const loadingSubmit = effects[`OPParentsAdd/ADD`] || effects[`OPParentsAdd/UPDATE`];
  const loading =
    effects[`OPParentsAdd/GET_DETAILS`] ||
    effects[`OPParentsAdd/GET_EMPLOYEES`] ||
    effects['OPParentsAdd/GET_NOTIFICATION_MODULE'];
  const [types, setTypes] = useState([]);
  const [dataSource, setDataSoure] = useState([]);

  /**
   * Function submit form modal
   * @param {object} values values of form
   */
  const onFinish = () => {
    dispatch({
      type: 'OPParentsAdd/UPDATE_NOTIFICATION_MODULE',
      payload: dataSource.map((item) => ({
        userId: params.id,
        notificationModuleId: item?.notificationModule?.id,
        notificationTypeId: item?.notificationType?.id,
      })),
      callback: (response, error) => {
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.current.setFields([
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

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'OPParentsAdd/GET_DETAILS',
        payload: params,
      });
      dispatch({
        type: 'OPParentsAdd/GET_NOTIFICATION_TYPES',
        payload: params,
        callback: (response) => {
          if (response) {
            setTypes(response.items);
          }
        },
      });
      dispatch({
        type: 'OPParentsAdd/GET_NOTIFICATION_MODULE',
        payload: params,
        callback: (response) => {
          if (response) {
            setDataSoure(response);
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (!isEmpty(details) && params.id) {
      formRef.current.setFieldsValue({
        ...details,
      });
    }
  }, [details]);

  const onChangeTypes = (e, record) => {
    const notificationType = types.find((item) => item.id === e);
    setDataSoure((prev) =>
      prev.map((item) => {
        if (item.id === record.id) {
          return {
            ...item,
            notificationType,
          };
        }
        return item;
      }),
    );
  };

  /**
   * Function header table
   */
  const header = () => [
    {
      title: 'STT',
      key: 'index',
      align: 'center',
      className: 'min-width-60',
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Tên module',
      key: 'name',
      className: 'min-width-130',
      render: (record) => record?.notificationModule?.name,
    },
    {
      title: 'Hình thức nhận',
      key: 'type',
      className: 'min-width-200',
      render: (record) => (
        <Select
          value={record?.notificationType?.id}
          className="w-100"
          dataSet={types}
          onChange={(e) => onChangeTypes(e, record)}
        />
      ),
    },
  ];

  return (
    <Form layout="vertical" ref={formRef} onFinish={onFinish}>
      <Pane className="card">
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Cấu hình thông báo
            </Heading>

            <Table
              columns={header()}
              dataSource={dataSource}
              loading={loading}
              pagination={false}
              params={{
                header: header(),
                type: 'table',
              }}
              bordered={false}
              rowKey={(record) => record.name || record.id}
              scroll={{ x: '100%', y: '60vh' }}
            />
          </Pane>

          <Pane style={{ padding: 20 }}>
            <Button
              color="success"
              size="large"
              htmlType="submit"
              style={{ marginLeft: 'auto' }}
              loading={loadingSubmit}
            >
              Lưu
            </Button>
          </Pane>
        </Loading>
      </Pane>
    </Form>
  );
});

Curator.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Curator.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
};

export default withRouter(connect(mapStateToProps)(Curator));
