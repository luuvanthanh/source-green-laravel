import { memo, useRef, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { useParams } from 'umi';
import TableCus from '@/components/CommonComponent/Table';
import classnames from 'classnames';
import { useSelector, useDispatch } from 'dva';

import Text from '@/components/CommonComponent/Text';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { Helper } from '@/utils';
import stylesModule from '../../styles.module.scss';


const General = memo(() => {
  const [
    medicalCheck
  ] = useSelector(({ crmSaleAdmissionAdd }) => [
    crmSaleAdmissionAdd.medicalCheck
  ]);
  const formRef = useRef();
  const params = useParams();
  const dispatch = useDispatch();
  const [formCheck, setFormCheck] = useState(false);



  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_MEDICAL',
        payload: { admission_register_id: params.id },
        callback(response) {
          if (response && response.parsePayload.length > 0) {
            setFormCheck(true);
          }
        }
      });
    }
  }, [params.id]);

  const columns = [
    {
      title: 'Bệnh đã mắc phải nằm viện',
      dataIndex: 'sick',
      key: 'sick',
      width: 200,
      className: classnames('min-width-200', 'max-width-200'),
      render: (value, record) => (
        <Input.TextArea
          value={record.sick}
          autoSize={{ minRows: 1, maxRows: 1 }}
          placeholder="Nhập"
        />
      ),
    },
    {
      title: 'Năm',
      dataIndex: 'year',
      key: 'year',
      width: 80,
      className: classnames('min-width-200', 'max-width-200'),
      render: (value, record) => (
        <Input.TextArea
          value={record.year}
          autoSize={{ minRows: 1, maxRows: 1 }}
          placeholder="Nhập"
        />
      ),
    },
    {
      title: 'Thời gian nằm viện',
      dataIndex: 'hospital_time',
      key: 'hospital_time',
      width: 200,
      className: classnames('min-width-200', 'max-width-200'),
      render: (value, record) => (
        <Input.TextArea
          value={record.hospital_time}
          autoSize={{ minRows: 1, maxRows: 1 }}
          placeholder="Nhập"
        />
      ),
    },
    {
      title: 'Tình trạng sau khi xuất viện',
      key: 'status',
      width: 200,
      dataIndex: 'status',
      render: (value, record) => (
        <Input.TextArea
          value={record.status}
          autoSize={{ minRows: 1, maxRows: 1 }}
          placeholder="Nhập"
        />
      ),
    },
  ];

  const onChangeExcel = () => {
    Helper.exportExcelCRM(
      `/v1/export-medical-infos`,{
        admission_register_id: params?.id,
      }, `KhaiBaoYTe.docx`,
    );
  };

  return (
    <Form layout="vertical" ref={formRef} >
      {/* <Pane className="card"> */}
      {/* <Loading loading={loading} isError={error.isError} params={{ error }}> */}
      <Pane className="card">
        {
          formCheck ?
            <>
              <Heading type="form-title" className="pl20 pt20">
                Thông tin y tế
              </Heading>
              <Heading type="form-block-title" className="pl20 pt10"  >
                Thông tin học sinh
              </Heading>
              <Pane className={stylesModule['wrapper-top']}>
                <Pane className="row pl20 pr20 pb20 pt10" >
                  <Pane className="col-lg-4">
                    <div className="ant-col ant-form-item-label">
                      <label className="ant-form-item-required">Cân nặng</label>
                    </div>
                    <Text size="normal" className={stylesModule.details}>
                      {medicalCheck?.weight}
                    </Text>
                  </Pane>
                  <Pane className="col-lg-4">
                    <div className="ant-col ant-form-item-label">
                      <label className="ant-form-item-required">Chiều cao (cm)</label>
                    </div>
                    <Text size="normal" className={stylesModule.details}>
                      {medicalCheck?.height}
                    </Text>
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="border-top pt20 d-flex justify-content-between align-items-center">
                <Heading type="form-block-title" className="ml20">
                  Thông tin khai báo y tế
                </Heading>
              </Pane>
              {
                medicalCheck?.medicalDeclareInfo?.map((item, index) =>
                  <>
                    <Pane className="offset-lg-12 col-lg-12 pt20 pl20 pr20 border-bottom" key={index}>
                      <Pane className={stylesModule['wrapper-radio']}>
                        <h3 className={stylesModule.title}>{index + 1}. {item?.configMedicalDeclare?.name}</h3>
                        <Pane >
                          {item?.configMedicalDeclare?.use_yes_or_no ?
                            <div className='d-flex pb10'>
                              <p className={stylesModule.name}>Trả lời : </p>
                              <h3 className={stylesModule.details}>{item?.is_checked ? 'Có' : 'Không'}</h3>
                            </div>
                            : ""}
                        </Pane>
                        {
                          item?.configMedicalDeclare?.use_input ?
                            <Pane className="col-lg-12 p0">
                              <div className='d-flex pb10'>
                                <p className={stylesModule.name}>Cụ thể :</p>
                                <h3 className={stylesModule.details}>{item?.reason}</h3>
                              </div>
                            </Pane>
                            : ""
                        }
                      </Pane>

                    </Pane>
                  </>)
              }
              {
                medicalCheck?.note ?
                  <>
                    <Pane className="col-lg-12 pt20 pl20 pr20">
                      <h3 className={stylesModule['wrapper-title']}>8. Lưu ý khác (nếu có)</h3>
                    </Pane>
                    <Pane className="col-lg-12 pl20 pr20 border-bottom">
                      <div className={stylesModule['wrapper-note']}>
                        <p className={stylesModule.name}>Nội dung :</p>
                        <h3 className={stylesModule.details}>{medicalCheck?.note}</h3>
                      </div>
                    </Pane>
                  </>
                  : ""
              }

              <Pane className=" border-bottom">
                <Pane className="p20">
                  <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                    Diễn biến sức khỏe của trẻ
                  </Heading>
                  <div className={stylesModule['wrapper-table']}>
                    <TableCus
                      rowKey={(record) => record.id}
                      className="table-edit"
                      columns={columns}
                      dataSource={medicalCheck?.childHeathDevelop}
                      isEmpty
                      pagination={false}
                      scroll={{ x: '100%' }}
                    />
                  </div>
                </Pane>
              </Pane>
              <Pane className="d-flex justify-content-end p20">
                <Button color="primary" icon="export" className="ml-2" onClick={onChangeExcel}>
                  Xuất file khai báo y tế
                </Button>
              </Pane>
            </> :
            <div>
              <Heading type="form-title" className="pl20 pt20">
                Thông tin y tế
              </Heading>
              <p className={stylesModule['wrapper-not-medical']}>
                Phụ huynh khai báo thông tin y tế
              </p>
            </div>
        }
      </Pane>
      {/* </Loading> */}
    </Form >
  );
},
);

export default General;
