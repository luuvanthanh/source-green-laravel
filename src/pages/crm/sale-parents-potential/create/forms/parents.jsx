import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
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
  { id: 'OTHER', name: 'Khác' },
];
const mapStateToProps = ({ loading, crmSaleParentsPotentialAdd }) => ({
  loading,
  details: crmSaleParentsPotentialAdd.details,
  error: crmSaleParentsPotentialAdd.error,
  branches: crmSaleParentsPotentialAdd.branches,
  classes: crmSaleParentsPotentialAdd.classes,
  city: crmSaleParentsPotentialAdd.city,
  district: crmSaleParentsPotentialAdd.district,
  search: crmSaleParentsPotentialAdd.search,
});
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, city, district, search }) => {
    const formRef = useRef();
    const [files, setFiles] = Helper.isJSON(details?.file_image)
      ? useState(JSON.parse(details?.file_image))
      : useState([]);
    const mounted = useRef(false);
    const mountedSet = (setFunction, value) =>
      !!mounted?.current && setFunction && setFunction(value);
    const loadingSubmit =
      effects[`crmSaleParentsPotentialAdd/ADD`] ||
      effects[`crmSaleParentsPotentialAdd/UPDATE`] ||
      effects[`crmSaleParentsPotentialAdd/UPDATE_STATUS`];
    const loading = effects[`crmSaleParentsPotentialAdd/GET_DETAILS`];
    useEffect(() => {
      dispatch({
        type: 'crmSaleParentsPotentialAdd/GET_CITIES',
        payload: {},
      });
      dispatch({
        type: 'crmSaleParentsPotentialAdd/GET_SEARCH',
        payload: {},
      });
      if (params.id) {
        dispatch({
          type: 'crmSaleParentsPotentialAdd/GET_DISTRICTS',
          payload: {},
        });
      }
    }, [params.id]);

    const onChangeCity = (city_id) => {
      dispatch({
        type: 'crmSaleParentsPotentialAdd/GET_DISTRICTS',
        payload: {
          city_id,
        },
      });
    };

    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'crmSaleParentsPotentialAdd/GET_DETAILS',
          payload: params,
        });
      }
    }, [params.id]);

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      dispatch({
        type: params.id ? 'crmSaleParentsPotentialAdd/UPDATE' : 'crmSaleParentsPotentialAdd/ADD',
        payload: params.id
          ? { ...details, ...values, id: params.id, file_image: JSON.stringify(files) }
          : { ...values, file_image: JSON.stringify(files), status: 'WORKING' },
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
              <Pane className="row" {...marginProps}>
                <Pane className="col-lg-4">
                  <FormItem
                    name="full_name"
                    label="Họ và tên"
                    type={variables.INPUT}
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
                    rules={[variables.RULES.PHONE]}
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
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'name']}
                    name="search_source_id"
                    data={search}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Nguồn tiềm kiếm"
                  />
                </Pane>
              </Pane>
            </Pane>

            <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
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
};

export default withRouter(connect(mapStateToProps)(General));
