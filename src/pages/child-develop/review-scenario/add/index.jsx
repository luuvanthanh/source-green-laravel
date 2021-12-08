import { memo, useRef, useEffect, useState } from 'react';
import { Form, Input, Switch } from 'antd';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';
import { useSelector } from 'dva';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { DeleteOutlined } from '@ant-design/icons';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import TableCus from '@/components/CommonComponent/Table';
import styles from '@/assets/styles/Common/common.scss';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { v4 as uuidv4 } from 'uuid';
import stylesModule from '../styles.module.scss';

const parentIds = [
  {
    id: 0,
    name: 'Nhóm mẹ',
  },
  {
    id: 1,
    name: 'Nhóm con',
  },
];
const mapStateToProps = ({ loading, childDevelopReviewScenarioAdd }) => ({
  loading,
  details: childDevelopReviewScenarioAdd.details,
  error: childDevelopReviewScenarioAdd.error,
  branches: childDevelopReviewScenarioAdd.branches,
  classes: childDevelopReviewScenarioAdd.classes,
  city: childDevelopReviewScenarioAdd.city,
  district: childDevelopReviewScenarioAdd.district,
  search: childDevelopReviewScenarioAdd.search,
  townWards: childDevelopReviewScenarioAdd.townWards,
});
const General = memo(
  ({ match: { params }, error }) => {
    const formRef = useRef();
    const [remove, setRemove] = useState([]);
    const [data, setData] = useState([
      {
        id: uuidv4(),
        category: { name: undefined },
        product_id: undefined,
        conversion_unit: undefined,
        conversion_price: undefined,
      },
    ]);
    const [{ menuLeftCRM }] = useSelector(({ menu }) => [menu]);
    const mounted = useRef(false);

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    const columns = [
      {
        title: 'Nội dung',
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
        title: 'Sử dụng',
        dataIndex: 'show_home_page',
        width: 160,
        className: 'min-width-160',
        render: (showHomePage,) => (
          <div
            role="presentation"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Switch
              defaultChecked={showHomePage}
            />
          </div>
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
        <Breadcrumbs last={params.id ? 'Chỉnh sửa ' : 'Tạo mới'} menu={menuLeftCRM} />
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
                    Thông tin chung
                  </Heading>
                  <Pane className="row mt20">
                    <Pane className="col-lg-3">
                      <FormItem label="Kỹ năng" name="skill" type={variables.SELECT} rules={[variables.RULES.EMPTY_INPUT]} />
                    </Pane>
                    <Pane className="col-lg-3">
                      <FormItem label="Độ tuổi" name="age" type={variables.SELECT} rules={[variables.RULES.EMPTY_INPUT]} />
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="card">
                <Loading isError={error.isError} params={{ error }}>
                  <Pane>
                    <Pane className="pl20 pt0 pr20 pb20">
                      <Pane className={stylesModule['wrapper-students']}>
                        <Form.List name="web_form_childrens">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map((field, index) => (
                                <Pane key={field.key} className='border-bottom pt20'>
                                  <Heading type="form-title"  >
                                    Thông tin tiêu chí {index + 1}
                                  </Heading>
                                  <div className="d-flex flex-row-reverse ">
                                    {fields.length > 1 && (
                                      <DeleteOutlined
                                        onClick={() => {
                                          remove(index);
                                        }}
                                        className={stylesModule['wrapper-btn']}
                                      />
                                    )}
                                  </div>
                                  <Pane className="row">
                                    <Pane className="col-lg-6">
                                      <FormItem
                                        label="Tên tiêu chí"
                                        name={[field.name, 'full_name']}
                                        fieldKey={[field.fieldKey, 'full_name']}
                                        type={variables.INPUT}
                                        rules={[variables.RULES.EMPTY_INPUT]}
                                      />
                                    </Pane>
                                    <Pane className="col-lg-3 radio-only--custom">
                                      <FormItem
                                        name="groups"
                                        label="Áp dụng"
                                        type={variables.CHECKBOX}
                                        data={parentIds.map((item) => ({ value: item.id, label: item.name }))}
                                      />
                                    </Pane>
                                    <Pane className="col-lg-3">
                                      <FormItem
                                        valuePropName="checked"
                                        label="Sử dụng"
                                        name="show"
                                        type={variables.SWITCH}
                                      />
                                    </Pane>
                                  </Pane>
                                  <Heading type="form-title" className="mb10">
                                    Hình thức tiếp cận
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
                                          color="transparent-success"
                                          icon="plus"
                                        >
                                          Thêm
                                        </Button>
                                      )}
                                    />
                                  </div>
                                </Pane>
                              ))}
                              <Pane className='pt20'>
                                <Button
                                  color="success"
                                  ghost
                                  icon="plus"
                                  onClick={() => {
                                    add();
                                  }}
                                >
                                  Thêm tiêu chí
                                </Button>
                              </Pane>
                            </>
                          )}
                        </Form.List>
                      </Pane>
                    </Pane>
                    <Pane className="p20 d-flex justify-content-between align-items-center border-top">
                      {params.id ? (
                        <p
                          className="btn-delete"
                          role="presentation"
                        >
                          Xóa
                        </p>
                      ) : (
                        <p
                          className="btn-delete"
                          role="presentation"
                          onClick={() => history.goBack()}
                        >
                          Hủy
                        </p>
                      )}
                      <Button
                        className="ml-auto px25"
                        color="success"
                        htmlType="submit"
                        size="large"
                      >
                        Lưu
                      </Button>
                    </Pane>
                  </Pane>
                </Loading>
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
  error: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  error: {},
};

export default withRouter(connect(mapStateToProps)(General));
