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
import ImgDetail from '@/components/CommonComponent/imageDetail';
import Text from '@/components/CommonComponent/Text';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Button from '@/components/CommonComponent/Button';
import { variables, Helper } from '@/utils';
import stylesModule from '../styles.module.scss';
import HelperModules from '../utils/Helper';
import VariableModules from '../utils/variables';



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

  const header = () => {
    const columns = [
      {
        title: 'Thời gian học',
        key: 'day',
        className: 'max-width-120',
        width: 120,
        render: (value) => {
          const count = value?.children?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                {Helper.getDate(value?.information?.creationTime, variables.DATE_FORMAT.DATE_TIME)}
              </div>
            ),
            props: {},
          }; if (value?.children) {
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
          const count = value?.children?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                <Text size="normal">{value?.information?.toolDetail?.name}</Text>
              </div>
            ),
            props: {},
          }; if (value?.children) {
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
        className: 'min-width-100',
        align: 'center',
        width: 100,
        render: (value) => {
          const count = value?.children?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                <Text size="normal">{value?.information?.level}</Text>
              </div>
            ),
            props: {},
          }; if (value?.children) {
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
        align: 'center',
        className: 'min-width-120',
        width: 120,
        render: (value) => {
          const count = value?.children?.length + 1;
          const obj = {
            children: (
              <div className={stylesModule['table-name']}>
                <Text size="normal">{value?.information?.totalMinutes}</Text>
              </div>
            ),
            props: {},
          }; if (value?.children) {
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
        className: 'min-width-200',
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
          if (value?.children) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
      {
        title: 'Tham gia phụ huynh',
        key: 'statusParent',
        className: 'min-width-200',
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
          if (value?.children) {
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
          if (value?.children) {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      },
    ];
    return columns;
  };

  const onChangeItem = () => {
    dispatch({
      type: 'teachingToolsStudent/ADD',
      payload: [params?.id],
      callback: (response) => {
        if (response) {
          history.goBack();
        }
      },
    });
  };

  return (
    <div className={stylesModule['wraper-container']}>
      <Breadcrumbs last="Chi tiết" menu={menuLeftCriteria} />
      <Helmet title="Học sinh có TKNC" />
      <Pane className="pl20 pr20">
        <Pane >
          <Form layout="vertical" form={form} initialValues={{
            data: [
              {},
            ],
          }}>
            <Loading
              params={{ type: 'container' }}
              loading={effects['teachingToolsStudent/GET_DETAIL']}
            >
              <Pane className="card p20">
                <div className={stylesModule['wrapper-header']}>
                  <Heading type="form-title" className="mb15">
                    Thông tin chung
                  </Heading>
                  <div className={stylesModule['header-tag']}>
                    {HelperModules.tagStatus(detail?.isSent ? VariableModules.STATUS.SEND : VariableModules.STATUS.NOT_SEND)}
                    <p className={stylesModule.time}>Lúc {Helper.getDate(detail?.sentDate, variables.DATE_FORMAT.DATE_TIME)} </p>
                  </div>
                </div>
                <Pane className="row">
                  <Pane className="col-lg-3">
                    <div className={stylesModule['wrapper-student']}>
                      <ImgDetail
                        fileImage={detail?.student?.fileImage}
                      />
                      <div className={stylesModule?.content}>
                        <h3 className={stylesModule?.lable}>{detail?.student?.fullName}</h3>
                        <p className={stylesModule?.age}>{detail?.student?.age} Tháng tuổi</p>
                      </div>
                    </div>
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={detail?.student?.branch?.name} label="Cơ sở" type={variables.TYPE.TEXT} />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={detail?.student?.class?.name} label="Lớp" type={variables.TYPE.TEXT} />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail name={Helper.getDate(detail?.creationTime, variables.DATE_FORMAT.DATE_TIME)} label="Thời gian phát hiện TKNC" type={variables.TYPE.TEXT} />
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
                            dataSource={item?.groupBy}
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
              <Pane className="d-flex justify-content-between align-items-center pb20">
                <p
                  className="btn-delete"
                  role="presentation"
                  onClick={() => history.goBack()}
                >
                  Đóng
                </p>
                {
                  !detail?.isSent && (
                    <Button
                      className="ml-auto px25"
                      color="success"
                      size="large"
                      onClick={() =>
                        onChangeItem()
                      }
                    >
                      Gửi TKNC
                    </Button>
                  )
                }
              </Pane>
            </Loading>
          </Form>
        </Pane>
      </Pane>
    </div>
  );
});

export default Index;