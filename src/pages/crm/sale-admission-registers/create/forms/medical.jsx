import { memo, useRef, useState, useEffect } from 'react';
import { Form, Radio, Input } from 'antd';
import { isEmpty, get } from 'lodash';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';
import TableCus from '@/components/CommonComponent/Table';
import classnames from 'classnames';
import styles from '@/assets/styles/Common/common.scss';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import { v4 as uuidv4 } from 'uuid';
import FormItem from '@/components/CommonComponent/FormItem';
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
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, sliderRows }) => {
    const formRef = useRef();
    const mounted = useRef(false);
    const [data, setData] = useState(sliderRows);
    const loadingSubmit =
      effects[`crmSaleAdmissionAdd/ADD`] ||
      effects[`crmSaleAdmissionAdd/UPDATE`] ||
      effects[`crmSaleAdmissionAdd/UPDATE_STATUS`];
    const loading = effects[`crmSaleAdmissionAdd/GET_DETAILS`];
    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    useEffect(() => {
      if (!isEmpty(sliderRows)) {
        setData(sliderRows);
      }
    }, [sliderRows]);

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

    const columns = [
      {
        title: 'Bệnh đã mắc phải nằm viện',
        dataIndex: 'title',
        key: 'title',
        width: 250,
        className: classnames('min-width-200', 'max-width-200'),
        render: (value) => (
          <Input value={value} autoSize={{ minRows: 3, maxRows: 3 }} placeholder="Nhập" />
        ),
      },
      {
        title: 'Năm',
        dataIndex: 'title',
        key: 'title',
        width: 100,
        className: classnames('min-width-200', 'max-width-200'),
        render: (value) => (
          <Input value={value} autoSize={{ minRows: 3, maxRows: 3 }} placeholder="Nhập" />
        ),
      },
      {
        title: 'Thời gian nằm viện',
        dataIndex: 'title',
        key: 'title',
        width: 200,
        className: classnames('min-width-200', 'max-width-200'),
        render: (value) => (
          <Input value={value} autoSize={{ minRows: 3, maxRows: 3 }} placeholder="Nhập" />
        ),
      },
      {
        title: 'Tình trạng sau khi xuất viện',
        key: 'content',
        width: 200,
        dataIndex: 'content',
        render: (value) => (
          <Input value={value} autoSize={{ minRows: 3, maxRows: 3 }} placeholder="Nhập" />
        ),
      },
      {
        key: 'action',
        className: 'min-width-80',
        width: 80,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <button
              onClick={() => {
                setData(data.filter((val) => (val.key || val.id) !== (record.key || record.id)));
              }}
              type="button"
              className={styles['button-circle']}
            >
              <span className="icon-remove" />
            </button>
          </div>
        ),
      },
    ];

    return (
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        {/* <Pane className="card"> */}
        <Loading loading={loading} isError={error.isError} params={{ error }}>
          <Pane className="card">
            <Pane className=" border-bottom">
              <Pane className="p20">
                <Heading type="form-title" style={{ marginBottom: 20 }}>
                  Thông tin y tế
                </Heading>
                <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                  Thông tin học sinh
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-4">
                    <FormItem
                      name="weight"
                      label="Cân nặng (kg)"
                      type={variables.NUMBER}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormItem
                      name="height"
                      label="Chiều cao (cm)"
                      type={variables.NUMBER}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
            <Pane className=" border-bottom">
              <Pane className="p20">
                <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                  Thông tin khai báo y tế
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-12">
                    <h3 className={stylesModule['wrapper-title']}>
                      1. Trẻ đã được tiêm chủng vắc xin đầy đủ theo lịch tiêm chủng quốc gia?
                    </h3>
                  </Pane>
                  <Pane className={classnames(stylesModule['wrapper-input'], 'col-lg-1 ')}>
                    <Radio /> <div>Có</div>
                  </Pane>
                  <Pane className={classnames(stylesModule['wrapper-input'], 'col-lg-1 ')}>
                    <Radio /> <div>Không</div>
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name=""
                      label="Lý do"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <h3 className={stylesModule['wrapper-title']}>
                      2. Trong vòng 6 tháng vừa qua, trẻ đã được đi khám sức khỏe định kỳ?
                    </h3>
                  </Pane>
                  <Pane className={classnames(stylesModule['wrapper-input'], 'col-lg-1 ')}>
                    <Radio /> <div>Có</div>
                  </Pane>
                  <Pane className={classnames(stylesModule['wrapper-input'], 'col-lg-1 ')}>
                    <Radio /> <div>Không</div>
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name=""
                      label="Lý do"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <h3 className={stylesModule['wrapper-title']}>
                      3. Trẻ có bị dị ứng thực phẩm nào không?
                    </h3>
                  </Pane>
                  <Pane className={classnames(stylesModule['wrapper-input'], 'col-lg-1 ')}>
                    <Radio /> <div>Có</div>
                  </Pane>
                  <Pane className={classnames(stylesModule['wrapper-input'], 'col-lg-1 ')}>
                    <Radio /> <div>Không</div>
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name=""
                      label="Cụ thể"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <h3 className={stylesModule['wrapper-title']}>
                      4. Trẻ có bị dị ứng/sốc phản vệ với loại thuốc nào không?
                    </h3>
                  </Pane>
                  <Pane className={classnames(stylesModule['wrapper-input'], 'col-lg-1 ')}>
                    <Radio /> <div>Có</div>
                  </Pane>
                  <Pane className={classnames(stylesModule['wrapper-input'], 'col-lg-1 ')}>
                    <Radio /> <div>Không</div>
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name=""
                      label="Cụ thể"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <h3 className={stylesModule['wrapper-title']}>
                      5. Trẻ có đang mắc các bệnh lý như: hen suyễn, tim mạch, tiểu đường bẩm sinh,
                      co giật,...?
                    </h3>
                  </Pane>
                  <Pane className={classnames(stylesModule['wrapper-input'], 'col-lg-1 ')}>
                    <Radio /> <div>Có</div>
                  </Pane>
                  <Pane className={classnames(stylesModule['wrapper-input'], 'col-lg-1 ')}>
                    <Radio /> <div>Không</div>
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name=""
                      label="Cụ thể"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <h3 className={stylesModule['wrapper-title']}>
                      6. Trẻ đã bao giờ cần nhà chuyên gia (tâm lý, giáo dục, bác sĩ) tư vấn nhu cầu
                      giáo dục đặc biệt?
                    </h3>
                  </Pane>
                  <Pane className={classnames(stylesModule['wrapper-input'], 'col-lg-1 ')}>
                    <Radio /> <div>Có</div>
                  </Pane>
                  <Pane className={classnames(stylesModule['wrapper-input'], 'col-lg-1 ')}>
                    <Radio /> <div>Không</div>
                  </Pane>
                  <Pane className="col-lg-12">
                    <FormItem
                      name=""
                      label="Cụ thể"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>

                  <Pane className="col-lg-12">
                    <h3 className={stylesModule['wrapper-title']}>8. Lưu ý khác (nếu có)</h3>
                  </Pane>
                  <Pane className="col-lg-12 mt-1">
                    <FormItem
                      name=""
                      label="Nội dung"
                      type={variables.INPUT}
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
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
                    dataSource={data}
                    isEmpty
                    pagination={false}
                    scroll={{ x: '100%' }}
                    footer={() => (
                      <Button
                        onClick={() =>
                          setData([
                            ...data,
                            {
                              id: uuidv4(),
                              title: undefined,
                              content: undefined,
                              file_image: undefined,
                            },
                          ])
                        }
                        color="transparent-success"
                        icon="plus"
                      >
                        Thêm
                      </Button>
                    )}
                  />
                </div>
              </Pane>
            </Pane>
            <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
              <Button color="primary" icon="export" className="ml-2">
                Xuất file khai báo y tế
              </Button>
              <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2">
                Lưu
              </Button>
            </Pane>
          </Pane>
        </Loading>
      </Form>
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
  sliderRows: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  data: [],
  sliderRows: [],
};

export default withRouter(connect(mapStateToProps)(General));
