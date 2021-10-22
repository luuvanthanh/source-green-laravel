import { memo, useRef, useEffect } from 'react';
import { Form, Steps } from 'antd';
import { useParams } from 'umi';
import { isEmpty, get } from 'lodash';
import { useSelector, useDispatch } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { variables, Helper } from '@/utils';
import { CheckCircleOutlined } from '@ant-design/icons';
import Loading from '@/components/CommonComponent/Loading';
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
    lead,
    error,
    loading: { effects },
  } = useSelector(({ loading, crmSaleParentsPotentialAdd }) => ({
    loading,
    lead: crmSaleParentsPotentialAdd.lead,
    error: crmSaleParentsPotentialAdd.error,
    details: crmSaleParentsPotentialAdd.details,
    parentLead: crmSaleParentsPotentialAdd.parentLead,
    detailsLead: crmSaleParentsPotentialAdd.detailsLead,
    data: crmSaleParentsPotentialAdd.data,
  }));

  const loadingSubmit = effects[`crmSaleParentsPotentialAdd/ADD_STATUS_LEAD`];
  const loading = effects[`crmSaleParentsPotentialAdd/GET_STATUS_LEAD`];

  const onFinish = (values) => {
    dispatch({
      type: 'crmSaleParentsPotentialAdd/ADD_STATUS_LEAD',
      payload: {
        ...values,
        customer_potential_id: params.id,
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
        render: (record) => get(record, 'name'),
      },
    ];
    return columns;
  };
  return (
    <Form layout="vertical" initialValues={{ data: [{}] }} ref={formRef} onFinish={onFinish}>
      <div className="card">
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <div style={{ padding: 20 }} className="pb-0 border-bottom">
            <Heading type="form-title" style={{ marginBottom: 20 }}>
              Tình trạng tiềm năng
            </Heading>
            <div className="row " style={{ marginBottom: 20 }}>
              <Pane className="col-lg-12 ">
                <Steps
                  labelPlacement="vertical"
                  current={lead.length-1}
                  size="small"
                  className={stylesModule['wrapper-step']}
                >
                  {parentLead.map((items) => (
                    <Step title={items.name} icon={<CheckCircleOutlined />} />
                  ))}
                </Steps>
              </Pane>
            </div>
            <div className="row">
              <Pane className="col-lg-6">
                <FormItem
                  options={['id', 'name']}
                  name="status_parent_potential_id"
                  data={parentLead}
                  placeholder="Chọn"
                  label="Tình trạng chăm sóc của phụ huynh tiềm năng"
                  type={variables.SELECT}
                  rules={[variables.RULES.EMPTY_INPUT]}
                />
              </Pane>
            </div>
            <div className={stylesModule['wrapper-btn']}>
              <Button
                color="success"
                size="normal"
                htmlType="submit"
                loading={loadingSubmit || loading}
              >
                Lưu
              </Button>
            </div>
          </div>
        </Loading>
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
  );
});

export default General;
