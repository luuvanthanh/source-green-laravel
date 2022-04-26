import styles from '@/assets/styles/Common/common.scss';
import FormItem from '@/components/CommonComponent/FormItem';
import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import Table from '@/components/CommonComponent/Table';
import { handleOutboundCall } from '@/pages/crm/call-center/pop-up/handleCallCenter';
import { variables } from '@/utils';
import { Form } from 'antd';
import { useDispatch, useSelector } from 'dva';
import moment from 'moment';
import { memo, useEffect, useRef, useState } from 'react';
import { useParams } from 'umi';
import stylesModule from '../../styles.module.scss';

const General = memo(() => {
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const audioRef = useRef(null);
  const [formRef] = Form.useForm();
  const [
    { details },
    { outboundHistory },
  ] = useSelector(({ crmSaleLeadAdd, crmManagementCall }) => [crmSaleLeadAdd, crmManagementCall]);
  const { outboundStatus, outboundContext } = handleOutboundCall();

  const [currentPhone, setCurrentPhone] = useState(null);

  useEffect(() => {
    dispatch({
      type: 'crmSaleLeadAdd/GET_DETAILS_CALL',
      payload: params,
      callback: (response) => {
        if (response) {
          formRef.setFieldsValue({
            phone: response.phone,
            other_phone: response.other_phone,
          });
        }
      },
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const callNumber = (phone) => {
    setCurrentPhone(phone);
    outboundContext(phone, audioRef.current);
  };

  useEffect(() => {
    if (currentPhone) {
      dispatch({
        type: 'crmManagementCall/IS_CLICK',
        payload: {
          isClickToCall: true,
          quickPhoneNumber: currentPhone,
          quickStatus: outboundStatus,
          outboundHistory,
        },
      });
    }
  }, [outboundStatus]);

  const header = () => {
    const columns = [
      {
        title: 'Ngày giờ gọi',
        key: 'created_at',
        width: 150,
        render: (record) => moment(record?.created_at).format(variables.DATE_FORMAT.DATE_TIME),
      },
      {
        title: 'Số gọi',
        key: 'phone',
        width: 150,
        render: (record) =>
          record?.direction === variables.DIRECTION_ENG.OUTBOUND
            ? record.switchboard
            : record.phone,
      },
      {
        title: 'Số nhận',
        key: 'phone',
        width: 150,
        render: (record) =>
          record?.direction === variables.DIRECTION_ENG.OUTBOUND
            ? record.phone
            : record.switchboard,
      },
      {
        title: 'Nội dung cuộc gọi',
        key: 'content',
        width: 150,
        render: (record) => record?.content,
      },
      {
        title: 'Người gọi',
        key: 'full_name',
        width: 150,
        render: (record) =>
          record?.direction === variables.DIRECTION_ENG.OUTBOUND && record?.employee?.full_name,
      },
      {
        title: 'Ghi âm',
        key: 'record_link',
        width: 150,
        render: (record) => (
          <div className={styles['files-container']}>
            <div className={styles.item}>
              <a
                href={record?.record_link}
                target="_blank"
                rel="noreferrer"
                className={styles['link-record']}
              >
                File ghi âm
              </a>
            </div>
          </div>
        ),
      },
    ];
    return columns;
  };

  return (
    <Form form={formRef} layout="vertical">
      <audio ref={audioRef} autoPlay>
        <track kind="captions" />
      </audio>
      <div className="card">
        <div style={{ padding: 20 }} className="pb-0 border-bottom">
          <Heading type="form-title" style={{ marginBottom: 20 }}>
            Thông tin cuộc gọi
          </Heading>
          <div className="row">
            <div className="col-lg-6 d-flex">
              <FormItem
                name="phone"
                label="Số điện thoại"
                className={stylesModule['phone-input']}
                type={variables.INPUT}
              />
              {details.phone && (
                <img
                  src="/images/telephone-small.svg"
                  alt="telephone-small"
                  className={stylesModule['call-icon']}
                  role="presentation"
                  onClick={() => callNumber(details.phone)}
                />
              )}
            </div>
            <div className="col-lg-6 d-flex">
              <FormItem
                name="other_phone"
                label="Số điện thoại khác"
                className={stylesModule['phone-input']}
                type={variables.INPUT}
              />
              {details.other_phone && (
                <img
                  src="/images/telephone-small.svg"
                  alt="telephone-small"
                  className={stylesModule['call-icon']}
                  role="presentation"
                  onClick={() => callNumber(details.other_phone)}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="border-bottom p20">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <Heading type="form-title">Lịch sử chăm sóc</Heading>
            {/* <Button
              color="success"
              icon="plus"
              onClick={() => history.push(`${pathname}/them-lich-su`)}
            >
              Thêm lịch sử
            </Button> */}
          </div>
          <div className="row">
            <Pane className="col-lg-12">
              <div className={stylesModule['wrapper-table']}>
                <Table
                  columns={header()}
                  dataSource={details?.historyCall}
                  pagination={false}
                  className="table-normal"
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
            </Pane>
          </div>
        </div>
      </div>
    </Form>
  );
});

export default General;
