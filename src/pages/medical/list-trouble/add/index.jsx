import { memo, useRef, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { connect, withRouter, history } from 'umi';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'dva';
import { head, isEmpty, get } from 'lodash';
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
  ({ match: { params }, loading: { effects }, details }) => {
    const formRef = useRef();
    const dispatch = useDispatch();
    const [remove, setRemove] = useState([]);
    const [{ menuLeftMedical }] = useSelector(({ menu, }) => [menu,]);
    const mounted = useRef(false);
    const loadingSubmit = effects['medicalListTroubleAdd/ADD'] || effects['medicalListTroubleAdd/UPDATE'];
    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);
    const [data, setData] = useState([{
      id: uuidv4(),
      position: undefined,
      symptomName: undefined,
    }]);
    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'medicalListTroubleAdd/GET_DETAILS',
          payload: params,
          callback: (response) => {
            if (response) {
              setData(
                response?.symptoms.map((item, index) => ({
                  ...item,
                  index,
                })),
              );
            }
          },
        });
      }
    }, [params.id]);

    useEffect(() => {
      if (params.id) {
        formRef.current.setFieldsValue({
          ...details,
          ...head(details.positionLevel),
        });
      }
    }, [details]);

    const onFinish = (values) => {
      const items = data.map((item) => ({
        position: item.position,
        symptomName: item.symptomName,
      }));
      dispatch({
        type: params.id ? 'medicalListTroubleAdd/UPDATE' : 'medicalListTroubleAdd/ADD',
        payload: params.id ? { ...details, name: values?.name, symptoms: items } : { name: values?.name, symptoms: items },
        callback: (response, error) => {
          if (response) {
            if (response) {
              history.goBack();
            }
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

    const onChangePosition = (e, record) => {
      setData((prev) =>
        prev.map((item) => (
          item.index === record.index ? { ...item, position: e.target.value } : { ...item }
        ),
        ));
    };

    const onChangeSymptomName = (e, record) => {
      setData((prev) =>
        prev.map((item) => (
          item.index === record.index ? { ...item, symptomName: e.target.value } : { ...item }
        ),
        ));
    };
    const columns = [
      {
        title: 'Vị trí vết thương',
        key: 'position',
        lassName: 'min-width-100',
        render: (value, record) => (
          <Input.TextArea
            value={record.position}
            autoSize={{ minRows: 1, maxRows: 1 }}
            placeholder="Nhập"
            onChange={(e) => onChangePosition(e, record)}
          />
        ),
      },
      {
        title: 'Tên triệu chứng',
        key: 'symptomName',
        lassName: 'min-width-100',
        render: (value, record) => (
          <Input.TextArea
            value={record.symptomName}
            autoSize={{ minRows: 1, maxRows: 1 }}
            placeholder="Nhập"
            onChange={(e) => onChangeSymptomName(e, record)}
          />
        ),
      },
      {
        key: 'action',
        className: 'min-width-100',
        width: 100,
        fixed: 'right',
        render: (record) =>
          <div className={styles['list-button']}>
            <Button
              onClick={() => {
                setData(data.filter((val) => (val.index) !== (record.index)));
                setRemove([...remove, record.index]);
              }}
              type="button"
              color="danger" icon="remove"
            />
          </div>

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
            onFinish={onFinish}
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
                                    dataId: uuidv4(),
                                    index: data.length,
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
                    <p
                      className="btn-delete"
                      role="presentation"
                      loading={loadingSubmit}
                      onClick={() => history.goBack()}
                    >
                      Hủy
                    </p>
                    <Button
                      className="ml-auto px25"
                      color="success"
                      htmlType="submit"
                      size="large"
                      loading={loadingSubmit}
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
  loading: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  loading: {},
  details: {},
};

export default withRouter(connect(mapStateToProps)(General));
