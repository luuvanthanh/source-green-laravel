import { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import {  Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import moment from 'moment';
import {  useParams } from 'umi';

import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';


const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();

  const {  menuLeftCRM, yearsSchool } = useSelector(
    ({ loading, menu, schoolYear }) => ({
      loading: loading.effects,
      menuLeftCRM: menu.menuLeftCRM,
      yearsSchool: schoolYear.data,
    }),
  );

  useEffect(() => {
    dispatch({
      type: 'schoolYear/GET_DATA',
      payload: {
        page: variables.PAGINATION.PAGE,
        limit: variables.PAGINATION.SIZEMAX,
      },
    });
  }, []);


  useEffect(() => {
    if (params?.id) {
      dispatch({
        type: 'CRMfeePolicyPolicyAdd/GET_DETAILS',
        payload: {
          id: params?.id,
          include: Helper.convertIncludes(['schoolYear']),
        },
        callback: (res) => {
          if (res) {
            const timeToPay = [moment(res?.schoolYear?.start_date), moment(res?.schoolYear?.end_date)];
            form.setFieldsValue({
              schoolYearId: `${res?.schoolYear?.year_from} - ${res?.schoolYear?.year_to} `,
              decisionDate: res?.decision_date ? moment(res?.decision_date) : null,
              decisionNumber: res?.decision_number,
              timeToPay,
            });
          }
        },
      });
    }
  }, [params?.id]);

  const onChange = async (e, name) => {
    if (name === 'schoolYearId') {
      const choolYearSelect = yearsSchool.find((item) => item?.id === e);
      await form?.setFieldsValue({
        timeToPay: [moment(choolYearSelect?.startDate), moment(choolYearSelect?.endDate)],
      });
    }

  };



  return (
    <Form layout="vertical" colon={false}  form={form} >
      <Breadcrumbs
        className="pb0"
        last={params?.id ? 'Chi tiết' : 'Thêm mới'}
        menu={menuLeftCRM}
      />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Loading params={{ type: 'container', goBack: '/chinh-sach-phi/tien-dong' }}>
          <Helmet title={params?.id ? 'Chi tiết tiền đóng' : 'Thêm mới tiền đóng'} />

          <Pane className="card p20">
            <Heading type="form-title" className="mb10">
              Thông tin chung
            </Heading>

            <Pane className="row">
              <div className="col-lg-3">
                <FormItem
                  className="mb-0"
                  label="Năm học"
                  name="schoolYearId"
                  type={variables.SELECT}
                  placeholder="Chọn năm"
                  onChange={(e) => onChange(e, 'schoolYearId')}
                  allowClear={false}
                   data={yearsSchool.map(item => ({ ...item, name: `${item?.yearFrom} - ${item?.yearTo}` }))}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb0"
                  label="Ngày quyết định"
                  name="decisionDate"
                  onChange={(e) => onChange(e, 'decisionDate')}
                  type={variables.DATE_PICKER}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb0"
                  label="Số quyết định"
                  name="decisionNumber"
                  onChange={(e) => onChange(e, 'decisionNumber')}
                  type={variables.INPUT}
                  rules={[variables.RULES.EMPTY]}
                />
              </div>
              <div className="col-lg-3">
                <FormItem
                  className="mb0"
                  label="Thời gian hiệu lực"
                  name="timeToPay"
                  type={variables.RANGE_PICKER}
                  data={[]}
                  allowClear={false}
                  rules={[variables.RULES.EMPTY]}
                  disabled
                />
              </div>
            </Pane>
          </Pane>
        </Loading>
      </Pane>
    </Form>
  );
});

export default Index;
