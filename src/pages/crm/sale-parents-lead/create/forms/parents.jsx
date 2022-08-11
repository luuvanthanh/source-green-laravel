import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get, omit } from 'lodash';
import moment from 'moment';
import { connect, history, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import MultipleImageUpload from '@/components/CommonComponent/UploadAvatar';
import { Helper } from '@/utils';

const marginProps = { style: { marginBottom: 12 } };
const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
  // { id: 'OTHER', name: 'Khác' },
];

const network = [
  { id: 'facebook', name: 'Facebook' },
  { id: 'zalo', name: 'Zalo' },
  { id: 'skype', name: 'Skype' },
  { id: 'instagram', name: 'Instagram' },
];

const mapStateToProps = ({ loading, crmSaleLeadAdd }) => ({
  loading,
  details: crmSaleLeadAdd.details,
  error: crmSaleLeadAdd.error,
  branches: crmSaleLeadAdd.branches,
  classes: crmSaleLeadAdd.classes,
  city: crmSaleLeadAdd.city,
  district: crmSaleLeadAdd.district,
  search: crmSaleLeadAdd.search,
  townWards: crmSaleLeadAdd.townWards,
  detailsReferences: crmSaleLeadAdd.detailsReferences,
  interest: crmSaleLeadAdd.interest,
});
const General = memo(
  ({
    dispatch,
    loading: { effects },
    match: { params },
    details,
    error,
    city,
    district,
    search,
    branches,
    townWards,
    detailsReferences,
    interest,
  }) => {
    const formRef = useRef();
    const [files, setFiles] = useState([]);
    const mounted = useRef(false);
    const mountedSet = (setFunction, value) =>
    !!mounted?.current && setFunction && setFunction(value);
    const [checkNetwork, setCheckNetwork] = useState("facebook");
    const loadingSubmit =
      effects[`crmSaleLeadAdd/ADD`] ||
      effects[`crmSaleLeadAdd/UPDATE`] ||
      effects[`crmSaleLeadAdd/UPDATE_STATUS`];
    const loading = effects[`crmSaleLeadAdd/GET_DETAILS`];

    useEffect(() => {
      dispatch({
        type: 'crmSaleLeadAdd/GET_CITIES',
        payload: {},
      });
      dispatch({
        type: 'crmSaleLeadAdd/GET_SEARCH',
        payload: {},
      });
      dispatch({
        type: 'crmSaleLeadAdd/GET_BRANCHES',
        payload: {},
      });
    }, []);

    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'crmSaleLeadAdd/GET_DETAILS',
          payload: params,
        });
        dispatch({
          type: 'crmSaleLeadAdd/GET_PROGRAM_INTEREST',
          payload: {},
        });
      }
    }, [params.id]);
    useEffect(() => {
      if (details.city_id) {
        dispatch({
          type: 'crmSaleLeadAdd/GET_DISTRICTS',
          payload: details,
        });
      }
      if (details.district_id) {
        dispatch({
          type: 'crmSaleLeadAdd/GET_TOWN_WARDS',
          payload: details,
        });
      }
      if (details.town_ward_id) {
        dispatch({
          type: 'crmSaleLeadAdd/GET_TOWN_WARDS',
          payload: details,
        });
      }
      if (details.district_id) {
        dispatch({
          type: 'crmSaleLeadAdd/GET_DISTRICTS',
          payload: details,
        });
      }
    }, [details.id]);

    const onChangeCity = (city_id) => {
      dispatch({
        type: 'crmSaleLeadAdd/GET_DISTRICTS',
        payload: {
          city_id,
        },
      });
    };

    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'crmSaleLeadAdd/GET_DETAILS',
          payload: params,
        });
        dispatch({
          type: 'crmSaleLeadAdd/GET_REFERENCES',
          payload: { customer_lead_id: params.id },
          callback: (response) => {
            if (response) {
              if (params.id) {
                formRef.current.setFieldsValue({
                  ...head(
                    response.parsePayload.map((item) => ({
                      presenter_full_name: item?.full_name,
                      presenter_birth_date: item?.birth_date ? moment(item?.birth_date): "",
                      presenter_address: item?.address,
                      presenter_phone: item?.phone,
                    })),
                  ),
                });
              }
            }
          },
        });
      }
    }, [params.id]);

    const onChangeDistricts = (district_id) => {
      dispatch({
        type: 'crmSaleLeadAdd/GET_TOWN_WARDS',
        payload: {
          district_id,
        },
      });
    };
    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      dispatch({
        type: params.id ? 'crmSaleLeadAdd/UPDATE' : 'crmSaleLeadAdd/ADD',
        payload: params.id
          ? { ...details, ...values, id: params.id, file_image: JSON.stringify(files) }
          : {
              ...values,
              file_image: JSON.stringify(files),
              ...omit(
                values,
                'presenter_full_name',
                'presenter_birth_date',
                'presenter_address',
                'presenter_phone',
                'marketing_program_id',
                'network',
              ),
            },
        callback: (response, error) => {
          if (response) {
            history.goBack();
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
      if (
        values?.presenter_full_name ||
        values?.presenter_birth_date ||
        values?.presenter_address ||
        values?.presenter_phone
      ) {
        dispatch({
          type: 'crmSaleLeadAdd/ADD_REFERENCES',
          payload: {
            ...detailsReferences,
            full_name: values?.presenter_full_name,
            birth_date: values?.presenter_birth_date,
            address: values?.presenter_address,
            phone: values?.presenter_phone,
            customer_lead_id: params.id,
            id: params.id,
          },
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
      }
      dispatch({
        type: 'crmSaleLeadAdd/ADD_INTEREST',
        payload: {
          customer_lead_id: params.id,
          marketing_program: values.marketing_program_id.map((item) => ({
            marketing_program_id: item,
          })),
        },
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
    };

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);
    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          ...details,
          network: 'facebook',
          ...head(details.positionLevel),
          birth_date: details.birth_date && moment(details.birth_date),
          created_at: Helper.getDate(details?.created_at, variables.DATE_FORMAT.DATE_VI),
        });
        if (Helper.isJSON(details?.file_image)) {
          mountedSet(setFiles, JSON.parse(details?.file_image));
        }
      }
        if (params.id && details.marketingProgram) {
          formRef.current.setFieldsValue({
              marketing_program_id: details.marketingProgram.map((i) => i.id),
          });
      }
    }, [details]);

    const uploadFiles = (file) => {
      mountedSet(setFiles, (prev) => [...prev, file]);
    };

    const onNetwork = (e) => {
      setCheckNetwork(e);
    };

    const onFormNetWord = () => {
      if(checkNetwork === "facebook") {
        return (<Pane className="col-lg-4">
        <FormItem name="facebook" label="Facebook" type={variables.INPUT} />
      </Pane>);
      }
      if(checkNetwork === "zalo") {
        return ( <Pane className="col-lg-4">
        <FormItem name="zalo" label="Zalo" type={variables.INPUT} />
      </Pane>);
      }
      if(checkNetwork === "skype") {
        return ( <Pane className="col-lg-4">
        <FormItem name="skype" label="Skype" type={variables.INPUT} />
      </Pane>);
      }
      if(checkNetwork === "instagram") {
        return ( <Pane className="col-lg-4">
        <FormItem name="instagram" label="Instagram" type={variables.INPUT} />
      </Pane>);
      }
      return "";
    };

    return (
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Pane className="card">
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Thông tin cơ bản
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
              <Pane className="row border-bottom" {...marginProps}>
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
                    disabledDate={(current) => current > moment()}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'name']}
                    name="sex"
                    data={genders}
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
                    rules={[variables.RULES.EMAIL]}
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
                <Pane className="col-lg-12">
                  <FormItem name="address" label="Địa chỉ" type={variables.INPUT} />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'name']}
                    name="city_id"
                    data={city}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Thuộc tỉnh thành"
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
                    onChange={onChangeDistricts}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'name']}
                    data={townWards}
                    name="town_ward_id"
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Phường/Xã"
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'name']}
                    data={network}
                    placeholder="Chọn"
                    name="network"
                    type={variables.SELECT}
                    label="Mạng xã hội"
                    onChange={onNetwork}
                  />
                </Pane>
                {onFormNetWord()}
              </Pane>
              <Pane className="row  border-bottom" {...marginProps}>
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
                    name="branch_id"
                    data={branches}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Cơ sở quan tâm"
                  />
                </Pane>
                <Pane className="col-lg-4">
                  {details?.manual_create || !params?.id ? (
                    <FormItem
                      options={['id', 'name']}
                      name="search_source_id"
                      data={search}
                      placeholder="Chọn"
                      type={variables.SELECT}
                      label="Nguồn tìm kiếm"
                      rules={[variables.RULES.EMPTY_INPUT]}
                    />
                  ) : (
                    <FormItem
                      options={['id', 'name']}
                      name="search_source_id"
                      data={search}
                      placeholder="Chọn"
                      type={variables.SELECT}
                      label="Nguồn tìm kiếm"
                      rules={[variables.RULES.EMPTY_INPUT]}
                      disabled
                    />
                  )}
                </Pane>
                <Pane className="col-lg-4">
                  {params?.id ? (
                    <FormItem
                      placeholder=" "
                      name="created_at"
                      type={variables.SELECT}
                      label="Ngày nhận data"
                      disabled
                    />
                  ) : (
                    ''
                  )}
                </Pane>
              </Pane>
              <Pane className="row p20 ">
                <Heading type="form-title">
                  Người giới thiệu
                </Heading>
              </Pane>
                <Pane className="row border-bottom">
                  <Pane className="col-lg-4">
                    <FormItem
                      label="Họ và tên"
                      name="presenter_full_name"
                      type={variables.INPUT}
                      rules={[variables.RULES.MAX_LENGTH_INPUT]}
                    />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormItem
                      name="presenter_birth_date"
                      label="Ngày sinh"
                      type={variables.DATE_PICKER}
                    />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormItem
                      label="Địa chỉ"
                      name="presenter_address"
                      type={variables.INPUT}
                      rules={[variables.RULES.MAX_LENGTH_INPUT]}
                    />
                  </Pane>
                  <Pane className="col-lg-4">
                    <FormItem
                      label="Số điện thoại"
                      name="presenter_phone"
                      type={variables.INPUT}
                    />
                  </Pane>
                </Pane>
              <Pane className="row p20">
                <Heading type="form-title">
                  Chương trình phụ huynh quan tâm
                </Heading>
              </Pane>
                <Pane className="row pl20 pr20 pb20">
                  <Pane className="col-lg-12">
                    <FormItem
                      data={interest}
                      options={['id', 'name']}
                      name="marketing_program_id"
                      defaultValue={[details.marketingProgram]}
                      placeholder="Chọn"
                      type={variables.SELECT_MUTILPLE}
                    />
                  </Pane>
                </Pane>
            </Pane>

            <Pane className="p20 d-flex justify-content-between align-items-center ">
              <p
                className="btn-delete"
                role="presentation"
                onClick={() => history.push('/crm/sale/ph-lead')}
              >
                Hủy
              </p>
              <Button color="success" size="large" htmlType="submit" loading={loadingSubmit}>
                Lưu
              </Button>
            </Pane>
          </Loading>
        </Pane>
      </Form>
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
  search: PropTypes.arrayOf(PropTypes.any),
  townWards: PropTypes.arrayOf(PropTypes.any),
  detailsReferences: PropTypes.objectOf(PropTypes.any),
  interest: PropTypes.arrayOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
  branches: [],
  classes: [],
  city: [],
  district: [],
  search: [],
  townWards: [],
  detailsReferences: {},
  interest: [],
};

export default withRouter(connect(mapStateToProps)(General));
