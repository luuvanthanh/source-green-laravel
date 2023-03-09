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
import Text from '@/components/CommonComponent/Text';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Button from '@/components/CommonComponent/Button';
import stylesModule from '../styles.module.scss';


const Index = memo(() => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const params = useParams();
  const mounted = useRef(false);
  const {
    loading: { effects },
    detail,
    menuLeftCriteria,
  } = useSelector(({ menu, loading, teachingToolsStudent }) => ({
    loading,
    detail: teachingToolsStudent.detail,
    menuLeftCriteria: menu.menuLeftCriteria,
    error: teachingToolsStudent.error,
  }));

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'teachingToolsStudent/GET_DETAIL',
        payload: params,
      });
    }
  }, [params.id]);

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  // useEffect(() => {
  //   if (params.id) {
  //     form.setFieldsValue({
  //       ...details,
  //     });
  //   }
  // }, [details]);

  const header = () => {
    const columns = [
      {
        title: 'Thời gian học',
        key: 'day',
        className: 'max-width-200',
        width: 200,
        render: (value) => {
          const count = value?.reviewJson?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {/* { Helper.getDate(value, variables.DATE_FORMAT.DATE_TIME)} */}
              </div>
            ),
            props: {},
          }; if (value?.reviewJson) {
            obj.props.rowSpan = count;
          }
          else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Giáo cụ',
        key: 'statusParent',
        className: 'min-width-150',
        render: (value) => {
          const count = value?.reviewJson?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                <Text size="normal">{value?.toolDetail?.name}</Text>
              </div>
            ),
            props: {},
          }; if (value?.reviewJson) {
            obj.props.rowSpan = count;
          }
          else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Cấp độ',
        key: 'level',
        className: 'min-width-150',
        render: (value) => {
          const count = value?.reviewJson?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                <Text size="normal">{value?.level}</Text>
              </div>
            ),
            props: {},
          }; if (value?.reviewJson) {
            obj.props.rowSpan = count;
          }
          else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Số phút học',
        key: 'totalMinutes',
        className: 'min-width-150',
        render: (value) => {
          const count = value?.reviewJson?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                <Text size="normal">{value?.totalMinutes}</Text>
              </div>
            ),
            props: {},
          }; if (value?.reviewJson) {
            obj.props.rowSpan = count;
          }
          else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Hành động cụ thể',
        key: 'statusParent',
        className: 'min-width-150',
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.activity}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.reviewJson) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Tham gia phụ huynh',
        key: 'statusParent',
        className: 'min-width-150',
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.parentInvolvement}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.reviewJson) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Giáo viên nhận xét',
        key: 'statusParent',
        className: 'min-width-150',
        render: (value) => {

          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {value ?
                  <Text size="normal">{value?.reviewOfTeacher}</Text> : ""
                }
              </div>
            ),
            props: {},
          };
          if (value?.reviewJson) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
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
              loading={effects['teachingToolsStudent/GET_DETAIL']}
            >
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Thông tin chung
                </Heading>
                <Pane className="row">
                  <Pane className="col-lg-3">
                    <FormDetail name={detail?.student?.fullName} label="32 tháng tuổi" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={detail?.student?.branch?.name} label="Cơ sở" type="text" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={detail?.student?.class?.name} label="Lớp" />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name="" label="Thời gian phát hiện TKNC" />
                  </Pane>
                </Pane>
              </Pane>
              {
                detail?.studentHasSensitivePeriodDetailGroupSensitivePeriods?.map((item, index) => (
                  <Pane className="card p20" key={index}>
                    <Heading type="form-title" className="mb15">
                      Thời kỳ nhạy cảm: {item?.sensitivePeriod?.name}
                    </Heading>
                    <Pane className="row">
                      <Pane className="col-lg-12">
                        <div className={stylesModule['wrapper-table']}>
                          <Table
                            columns={header()}
                            bordered
                            dataSource={item?.studentHasSensitivePeriodDetails}
                            pagination={false}
                            className="table-normal"
                            defaultExpandAllRows
                            childrenColumnName="children"
                            isEmpty
                            params={{
                              header: header(),
                              type: 'table',
                            }}
                            rowKey={(record) => record?.id}
                            scroll={{ x: '100%' }}
                          />
                        </div>
                      </Pane>
                    </Pane>
                  </Pane>
                ))
              }
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
                    history.push(`/chuong-trinh-hoc/settings/evaluationCriteria/${detail?.id}/edit`);
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