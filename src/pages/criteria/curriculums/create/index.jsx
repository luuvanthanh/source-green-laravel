import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs, Switch } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory, useParams } from 'umi';
import { isEmpty, head } from 'lodash';
import csx from 'classnames';
import moment from 'moment';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

import { variables, Helper } from '@/utils';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Loading from '@/components/CommonComponent/Loading';
import variablesModules from '../utils/variables';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const { TabPane } = Tabs;

const Index = memo(() => {
  const [tab, setTab] = useState(null);
  const [type, setType] = useState(variablesModules.ADD);
  const [programType, setProgramType] = useState(variablesModules.STUDENT);
  const [toolGroups, setToolGroups] = useState([]);
  const [isEnable, setIsEnable] = useState(false);

  const [
    { menuLeftCriteria },
    { students, classes, curriculumTemplates, error },
    loading,
  ] = useSelector(({ menu, curriculumsAdd, loading: { effects } }) => [
    menu,
    curriculumsAdd,
    effects,
  ]);
  const dispatch = useDispatch();
  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);
  const params = useParams();
  const mountedSet = (action, value) => mounted?.current && action(value);

  const onChangeType = (event) => {
    mountedSet(setType, event.target.value);
  };

  const onChangeProgramType = (event) => {
    mountedSet(setProgramType, event.target.value);
  };

  const onChangeIsEnable = (value) => {
    mountedSet(setIsEnable, value);
  };

  const onChangeToolGroups = (isChoosed, record) => {
    mountedSet(
      setToolGroups,
      toolGroups.map((item) => (item.id === record.id ? { ...item, isChoosed } : item)),
    );
  };

  const onChangeToolDetails = (isChoosed, record) => {
    mountedSet(
      setToolGroups,
      toolGroups.map((item) => {
        if (item.id === record.parentId) {
          return {
            ...item,
            toolDetails: item.toolDetails.map((itemTool) =>
              itemTool.id === record.id ? { ...itemTool, isChoosed } : itemTool,
            ),
          };
        }
        return item;
      }),
    );
  };

  const onFinish = (values) => {
    const payload = {
      ...values,
      ...params,
      toolGroups: toolGroups.map((item) => ({
        toolGroupId: item.id,
        isChoosed: !!item.isChoosed,
        toolDetails: item.toolDetails.map((detail) => ({
          toolDetailId: detail.id,
          isChoosed: !!detail.isChoosed,
        })),
      })),
      isEnable,
      objectCurriculums: [
        {
          studentId: values.studentId,
          classId: values.classId,
        },
      ],
    };
    dispatch({
      type: params.id ? 'curriculumsAdd/UPDATE' : 'curriculumsAdd/ADD',
      payload,
      callback: (response, error) => {
        if (response) {
          history.push('/chuong-trinh-hoc');
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

  const remove = () => {
    Helper.confirmAction({
      callback: () => {
        dispatch({
          type: 'curriculumsAdd/REMOVE',
          payload: {
            ...params,
          },
          callback: (response) => {
            if (response) {
              history.push('/chuong-trinh-hoc');
            }
          },
        });
      },
    });
  };

  const onChangeTemplates = (value) => {
    const template = curriculumTemplates.find((item) => item.id === value);
    if (template) {
      mountedSet(setProgramType, template.programType);
      mountedSet(setIsEnable, template.isEnable);
      formRef.current.setFieldsValue({
        ...template,
      });
      mountedSet(
        setToolGroups,
        template.toolGroupCurriculums.map((item) => ({
          ...item,
          index: item.groupIndex,
          toolDetails: item.toolDetails.map((itemTool) => ({
            ...itemTool,
            index: itemTool.detailIndex,
          })),
        })),
      );
    }
  };

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (!params.id) {
      dispatch({
        type: 'curriculumsAdd/GET_TOOL_GROUPS',
        payload: {},
        callback: (response) => {
          mountedSet(
            setToolGroups,
            response.map((item, index) => ({ ...item, index })),
          );
        },
      });
    }
  }, []);

  useEffect(() => {
    dispatch({
      type: 'curriculumsAdd/GET_STUDENTS',
      payload: {
        classStatus: 'HAS_CLASS',
      },
    });
    dispatch({
      type: 'curriculumsAdd/GET_CLASSES',
      payload: {},
    });
    dispatch({
      type: 'curriculumsAdd/GET_CURRICULUM_TEMPLATES',
      payload: {},
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'curriculumsAdd/GET_DETAILS',
        payload: {
          ...params,
        },
        callback: (response) => {
          if (response) {
            mountedSet(setProgramType, response.programType);
            mountedSet(setIsEnable, response.isEnable);
            formRef.current.setFieldsValue({
              ...response,
              fromDate: moment(response.fromDate),
              toDate: moment(response.toDate),
              studentId: head(response.objectCurriculums)?.student?.id,
              classId: head(response.objectCurriculums)?.class?.id,
            });
            mountedSet(
              setToolGroups,
              response.toolGroupCurriculums.map((item) => ({
                ...item,
              })),
            );
          }
        },
      });
    }
  }, [params.id]);

  const changeTab = (values) => setTab(values.id);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(toolGroups, result.source.index, result.destination.index);

    setToolGroups(items);
  };

  const onDragEndContent = (result, record) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(record.toolDetails, result.source.index, result.destination.index);

    setToolGroups(
      toolGroups.map((item) => (item.id === record.id ? { ...item, toolDetails: items } : item)),
    );
  };

  const enableToolDetails = (items) => {
    const toolGroup = items.find((item) => item.id === tab && item.isChoosed);
    if (toolGroup) {
      return toolGroup?.toolDetails?.map((item) => ({ ...item, parentId: toolGroup.id }));
    }
    return [];
  };

  const enableParentId = (items) => {
    const toolGroup = items.find((item) => item.id === tab && item.isChoosed);
    return toolGroup;
  };

  return (
    <>
      <Helmet title={params.id ? 'Chỉnh sửa chương trình học' : 'Tạo mới chương trình học'} />
      <Pane style={{ padding: 20, paddingBottom: 0 }}>
        <Breadcrumbs
          className="pb30 pt0"
          last={params.id ? 'Chỉnh sửa' : 'Thêm mới'}
          menu={menuLeftCriteria}
        />
        <Pane className="row">
          <Pane className="col-lg-8 offset-lg-2">
            <Form
              layout="vertical"
              ref={formRef}
              onFinish={onFinish}
              initialValues={{
                type,
                programType,
              }}
            >
              <Loading
                loading={
                  loading['curriculumsAdd/GET_DETAILS'] ||
                  loading['curriculumsAdd/GET_CLASSES'] ||
                  loading['curriculumsAdd/GET_STUDENTS']
                }
                isError={error.isError}
                params={{ error, type: 'container', goBack: '/chuong-trinh-hoc' }}
              >
                {!params.id && (
                  <Pane className="card px15 pt20">
                    <Heading type="form-title" className="mb20">
                      Thông tin template
                    </Heading>

                    <Pane className={csx('row', 'border-bottom')}>
                      <Pane className="col-lg-12">
                        <FormItem
                          className="row-radio"
                          name="type"
                          type={variables.RADIO}
                          data={variablesModules.CHOOSE}
                          rules={[variables.RULES.EMPTY]}
                          onChange={onChangeType}
                        />
                      </Pane>
                    </Pane>
                    {type === variablesModules.TEMPLATE && (
                      <Pane className={csx('row', 'border-bottom')}>
                        <Pane className="col-lg-12">
                          <FormItem
                            className="mt20"
                            label="Template"
                            name="template"
                            type={variables.SELECT}
                            data={curriculumTemplates.map((item) => ({
                              id: item.id,
                              name: item.curriculumName,
                            }))}
                            onChange={onChangeTemplates}
                            allowClear={false}
                          />
                        </Pane>
                      </Pane>
                    )}
                  </Pane>
                )}

                <Pane className="card px15 pt20">
                  <Heading type="form-title" className="mb20">
                    Thông tin chung
                  </Heading>

                  <Pane className={csx('row', 'border-bottom')}>
                    <Pane className="col-lg-12">
                      <FormItem
                        className="row-radio"
                        name="programType"
                        type={variables.RADIO}
                        data={variablesModules.RADIOS}
                        rules={[variables.RULES.EMPTY]}
                        onChange={onChangeProgramType}
                      />
                    </Pane>
                  </Pane>

                  <Pane className={csx('row', 'border-bottom')}>
                    {programType === variablesModules.STUDENT && (
                      <Pane className="col-lg-4">
                        <FormItem
                          className="mt20"
                          label="Học sinh"
                          name="studentId"
                          type={variables.SELECT}
                          data={Helper.convertSelectUsers(students)}
                          allowClear={false}
                        />
                      </Pane>
                    )}
                    {programType === variablesModules.CLASS && (
                      <Pane className="col-lg-4">
                        <FormItem
                          className="mt20"
                          label="Lớp"
                          name="classId"
                          type={variables.SELECT}
                          data={classes}
                          allowClear={false}
                        />
                      </Pane>
                    )}

                    <Pane className="col-lg-4">
                      <FormItem
                        className="mt20"
                        label="Bắt đầu từ"
                        name="fromDate"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.DATE_PICKER}
                        disabledDate={(current) =>
                          Helper.disabledDateFrom(current, formRef, 'toDate')
                        }
                      />
                    </Pane>
                    <Pane className="col-lg-4">
                      <FormItem
                        className="mt20"
                        label="Kết thúc"
                        name="toDate"
                        rules={[variables.RULES.EMPTY]}
                        type={variables.DATE_PICKER}
                        disabledDate={(current) =>
                          Helper.disabledDateTo(current, formRef, 'fromDate')
                        }
                      />
                    </Pane>
                  </Pane>

                  <Pane className={csx('row')}>
                    <Pane className="col-lg-12 mt20">
                      <FormItem
                        label="Tên chương trình"
                        name="name"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>

                    <Pane className="col-lg-12">
                      <FormItem
                        label="Mục tiêu chương trình"
                        name="target"
                        rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                        type={variables.TEXTAREA}
                      />
                    </Pane>
                  </Pane>
                </Pane>

                <Pane className="card mt-30">
                  <Pane type="form-title" className="heading-form border-bottom">
                    <Heading type="form-title">Góc giáo cụ</Heading>
                    <Switch onChange={onChangeIsEnable} checked={isEnable} />
                  </Pane>
                  <Pane className="px15">
                    <Pane className="row">
                      <Pane className="col-lg-4 tab-drag">
                        <DragDropContext onDragEnd={onDragEnd}>
                          <Droppable droppableId="droppable">
                            {(provided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef}>
                                {toolGroups.map((item, index) => (
                                  <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Tabs
                                          className={item.id === tab ? 'active-tab' : ''}
                                          tabPosition="left"
                                          onChange={() => changeTab(item)}
                                          activeKey={tab}
                                        >
                                          <TabPane
                                            tab={
                                              <Pane className="tab-space-between">
                                                <Pane>
                                                  <span className="icon icon-drag" />
                                                  <span className="title">{item.name}</span>
                                                </Pane>
                                                <Switch
                                                  disabled={!isEnable}
                                                  className="mb0 btn-switch"
                                                  checked={item.isChoosed}
                                                  onChange={(value) =>
                                                    onChangeToolGroups(value, item)
                                                  }
                                                />
                                              </Pane>
                                            }
                                            key={index}
                                          />
                                        </Tabs>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </Pane>
                      <Pane className="col-lg-8">
                        <DragDropContext
                          onDragEnd={(event) => onDragEndContent(event, enableParentId(toolGroups))}
                        >
                          <Droppable droppableId="droppable">
                            {(provided) => (
                              <div {...provided.droppableProps} ref={provided.innerRef}>
                                {enableToolDetails(toolGroups)?.map((item, index) => (
                                  <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <Pane
                                          key={index}
                                          className="tab-space-between start py15 border-bottom"
                                        >
                                          <Pane className="d-flex align-items-center">
                                            <span className="icon icon-drag" />
                                            <span className="text">{item.name}</span>
                                          </Pane>
                                          <Switch
                                            disabled={!isEnable}
                                            className="mb0 btn-switch"
                                            checked={item.isChoosed}
                                            onChange={(value) => onChangeToolDetails(value, item)}
                                          />
                                        </Pane>
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                              </div>
                            )}
                          </Droppable>
                        </DragDropContext>
                      </Pane>
                    </Pane>
                  </Pane>
                </Pane>

                <Pane className="mb10 d-flex justify-content-between align-items-center">
                  {params.id && (
                    <p className="btn-delete" role="presentation" onClick={remove}>
                      Xóa
                    </p>
                  )}

                  <Button
                    className="ml-auto"
                    color="success"
                    htmlType="submit"
                    size="large"
                    loading={loading['curriculumsAdd/ADD'] || loading['curriculumsAdd/UPDATE']}
                  >
                    Lưu
                  </Button>
                </Pane>
              </Loading>
            </Form>
          </Pane>
        </Pane>
      </Pane>
    </>
  );
});

export default Index;
