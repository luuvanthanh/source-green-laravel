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
  detailsAccount: OPParentsAdd.detailsAccount,
});
const Curator = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, detailsAccount, error }) => {
    const formRef = useRef();

    const loadingSubmit = effects[`OPParentsAdd/UPDATE_NOTIFICATION_MODULE`];
    const loading =
      effects[`OPParentsAdd/GET_DETAILS`] ||
      effects[`OPParentsAdd/GET_EMPLOYEES`] ||
      effects['OPParentsAdd/GET_NOTIFICATION_MODULE'];
    const [dataSource, setDataSoure] = useState([]);

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = () => {
      dispatch({
        type: 'OPParentsAdd/UPDATE_NOTIFICATION_MODULE',
        payload: dataSource.map((item) => ({
          userId: detailsAccount?.user?.id,
          notificationModuleId: item?.moduleId,
          notificationTypeId: item?.usingType?.id,
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
          type: 'OPParentsAdd/GET_DETAILS_ACCOUNT',
          payload: params,
        });
        dispatch({
          type: 'OPParentsAdd/GET_DETAILS',
          payload: params,
        });
      }
    }, [params.id]);

    useEffect(() => {
      if (params.id && !isEmpty(detailsAccount)) {
        dispatch({
          type: 'OPParentsAdd/GET_NOTIFICATION_MODULE',
          payload: {
            id: detailsAccount?.user?.id,
          },
          callback: (response) => {
            if (response) {
              setDataSoure(response?.notificationTypeGroupByModule || []);
            }
          },
        });
      }
    }, [params.id, detailsAccount]);

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          ...details,
        });
      }
    }, [details]);

    const onChangeTypes = (e, record) => {
      const moduleTypeGroupByName = record?.moduleTypeGroupByNames?.find(
        (item) => item?.notificationType?.id === e,
      );
      setDataSoure((prev) =>
        prev.map((item) => {
          if (item?.moduleId === record?.moduleId) {
            return {
              ...item,
              usingType: moduleTypeGroupByName?.notificationType,
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
        render: (record) => record?.name,
      },
      {
        title: 'Hình thức nhận',
        key: 'type',
        className: 'min-width-200',
        render: (record) => (
          <Select
            value={!isEmpty(record?.moduleTypeGroupByNames) && record?.usingType?.id}
            className="w-100"
            dataSet={record?.moduleTypeGroupByNames?.map((item) => ({
              id: item?.notificationType?.id,
              name: item?.notificationType?.name,
            }))}
            onChange={(e) => onChangeTypes(e, record)}
          />
        ),
      },
    ];

    return (
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Pane className="card">
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            {!isEmpty(detailsAccount) && (
              <>
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
              </>
            )}
          </Loading>
        </Pane>
      </Form>
    );
  },
);

Curator.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  detailsAccount: PropTypes.objectOf(PropTypes.any),
};

Curator.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
  detailsAccount: {},
};

export default withRouter(connect(mapStateToProps)(Curator));
