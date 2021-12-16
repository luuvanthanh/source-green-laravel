import { memo, useRef, useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import { useParams, useHistory } from 'umi';
import { useSelector, useDispatch } from 'dva';
import { head, isEmpty, get, omit } from 'lodash';
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

const General = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [{ menuLeftMedical }, {
    details,
  }, effects] = useSelector(({ menu, medicalListTroubleAdd, loading: { effects } }) => [menu, medicalListTroubleAdd, effects]);
  const mounted = useRef(false);
  const loadingSubmit = effects['medicalListTroubleAdd/ADD'] || effects['medicalListTroubleAdd/UPDATE'];


  const params = useParams();

  const history = useHistory();

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
      form.setFieldsValue({
        ...details,
        ...head(details.positionLevel) || {},
      });
    }
  }, [details]);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'medicalListTroubleAdd/UPDATE' : 'medicalListTroubleAdd/ADD',
      payload: {
        ...details,
        ...params,
        name: values?.name,
        symptoms: data.map((item) => ({
          ...omit(item, 'index')
        }))
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              form.setFields([
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

  const onChange = (e, record, key = 'position') => {
    setData((prev) =>
      prev.map((item) => (
        item.index === record.index ? { ...item, [key]: e.target.value } : { ...item }
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
          onChange={(e) => onChange(e, record, 'position')}
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
          onChange={(e) => onChange(e, record, 'symptomName')}
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
          form={form}
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
};

General.defaultProps = {
};

export default General;
