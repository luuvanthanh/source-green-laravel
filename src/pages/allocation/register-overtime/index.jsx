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
import { useHistory, useParams } from 'umi';
import moment from 'moment';
import { get, head, isEmpty, last } from 'lodash';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';

const dataTime = (n) => {
  const allTime = [];
  for (let i = 1; i < n + 1; i += 1) {
    allTime.push({ name: `${i} ngày` });
  }

  return allTime.map((i, id) => ({ id, ...i }));
};

const dataHour = (n) => {
  const allHour = [];
  for (let i = 1; i < n + 1; i += 1) {
    allHour.push({ name: `${i} giờ` });
  }

  return allHour.map((i, id) => ({ id, ...i }));
};

const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();

  const [
    { error, details },
    loading,
    { menuLeftAllocation },
  ] = useSelector(({ loading: { effects }, registerOvertimeAdd, menu }) => [
    registerOvertimeAdd,
    effects,
    menu,
  ]);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'registerOvertimeAdd/GET_DETAILS',
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
      type: params.id ? 'registerOvertimeAdd/UPDATE' : 'registerOvertimeAdd/ADD',
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
      <Helmet title="Cấu hình đăng ký ngoài giờ" />
      <Breadcrumbs last={params.id ? 'Chỉnh sửa' : 'Thêm mới'} menu={menuLeftAllocation} />
      <div className={classnames(styles['content-form'], styles['content-form-children'])}>
        <Form className={styles['layout-form']} layout="vertical" form={form} onFinish={onFinish}>
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className={styles['content-form']}>
                <Loading
                  loading={loading['registerOvertimeAdd/GET_DETAILS']}
                  isError={error.isError}
                  params={{
                    error,
                    type: 'container',
                    goBack: '/phan-bo/cau-hinh-dang-ky-ngoai-gio',
                  }}
                >
                  <Text color="dark" className="mb10">
                    Cấu hình đăng ký ngoài giờ
                  </Text>
                  <div className={classnames(styles['content-children'], 'mt0')}>
                    <div className="row border-bottom">
                      <div className="col-lg-12">
                        <FormItem
                          label="Năm học áp dụng"
                          name="year"
                          type={variables.RANGE_PICKER}
                          picker="year"
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                    </div>

                    <div className="row border-bottom mt20">
                      <div className="col-lg-12 mb10">
                        <Text color="success" size="large-medium">
                          Giới hạn đăng ký dài hạn
                        </Text>
                      </div>
                      <div className="col-lg-6">
                        <FormItem
                          data={dataTime(30)}
                          label="Đăng ký trước"
                          name="dayLongterm"
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                      <div className="col-lg-6 mt30">
                        <FormItem
                          data={dataHour(24)}
                          name="hourLongterm"
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                    </div>

                    <div className="row border-bottom mt20">
                      <div className="col-lg-12 mb10">
                        <Text color="success" size="large-medium">
                          Giới hạn đăng ký đột xuất
                        </Text>
                      </div>
                      <div className="col-lg-6">
                        <FormItem
                          data={dataTime(30)}
                          label="Đăng ký trước"
                          name="timeUnexpected"
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                      <div className="col-lg-6 mt30">
                        <FormItem
                          data={dataHour(24)}
                          name="hourUnexpected"
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                    </div>

                    <div className="row border-bottom mt20">
                      <div className="col-lg-12 mb10">
                        <Text color="success" size="large-medium">
                          Giới hạn hủy đăng ký
                        </Text>
                      </div>
                      <div className="col-lg-6">
                        <FormItem
                          data={dataTime(30)}
                          label="Huỷ trước"
                          name="timeLimit"
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY]}
                          prefix="ngày"
                        />
                      </div>
                      <div className="col-lg-6 mt30">
                        <FormItem
                          data={dataHour(24)}
                          name="hourLimit"
                          type={variables.SELECT}
                          rules={[variables.RULES.EMPTY]}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-lg-12 mt20 mb10 d-flex justify-content-end align-items-center">
                        <p
                          className="btn-delete"
                          role="presentation"
                          loading={
                            loading['registerOvertimeAdd/ADD'] ||
                            loading['registerOvertimeAdd/UPDATE'] ||
                            loading['registerOvertimeAdd/GET_DETAILS']
                          }
                          onClick={() => history.goBack()}
                        >
                          Hủy
                        </p>
                        <Button
                          className="ml-auto px25"
                          color="success"
                          htmlType="submit"
                          size="large"
                          loading={
                            loading['registerOvertimeAdd/ADD'] ||
                            loading['registerOvertimeAdd/UPDATE'] ||
                            loading['registerOvertimeAdd/GET_DETAILS']
                          }
                        >
                          Lưu
                        </Button>
                      </div>
                    </div>
                  </div>
                </Loading>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </>
  );
});

export default Index;
