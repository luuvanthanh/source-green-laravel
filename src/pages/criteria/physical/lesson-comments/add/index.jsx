import Heading from '@/components/CommonComponent/Heading';
import Pane from '@/components/CommonComponent/Pane';
import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import { Checkbox, Divider, Form } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { memo, useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, useHistory, useLocation } from 'umi';
import FormDetail from '@/components/CommonComponent/FormDetail';
import Loading from '@/components/CommonComponent/Loading';
import { Helper, variables } from '@/utils';
import ImgDetail from '@/components/CommonComponent/imageDetail';
import { get, head, isEmpty } from 'lodash';
import classnames from 'classnames';
import Button from '@/components/CommonComponent/Button';
import Table from '@/components/CommonComponent/Table';
import FormItem from '@/components/CommonComponent/FormItem';
import moment from 'moment';
import variablesModules from '../utils/variables';
import stylesModule from '../styles.module.scss';

const Index = memo(() => {
  const [form] = Form.useForm();
  const params = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const mounted = useRef(false);
  const { query } = useLocation();

  const {
    menuLeftCriteria,
    loading: { effects },
    user
  } = useSelector(({ menu, loading, PhysicalLessonCommentsAdd, user }) => ({
    loading,
    menuLeftCriteria: menu.menuLeftCriteria,
    years: PhysicalLessonCommentsAdd.years,
    error: PhysicalLessonCommentsAdd.error,
    user
  }));
  const [dataStudent, setDataStudent] = useState(undefined);
  const [dataComment, setDataComment] = useState(undefined);
  const [details, setDetails] = useState(undefined);
  const isNotFeedback = query?.type === variablesModules.STATUS.NOT_FEEDBACK;
  const loadingSubmit = effects['PhysicalLessonCommentsAdd/ADD'];

  useEffect(() => {
    if (query?.type === variablesModules.STATUS.NOT_FEEDBACK) {
      dispatch({
        type: 'PhysicalLessonCommentsAdd/GET_TEMPLATE_FOR_CREATING',
        payload: {
          classId: query?.classId,
          date: query?.date,
          physicalStudyProgramSessionId: query?.physicalStudyProgramSessionId,
          schoolYearId: query?.schoolYearId,
          studentId: query?.studentId,
        },
        callback: (response) => {
          if (response) {
            setDataStudent(response?.information);
            setDataComment(head(response?.templates)?.physicalCriteraiTemplates?.map(i => ({
              ...i,
              content: {
                ...i?.content,
                items: i?.content?.items?.map((k, index) => ({
                  item: k,
                  id: `${i?.id}${index}`,
                  isChecked: false
                })),
              },
              contentText: ''
            })));
          }
        },
      });
    }

    if (query?.type === variablesModules.STATUS.NOT_APPROVED_FEEDBACK) {
      if (params.id) {
        dispatch({
          type: 'PhysicalLessonCommentsAdd/GET_DATA',
          payload: params,
          callback: (response) => {
            if (response) {
              setDetails(response);
              setDataComment(response?.templates?.map(i => ({
                ...i,
                content: {
                  ...i?.template?.content,
                  items: i?.template?.content?.items?.map((k, index) => ({
                    ...k,
                    id: `${i?.id}${index}`,
                  })),
                },
                contentText: i?.content
              })));
            }
          },
        });
      }
    }
  }, [params.id]);

  const onChangeUseTable = (e, id) => {
    setDataComment(dataComment?.map(i => ({
      ...i,
      content: {
        ...i?.content,
        items: i?.content?.items?.map(j => ({
          ...j,
          isChecked: j?.id === id ? e.target.checked : j?.isChecked,
        })),
      }
    })));
  };

  const onChangeContentText = (e, id) => {
    setDataComment(dataComment?.map(i => ({
      ...i,
      contentText: id === i?.id ? e.target.value : i?.contentText
    })));
  };

  const header = () => [
    {
      title: 'Sử dụng',
      key: 'student',
      width: 200,
      className: 'min-width-200',
      render: (record) => (
        <div className={classnames(stylesModule['wrapper-checkbox'])}>
          <Checkbox
            checked={record?.isChecked || false}
            className="mr15"
            onChange={(e) => onChangeUseTable(e, record.id)}
          />
          <p className={stylesModule.textChild} >{record?.item}</p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  const onFinish = () => {
    const payload = {
      id: isNotFeedback ? undefined : details.id,
      studentId: isNotFeedback ? dataStudent?.student?.id : details?.student?.id,
      schoolYearId: isNotFeedback ? query?.schoolYearId : details?.schoolYear?.id,
      classId: isNotFeedback ? dataStudent?.class?.id : details?.class?.id,
      physicalStudyProgramId: isNotFeedback ? dataStudent?.physicalStudyProgram?.id : details?.physicalStudyProgram?.id,
      physicalStudyProgramSessionId: isNotFeedback ? dataStudent?.physicalStudyProgramSession?.id : details?.physicalStudyProgramSession?.id,
      joinedDate: isNotFeedback ? moment(dataStudent?.dateHaveInClass) : moment(details?.joinedDate),
      templates: isEmpty(dataComment) ? [] : dataComment?.map(i => ({
        template: {
          id: isNotFeedback ? i?.id : i?.template?.id,
          name: isNotFeedback ? i?.name : i?.template?.name,
          isChecked: true,
          content: {
            type: "FEEDBACK",
            items: isEmpty(i?.content?.items) ? [] : i?.content?.items?.map(j => ({
              item: j?.item,
              isChecked: j?.isChecked
            }))
          }
        },
        content: i?.contentText
      }))
    };
    dispatch({
      type: isNotFeedback ? 'PhysicalLessonCommentsAdd/ADD' : 'PhysicalLessonCommentsAdd/UPDATE',
      payload,
      callback: (response, error) => {
        if (response) {
          if (response) {
            history.goBack();
          }
        }
        if (error) {
          if (get(error, 'data.status') === 400 && !isEmpty(error?.data?.errors)) {
            error.data.errors.forEach((item) => {
              form.current.setFields([
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

  const onApproveFeedback = (id) => {
    dispatch({
      type: 'PhysicalLessonCommentsAdd/APPROVE_FEEDBACK',
      payload: {
        listIdApprove: [id]
      },
      callback: (response) => {
        if (response) {
          history.goBack();
        }
      },
    });
  };

  /**
* Function remove items
* @param {uid} id id of items
*/
  const onRejectFeedback = (id) => {
    const text = "Bạn có chắc muốn từ chối nhận xét này không?";
    Helper.confirmDelete({
      callback: () => {
        dispatch({
          type: 'PhysicalLessonCommentsAdd/REJECT_FEEDBACK',
          payload: {
            id
          },
          callback: (response) => {
            if (response) {
              history.goBack();
            }
          },
        });
      },
    }, text);
  };

  return (
    <div className={stylesModule['wraper-container-quarterReport']}>
      <Breadcrumbs last={params.id ? `Nhận xét ${isNotFeedback ? dataStudent?.student?.fullName : details?.student?.fullName}` : 'Tạo mới'} menu={menuLeftCriteria} />
      <Helmet title="Nhận xét tiết học" />
      <Loading
        loading={effects['PhysicalLessonCommentsAdd/GET_TEMPLATE_FOR_CREATING'] || effects['PhysicalLessonCommentsAdd/GET_DATA']}
      >
        <Pane className="pl20 pr20 pb20">
          <Form
            layout="vertical"
            form={form}
            initialValues={{
              data: [{}],
            }}
            onFinish={onFinish}
          >
            <Pane>
              <Pane className="card p20">
                <Heading type="form-title" className="mb15">
                  Nhận xét ngày {isNotFeedback ? Helper.getDate(dataStudent?.dateHaveInClass, variables.DATE_FORMAT.DATE) : Helper.getDate(details?.joinedDate, variables.DATE_FORMAT.DATE)}
                </Heading>
                <div className="row" style={{ paddingLeft: 15, paddingRight: 15 }} >
                  <div className={stylesModule['quarterReport-header-img']}>
                    <ImgDetail
                      fileImage={isNotFeedback ? dataStudent?.student?.fileImage : details?.student?.fileImage}
                    />
                    <div className='d-block ml20'>
                      <h3 className={stylesModule['general-fullName']}>
                        {isNotFeedback ? dataStudent?.student?.fullName : details?.student?.fullName}
                      </h3>
                      <p className={stylesModule['general-age']}>{isNotFeedback ? dataStudent?.student?.age : details?.student?.age} tháng tuổi</p>
                    </div>
                  </div>
                </div>
                <Divider />
                <Pane className="row">
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={`${user?.schoolYear?.yearFrom} - ${user?.schoolYear?.yearTo}`}
                      label="Năm học"
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={isNotFeedback ? dataStudent?.branch?.name : details?.class?.branch?.name}
                      label="Cơ sở"
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={isNotFeedback ? dataStudent?.class?.name : details?.class?.name}
                      label="Lớp"
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={isNotFeedback ? Helper.getDate(dataStudent?.dateHaveInClass, variables.DATE_FORMAT.DATE) : Helper.getDate(details?.joinedDate, variables.DATE_FORMAT.DATE)}
                      label="Ngày nhận xét"
                    />
                  </Pane>
                </Pane>
                <Divider />
                <Pane className="row">
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={isNotFeedback ? dataStudent?.physicalStudyProgram?.name : details?.physicalStudyProgram?.name}
                      label="Chương trình học"
                    />
                  </Pane>
                  <Pane className="col-lg-3">
                    <FormDetail
                      name={isNotFeedback ? dataStudent?.physicalStudyProgramSession?.name : details?.physicalStudyProgramSession?.name}
                      label="Bài học"
                    />
                  </Pane>
                  {
                    !isNotFeedback && (
                      <Pane className="col-lg-3">
                        <FormDetail
                          name={`${details?.creator?.name} lúc ${Helper.getDate(details?.creationTime, variables.DATE_FORMAT.DATE_TIME)}`}
                          label="Giáo viên nhận xét"
                        />
                      </Pane>
                    )
                  }
                </Pane>
              </Pane>
            </Pane>
            <Pane className="card p20">
              {
                isEmpty(dataComment) ? <></> : dataComment?.map((item, index) => (
                  <Pane className={classnames("mb20", { "border-bottom": index !== dataComment?.length - 1 })} key={item?.id}>
                    <Heading type="form-title" className="mb15">
                      {isNotFeedback ? item?.name : item?.template?.name}
                    </Heading>
                    <Pane className="col-lg-12 p-0">
                      <p className="mb10">Nhận xét mẫu</p>
                      <div className={stylesModule['wrapper-table-details']}>
                        <Table
                          columns={header()}
                          dataSource={item?.content?.items}
                          pagination={false}
                          rowKey={(record) => record.id}
                          scroll={{ x: '100%' }}
                          isEmpty
                        />
                      </div>
                      <Pane className="col-lg-12 p-0 pt15">
                        <FormItem
                          label="Nội dung nhận xét"
                          type="textArea"
                          onChange={e => onChangeContentText(e, item?.id)}
                          value={item?.contentText || ''}
                        />
                      </Pane>
                    </Pane>
                  </Pane>
                ))
              }
            </Pane>
            <Pane className="d-flex justify-content-between align-items-center mb20 mt20">
              <p className="btn-delete" role="presentation" onClick={() => history.goBack()}>
                Đóng
              </p>
              <div className="d-flex align-items-center">
                {
                  !isNotFeedback && (
                    <Button
                      className="ml10 px25"
                      color="danger"
                      loading={effects['PhysicalLessonCommentsAdd/REJECT_FEEDBACK']}
                      onClick={() => onRejectFeedback(details.id)}
                    >
                      Từ chối
                    </Button>
                  )
                }
                <Button
                  className="ml10 px25"
                  color="success"
                  htmlType="submit"
                  loading={loadingSubmit}
                >
                  Lưu
                </Button>
                {
                  !isNotFeedback && (
                    <Button
                      className="ml10 px25"
                      color="primary"
                      loading={effects['PhysicalLessonCommentsAdd/APPROVE_FEEDBACK']}
                      onClick={() => onApproveFeedback(details.id)}
                    >
                      Duyệt
                    </Button>
                  )
                }
              </div>
            </Pane>
          </Form>
        </Pane>
      </Loading>
    </div >
  );
});

export default Index;
