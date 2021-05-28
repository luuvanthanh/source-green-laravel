import { memo, useRef, useState, useEffect } from 'react';
import { Form, Checkbox } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Helmet } from 'react-helmet';
import { Scrollbars } from 'react-custom-scrollbars';
import csx from 'classnames';
import { connect, history, withRouter } from 'umi';
import { head, isEmpty, get, omit } from 'lodash';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import variables from '@/utils/variables';
import variablesModules from '../../utils/variables';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

const { List: FormList } = Form;

const mapStateToProps = ({ timeTablesAdd, loading, menu }) => ({
  loading,
  branches: timeTablesAdd.branches,
  classes: timeTablesAdd.classes,
  error: timeTablesAdd.error,
  menuLeft: menu.menuLeftTimeTable,
});
const Index = memo(
  ({ dispatch, loading: { effects }, match: { params }, branches, error, menuLeft, classes }) => {
    const mounted = useRef(false);
    const mountedSet = (setFunction, value) =>
      !!mounted?.current && setFunction && setFunction(value);

    const loadingSubmit = effects[`timeTablesAdd/ADD`] || effects[`timeTablesAdd/UPDATE`];
    const loading = effects[`timeTablesAdd/GET_DETAILS`] || effects[`timeTablesAdd/GET_BRANCHES`];

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
        type: 'timeTablesAdd/ADD',
        payload,
        callback: (response, error) => {
          if (response) {
            history.goBack();
          }
          if (error) {
            if (error?.validationErrors && !isEmpty(error?.validationErrors)) {
              error?.validationErrors.forEach((item) => {
                this.formRef.current.setFields([
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
        type: 'timeTablesAdd/GET_BRANCHES',
        payload: params,
      });
    }, []);

    const onChangeBranch = (branch) => {
      dispatch({
        type: 'timeTablesAdd/GET_CLASSES',
        payload: {
          branch,
        },
      });
    };

    useEffect(() => {
      mounted.current = true;
      return () => (mounted.current = false);
    }, []);

    return (
      <>
        <Breadcrumbs last={'Tạo thời khóa biểu '} menu={menuLeft} />
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
                      Tạo thời khóa biểu
                    </Heading>

                    <Pane className={csx('row', 'border-bottom', 'mb20')}>
                      <Pane className="col-lg-12">
                        <FormItem
                          label="Áp dụng cho thứ"
                          name="timetableWeeks"
                          rules={[variables.RULES.EMPTY]}
                          type={variables.SELECT_MUTILPLE}
                          data={variablesModules.DAYS}
                        />
                      </Pane>
                      <Pane className="col-lg-6">
                        <FormItem
                          label="Khoảng thời gian áp dụng"
                          name="date"
                          rules={[variables.RULES.EMPTY]}
                          type={variables.RANGE_PICKER}
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

                    <FormList name="timetableDetails">
                      {(times, { add, remove }) => (
                        <>
                          <Pane className="border-bottom">
                            <Scrollbars autoHeight autoHeightMax={window.innerHeight - 355}>
                              {times.map(({ key, name }, index) => (
                                <Pane
                                  key={key}
                                  className={csx('position-relative', {
                                    'border-bottom': index < times.length - 1,
                                  })}
                                  style={{ padding: '20px 20px 0 20px' }}
                                >
                                  <Heading type="form-block-title" style={{ marginBottom: 12 }}>
                                    Mốc thời gian {index + 1}
                                  </Heading>

                                  {times.length > 1 && (
                                    <DeleteOutlined
                                      className="position-absolute"
                                      style={{ top: 20, right: 20, zIndex: 2 }}
                                      onClick={() => remove(name)}
                                    />
                                  )}

                                  <Pane className="row">
                                    <Pane className="col-lg-6">
                                      <FormItem
                                        label="Giờ bắt đầu"
                                        name={[name, 'fromTime']}
                                        type={variables.TIME_PICKER}
                                        rules={[variables.RULES.EMPTY]}
                                      />
                                    </Pane>
                                    <Pane className="col-lg-6">
                                      <FormItem
                                        label="Giờ kết thúc"
                                        name={[name, 'toTime']}
                                        type={variables.TIME_PICKER}
                                        rules={[variables.RULES.EMPTY]}
                                      />
                                    </Pane>

                                    <Pane className="col-lg-12">
                                      <FormItem
                                        label="Nội dung"
                                        name={[name, 'content']}
                                        type={variables.INPUT}
                                      />
                                    </Pane>
                                  </Pane>
                                </Pane>
                              ))}
                            </Scrollbars>
                          </Pane>

                          <Pane style={{ padding: 20 }} className="border-bottom">
                            <Button
                              className="text-uppercase"
                              color="success"
                              ghost
                              icon="plus"
                              onClick={() => add()}
                            >
                              Thêm mốc thời gian
                            </Button>
                          </Pane>
                        </>
                      )}
                    </FormList>

                    <Pane className="p20">
                      <Button
                        size="large"
                        color="success"
                        htmlType="submit"
                        style={{ marginLeft: 'auto' }}
                        loading={loadingSubmit}
                      >
                        Tạo
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

export default withRouter(connect(mapStateToProps)(Index));
