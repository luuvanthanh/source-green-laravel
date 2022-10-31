import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Upload, message, Input } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import { head, isEmpty, last } from 'lodash';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import { variables, Helper } from '@/utils';
import CustomListUpload from '@/components/CommonComponent/CustomListUpload';

const Index = memo(() => {
  const [
    menuData,
    loading,
    { error, foodCommonsGroups },
    { user },
  ] = useSelector(({ menu: { menuLeftChildren }, loading: { effects }, foodCommonsCreate, user }) => [
    menuLeftChildren,
    effects,
    foodCommonsCreate,
    user
  ]);
  const dispatch = useDispatch();
  const params = useParams();

  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);
  const [pathImage, setPathImage] = useState([]);
  const [units, setUnits] = useState([]);
  const [collapsedUnit, setCollapsedUnit] = useState(false);
  const [nameUnit, setNameUnit] = useState(null);

  const onFinish = (values) => {
    dispatch({
      type: params.id ? 'foodCommonsCreate/UPDATE' : 'foodCommonsCreate/ADD',
      payload: {
        ...values,
        ...params,
        measureUnit: units.find((item) => item.id === values.measureUnitId)?.name,
        pathImage: JSON.stringify(pathImage),
      },
      callback: (response, error) => {
        if (response) {
          history.goBack();
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'foodCommonsCreate/GET_DATA',
        payload: {
          ...params,
        },
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
              ...response,
              measureUnit: response?.measureUnit?.name,
            });
            if (Helper.isJSON(response.pathImage)) {
              setPathImage(JSON.parse(response.pathImage));
            }
          }
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    dispatch({
      type: 'foodCommonsCreate/GET_MEASURE_UNITS',
      payload: {},
      callback: (response) => {
        if (response) {
          setUnits(response.filter((item) => item.name));
        }
      },
    });
    dispatch({
      type: 'foodCommonsCreate/GET_FOOD_COMMONS_GROUPS',
      payload: {},
    });
  }, []);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onUpload = (files) => {
    dispatch({
      type: 'upload/UPLOAD',
      payload: files,
      callback: (response) => {
        if (response) {
          setPathImage((prevState) => [...prevState, head(response.results)?.fileInfo]);
        }
      },
    });
  };

  const onRemoFile = (record) => {
    setPathImage((prevState) => prevState.filter((item) => item.id !== record.id));
  };

  const props = {
    beforeUpload() {
      return null;
    },
    customRequest({ file }) {
      const { name, size } = file;
      const allowTypes = ['jpeg', 'jpg', 'png'];
      const maxSize = 5 * 2 ** 20;
      if (!allowTypes.includes(last(name.split('.'))) || size > maxSize) {
        message.error('Định dạng hỗ trợ:  .jpeg, .jpg, .png. Tổng dung lượng không vượt quá 20MB');
        return;
      }
      onUpload(file);
    },
    showUploadList: false,
    fileList: [],
  };

  const onChangeUnit = (e) => {
    setNameUnit(e.target.value);
  };

  const onSaveUnit = () => {
    dispatch({
      type: 'foodCommonsCreate/ADD_MEASURE_UNIT',
      payload: {
        name: nameUnit,
        code: nameUnit,
      },
      callback: (response, error) => {
        if (response) {
          setUnits((prev) => [{ ...response, name: nameUnit, code: nameUnit }, ...prev]);
          setCollapsedUnit(false);
        }
        if (error) {
          if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
            error?.validationErrors.forEach((item) => {
              formRef.current.setFields([
                {
                  name: head(item.members),
                  errors: [item.message],
                },
              ]);
            });
          }
        }
      },
    });
  };

  return (
    <Pane style={{ paddingTop: 20 }}>
      <Helmet title="Tạo món ăn" />
      <Breadcrumbs className="pb30 pt0" last="Tạo món ăn" menu={menuData} />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Pane className="row justify-content-center">
          <Pane className="col-lg-8">
            <Form layout="vertical" ref={formRef} onFinish={onFinish} initialValues={{}}>
              <Pane className="p20 pt20 card">
                <Loading
                  loading={
                    loading['foodCommonsCreate/GET_MEASURE_UNITS'] ||
                    loading['foodCommonsCreate/GET_DATA']
                  }
                  isError={error.isError}
                  params={{ error, goBack: '/thuc-don/mon-an' }}
                >
                  <Heading type="form-title" className="mb20">
                    Thông tin chung
                  </Heading>
                  <Pane className="row">
                    <Pane className="col-6">
                      <FormItem
                        label="Mã món ăn"
                        name="code"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>
                    <Pane className="col-6">
                      <FormItem
                        label="Tên món ăn"
                        name="name"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>
                  </Pane>
                  <Pane className="row">
                    <Pane className="col-6">
                      <FormItem
                        data={units}
                        label="Đvt"
                        name="measureUnitId"
                        type={variables.SELECT_ADD}
                        rules={[variables.RULES.EMPTY]}
                        dropdownRender={(menu) => (
                          <div>
                            {menu}
                            {!collapsedUnit && (
                              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                <Button
                                  color="dash-success"
                                  icon="plus"
                                  onClick={() => setCollapsedUnit(true)}
                                >
                                  Thêm đơn vị tính
                                </Button>
                              </div>
                            )}
                            {collapsedUnit && (
                              <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                <Input
                                  className="mr-2"
                                  onChange={onChangeUnit}
                                  placeholder="Nhập"
                                  style={{ flex: 'auto' }}
                                  value={nameUnit}
                                />
                                <Button
                                  color="primary"
                                  onClick={onSaveUnit}
                                  loading={loading['foodCommonsCreate/ADD_MEASURE_UNIT']}
                                >
                                  Lưu
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      />
                    </Pane>
                    <Pane className="col-6">
                      <FormItem
                        data={foodCommonsGroups}
                        label="Nhóm hàng"
                        name="itemGroupId"
                        type={variables.SELECT}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>
                  </Pane>
                  <Pane className="row">
                    <Pane className="col-12">
                      <label className="ant-col ant-form-item-label d-block">
                        <span>Hình ảnh món </span>
                      </label>
                      <Upload {...props}>
                        <Button color="primary" icon="upload1">
                          Tải lên
                        </Button>
                      </Upload>
                    </Pane>
                  </Pane>
                  {!isEmpty(pathImage) && (
                    <CustomListUpload data={pathImage} remove={(item) => onRemoFile(item)} />
                  )}
                </Loading>
              </Pane>

              <Pane className="py20 d-flex justify-content-between align-items-center">
                {user?.roleCode === "sale" || user?.roleCode === variables?.LIST_ROLE_CODE?.TEACHER ? "" : (
                  <Button
                    className="ml-auto px25"
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={
                      loading['foodCommonsCreate/ADD'] ||
                      loading['foodCommonsCreate/UPDATE'] ||
                      loading['foodCommonsCreate/GET_DATA']
                    }
                  >
                    Lưu
                  </Button>
                )}
              </Pane>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
