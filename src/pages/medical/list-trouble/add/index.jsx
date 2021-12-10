import { memo, useRef, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';
import { useSelector } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import TableCus from '@/components/CommonComponent/Table';
import styles from '@/assets/styles/Common/common.scss';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { v4 as uuidv4 } from 'uuid';
import stylesModule from '../styles.module.scss';


const mapStateToProps = ({ loading, medicalListTroubleAdd }) => ({
  loading,
  details: medicalListTroubleAdd.details,
  error: medicalListTroubleAdd.error,
  branches: medicalListTroubleAdd.branches,
  classes: medicalListTroubleAdd.classes,
  city: medicalListTroubleAdd.city,
  district: medicalListTroubleAdd.district,
  search: medicalListTroubleAdd.search,
  townWards: medicalListTroubleAdd.townWards,
});
const General = memo(
  ({ match: { params } }) => {
    const formRef = useRef();
    const [remove, setRemove] = useState([]);
    const [data, setData] = useState([
      {
        id: uuidv4(),
      },
    ]);
    const [{ menuLeftMedical }] = useSelector(({ menu }) => [menu]);
    const mounted = useRef(false);

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    const columns = [
      {
        title: 'Vị trí vết thương',
        key: 'name',
        lassName: 'min-width-100',
        render: (value) => (
          <Input.TextArea
            value={value.name}
            autoSize={{ minRows: 1, maxRows: 1 }}
            placeholder="Nhập"
          />
        ),
      },
      {
        title: 'Tên triệu chứng',
        key: 'name',
        lassName: 'min-width-100',
        render: (value) => (
          <Input.TextArea
            value={value.name}
            autoSize={{ minRows: 1, maxRows: 1 }}
            placeholder="Nhập"
          />
        ),
      },
      {
        key: 'action',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) => (
          <div className={styles['list-button']}>
            <Button
              onClick={() => {
                setData(data.filter((val) => (val.key || val.id || val.test) !== (record.key || record.id || record.test)));
                setRemove([...remove, record.id]);
              }}
              type="button"
              color="danger" icon="remove"
            />

          </div>
        ),
      },
    ];
    return (
      <>
        <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuLeftMedical} />
        <Pane className="p20">
          <Form
            layout="vertical"
            ref={formRef}
            initialValues={{}}
          >
            <Pane>
              <Pane className="card">
                <Pane className="p20">
                  <Heading type="form-title" className="mb20">
                    Thông tin thêm mới
                  </Heading>
                  <Pane className="row mt20">
                    <Pane className="col-lg-3">
                      <FormItem label="Mã sự cố" name="code" type={variables.INPUT} disabled placeholder={" "} />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem label="Tên sự cố" name="name" type={variables.INPUT} rules={[variables.RULES.EMPTY_INPUT]} />
                    </Pane>
                    <Pane className="col-lg-12">
                      <Heading type="form-title" className="mb20">
                        Triệu chứng
                      </Heading>
                      <div className={stylesModule['wrapper-table']}>
                        <TableCus
                          rowKey={(record) => record.id}
                          className="table-edit mb20"
                          columns={columns}
                          dataSource={data}
                          pagination={false}
                          scroll={{ x: '100%' }}
                          footer={(item, index) => (
                            <Button
                              key={index}
                              onClick={() =>
                                setData([
                                  ...data,
                                  {
                                    key: '',
                                    test: uuidv4(),
                                  },
                                ])
                              }
                              className={stylesModule.btn}
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
                  <Pane className="pt20 pb20 d-flex justify-content-between align-items-center border-top">
                    {params.id ? (
                      <p
                        className="btn-delete"
                        role="presentation"
                      // loading={loadingSubmit}
                      // onClick={() => this.cancel(params.id)}
                      >
                        Xóa
                      </p>
                    ) : (
                      <p
                        className="btn-delete"
                        role="presentation"
                      // loading={loadingSubmit}
                      // onClick={() => history.goBack()}
                      >
                        Hủy
                      </p>
                    )}
                    <Button
                      className="ml-auto px25"
                      color="success"
                      htmlType="submit"
                      size="large"
                    // loading={loadingSubmit}
                    >
                      Lưu
                    </Button>
                  </Pane>
                </Pane>
              </Pane>
            </Pane>
          </Form>
        </Pane>
      </>
    );
  },
);

General.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
};

export default withRouter(connect(mapStateToProps)(General));
