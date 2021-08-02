import { memo, useRef, useEffect, useState } from 'react';
import { Form } from 'antd';
import csx from 'classnames';
import { connect, history, withRouter } from 'umi';
import { head, isEmpty, omit } from 'lodash';
import PropTypes from 'prop-types';
import { useDispatch } from 'dva';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import variables from '@/utils/variables';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Quill from '@/components/CommonComponent/Quill';

import variablesModules from '../variables';

const mapStateToProps = ({ timeTablesScheduleAdd, loading, menu }) => ({
  loading,
  branches: timeTablesScheduleAdd.branches,
  classes: timeTablesScheduleAdd.classes,
  error: timeTablesScheduleAdd.error,
  menuLeft: menu.menuLeftTimeTable,
});

const Index = memo(
  ({ loading: { effects }, match: { params }, branches, error, menuLeft, classes }) => {
    const mounted = useRef(false);
    const mountedSet = (action, value) => mounted?.current && action(value);
    const dispatch = useDispatch();

    const [content, setContent] = useState('');


    const loadingSubmit = effects[`timeTablesScheduleAdd/ADD`] || effects[`timeTablesScheduleAdd/UPDATE`];
    const loading = effects[`timeTablesScheduleAdd/GET_DETAILS`] || effects[`timeTablesScheduleAdd/GET_BRANCHES`];

    const formRef = useRef();

    const onFinish = (values) => {
      const payload = {
        ...omit(values, 'date'),
        fromDate: values.date[0],
        toDate: values.date[1],
        timetableWeeks: values.timetableWeeks.map((item) => ({
          dayOfWeek: item,
        })),
        classTimetables: values.classTimetables.map((item) => ({
          classId: item,
        })),
      };
      dispatch({
        type: 'timeTablesScheduleAdd/ADD',
        payload,
        callback: (response, err) => {
          if (response) {
            history.goBack();
          }
          if (err) {
            if (err?.validationErrors && !isEmpty(err?.validationErrors)) {
              err?.validationErrors.forEach((item) => {
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
      dispatch({
        type: 'timeTablesScheduleAdd/GET_BRANCHES',
        payload: params,
      });
    }, []);

    const onChangeBranch = (branch) => {
      dispatch({
        type: 'timeTablesScheduleAdd/GET_CLASSES',
        payload: {
          branch,
        },
      });
    };

    useEffect(() => {
      mounted.current = true;
      return mounted.current;
    }, []);

    const onChangeEditor = (value) => {
      mountedSet(setContent, value);
    };

    return (
      <>
        <Breadcrumbs last="Tạo thời khóa biểu" menu={menuLeft} />
        <Pane style={{ padding: '10px 20px', paddingBottom: 0 }}>
          <Loading loading={loading} isError={error.isError} params={{ error }}>
            <Form
              layout="vertical"
              ref={formRef}
              onFinish={onFinish}
              initialValues={{
                timetableDetails: [{}],
              }}
            >
              <Pane className="row">
                <Pane className="col-lg-6">
                  <Pane className="card" style={{ padding: 20 }}>
                    <Heading type="form-title" style={{ marginBottom: 20 }}>
                      Thông tin chung
                    </Heading>

                    <Pane className={csx('row', 'border-bottom', 'mb20')}>
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Loại lịch"
                          name="type"
                          rules={[variables.RULES.EMPTY]}
                          type={variables.SELECT}
                          data={variablesModules.TYPE_CALENDAR}
                        />
                      </Pane>
                    </Pane>
                    <Pane className={csx('row', 'border-bottom', 'mb20')}>
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Thời gian diễn ra"
                          name="date"
                          type={variables.DATE_PICKER}
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          className="no-label"
                          name="time"
                          label=""
                          type={variables.TIME_RANGE}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem
                          className="checkbox-row"
                          label="Nhắc nhở"
                          type={variables.CHECKBOX_SINGLE}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem
                          label="Nhắc trước"
                          name="name"
                          rules={[variables.RULES.EMPTY]}
                          type={variables.SELECT}
                          data={[]}
                        />
                      </Pane>
                      <Pane className="col-lg-12">
                        <FormItem
                          label="Ghi chú nhắc nhở"
                          name="description"
                          rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                          type={variables.TEXTAREA}
                        />
                      </Pane>
                    </Pane>
                    <Pane className={csx('row', 'border-bottom', 'mb20')}>
                      <Pane className="col-lg-12">
                        <FormItem
                          className="radio-group-row"
                          label="Đối tượng"
                          name="classChangeId"
                          type={variables.RADIO}
                          rules={[variables.RULES.EMPTY]}
                          data={[{ value: 1, label: 'Lớp' }, {value: 2, label: 'Cá nhân'}]}
                        />
                      </Pane>
                    </Pane>
                    <Pane className={csx('row', 'border-bottom', 'mb20')}>
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Cơ sở áp dụng"
                          name="branchId"
                          rules={[variables.RULES.EMPTY]}
                          type={variables.SELECT}
                          data={branches}
                          onChange={onChangeBranch}
                        />
                      </Pane>
                    </Pane>

                    {!isEmpty(classes) && (
                      <Pane className="row">
                        <Pane className="col-lg-12">
                          <FormItem
                            label="Chọn lớp"
                            name="classTimetables"
                            type={variables.CHECKBOX}
                            rules={[variables.RULES.EMPTY]}
                            className="checkbox-group group-column"
                            data={classes.map((item) => ({
                              value: item.id,
                              label: item.name,
                            }))}
                          />
                        </Pane>
                      </Pane>
                    )}
                  </Pane>
                </Pane>

                <Pane className="col-lg-6">
                  <Pane className="card">
                    <Pane style={{ padding: '20px 20px 0 20px' }}>
                      <Heading type="form-title">Chi tiết</Heading>
                    </Pane>
                    <Pane className="p20">
                      <Pane className={csx('row', 'mb20')}>
                        <Pane className="col-lg-12">
                          <FormItem
                            label="Tiêu đề"
                            name="title"
                            rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                            type={variables.INPUT}
                          />
                        </Pane>
                        <Pane className="col-lg-12">
                          <FormItem
                            label="Địa điểm"
                            name="title"
                            rules={[variables.RULES.EMPTY_INPUT, variables.RULES.MAX_LENGTH_INPUT]}
                            type={variables.INPUT}
                          />
                        </Pane>
                        <Pane className="col-lg-12">
                          <Pane className="ant-col ant-form-item-label">
                            <label>
                              <span>Nội dung</span>
                            </label>
                          </Pane>
                          <Quill onChange={onChangeEditor} value={content} />
                        </Pane>
                      </Pane>
                    </Pane>

                    <Pane className="p20">
                      <Button
                        size="large"
                        color="success"
                        htmlType="submit"
                        style={{ marginLeft: 'auto' }}
                        loading={loadingSubmit}
                      >
                        Gửi
                      </Button>
                    </Pane>
                  </Pane>
                </Pane>
              </Pane>
            </Form>
          </Loading>
        </Pane>
      </>
    );
  },
);

Index.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  loading: PropTypes.objectOf(PropTypes.any),
  classes: PropTypes.arrayOf(PropTypes.any),
  branches: PropTypes.arrayOf(PropTypes.any),
  menuLeft: PropTypes.arrayOf(PropTypes.any),
  error: PropTypes.objectOf(PropTypes.any),
};

Index.defaultProps = {
  match: {},
  loading: {},
  classes: [],
  branches: [],
  menuLeft: [],
  error: {},
};

export default withRouter(connect(mapStateToProps)(Index));
