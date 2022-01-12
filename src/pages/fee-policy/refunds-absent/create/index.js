import { memo, useRef, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Table } from 'antd';
import { useSelector } from 'dva';
import { useParams, history, useLocation } from 'umi';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import { DeleteOutlined } from '@ant-design/icons';
import TableCus from '@/components/CommonComponent/Table';
import Loading from '@/components/CommonComponent/Loading';

import Button from '@/components/CommonComponent/Button';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  const formRef = useRef();
  const params = useParams();

  const { menuLeftFeePolicy, data } = useSelector(
    ({ loading, menu, feePolicyRefundsAbsentAdd }) => ({
      loading: loading.effects,
      menuLeftFeePolicy: menu.menuLeftFeePolicy,
      data: feePolicyRefundsAbsentAdd?.data,
    }),
  );
  const { query } = useLocation();

  const [search] = useState({
    page: query?.page || variables.PAGINATION.PAGE,
    limit: query?.limit || variables.PAGINATION.PAGE_SIZE,
    keyWord: query?.keyWord,
  });

  const columns = useMemo(() => [
    {
      title: 'STT ',
      key: 'index',
      width: 80,
      render: (text, record, index) => Helper.serialOrder(search?.page, index, search?.limit),
    },
    {
      title: 'Tên học sinh',
      key: 'class',
      className: 'min-width-200',
      render: (record) => record?.name || '',
    },
    {
      title: 'Ngày nghỉ học',
      key: 'format',
      className: 'min-width-200',
      render: (record) => record?.day || '',
    },
    {
      title: 'Loại phí',
      key: 'monsey',
      className: `${stylesModule['table-content']}`,
      render: (record) =>
        record?.feeType.map((item, index) => (
          <div className={stylesModule['table-item']} key={index}>
            {item.name}
          </div>
        )),
    },
    {
      title: 'Tiền hoàn',
      key: 'money',
      className: `${stylesModule['table-contents']}`,
      render: (record) =>
        record?.money.map((item, index) => (
          <div className={stylesModule['table-items']} key={index}>
            {item.name}
          </div>
        )),
    },
    {
      title: '',
      key: 'delete',
      className: 'min-width-40',
      with: 40,
      render: () => <DeleteOutlined className="btn-delete-table" />,
    },
  ]);

  return (
    <Form layout="vertical" colon={false} ref={formRef}>
      <Breadcrumbs
        className="pb0"
        last={params?.id ? 'Chi tiết' : 'Thêm mới'}
        menu={menuLeftFeePolicy}
      />
      <Pane style={{ padding: 20, paddingBottom: 0 }} className="col-lg-8 offset-lg-2">
        <Loading params={{ type: 'container', goBack: '/chinh-sach-phi/tien-dong' }}>
          <Helmet title={params?.id ? 'Chi tiết tiền đóng' : 'Thêm mới tiền đóng'} />

          <Pane className="card p20">
            <Heading type="form-title" className="mb10">
              Thông tin chung
            </Heading>

            <Pane className="row">
              <div className="col-lg-3">
                <FormItem
                  className="mb-2"
                  label="Tháng tính hoàn phí"
                  name="feePolicyRefundsAbsentAddId"
                  type={variables.DATE_PICKER}
                  placeholder="Chọn năm"
                  allowClear={false}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-3 pt30">
                <Button color="primary" className="ml-2">
                  Tính phí hoàn
                </Button>
              </div>
            </Pane>
          </Pane>
          <>
            <Pane className="card mb0">
              <Pane className="card p20">
                <Heading type="form-title" className="heading-tab">
                  Chi tiết phí hoàn
                </Heading>
                <div className={stylesModule['wrapper-table']}>
                  <TableCus
                    bordered
                    columns={columns}
                    dataSource={data}
                    loading={false}
                    error={{}}
                    isError={false}
                    pagination={false}
                    rowKey="id"
                    scroll={{ x: '100%' }}
                    summary={() => (
                      <Table.Summary.Row>
                        <Table.Summary.Cell colSpan={3} />
                        <Table.Summary.Cell align="right">
                          <p className={stylesModule.footer}>Tổng cộng</p>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell colSpan={0} />
                        <Table.Summary.Cell align="right">
                          <p className={stylesModule.footer}>100.000.000</p>
                          {/* <strong>{Helper.getPrice(Helper.summary(pageData, 'money'), 0, true)}</strong> */}
                        </Table.Summary.Cell>
                        <Table.Summary.Cell />
                      </Table.Summary.Row>
                    )}
                  />
                </div>
              </Pane>
            </Pane>
            <Pane className="pt20 pb20 d-flex justify-content-between align-items-center">
              <p
                className="btn-delete"
                role="presentation"
                onClick={() => history.push('/chinh-sach-phi/hoan-phi-hoc-sinh-nghi-hoc')}
              >
                Hủy
              </p>
              <Button
                className="ml-auto px25"
                color="success"
                htmlType="submit"
                size="large"
                // loading={loading['classTypeAdd/GET_DETAILS']}
              >
                Lưu
              </Button>
            </Pane>
          </>
        </Loading>
      </Pane>
    </Form>
  );
});

export default Index;
