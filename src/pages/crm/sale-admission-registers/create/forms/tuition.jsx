import { memo, useRef, useEffect } from 'react';
import { Form, Table } from 'antd';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Text from '@/components/CommonComponent/Text';
import Button from '@/components/CommonComponent/Button';
// import Table from '@/components/CommonComponent/Table';
// import Loading from '@/components/CommonComponent/Loading';
import { Helper, variables } from '@/utils';
import FormItem from '@/components/CommonComponent/FormItem';
// import variablesForm from '../../utils/variables';
import stylesModule from '../../styles.module.scss';

const mapStateToProps = ({ loading }) => ({
  loading,
});
const General = memo(
  ({ loading: { effects },  data }) => {
    const formRef = useRef();
    const mounted = useRef(false);
    const loadingSubmit = "";
    const loading = effects[``];

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    const header = () => {
      const columns = [
        {
          title: 'Loại phí',
          key: 'full_name',
          className: 'min-width-150',
          width: 150,
          dataIndex: 'full_name',
        },
        {
          title: 'Hình thức',
          key: 'full_name',
          className: 'min-width-250',
          width: 250,
          dataIndex: 'full_name',
        },
        {
          title: 'Tiền dự kiến (đ)',
          key: 'name',
          className: 'min-width-150',
          width: 150,
        },
        {
          title: 'Tiền giảm (đ)',
          key: 'name',
          className: 'min-width-150',
          width: 150,
        },
        {
          title: 'Tiền đóng (đ)',
          key: 'name',
          className: 'min-width-150',
          width: 150,
        },
      ];
      return columns;
    };

    return (
      <>
        <Form layout="vertical" ref={formRef} >
          {/* <Loading loading={loading} isError={error.isError} params={{ error }}> */}
            <Pane className="card">
              <Pane >
                <Pane className="p20">
                  <Heading type="form-title" style={{ marginBottom: 20 }}>
                    Thông tin học phí
                  </Heading>
                  <p className={stylesModule['title-Information']}>Chưa có thông tin học phí</p>
                </Pane>
              </Pane>
            </Pane>
          {/* </Loading> */}
        </Form>
        {/*  */}
        <Form layout="vertical" ref={formRef} >
          {/* <Loading loading={loading} isError={error.isError} params={{ error }}> */}
            <Pane className="card">
              <Pane className="border-bottom">
                <Pane className="p20">
                  <Heading type="form-title" style={{ marginBottom: 20 }}>
                    Thông tin học phí
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-lg-3">
                      <FormItem
                        label="Tên học sinh"
                        name="select"
                        placeholder="Chọn"
                        type={variables.INPUT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        label="Năm học"
                        name="select"
                        placeholder="Chọn"
                        type={variables.INPUT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        label="Ngày sinh"
                        name="select"
                        placeholder="Chọn"
                        type={variables.INPUT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        label="Tuổi (tháng)"
                        name="select"
                        placeholder="Chọn"
                        type={variables.INPUT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        label="Ngày nhập học"
                        name="select"
                        placeholder="Chọn"
                        type={variables.INPUT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        label="Lớp học dự kiến"
                        name="select"
                        placeholder="Chọn"
                        type={variables.INPUT}
                      />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem
                        label="Trạng thái"
                        name="status"
                        allowClear={false}
                        type={variables.INPUT}
                      />
                    </Pane>
                  </Pane>
                  <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                    Chi tiết loại phí
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
                      bordered
                      rowKey={(record) => record.id}
                      scroll={{ x: '100%' }}
                      summary={(pageData) => {
                        let totalBorrow = 0;
                        let totalShipping = 0;
                        pageData.forEach(({ total_price, shipping_fee }) => {
                          totalBorrow += total_price;
                          totalShipping += shipping_fee;
                        });
                        return (
                          <>
                            <Table.Summary.Row>
                              <Table.Summary.Cell colSpan={2}>
                                <Text size="normal" style={{ fontWeight: 'bold' }}>
                                  Tổng tiền
                                </Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell>
                                <Text size="normal" style={{ fontWeight: 'bold' }}>
                                  {Helper.getPrice(totalBorrow)}
                                </Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell>
                                <Text size="normal" style={{ fontWeight: 'bold' }}>
                                  {Helper.getPrice(totalShipping)}
                                </Text>
                              </Table.Summary.Cell>
                              <Table.Summary.Cell>
                                <Text size="normal" style={{ fontWeight: 'bold' }}>
                                  {Helper.getPrice(totalBorrow + totalShipping)}
                                </Text>
                              </Table.Summary.Cell>
                            </Table.Summary.Row>
                          </>
                        );
                      }}
                    />
                  </div>
                </Pane>
              </Pane>
              <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
                <Button color="primary" icon="export" className="ml-2">
                  Xuất biểu phí
                </Button>
                <Button color="success" htmlType="submit" loading={loadingSubmit} className="ml-2">
                  Thanh toán
                </Button>
              </Pane>
            </Pane>
          {/* </Loading> */}
        </Form>
      </>
    );
  },
);

General.propTypes = {
  loading: PropTypes.objectOf(PropTypes.any),
  // error: PropTypes.objectOf(PropTypes.any),
  data: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  loading: {},
  // error: {},
  data: [],
};

export default withRouter(connect(mapStateToProps)(General));
