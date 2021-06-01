import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import { head, isEmpty } from 'lodash';
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
import variablesModules from '../../../utils/variables';

const genders = [
  { id: 'MALE', name: 'Nam' },
  { id: 'FEMALE', name: 'Nữ' },
];
const mapStateToProps = ({ loading, OPchildrenAdd }) => ({
  loading,
  details: OPchildrenAdd.details,
  error: OPchildrenAdd.error,
  branches: OPchildrenAdd.branches,
  classes: OPchildrenAdd.classes,
});
const General = memo(
  ({ dispatch, loading: { effects }, match: { params }, details, error, branches, classes }) => {
    const formRef = useRef();
    const [dayOfBirth, setDayOfBirth] = useState(null);
    const [files, setFiles] = useState([]);
    const mounted = useRef(false);
    const mountedSet = (setFunction, value) =>
      !!mounted?.current && setFunction && setFunction(value);

    const loadingSubmit =
      effects[`OPchildrenAdd/ADD`] ||
      effects[`OPchildrenAdd/UPDATE`] ||
      effects[`OPchildrenAdd/UPDATE_STATUS`];
    const loading = effects[`OPchildrenAdd/GET_DETAILS`];

    const onChaneDate = (e) => {
      mountedSet(setDayOfBirth, e);
    };

    const onChangeBranch = (e) => {
      dispatch({
        type: 'OPchildrenAdd/GET_CLASSES',
        payload: {
          branch: e,
        },
      });
    };

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const onFinish = (values) => {
      const age = moment().endOf('month').diff(moment(values.dayOfBirth).startOf('month'), 'month');
      dispatch({
        type: params.id ? 'OPchildrenAdd/UPDATE' : 'OPchildrenAdd/ADD',
        payload: params.id
          ? {
              ...details,
              id: params.id,
              student: {
                ...details.student,
                ...values,
                id: params.id,
                fileImage: JSON.stringify(files),
                age,
              },
            }
          : {
              student: {
                ...values,
                fileImage: JSON.stringify(files),
                age,
              },
            },
        callback: (response, error) => {
          if (response) {
            history.push(
              `/ho-so-doi-tuong/hoc-sinh/${response?.student?.id}/chi-tiet?type=general`,
            );
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

    /**
     * Function submit form modal
     * @param {object} values values of form
     */
    const updateStatus = () => {
      dispatch({
        type: 'OPchildrenAdd/UPDATE_STATUS',
        payload: {
          status:
            details?.student?.status === variablesModules.STATUS.STORE
              ? variablesModules.STATUS.REGIST
              : variablesModules.STATUS.STORE,
          id: params.id,
        },
        callback: (response) => {
          if (response) {
            history.push(`/ho-so-doi-tuong/hoc-sinh`);
          }
        },
      });
    };

    useEffect(() => {
      dispatch({
        type: 'OPchildrenAdd/GET_BRANCHES',
        payload: params,
      });
    }, []);

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    useEffect(() => {
      if (!isEmpty(details) && params.id) {
        formRef.current.setFieldsValue({
          ...details.student,
          dayOfBirth: details?.student?.dayOfBirth && moment(details?.student?.dayOfBirth),
          registerDate: details?.student?.registerDate && moment(details?.student?.registerDate),
          branchId: details?.student?.class?.branchId,
        });
        mountedSet(setDayOfBirth(moment(details?.student?.dayOfBirth)));
        if (details?.student?.class?.branchId) {
          dispatch({
            type: 'OPchildrenAdd/GET_CLASSES',
            payload: {
              branch: details?.student?.class?.branchId,
            },
          });
        }
        if (Helper.isJSON(details?.student?.fileImage)) {
          mountedSet(setFiles, JSON.parse(details?.student?.fileImage));
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
                  <Form.Item name="avatar" label="Hình ảnh học sinh">
                    <MultipleImageUpload
                      files={files}
                      callback={(files) => uploadFiles(files)}
                      removeFiles={(files) => mountedSet(setFiles, files)}
                    />
                  </Form.Item>
                </Pane>
              </Pane>

              <Pane className="row">
                <Pane className="col-lg-4">
                  <FormItem
                    name="fullName"
                    label="Họ và tên"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name="code"
                    label="Mã học sinh"
                    type={variables.INPUT}
                    rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    name="registerDate"
                    label="Ngày vào lớp"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                  />
                </Pane>

                <Pane className="col-lg-4">
                  <FormItem
                    name="dayOfBirth"
                    label="Ngày sinh"
                    type={variables.DATE_PICKER}
                    rules={[variables.RULES.EMPTY]}
                    onChange={onChaneDate}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <Form.Item label="Tuổi(tháng)">
                    {dayOfBirth &&
                      moment().endOf('month').diff(moment(dayOfBirth).startOf('month'), 'month')}
                  </Form.Item>
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    data={genders}
                    name="sex"
                    label="Giới tính"
                    type={variables.SELECT}
                    rules={[variables.RULES.EMPTY]}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    data={branches}
                    name="branchId"
                    label="Mã cơ sở"
                    type={variables.SELECT}
                    onChange={onChangeBranch}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem data={classes} name="classId" label="Mã lớp" type={variables.SELECT} />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem data={[]} name="yearId" label="Mã năm" type={variables.SELECT} />
                </Pane>
              </Pane>

              {/* <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                Địa chỉ
              </Heading> */}

              <Pane className="row">
                <Pane className="col-lg-12">
                  <FormItem name="address" label="Địa chỉ" type={variables.INPUT} />
                </Pane>
              </Pane>
            </Pane>

            <Pane className="d-flex" style={{ marginLeft: 'auto', padding: 20 }}>
              {params.id && (
                <Button
                  color="success"
                  size="large"
                  htmlType="button"
                  className="mr-3"
                  onClick={updateStatus}
                  loading={loadingSubmit}
                >
                  {details?.student?.status === variablesModules.STATUS.STORE
                    ? 'Khôi phục'
                    : 'Lưu trữ hồ sơ'}
                </Button>
              )}
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
};

General.defaultProps = {
  match: {},
  details: {},
  dispatch: () => {},
  loading: {},
  error: {},
  branches: [],
  classes: [],
};

export default withRouter(connect(mapStateToProps)(General));
