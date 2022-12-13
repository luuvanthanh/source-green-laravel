import { memo, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet';
import { Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useParams, history } from 'umi';
import Heading from '@/components/CommonComponent/Heading';
import Loading from '@/components/CommonComponent/Loading';
import Table from '@/components/CommonComponent/Table';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import { Helper } from '@/utils';
import FormDetail from '@/components/CommonComponent/FormDetail';
import { variables } from '@/utils/variables';
import Button from '@/components/CommonComponent/Button';
import stylesModule from '../styles.module.scss';


const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    details,
    menuLeftCriteria,
  } = useSelector(({ menu, loading, englishSettingevaluationCriteriaAdd }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    details: englishSettingevaluationCriteriaAdd.details,
    skill: englishSettingevaluationCriteriaAdd.skill,
    error: englishSettingevaluationCriteriaAdd.error,
  }));

  // useEffect(() => {
  //   if (params.id) {
  //     dispatch({
  //       type: 'englishSettingevaluationCriteriaAdd/GET_DATA',
  //       payload: params,
  //       callback: () => { },
  //     });
  //   }
  // }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (params.id) {
      form.setFieldsValue({
        ...details,
      });
    }
  }, [details]);

  const header = () => {
    const columns = [
      {
        title: 'Thời gian học',
        key: 'day',
        className: 'max-width-200',
        width: 200,
        render: (record) =>
          Helper.getDate(record, variables.DATE_FORMAT.DATE_TIME),
      },
      {
        title: 'Giáo cụ',
        key: 'statusParent',
        className: 'min-width-150',
      },
      {
        title: 'Cấp độc',
        key: 'statusParent',
        className: 'min-width-150',
      },
      {
        title: 'Số phút học',
        key: 'statusParent',
        className: 'min-width-150',
      },
      {
        title: 'Hành động cụ thể',
        key: 'statusParent',
        className: 'min-width-150',
      },
      {
        title: 'Tham gia phụ huynh',
        key: 'statusParent',
        className: 'min-width-150',
      },
      {
        title: 'Giáo viên nhận xét',
        key: 'statusParent',
        className: 'min-width-150',
      },
    ];
    return columns;
  };

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last="Chi tiết" menu={menuLeftCriteria} />
      <Helmet title="Subject" />
      <Pane className="pl20 pr20">
        <Pane >
          <Form layout="vertical" form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              loading={effects['englishSettingevaluationCriteriaAdd/GET_DATA']}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Thông tin chung
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-3">
                    <FormDetail name="Trần Văn Huy" label="32 tháng tuổi" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name="Lake View" label="Cơ sở" type="text" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name="Preschool 2" label="Lớp" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name="15/11/2022, 15:12" label="Thời gian phát hiện TKNC" />
                  </Pane>
                </Pane>
              </Pane>

              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Thời kỳ nhạy cảm: Vận động
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-12">
                    <div className={stylesModule['wrapper-table']}>
                      <Table
                        columns={header()}
                        dataSource={[]}
                        pagination={false}
                        loading={effects[`crmSaleLeadAdd/GET_STATUS_LEAD`]}
                        className="table-normal"
                        isEmpty
                        params={{
                          header: header(),
                          type: 'table',
                        }}
                        bordered={false}
                        rowKey={(record) => record.id}
                        scroll={{ x: '100%' }}
                      />
                    </div>
                  </Pane>
                </Pane>
              </Pane>
              <Pane className="d-flex justify-content-between align-items-center mb20">
                <p
                  className="btn-delete"
                  role="presentation"

                  onClick={() => history.goBack()}
                >
                  Đóng
                </p>
                <Button
                  className="ml-auto px25"
                  color="success"
                  size="large"
                  onClick={() => {
                    history.push(`/chuong-trinh-hoc/settings/evaluationCriteria/${details?.id}/edit`);
                  }}
                >
                  Gửi TKNC
                </Button>
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;