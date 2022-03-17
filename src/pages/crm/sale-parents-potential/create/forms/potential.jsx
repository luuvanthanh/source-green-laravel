import { memo, useRef, useEffect } from 'react';
import { Form, Steps } from 'antd';
import { useParams } from 'umi';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { variables, Helper } from '@/utils';
import { CheckCircleOutlined } from '@ant-design/icons';
import Table from '@/components/CommonComponent/Table';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import stylesModule from '../../styles.module.scss';

const { Step } = Steps;
const General = memo(() => {
  const formRef = useRef();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    parentLead,
    details,
    lead,
    user,
    loading: { effects },
  } = useSelector(({ loading, crmSaleParentsPotentialAdd, user }) => ({
    loading,
    lead: crmSaleParentsPotentialAdd.lead,
    error: crmSaleParentsPotentialAdd.error,
    details: crmSaleParentsPotentialAdd.details,
    parentLead: crmSaleParentsPotentialAdd.parentLead,
    detailsLead: crmSaleParentsPotentialAdd.detailsLead,
    data: crmSaleParentsPotentialAdd.data,
    user: user.user,
  }));

  const loadingSubmit = effects[`crmSaleParentsPotentialAdd/ADD_STATUS_LEAD`];
  const loading = effects[`crmSaleParentsPotentialAdd/GET_STATUS_LEAD`];

  const onFinish = (values) => {
    dispatch({
      type: 'crmSaleParentsPotentialAdd/ADD_STATUS_LEAD',
      payload: {
        ...values,
        customer_potential_id: params.id,
        user_update_id: user?.id,
        user_update_info: user,
      },
      callback: (response, error) => {
        if (response) {
          dispatch({
            type: 'crmSaleParentsPotentialAdd/GET_STATUS_LEAD',
            payload: {
              customer_potential_id: params.id,
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
    dispatch({
      type: 'crmSaleParentsPotentialAdd/GET_PARENT_LEAD',
      payload: {},
    });
  }, []);

  useEffect(() => {
    dispatch({
      type: 'crmSaleParentsPotentialAdd/GET_STATUS_LEAD',
      payload: {
        customer_potential_id: params.id,
      },
    });
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (details?.customerPotentialStatusCare?.filter(i => i?.statusParentPotential?.number === 3).length <= 0 && details?.customerPotentialStatusCare?.filter(i => i?.statusParentPotential?.number === 4) <= 0) {
      formRef.current.setFieldsValue({
        status_parent_potential_id: details?.customerPotentialStatusCare[(details?.customerPotentialStatusCare?.length - 1)]?.status_parent_potential_id,
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
        render: (record) => <Text size="normal">{get(record, 'statusParentPotential.name')}</Text>,
      },
      {
        title: 'Người cập nhật',
        key: 'name',
        className: 'max-width-150',
        width: 150,
        render: (record) => <Text size="normal">{record?.user_update_info?.name}</Text>,
      },
    ];
    return columns;
  };

  return (
    <Form layout="vertical" initialValues={{ data: [{}] }} ref={formRef} onFinish={onFinish}>
      <div className="card">
        <>
          <div style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Tình trạng tiềm năng
            </Heading>
            <div className="row " style={{ marginBottom: 20 }}>
              <Pane className="col-lg-12 ">
                <Steps
                  labelPlacement="vertical"
                  current={lead[0]?.statusParentPotential?.number - 1}
                  size="small"
                  className={stylesModule['wrapper-step']}
                >
                  {parentLead.map((items, index) => (
                    <Step title={items.name} icon={<CheckCircleOutlined />} key={index} />
                  ))}
                </Steps>
              </Pane>
            </div>
            <div className="row">
              {
                lead[0]?.statusParentPotential?.number === 3 || lead[0]?.statusParentPotential?.number  === 4 ?
                  <Pane className="col-lg-6">
                    <FormItem
                      options={['id', 'name']}
                      name="status_parent_potential_id"
                      data={parentLead.filter(i => i?.use === false)}
                      placeholder="Chọn"
                      label="Tình trạng chăm sóc của phụ huynh tiềm năng"
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY_INPUT]}
                      disabled
                    />
                  </Pane>
                  :
                  <Pane className="col-lg-6">
                    <FormItem
                      options={['id', 'name']}
                      name="status_parent_potential_id"
                      data={parentLead.filter(i => i?.use === false)}
                      placeholder="Chọn"
                      label="Tình trạng chăm sóc của phụ huynh tiềm năng"
                      type={variables.SELECT}
                      rules={[variables.RULES.EMPTY_INPUT]}
                    />
                  </Pane>
              }
            </div>
            <div className={stylesModule['wrapper-btn']}>
              {
                lead[0]?.statusParentPotential?.number === 3 || lead[0]?.statusParentPotential?.number  === 4 ?
                  <Button
                  color="success"  className="ml-4" disabled
                  >
                    Lưu
                  </Button>:
                  <Button
                    color="success"
                    size="normal"
                    htmlType="submit"
                    loading={loadingSubmit || loading}
                  >
                    Lưu
                  </Button> 
              }
            </div>
          </div>
        </>
      </div>
      <div className="card">
        <div style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Lịch sử chăm sóc
          </Heading>
          <div className="row">
            <Pane className="col-lg-12">
              <div className={stylesModule['wrapper-table']}>
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
              </div>
            </Pane>
          </div>
        </div>
      </div>
    </Form>
  );
});

export default General;
