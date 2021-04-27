import { memo, useRef, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Form, Tabs } from 'antd';
import { useSelector, useDispatch } from 'dva';
import { useHistory } from 'umi';
import csx from 'classnames';

import Breadcrumbs from '@/components/LayoutComponents/Breadcrumbs';
import Pane from '@/components/CommonComponent/Pane';
import Heading from '@/components/CommonComponent/Heading';
import Button from '@/components/CommonComponent/Button';
import FormItem from '@/components/CommonComponent/FormItem';

import { variables } from '@/utils';
import Text from '@/components/CommonComponent/Text';
import variablesModules from '../utils/variables';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const { TabPane } = Tabs;

const Index = memo(({ }) => {
  const [tab, setTab] = useState('orientation');
  const [categoryTabs, setCategoryTabs] = useState(variablesModules.CATEGORY_TABS);
  const [contentTabs, setContentTabs] = useState(variablesModules.CONTENT_TABS);

  const [{ menuLeftCriteria }] = useSelector(({ menu }) => [menu]);
  const dispatch = useDispatch();
  const history = useHistory();
  const formRef = useRef();
  const mounted = useRef(false);
  const mountedSet = (action, value) => mounted?.current && action(value);

  const onFinish = (values) => {
    history.goBack()
  };

  useEffect(() => {
    mounted.current = true;
    return () => (mounted.current = false);
  }, []);

  const changeTab = (values) => {
    setTab(values.id)
  }

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      categoryTabs,
      result.source.index,
      result.destination.index
    );

    setCategoryTabs(items)
  }

  return (
    <Pane style={{ padding: 20, paddingBottom: 0 }}>
      <Helmet title="Tạo mới nhóm đối tượng" />
      <Breadcrumbs className="pb30 pt0" last="Thêm mới" menu={menuLeftCriteria} />
      <Pane className="row justify-content-center">
        <Pane className="col-md-10 col-lg-8 col-xl-6">
          <Form
            layout="vertical"
            ref={formRef}
            onFinish={onFinish}
            initialValues={{}}
          >
            <Pane className="card px15 pt20">
              <Heading type="form-title" className="mb20">
                Thông tin chung
              </Heading>

              <Pane className={csx('row', 'border-bottom')}>
                <Pane className="col-lg-12">
                  <FormItem
                    className="row-radio"
                    name="caNhan"
                    type={variables.RADIO}
                    data={variablesModules.RADIOS.map(({ id, name }) => ({ value: id, label: name }))}
                    rules={[variables.RULES.EMPTY]}
                  />
                </Pane>
              </Pane>

              <Pane className={csx('row', 'border-bottom')}>
                <Pane className="col-lg-4">
                  <FormItem
                    className="mt20"
                    label="Trẻ"
                    name="tre"
                    type={variables.SELECT}
                    data={[]}
                    onChange={() => {}}
                    allowClear={false}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    className="mt20"
                    label="Bắt đầu từ"
                    name="ngayBatDau"
                    type={variables.DATE_PICKER}
                  />
                </Pane>
                <Pane className="col-lg-4">
                  <FormItem
                    className="mt20"
                    label="Kết thúc"
                    name="ngayKetThuc"
                    // rules={[variables.RULES.EMPTY]}
                    type={variables.DATE_PICKER}
                  />
                </Pane>
              </Pane>

              <Pane className={csx('row')}>
                <Pane className="col-lg-12 mt20">
                  <FormItem
                    label="Tên chương trình"
                    name="tenChuongTrinh"
                    type={variables.INPUT}
                  />
                </Pane>

                <Pane className="col-lg-12">
                  <FormItem
                    label="Mục tiêu chương trình"
                    name="mucTieuChuongTrinh"
                    rules={[variables.RULES.MAX_LENGTH_TEXTAREA]}
                    type={variables.TEXTAREA}
                  />
                </Pane>
              </Pane>
            </Pane>

            <Pane className="card mt-30">
              <Pane type="form-title" className="heading-form border-bottom">
                <Text>Góc giáo cụ</Text>
                <FormItem
                  className="mb0"
                  name="isHasNote"
                  type={variables.SWITCH}
                  valuePropName="checked"
                />
              </Pane>
              <Pane className="px15">
                <Pane className="row">
                  <Pane className="col-lg-4 tab-drag">
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="droppable">
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {categoryTabs.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <Tabs className={item.id === tab ? 'active-tab' : ''} tabPosition="left" onChange={() => changeTab(item)} activeKey={tab}>
                                      <TabPane
                                        tab={
                                          <Pane className="tab-space-between">
                                            <Pane>
                                              <span className="icon icon-drag" />
                                              <span className="title">{item.name}</span>
                                            </Pane>
                                            <FormItem
                                              className="mb0 btn-switch"
                                              name={`category${index}`}
                                              type={variables.SWITCH}
                                              valuePropName="checked"
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
                    {contentTabs?.map((item, index) => (
                      <Pane key={index} className="tab-space-between start py15 border-bottom">
                        <Pane className="d-flex align-items-center">
                          <span className="icon icon-drag" />
                          <span className="text">{item.name}</span>
                        </Pane>
                        <FormItem
                          className="mb0 btn-switch"
                          name={`content${index}`}
                          type={variables.SWITCH}
                          valuePropName="checked"
                        />
                      </Pane>
                    ))}
                  </Pane>
                </Pane>
              </Pane>
            </Pane>

            <Button
              className="ml-auto mb30"
              color="success"
              htmlType="submit"
              size="large"
            >
              Lưu
            </Button>
          </Form>
        </Pane>
      </Pane>
    </Pane>
  );
});

export default Index;
