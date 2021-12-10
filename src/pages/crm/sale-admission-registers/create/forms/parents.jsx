import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';
import { Helper } from '@/utils';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
  { id: 'OTHER', name: 'Khác' },
];
const mapStateToProps = ({ loading, crmSaleAdmissionAdd }) => ({
  loading,
  details: crmSaleAdmissionAdd.details,
  error: crmSaleAdmissionAdd.error,
  branches: crmSaleAdmissionAdd.branches,
  classes: crmSaleAdmissionAdd.classes,
  city: crmSaleAdmissionAdd.city,
  district: crmSaleAdmissionAdd.district,
  parents: crmSaleAdmissionAdd.parents,
});
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, city, district, parents }) => {

    const formRef = useRef();

    const mounted = useRef(false);
    const mountedSet = (setFunction, value) =>
      !!mounted?.current && setFunction && setFunction(value);
    const loadingSubmit =
      effects[`crmSaleAdmissionAdd/ADD_PARENTS`];

    const [files, setFiles] = useState({});


    useEffect(() => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_CITIES',
        payload: {},
      });
    }, []);

    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'crmSaleAdmissionAdd/GET_PARENTS',
          payload: { admission_register_id: params.id },
          callback: (response) => {
            if (response) {
              formRef.current.setFieldsValue({
                data: response.parsePayload.map((item) => ({
                  ...item,
                  birth_date: item.birth_date && moment(item.birth_date),
                })),
              });
              setFiles({ ...response.parsePayload.map(item => ({ files: Helper.isJSON(item.file_image) ? JSON.parse(item.file_image) : [] })) });
            }
          },
        });
        dispatch({
          type: 'crmSaleAdmissionAdd/GET_DISTRICTS',
          payload: {},
        });
      }
    }, [params.id]);

    const onChangeCity = (city_id) => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_DISTRICTS',
        payload: {
          city_id,
        },
      });
    };

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = () => {
      formRef.current.validateFields().then((values) => {
        const items = values.data.map((item, index) => ({
          ...item,
          file_image: files[index]?.files ? JSON.stringify(files[index].files) : undefined,
          birth_date: Helper.getDateTime({
            value: Helper.setDate({
              ...variables.setDateData,
              originValue: item.birth_date,
            }),
            format: variables.DATE_FORMAT.DATE_AFTER,
            isUTC: false,
          }),
          admission_register_id: params.id,
        }));
        const payload = {
          createRows: items.filter((item) => !item.id),
          updateRows: items.filter((item) => item.id),
        };
        dispatch({
          type: 'crmSaleAdmissionAdd/ADD_PARENTS',
          payload,
          callback: (response, error) => {
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
      });
    };

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    useEffect(() => {
      if (params.id) {
        formRef.current.setFieldsValue({
          ...details,
          ...head(details.positionLevel),
          birth_date: details.birth_date && moment(details.birth_date),
        });
      }
    }, [details]);

    const uploadFiles = (file, index) => {
      mountedSet(setFiles, (prev) => ({
        ...prev,
        [index]: {
          files: prev[index]?.files ? [...prev[index].files, file] : [file],
        },
      }));
    };


    const removeFiles = (file, index) => {
      mountedSet(setFiles, (prev) => ({
        ...prev,
        [index]: {
          files: file,
        },
      }));
    };

    return (
      <Pane>
        <Pane>
          <Form
            layout="vertical"
            initialValues={{
              data: [
                {
                  ...params,
                  birth_date: params.birth_date && moment(params.birth_date),
                },
              ],
            }}
            ref={formRef}
            onFinish={onFinish}
          >
            <Pane>
              <Pane>
                <Pane className="card">
                  <div className="row">
                    <div className="col-lg-12" >
                      <Form.List name="data">
                        {(fields, { add }) => (
                          <>
                            {fields.map((field, index) => {
                              let file = {};
                              const data = formRef?.current?.getFieldsValue();
                              const itemData = data?.data?.find((item, indexWater) => indexWater === index);
                              file = parents.find((item) => item.id === itemData?.id);
                              return (
                                <>
                                  {file?.status === false ?
                                    <Pane
                                      key={field.key}
                                      style={{ padding: 20 }}
                                    >
                                      <Heading type="form-title" style={{ marginBottom: 20 }}>
                                        Thông tin phụ huynh
                                      </Heading>
                                      <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                        {file?.sex === "MALE" ? 'THÔNG TIN CHA' : ""}
                                        {file?.sex === "FEMALE" ? 'THÔNG TIN MẸ' : ""}
                                        {file?.sex === "OTHER" ? 'THÔNG TIN KHÁC' : ""}
                                      </Heading>

                                      <Pane className="row">
                                        <Pane className="col">
                                          <MultipleImageUpload
                                            // callback={(event) => uploadFiles(event, index)}
                                            removeFiles={(event) => removeFiles(event, index)}
                                            files={files[index]?.files || []}
                                          />
                                        </Pane>
                                      </Pane>

                                      <Pane className="row">
                                        <Pane className="col-lg-4">
                                          <FormItem
                                            label="Họ và tên"
                                            name={[field.name, 'full_name']}
                                            fieldKey={[field.fieldKey, 'full_name']}
                                            type={variables.INPUT}
                                            disabled
                                          />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem
                                            name={[field.name, 'birth_date']}
                                            label="Ngày sinh"
                                            fieldKey={[field.fieldKey, 'birth_date']}
                                            type={variables.DATE_PICKER}
                                            disabled
                                          />
                                        </Pane>


                                        <Pane className="col-lg-4">
                                          <FormItem
                                            options={['id', 'name']}
                                            name={[field.name, 'sex']}
                                            data={genders}
                                            placeholder="Chọn"
                                            type={variables.SELECT}
                                            label="Giới tính"
                                            disabled
                                          />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem
                                            name={[field.name, 'email']}
                                            label="Email"
                                            type={variables.INPUT}
                                            disabled
                                          />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem
                                            name={[field.name, 'phone']}
                                            label="Số điện thoại"
                                            type={variables.INPUT}
                                            disabled
                                          />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem
                                            name={[field.name, 'other_phone']}
                                            label="Số điện thoại Khác"
                                            type={variables.INPUT}
                                            rules={[variables.RULES.PHONE]}
                                            disabled
                                          />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem
                                            name={[field.name, 'address']}
                                            label="Địa chỉ"
                                            type={variables.INPUT}
                                            disabled
                                          />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem
                                            options={['id', 'name']}
                                            name={[field.name, 'city_id']}
                                            data={city}
                                            placeholder="Chọn"
                                            type={variables.SELECT}
                                            label="Thuộc tỉnh thành"
                                            disabled
                                          />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem
                                            options={['id', 'name']}
                                            name={[field.name, 'district_id']}
                                            data={district}
                                            placeholder="Chọn"
                                            type={variables.SELECT}
                                            label="Thuộc quận huyện"
                                            disabled
                                          />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem name={[field.name, 'facebook']} label="Facebook" type={variables.INPUT} disabled />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem name={[field.name, 'zalo']} label="Zalo" type={variables.INPUT} disabled />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem name={[field.name, 'skype']} label="Skype" type={variables.INPUT} disabled />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem name={[field.name, 'instagram']} label="Instagram" type={variables.INPUT} disabled />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem name={[field.name, 'name_company']} label="Tên công ty" type={variables.INPUT} disabled />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem name={[field.name, 'address_company']} label="Địa chỉ công ty" type={variables.INPUT} disabled />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem name={[field.name, 'phone_company']} label="Số điện thoại" type={variables.INPUT} disabled />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem name={[field.name, 'career']} label="Nghề nghiệp " type={variables.INPUT} disabled />
                                        </Pane>

                                      </Pane>

                                    </Pane>
                                    :
                                    <>
                                      <Pane
                                        key={field.key}
                                        style={{ padding: 20 }}
                                        className="border-top"
                                      >
                                        <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                          {file?.sex === "MALE" ? 'THÔNG TIN CHA' : ""}
                                          {file?.sex === "FEMALE" ? 'THÔNG TIN MẸ' : ""}
                                          {file?.sex === "OTHER" ? 'THÔNG TIN KHÁC' : ""}
                                        </Heading>

                                        <Pane className="row">
                                          <Pane className="col">
                                            <Form.Item name={[field.key, 'file_image']} label="Hình ảnh phụ huynh">
                                              <MultipleImageUpload
                                                callback={(event) => uploadFiles(event, index)}
                                                removeFiles={(event) => removeFiles(event, index)}
                                                files={files[index]?.files || []}
                                              />
                                            </Form.Item>
                                          </Pane>
                                        </Pane>

                                        <Pane className="row">
                                          <Pane className="col-lg-4">
                                            <FormItem
                                              label="Họ và tên"
                                              name={[field.name, 'full_name']}
                                              fieldKey={[field.fieldKey, 'full_name']}
                                              type={variables.INPUT}
                                              rules={[variables.RULES.EMPTY_INPUT]}
                                            />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem
                                              name={[field.name, 'birth_date']}
                                              label="Ngày sinh"
                                              fieldKey={[field.fieldKey, 'birth_date']}
                                              type={variables.DATE_PICKER}

                                            />
                                          </Pane>


                                          <Pane className="col-lg-4">
                                            <FormItem
                                              options={['id', 'name']}
                                              name={[field.name, 'sex']}
                                              data={genders}
                                              placeholder="Chọn"
                                              type={variables.SELECT}
                                              label="Giới tính"
                                              rules={[variables.RULES.EMPTY_INPUT]}

                                            />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem
                                              name={[field.name, 'email']}
                                              label="Email"
                                              type={variables.INPUT}
                                              rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}

                                            />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem
                                              name={[field.name, 'phone']}
                                              label="Số điện thoại"
                                              type={variables.INPUT}
                                              rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}

                                            />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem
                                              name={[field.name, 'other_phone']}
                                              label="Số điện thoại Khác"
                                              type={variables.INPUT}
                                              rules={[variables.RULES.PHONE]}

                                            />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem
                                              name={[field.name, 'address']}
                                              label="Địa chỉ"
                                              type={variables.INPUT}
                                              rules={[variables.RULES.EMPTY_INPUT]}

                                            />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem
                                              options={['id', 'name']}
                                              name={[field.name, 'city_id']}
                                              data={city}
                                              placeholder="Chọn"
                                              type={variables.SELECT}
                                              label="Thuộc tỉnh thành"
                                              rules={[variables.RULES.EMPTY_INPUT]}
                                              onChange={onChangeCity}
                                            />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem
                                              options={['id', 'name']}
                                              name={[field.name, 'district_id']}
                                              data={district}
                                              placeholder="Chọn"
                                              type={variables.SELECT}
                                              label="Thuộc quận huyện"
                                              rules={[variables.RULES.EMPTY_INPUT]}

                                            />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem name={[field.name, 'facebook']} label="Facebook" type={variables.INPUT} />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem name={[field.name, 'zalo']} label="Zalo" type={variables.INPUT} />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem name={[field.name, 'skype']} label="Skype" type={variables.INPUT} />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem name={[field.name, 'instagram']} label="Instagram" type={variables.INPUT} />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem name={[field.name, 'name_company']} label="Tên công ty" type={variables.INPUT} />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem name={[field.name, 'address_company']} label="Địa chỉ công ty" type={variables.INPUT} />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem name={[field.name, 'phone_company']} label="Số điện thoại" type={variables.INPUT} />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem name={[field.name, 'career']} label="Nghề nghiệp " type={variables.INPUT} />
                                          </Pane>

                                        </Pane>

                                      </Pane>
                                    </>
                                  }
                                </>

                              );
                            })}
                            <Pane className="pl20 pb20" >
                              <Button
                                color="success"
                                ghost
                                icon="plus"
                                onClick={() => {
                                  add();
                                }}
                              >
                                Thêm thông tin
                              </Button>
                            </Pane>
                          </>
                        )}
                      </Form.List>
                    </div>
                  </div>
                </Pane>
                <Pane className="d-flex justify-content-between align-items-center mb20">
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
            </Pane >
          </Form >
        </Pane >
      </Pane >
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  city: PropTypes.arrayOf(PropTypes.any),
  district: PropTypes.arrayOf(PropTypes.any),
  parents: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  city: [],
  district: [],
  parents: [],
};

export default withRouter(connect(mapStateToProps)(General));