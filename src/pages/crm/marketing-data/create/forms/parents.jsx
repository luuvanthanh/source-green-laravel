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
  // { id: 'OTHER', name: 'Khác' },
];
const mapStateToProps = ({ loading, crmMarketingDataAdd, user }) => ({
  loading,
  details: crmMarketingDataAdd.details,
  error: crmMarketingDataAdd.error,
  branches: crmMarketingDataAdd.branches,
  classes: crmMarketingDataAdd.classes,
  city: crmMarketingDataAdd.city,
  district: crmMarketingDataAdd.district,
  search: crmMarketingDataAdd.search,
  townWards: crmMarketingDataAdd.townWards,
  user: user.user,
});
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, city, district, search, user, branches, townWards }) => {
    const formRef = useRef();
    const [files, setFiles] = useState([]);
    const mounted = useRef(false);
    const mountedSet = (setFunction, value) =>
      !!mounted?.current && setFunction && setFunction(value);
    const loadingSubmit =
      effects[`crmMarketingDataAdd/ADD`] ||
      effects[`crmMarketingDataAdd/UPDATE`] ||
      effects[`crmMarketingDataAdd/UPDATE_STATUS`];
    const loading = effects[`crmMarketingDataAdd/GET_DETAILS`];

    useEffect(() => {
      dispatch({
        type: 'crmMarketingDataAdd/GET_CITIES',
        payload: {},
      });
      dispatch({
        type: 'crmMarketingDataAdd/GET_SEARCH',
        payload: {},
      });
      dispatch({
        type: 'crmMarketingDataAdd/GET_BRANCHES',
        payload: {},
      });
    }, []);

    useEffect(() => {
      if (params.id) {
        dispatch({
          type: 'crmMarketingDataAdd/GET_DETAILS',
          payload: params,
        });
      }
    }, [params.id]);

    useEffect(() => {
      if (details.city_id) {
        dispatch({
          type: 'crmMarketingDataAdd/GET_DISTRICTS',
          payload: details,
        });
      }
      if (details.district_id) {
        dispatch({
          type: 'crmMarketingDataAdd/GET_TOWN_WARDS',
          payload: details
        });
      }
      if (details.town_ward_id) {
        dispatch({
          type: 'crmMarketingDataAdd/GET_TOWN_WARDS',
          payload: details
        });
      }
      if (details.district_id) {
        dispatch({
          type: 'crmMarketingDataAdd/GET_DISTRICTS',
          payload: details,
        });
      }
    }, [details.id]);

    const onChangeCity = (city_id) => {
      dispatch({
        type: 'crmMarketingDataAdd/GET_DISTRICTS',
        payload: {
          city_id,
        },
      });
    };

    const onChangeDistricts = (district_id) => {
      dispatch({
        type: 'crmMarketingDataAdd/GET_TOWN_WARDS',
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
        type: params.id ? 'crmMarketingDataAdd/UPDATE' : 'crmMarketingDataAdd/ADD',
        payload: params.id
          ? { ...details, ...values, id: params.id, file_image: JSON.stringify(files), user_create_id: null, user_create_info: null }
          : { ...values, file_image: JSON.stringify(files), status: 'NOT_MOVE', user_create_id: user?.id, user_create_info: user },
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
          created_at: Helper.getDate(details?.created_at, variables.DATE_FORMAT.DATE_VI),
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
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.PHONE]}
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
                    onChange={onChangeDistricts}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'name']}
                    name="town_ward_id"
                    data={townWards}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Phường/Xã"
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
                    name="branch_id"
                    data={branches}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Chọn cơ sở"
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
                <Pane className="col-lg-4">
                  {
                    params?.id ?
                      <FormItem
                        placeholder=" "
                        name="created_at"
                        type={variables.SELECT}
                        label="Ngày nhận data"
                        disabled
                      />
                      : ""
                  }
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
  user: PropTypes.objectOf(PropTypes.any),
  townWards: PropTypes.arrayOf(PropTypes.any),
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
  search: [],
  user: {},
  townWards: [],
};

export default withRouter(connect(mapStateToProps)(General));
