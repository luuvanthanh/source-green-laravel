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
  const [programType, setProgramType] = useState(variablesModules.STUDENT);
  const [toolGroups, setToolGroups] = useState([]);
  const [isEnable, setIsEnable] = useState(false);

  const [
    { menuLeftCriteria },
    { error },
    loading,
  ] = useSelector(({ menu, curriculumTemplatesAdd, loading: { effects } }) => [
    menu,
    curriculumTemplatesAdd,
    effects,
  ]);
  const dispatch = useDispatch();
  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);
  const params = useParams();
  const mountedSet = (action, value) => mounted?.current && action(value);

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
    dispatch({
      type: params.id ? 'curriculumTemplatesAdd/UPDATE' : 'curriculumTemplatesAdd/ADD',
      payload: {
        ...values,
        ...params,
        curriculumType: 'TOOL',
        toolGroups: toolGroups.map((item) => ({
          toolGroupId: item.id,
          isChoosed: !!item.isChoosed,
          toolDetails: item.toolDetails.map((detail) => ({
            toolDetailId: detail.id,
            isChoosed: !!detail.isChoosed,
          })),
        })),
        isEnable,
      },
      callback: (response, error) => {
        if (response) {
          history.push('/chuong-trinh-hoc/templates');
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
          type: 'curriculumTemplatesAdd/REMOVE',
          payload: {
            ...params,
          },
          callback: (response) => {
            if (response) {
              history.push('/chuong-trinh-hoc/templates');
            }
          },
        });
      },
    });
  };

  useEffect(() => {
    mounted.current = true;
    return mounted.current;
  }, []);

  useEffect(() => {
    if (!params.id) {
      dispatch({
        type: 'curriculumTemplatesAdd/GET_TOOL_GROUPS',
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
      type: 'curriculumTemplatesAdd/GET_STUDENTS',
      payload: {
        classStatus: 'HAS_CLASS',
      },
    });
    dispatch({
      type: 'curriculumTemplatesAdd/GET_CLASSES',
      payload: {},
    });
  }, []);

  useEffect(() => {
    if (params.id) {
      dispatch({
        type: 'curriculumTemplatesAdd/GET_DETAILS',
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
              studentId: head(response.objectCurriculumTemplates)?.student?.id,
              classId: head(response.objectCurriculumTemplates)?.class?.id,
            });
            mountedSet(
              setToolGroups,
              response.toolGroupCurriculums.map((item) => ({
                ...item.toolGroup,
                isChoosed: item.isChoosed,
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
      return toolGroup.toolDetails.map((item) => ({ ...item, parentId: toolGroup.id }));
    }
    return [];
  };

  const enableParentId = (items) => {
    const toolGroup = items.find((item) => item.id === tab && item.isChoosed);
    return toolGroup;
  };

  return (
    <>
      <Helmet
        title={
          params.id ? 'Chỉnh sửa chương trình học template' : 'Tạo mới chương trình học template'
        }
      />
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
                programType,
              }}
            >
              <Loading
                loading={
                  loading['curriculumTemplatesAdd/GET_DETAILS'] ||
                  loading['curriculumTemplatesAdd/GET_CLASSES'] ||
                  loading['curriculumTemplatesAdd/GET_STUDENTS']
                }
                isError={error.isError}
                params={{ error, type: 'container' }}
              >
                <Pane className="card px15">
                  <Pane className={csx('row', 'border-bottom')}>
                    <Pane className="col-lg-12 mt20">
                      <FormItem
                        label="Tên template"
                        name="curriculumName"
                        type={variables.INPUT}
                        rules={[variables.RULES.EMPTY]}
                      />
                    </Pane>
                  </Pane>
                </Pane>

                <Pane className="card px15 pt20">
                  <Heading type="form-title" className="mb20">
                    Thông tin chung
                  </Heading>

                  <Pane className={csx('row')}>
                    <Pane className="col-lg-12">
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
                    loading={
                      loading['curriculumTemplatesAdd/ADD'] ||
                      loading['curriculumTemplatesAdd/UPDATE']
                    }
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
