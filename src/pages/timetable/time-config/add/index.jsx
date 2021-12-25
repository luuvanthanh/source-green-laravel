import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';
import Loading from '@/components/CommonComponent/Loading';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import { Form } from 'antd';
import classnames from 'classnames';
import React, { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useRouteMatch } from 'umi';
import moment from 'moment';
import { get, head, isEmpty, last } from 'lodash';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { params } = useRouteMatch();
  const history = useHistory();

  const [
    { error, details },
    loading,
    { menuLeftTimeTable },
  ] = useSelector(({ loading: { effects }, timeTablesConfigAdd, menu }) => [
    timeTablesConfigAdd,
    effects,
    menu,
  ]);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'timeTablesConfigAdd/GET_DETAILS',
        payload: {
          id: params.id,
        },
      });
    }
  }, [params.id]);

  useEffect(() => {
    if (!isEmpty(details) && get(params, 'id')) {
      form.setFieldsValue({
        year: details.fromYear &&
          details.toYear && [
            moment(details.fromYear, variables.DATE_FORMAT.YEAR),
            moment(details.toYear, variables.DATE_FORMAT.YEAR),
          ],
        fromTime: details.fromTime && moment(details.fromTime, variables.DATE_FORMAT.HOUR),
        toTime: details.toTime && moment(details.toTime, variables.DATE_FORMAT.HOUR),
        periodDuration: details.periodDuration && details.periodDuration,
        fromDate: details.fromDate && moment(details.fromDate),
        toDate: details.toDate && moment(details.toDate),
      });
    }
  }, [details]);

  const onFinish = (values) => {
    const payload = {
      id: params.id,
      fromYear: head(values.year).year(),
      toYear: last(values.year).year(),
      fromTime: Helper.getDate(values.fromTime, variables.DATE_FORMAT.HOUR),
      toTime: Helper.getDate(values.toTime, variables.DATE_FORMAT.HOUR),
      periodDuration: values.periodDuration,
      fromDate: moment(values.fromDate),
      toDate: moment(values.toDate),
      isActive: true,
    };
    dispatch({
      type: params.id ? 'timeTablesConfigAdd/UPDATE' : 'timeTablesConfigAdd/ADD',
      payload,
      callback: (response) => {
        if (response) {
          history.goBack();
        }
      },
    });
  };

  return (
    <>
      <Helmet title="Cấu hình thời gian" />
      <Breadcrumbs last={params.id ? 'Chỉnh sửa' : 'Thêm mới'} menu={menuLeftTimeTable} />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <Form className={styles['layout-form']} layout="vertical" form={form} onFinish={onFinish}>
          <div className="row">
            <div className="col-lg-8 offset-lg-2">
              <div className={styles['content-form']}>
                <Loading
                  loading={loading['timeTablesConfigAdd/GET_DETAILS']}
                  isError={error.isError}
                  params={{
                    error,
                    type: 'container',
                    goBack: '/thoi-khoa-bieu/cau-hinh-thoi-gian',
                  }}
                >
                  <div className={classnames(styles['content-children'], 'mt0')}>
                    <Text color="dark" size="large-medium">
                      Thông tin thêm mới
                    </Text>
                    <div className="row mt-4">
                      <div className="col-lg-6">
                        <FormItem
                          label="Năm học"
                          name="year"
                          type={variables.RANGE_PICKER}
                          picker="year"
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          label="Thời gian học từ"
                          name="fromTime"
                          type={variables.TIME_PICKER}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          label="Thời gian học đến"
                          name="toTime"
                          type={variables.TIME_PICKER}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          label="Ngày áp dụng từ"
                          name="fromDate"
                          type={variables.DATE_PICKER}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormItem
                          label="Đến ngày"
                          name="toDate"
                          type={variables.DATE_PICKER}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                      <div className="col-lg-6">
                        <FormItem
                          label="Số phút một tiết học"
                          name="periodDuration"
                          type={variables.INPUT_COUNT}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                    </div>
                  </div>
                </Loading>
                <div className="row">
                  <div className="col-lg-12 mt-4 d-flex justify-content-end">
                    <Button
                      color="gray"
                      icon="prev"
                      onClick={() => history.goBack()}
                      size="large"
                      className="mr-3"
                      loading={
                        loading['timeTablesConfigAdd/ADD'] || loading['timeTablesConfigAdd/UPDATE']
                      }
                    >
                      HỦY
                    </Button>
                    <Button
                      color="green"
                      icon="save"
                      htmlType="submit"
                      size="large"
                      loading={
                        loading['timeTablesConfigAdd/ADD'] || loading['timeTablesConfigAdd/UPDATE']
                      }
                    >
                      LƯU
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
});

export default Index;
