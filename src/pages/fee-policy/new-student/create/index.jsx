import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import _ from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';

import TypeFees from './typeFees';

const radios = [
  {
    value: 'newStudent',
    label: 'Học sinh mới'
  },
  {
    value: 'oldStudent',
    label: 'Học sinh cũ'
  }
];

const Index = memo(() => {
  const params = useParams();
  const { loading } = useSelector(({ loading }) => ({ loading }));
  const [{ menuLeftFeePolicy }] = useSelector(({ menu }) => [menu]);
  const dispatch = useDispatch();

  const history = useHistory();
  const formRef = useRef();

  const [typeFees, setTypeFees] = useState([]);
  const [errorTable, setErrorTable] = useState({
    typeFees: false,
  });

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'feesAdd/GET_DETAILS',
        payload: {
          ...params
        },
        callback: (res) => {
          if (res) {
            formRef.current.setFieldsValue({
              ...res,
            });
          }
        },
      });
    }
  }, []);

  const onFinish = (values) => {
    dispatch({
      type: 'feesAdd/ADD',
      payload: {
        ...values,
      },
      callback: (res) => {
        if (res) {
          history.goBack();
        }
      },
    });
  };
  const remove = () => {
    formRef.current.resetFields();
  };

  const onChangeType = () => {
  };

  const checkProperties = (object) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in object) {
      if (object[key] === "" || object[key] === null)
        return true;
    }
    return false;
  };

  const checkValidate = (data, name) => {
    let pass = !_.isEmpty(data) ? data.find(item => !!checkProperties(item)) : true;
    if (name === 'other') {
      pass = !_.isEmpty(data) ? data.find(item => !!checkProperties(item)) : false;
    }
    setErrorTable((prev) => ({
      ...prev,
      [name]: !!pass,
    }));
  };

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title={params?.id ? 'Chi tiết' : 'Thêm mới'} />
      <Breadcrumbs className="pb30 pt0" last={`${params?.id ? 'Chi tiết' : 'Thêm mới'}`} menu={menuLeftFeePolicy} />
      <Pane className="row justify-content-center">
        <Pane className="col-lg-12">
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            initialValues={{ type: 'newStudent' }}
          >
            <Pane className="card">
              <Pane className="p20">
                <Heading type="form-title" className="mb20">
                  Thông tin học sinh
                </Heading>
                <FormItem
                  className="row-radio-auto mb0"
                  name="type"
                  type={variables.RADIO}
                  data={radios}
                  rules={[variables.RULES.EMPTY]}
                  onChange={onChangeType}
                />
              </Pane>
              <Pane className="p20 border-top">
                <div className="row">
                  <div className="col-lg-3">
                    <FormItem
                      label="Tên học sinh"
                      name="name"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="Năm học"
                      name="creator"
                      data={[]}
                      type={variables.SELECT}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="Ngày sinh"
                      name="dob"
                      type={variables.DATE_PICKER}
                      allowClear={false}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label htmlFor="" className="mb5 font-size-13" >Tuổi (tháng)</label>
                    <p className="mb0 font-size-13 mt5">32</p>
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="Ngày nhập học"
                      name="dob"
                      type={variables.DATE_PICKER}
                      allowClear={false}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="Lớp học dự kiến"
                      name="creator"
                      data={[]}
                      type={variables.SELECT}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="Họ tên Cha"
                      name="nameFather"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="SĐT Cha"
                      name="sdtFather"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="Họ tên Mẹ"
                      name="nameMother"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormItem
                      label="SĐT Mẹ"
                      name="sdtMother"
                      rules={[variables.RULES.EMPTY, variables.RULES.MAX_LENGTH_INPUT]}
                      type={variables.INPUT}
                    />
                  </div>
                </div>
              </Pane>
            </Pane>
            <Pane className="card mb0">
              <Heading type="form-title" className="heading-tab p20">
                Chi tiết
              </Heading>
              <TypeFees typeFees={typeFees} setTypeFees={setTypeFees} error={errorTable?.typeFees} checkValidate={checkValidate}/>
            </Pane>
            {
              !params?.id && (
                <Pane className="p20 d-flex justify-content-between align-items-center">
                  <p className="btn-delete" role="presentation" onClick={remove}>
                    Hủy
                  </p>
                  <Button
                    className="ml-auto px25"
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={loading['classTypeAdd/GET_DETAILS']}
                  >
                    Lưu
                  </Button>
                </Pane>
              )
            }
          </Form>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
