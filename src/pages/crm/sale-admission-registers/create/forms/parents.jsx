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

const marginProps = { style: { marginBottom: 12 } };
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
    const formInput = useRef();
    const [files, setFiles] = Helper.isJSON(details?.file_image)
      ? useState(JSON.parse(details?.file_image))
      : useState([]);
    const mounted = useRef(false);
    const mountedSet = (setFunction, value) =>
      !!mounted?.current && setFunction && setFunction(value);
    const loadingSubmit =
      effects[`crmSaleAdmissionAdd/ADD_PARENTS`];

    useEffect(() => {

      dispatch({
        type: 'crmSaleAdmissionAdd/GET_PARENTS',
        payload: { admission_register_id: params.id },
        callback: (response) => {
          if (response) {
            formRef.current.setFieldsValue({
              data: response.parsePayload.map((item) => ({
                ...item,
                birth_date: moment(item.birth_date),
              })),
            });
          }
        },
      });
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_CITIES',
        payload: {},
      });
      if (params.id) {
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
      formInput.current.validateFields().then((values) => {
        dispatch({
          type: 'crmSaleAdmissionAdd/ADD_PARENTS',
          payload: { ...values, file_image: JSON.stringify(files), status: true, customer_lead_id: details.id, admission_register_id: params.id },
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
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          ...details,
          ...head(details.positionLevel),
          startDate:
            head(details.positionLevel)?.startDate &&
            moment(head(details.positionLevel)?.startDate),
          birth_date: details.birth_date && moment(details.birth_date),
          dateOfIssueIdCard: details.dateOfIssueIdCard && moment(details.dateOfIssueIdCard),
          dateOff: details.dateOff && moment(details.dateOff),
        });
        if (Helper.isJSON(details?.file_image)) {
          mountedSet(setFiles, JSON.parse(details?.file_image));
        }
      }
    }, [details]);

    const uploadFiles = (file) => {
      mountedSet(setFiles, (prev) => [...prev, file]);
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

                      {parents.map((item) =>
                        <> {item.sex === 'MALE' ?
                          <>
                            <Form.List name="data" >
                              {(fields,) => (
                                <div className="border-bottom">
                                  {fields.map((field) => (
                                    <Pane
                                      key={field.key}
                                      style={{ padding: 20 }}
                                    >
                                      <Heading type="form-title" style={{ marginBottom: 20 }}>
                                        Thông tin phụ huynh
                                      </Heading>
                                      <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                        Thông tin Cha
                                      </Heading>

                                      <Pane className="row">
                                        <Pane className="col">
                                          <Form.Item name="file_image" label="Hình ảnh phụ huynh">
                                            <MultipleImageUpload
                                              files={files}
                                              callback={(files) => uploadFiles(files)}
                                              removeFiles={(files) => mountedSet(setFiles, files)}
                                              disabled
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
                                            rules={[variables.RULES.EMPTY_INPUT]}
                                            disabled
                                          />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem
                                            name={[field.name, 'email']}
                                            label="Email"
                                            type={variables.INPUT}
                                            rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
                                            disabled
                                          />
                                        </Pane>
                                        <Pane className="col-lg-4">
                                          <FormItem
                                            name={[field.name, 'phone']}
                                            label="Số điện thoại"
                                            type={variables.INPUT}
                                            rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
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
                                            rules={[variables.RULES.EMPTY_INPUT]}
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
                                            rules={[variables.RULES.EMPTY_INPUT]}
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
                                            rules={[variables.RULES.EMPTY_INPUT]}
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
                                  ))}
                                </div>
                              )}
                            </Form.List>
                          </>
                          :
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
                            ref={formInput}
                            onFinish={onFinish}
                          >
                            <div className="border-bottom">
                              <div className="p20">
                                <Heading type="form-title" style={{ marginBottom: 20 }}>
                                  Thông tin phụ huynh
                                </Heading>
                                <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                  Thông tin Cha
                                </Heading>
                                <Pane className="row">
                                  <Pane className="col">
                                    <Form.Item name="file_image" label="Hình ảnh phụ huynh">
                                      <MultipleImageUpload
                                        files={files}
                                        callback={(files) => uploadFiles(files)}
                                        removeFiles={(files) => mountedSet(setFiles, files)}
                                      />
                                    </Form.Item>
                                  </Pane>
                                </Pane>
                                <Pane className="row" {...marginProps}>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="full_name"
                                      label="Họ và tên"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="birth_date"
                                      label="Ngày sinh"
                                      type={variables.DATE_PICKER}
                                      rules={[variables.RULES.EMPTY]}
                                      disabledDate={(current) => current > moment()}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      options={['id', 'name']}
                                      name="sex"
                                      data={[ { id: 'MALE', name: 'Nam' },]}
                                      placeholder="Chọn"
                                      type={variables.SELECT}
                                      label="Giới tính"
                                      rules={[variables.RULES.EMPTY_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="email"
                                      label="Email"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="phone"
                                      label="Số điện thoại"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="other_phone"
                                      label="Số điện thoại Khác"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.PHONE]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="address"
                                      label="Địa chỉ"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      options={['id', 'name']}
                                      name="city_id"
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
                                      name="district_id"
                                      data={district}
                                      placeholder="Chọn"
                                      type={variables.SELECT}
                                      label="Thuộc quận huyện"
                                      rules={[variables.RULES.EMPTY_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="facebook" label="Facebook" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="zalo" label="Zalo" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="skype" label="Skype" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="instagram" label="Instagram" type={variables.INPUT} />
                                  </Pane>
                                </Pane>
                                <Pane className="row" {...marginProps}>
                                  <Pane className="col-lg-4">
                                    <FormItem name="name_company" label="Tên công ty" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="address_company" label="Địa chỉ công ty" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="phone_company" label="Số điện thoại" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="career" label="Nghề nghiệp " type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      options={['id', 'name']}
                                      name="facility_id"
                                      data={city}
                                      placeholder="Chọn"
                                      type={variables.SELECT}
                                      label="Thuộc tỉnh thành"
                                    />
                                  </Pane>
                                </Pane>
                              </div>
                            </div>
                          </Form>
                        }
                          {item.sex === 'FEMALE' ?
                            <>
                              <Form.List name="data">
                                {(fields) => (
                                  <div>
                                    {fields.map((field) => (
                                      <Pane
                                        key={field.key}
                                        style={{ padding: 20 }}
                                      >
                                        <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                          Thông tin Mẹ
                                        </Heading>

                                        <Pane className="row">
                                          <Pane className="col">
                                            <Form.Item name="file_image" label="Hình ảnh phụ huynh">
                                              <MultipleImageUpload
                                                files={files}
                                                callback={(files) => uploadFiles(files)}
                                                removeFiles={(files) => mountedSet(setFiles, files)}
                                                disabled
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
                                              rules={[variables.RULES.EMPTY_INPUT]}
                                              disabled
                                            />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem
                                              name={[field.name, 'email']}
                                              label="Email"
                                              type={variables.INPUT}
                                              rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
                                              disabled
                                            />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem
                                              name={[field.name, 'phone']}
                                              label="Số điện thoại"
                                              type={variables.INPUT}
                                              rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
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
                                              rules={[variables.RULES.EMPTY_INPUT]}
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
                                              rules={[variables.RULES.EMPTY_INPUT]}
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
                                              rules={[variables.RULES.EMPTY_INPUT]}
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
                                    ))}
                                  </div>
                                )}
                              </Form.List>
                            </>
                            :
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
                              ref={formInput}
                              onFinish={onFinish}
                            >
                              <div className="p20">
                                <Heading type="form-title" style={{ marginBottom: 20 }}>
                                  Thông tin phụ huynh
                                </Heading>
                                <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                  Thông tin Mẹ
                                </Heading>
                                <Pane className="row">
                                  <Pane className="col">
                                    <Form.Item name="file_image" label="Hình ảnh phụ huynh">
                                      <MultipleImageUpload
                                        files={files}
                                        callback={(files) => uploadFiles(files)}
                                        removeFiles={(files) => mountedSet(setFiles, files)}
                                      />
                                    </Form.Item>
                                  </Pane>
                                </Pane>
                                <Pane className="row" {...marginProps}>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="full_name"
                                      label="Họ và tên"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="birth_date"
                                      label="Ngày sinh"
                                      type={variables.DATE_PICKER}
                                      rules={[variables.RULES.EMPTY]}
                                      disabledDate={(current) => current > moment()}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      options={['id', 'name']}
                                      name="sex"
                                      data={[ { id: 'MALE', name: 'Nam' },]}
                                      placeholder="Chọn"
                                      type={variables.SELECT}
                                      label="Giới tính"
                                      rules={[variables.RULES.EMPTY_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="email"
                                      label="Email"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="phone"
                                      label="Số điện thoại"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="other_phone"
                                      label="Số điện thoại Khác"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.PHONE]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="address"
                                      label="Địa chỉ"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      options={['id', 'name']}
                                      name="city_id"
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
                                      name="district_id"
                                      data={district}
                                      placeholder="Chọn"
                                      type={variables.SELECT}
                                      label="Thuộc quận huyện"
                                      rules={[variables.RULES.EMPTY_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="facebook" label="Facebook" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="zalo" label="Zalo" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="skype" label="Skype" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="instagram" label="Instagram" type={variables.INPUT} />
                                  </Pane>
                                </Pane>
                                <Pane className="row" {...marginProps}>
                                  <Pane className="col-lg-4">
                                    <FormItem name="name_company" label="Tên công ty" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="address_company" label="Địa chỉ công ty" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="phone_company" label="Số điện thoại" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="career" label="Nghề nghiệp " type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      options={['id', 'name']}
                                      name="facility_id"
                                      data={city}
                                      placeholder="Chọn"
                                      type={variables.SELECT}
                                      label="Thuộc tỉnh thành"
                                    />
                                  </Pane>
                                </Pane>
                              </div>
                            </Form>
                          }
                          {item.sex === 'OTHER' ?
                            <>
                              <Form.List name="data">
                                {(fields) => (
                                  <div>
                                    {fields.map((field) => (
                                      <Pane
                                        key={field.key}
                                        style={{ padding: 20 }}
                                      >
                                        <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                          Thông tin khác
                                        </Heading>

                                        <Pane className="row">
                                          <Pane className="col">
                                            <Form.Item name="file_image" label="Hình ảnh phụ huynh">
                                              <MultipleImageUpload
                                                files={files}
                                                callback={(files) => uploadFiles(files)}
                                                removeFiles={(files) => mountedSet(setFiles, files)}
                                                disabled
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
                                              rules={[variables.RULES.EMPTY_INPUT]}
                                              disabled
                                            />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem
                                              name={[field.name, 'email']}
                                              label="Email"
                                              type={variables.INPUT}
                                              rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
                                              disabled
                                            />
                                          </Pane>
                                          <Pane className="col-lg-4">
                                            <FormItem
                                              name={[field.name, 'phone']}
                                              label="Số điện thoại"
                                              type={variables.INPUT}
                                              rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
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
                                              rules={[variables.RULES.EMPTY_INPUT]}
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
                                              rules={[variables.RULES.EMPTY_INPUT]}
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
                                              rules={[variables.RULES.EMPTY_INPUT]}
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
                                    ))}
                                  </div>
                                )}
                              </Form.List>
                            </>
                            :
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
                              ref={formInput}
                              onFinish={onFinish}
                            >
                              <div className="p20">               
                                <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                  Thông tin khác
                                </Heading>
                                <Pane className="row">
                                  <Pane className="col">
                                    <Form.Item name="file_image" label="Hình ảnh phụ huynh">
                                      <MultipleImageUpload
                                        files={files}
                                        callback={(files) => uploadFiles(files)}
                                        removeFiles={(files) => mountedSet(setFiles, files)}
                                      />
                                    </Form.Item>
                                  </Pane>
                                </Pane>
                                <Pane className="row" {...marginProps}>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="full_name"
                                      label="Họ và tên"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="birth_date"
                                      label="Ngày sinh"
                                      type={variables.DATE_PICKER}
                                      rules={[variables.RULES.EMPTY]}
                                      disabledDate={(current) => current > moment()}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      options={['id', 'name']}
                                      name="sex"
                                      data={[ { id: 'MALE', name: 'Nam' },]}
                                      placeholder="Chọn"
                                      type={variables.SELECT}
                                      label="Giới tính"
                                      rules={[variables.RULES.EMPTY_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="email"
                                      label="Email"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY, variables.RULES.EMAIL]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="phone"
                                      label="Số điện thoại"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY, variables.RULES.PHONE]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="other_phone"
                                      label="Số điện thoại Khác"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.PHONE]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      name="address"
                                      label="Địa chỉ"
                                      type={variables.INPUT}
                                      rules={[variables.RULES.EMPTY_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      options={['id', 'name']}
                                      name="city_id"
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
                                      name="district_id"
                                      data={district}
                                      placeholder="Chọn"
                                      type={variables.SELECT}
                                      label="Thuộc quận huyện"
                                      rules={[variables.RULES.EMPTY_INPUT]}
                                    />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="facebook" label="Facebook" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="zalo" label="Zalo" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="skype" label="Skype" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="instagram" label="Instagram" type={variables.INPUT} />
                                  </Pane>
                                </Pane>
                                <Pane className="row" {...marginProps}>
                                  <Pane className="col-lg-4">
                                    <FormItem name="name_company" label="Tên công ty" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="address_company" label="Địa chỉ công ty" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="phone_company" label="Số điện thoại" type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem name="career" label="Nghề nghiệp " type={variables.INPUT} />
                                  </Pane>
                                  <Pane className="col-lg-4">
                                    <FormItem
                                      options={['id', 'name']}
                                      name="facility_id"
                                      data={city}
                                      placeholder="Chọn"
                                      type={variables.SELECT}
                                      label="Thuộc tỉnh thành"
                                    />
                                  </Pane>
                                </Pane>
                              </div>
                            </Form>
                          }
                        </>
                      )}
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
            </Pane>
          </Form>
        </Pane>
      </Pane>
    );
  },
);

General.propTypes = {
  dispatch: PropTypes.func,
  match: PropTypes.objectOf(PropTypes.any),
  details: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  city: PropTypes.arrayOf(PropTypes.any),
  district: PropTypes.arrayOf(PropTypes.any),
  parents: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  branches: [],
  classes: [],
  city: [],
  district: [],
  parents: [],
};

export default withRouter(connect(mapStateToProps)(General));