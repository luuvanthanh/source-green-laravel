import { memo, useRef, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import styles from '@/assets/styles/Common/common.scss';
import Loading from '@/components/CommonComponent/Loading';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import { Helper } from '@/utils';
import stylesModule from '../../styles.module.scss';

const marginProps = { style: { marginBottom: 12 } };

const mapStateToProps = ({ loading, crmSaleLeadAdd }) => ({
  loading,
  details: crmSaleLeadAdd.details,
  error: crmSaleLeadAdd.error,
  branches: crmSaleLeadAdd.branches,
  classes: crmSaleLeadAdd.classes,
  parentLead: crmSaleLeadAdd.parentLead,
  lead: crmSaleLeadAdd.lead,
  parentPotential: crmSaleLeadAdd.parentPotential,
});
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, parentLead, lead, parentPotential }) => {
    const formRef = useRef();
    const formPotential = useRef();

    const mounted = useRef(false);
    const [visible, setVisible] = useState(false);

    const mountedSet = (setFunction, value) =>
      !!mounted?.current && setFunction && setFunction(value);
    const loadingSubmit =
      effects[`crmSaleLeadAdd/ADD`] ||
      effects[`crmSaleLeadAdd/UPDATE`] ||
      effects[`crmSaleLeadAdd/UPDATE_STATUS`];
    const loading = effects[`crmSaleLeadAdd/GET_DETAILS`];


    const loadingSubmitPotential =
      effects[`crmSaleLeadAdd/ADD_POTENTIAL`];

    useEffect(() => {
      dispatch({
        type: 'crmSaleLeadAdd/GET_STATUS_LEAD',
        payload: {
          customer_lead_id: params.id,
        },
      });
      dispatch({
        type: 'crmSaleLeadAdd/GET_PARENT_LEAD',
        payload: {},
      });
    }, [params.id]);

    const handleOk = () => {
      mountedSet(setVisible, true);
      dispatch({
        type: 'crmSaleLeadAdd/GET_DETAILS',
        payload: params,
      });
      dispatch({
        type: 'crmSaleLeadAdd/GET_PARENT_POTENTIAL',
        payload: {},
      });
    };

    const cancelModal = () => {
      mountedSet(setVisible, false);
    };


    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onPotential = () => {
      formPotential.current.validateFields().then((values) => {
        dispatch({
          type: "crmSaleLeadAdd/ADD_POTENTIAL",
          payload: { statusPotential: values.statusPotential, id: params.id },
          callback: (response, error) => {
            if (response) {
              mountedSet(setVisible, false);
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
      });
    };

    const onFinish = (values) => {
      dispatch({
        type: 'crmSaleLeadAdd/ADD_STATUS_LEAD',
        payload: {
          ...values,
          customer_lead_id: params.id,
        },
        callback: (response, error) => {
          if (response) {
            dispatch({
              type: 'crmSaleLeadAdd/GET_STATUS_LEAD',
              payload: {
                customer_lead_id: params.id,
              },
            });
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

    useEffect(() => {
      if (visible) {
        formPotential.current.setFieldsValue({
          ...details,
          ...head(details.positionLevel),
          birth_date: details.birth_date && moment(details.birth_date),
          created_at: details.created_at && moment(details.created_at),
        });
      }
    }, [details]);


    const header = () => {
      const columns = [
        {
          title: 'Ngày cập nhật',
          key: 'day',
          className: 'max-width-200',
          width: 200,
          render: (record) =>
            Helper.getDate(get(record, 'updated_at'), variables.DATE_FORMAT.DATE_TIME),
        },
        {
          title: 'Tên tình trạng chăm sóc',
          key: 'statusParent',
          className: 'min-width-150',
          render: (record) => <Text size="normal">{get(record, 'statusParentLead.name')}</Text>,
        },
        {
          title: 'Người cập nhật',
          key: 'name',
          className: 'max-width-150',
          width: 150,
          render: (record) => get(record, 'name'),
        },
      ];
      return columns;
    };
    return (
      <>
        <Form layout="vertical" ref={formRef} onFinish={onFinish}>
          <div className="card">
            <div style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Tình trạng chăm sóc phụ huynh lead
              </Heading>
              <Pane className="row mt20">
                <Pane className="col-lg-12">
                  <span className={styles['assignment-title']}>Tình trạng chăm sóc</span>
                </Pane>
                <Pane className="col-lg-4 mt10">
                  <FormItem
                    options={['id', 'name']}
                    name="status_parent_lead_id"
                    data={parentLead}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className={styles[('order-assignment-btn', 'col-lg-3')]}>
                  <Button color="success" ghost icon="next" onClick={handleOk} className="mt10">
                    Tạo tiềm năng
                  </Button>
                </Pane>
                <Modal
                  visible={visible}
                  title="Tạo tiềm năng"
                  onOk={handleOk}
                  centered
                  className={stylesModule['wrapper-modal-check']}
                  width={700}
                  onCancel={cancelModal}
                  footer={
                    <>
                      <p
                        role="presentation"
                        key="cancel"
                        color="white"
                        icon="fe-x"
                        onClick={cancelModal}
                        loading={loadingSubmit}
                        className={stylesModule['button-cancel']}
                      >
                        Hủy
                      </p>
                      <Button
                        key="choose"
                        color="success"
                        icon="fe-save"
                        loading={loadingSubmitPotential}
                        onClick={onPotential}
                      >
                        Tạo
                      </Button>
                    </>
                  }
                >

                  <Form layout="vertical" ref={formPotential}>
                    <Pane className="card">
                      <Loading loading={loading} isError={error.isError} params={{ error }}>
                        <Pane style={{ padding: 20 }} className="pb-0">
                          <Pane className="row" {...marginProps}>
                            <Pane className="col-lg-6">
                              <FormItem
                                name="full_name"
                                label="Họ và tên"
                                type={variables.INPUT}
                                disabled
                              />
                            </Pane>
                            <Pane className="col-lg-6">
                              <FormItem
                                name="phone"
                                label="Số điện thoại"
                                type={variables.INPUT}
                                disabled
                              />
                            </Pane>
                            <Pane className="col-lg-6">
                              <FormItem
                                name="address"
                                label="Địa chỉ"
                                type={variables.INPUT}
                                disabled
                              />
                            </Pane>
                            <Pane className="col-lg-6">
                              <FormItem
                                name="created_at"
                                label="Ngày tạo"
                                type={variables.DATE_PICKER}
                                disabledDate={(current) => current > moment()}
                                disabled
                              />
                            </Pane>

                            <Pane className="col-lg-6">
                              <FormItem
                                options={['id', 'name']}
                                name="statusPotential"
                                data={parentPotential}
                                placeholder="Chọn"
                                type={variables.SELECT}
                                label="Tình trạng tiềm năng"
                                rules={[variables.RULES.EMPTY_INPUT]}
                              />
                            </Pane>
                          </Pane>
                        </Pane>
                      </Loading>
                    </Pane>
                  </Form>
                </Modal>

              </Pane>
              <div className={stylesModule['wrapper-btn']}>
                <Button
                  color="success"
                  size="normal"
                  htmlType="submit"
                  loading={loadingSubmit}
                >
                  Lưu
                </Button>
              </div>
            </div>

          </div>
          <div className="card">
            <div style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Lịch sử chăm sóc
              </Heading>
              <div className="row">
                <Pane className="col-lg-12">
                  <Table
                    columns={header()}
                    dataSource={lead}
                    pagination={false}
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
              </div>
            </div>
          </div>
        </Form>
      </>
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  parentLead: PropTypes.arrayOf(PropTypes.any),
  lead: PropTypes.arrayOf(PropTypes.any),
  parentPotential: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  branches: [],
  classes: [],
  parentLead: [],
  lead: [],
  parentPotential: [],
};

export default withRouter(connect(mapStateToProps)(General));
