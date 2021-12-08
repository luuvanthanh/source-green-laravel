import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty, get } from 'lodash';
import moment from 'moment';
import { connect, withRouter } from 'umi';
import PropTypes from 'prop-types';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import Loading from '@/components/CommonComponent/Loading';
import { variables } from '@/utils/variables';
import FormItem from '@/components/CommonComponent/FormItem';
import ImageUpload from '@/components/CommonComponent/ImageUpload';
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
  students: crmSaleAdmissionAdd.students,
});
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, students }) => {
    const formRef = useRef();
    const [files, setFiles] = Helper.isJSON(get(details, 'studentInfo.file_image'))
      ? useState(JSON.parse(get(details, 'studentInfo.file_image')))
      : useState([]);
    const mounted = useRef(false);
    const mountedSet = (setFunction, value) =>
      !!mounted?.current && setFunction && setFunction(value);
    const loadingSubmit =
      effects[`crmSaleAdmissionAdd/UPDATE_STUDENTS`];
    const loading = effects[`crmSaleAdmissionAdd/GET_DETAILS`];
    useEffect(() => {
      dispatch({
        type: 'crmSaleAdmissionAdd/GET_DETAILS',
        payload: params,
      });

    }, []);



    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      dispatch({
        type: 'crmSaleAdmissionAdd/UPDATE_STUDENTS',
        payload: params.id
          ? { ...details, ...values, id: params.id, file_image: files }
          : { ...values, file_image: files },
        callback: (response, error) => {
          // if (response) {
          //   history.goBack();
          // }
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
          birth_date: get(students, 'studentInfo.birth_date') && moment(get(students, 'studentInfo.birth_date')),
        });


      }
      mountedSet(setFiles, details?.studentInfo?.file_image);
    }, [details]);

    const uploadFiles = (file) => {
      mountedSet(
        setFiles,
        file?.fileInfo?.url,
      );
    };
    return (
      <Form layout="vertical" ref={formRef} onFinish={onFinish}>
        <Pane className="card">
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <Pane style={{ padding: 20 }} className="pb-0 border-bottom">
              <Heading type="form-title" style={{ marginBottom: 20 }}>
                Thông tin học sinh
              </Heading>

              <Pane className="row">
                <Pane className="col">
                  <Form.Item name="file_image" label="Hình ảnh học sinh">
                    <ImageUpload
                      callback={(files) => uploadFiles(files)}
                      fileImage={files}
                    />
                  </Form.Item>
                </Pane>
              </Pane>
              <Pane className="row" {...marginProps}>
                <Pane className="col-lg-4">
                  <Form.Item>

                    <FormItem
                      value={get(details, 'studentInfo.full_name')}
                      label="Ngày sinh"
                      type={variables.INPUT}
                      disabled
                      rules={[variables.RULES.EMPTY]}
                    />
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    value={get(details, 'studentInfo.birth_date')}
                    label="Ngày sinh"
                    type={variables.INPUT}
                    format={variables.DATE_FORMAT.DATE_TIME}
                    rules={[variables.RULES.EMPTY]}
                    disabled
                    disabledDate={(current) => current > moment()}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    value={get(details, 'studentInfo.month_age')}
                    label="Tuổi (tháng)"
                    type={variables.INPUT}
                    disabled
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    value={get(details, 'studentInfo.sex')}
                    options={['id', 'name']}
                    data={genders}
                    placeholder="Chọn"
                    type={variables.SELECT}
                    disabled
                    label="Giới tính"
                    rules={[variables.RULES.EMPTY_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-8">
                  <FormItem
                    name="address"
                    label="Địa chỉ"
                    type={variables.INPUT}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'name']}
                    name=""
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Cơ sở"
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'name']}
                    name=""
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Lớp"
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    options={['id', 'name']}
                    name=""
                    placeholder="Chọn"
                    type={variables.SELECT}
                    label="Năm"
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
  students: PropTypes.objectOf(PropTypes.any),
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => { },
  loading: {},
  error: {},
  branches: [],
  classes: [],
  students: {},
};

export default withRouter(connect(mapStateToProps)(General));
