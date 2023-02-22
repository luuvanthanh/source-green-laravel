import React, { memo } from 'react';
import { Typography } from 'antd';
import { Draggable } from 'react-beautiful-dnd';
import { useDispatch } from 'dva';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import stylesModule from '../../styles.module.scss';

const { Paragraph } = Typography;

const Index = memo(({
  check,
  indexParent,
  taskItem,
  checkEdit,
  index,
  timeTable,
  time,
  checkDisabled
}) => {

  const dispatch = useDispatch();
  const onClickModal = () => {
    dispatch({
      type: 'englishStudyPlan/SET_MODAL_ITEM',
      payload: { check: true, data: taskItem },
    });
  };
  return (
    <>
      <Draggable key={`${taskItem.id}-${indexParent}-${index}`} draggableId={`${taskItem.dragId}-${index}`} isDragDisabled={!checkEdit || isEmpty(checkDisabled) || check && timeTable.toISOString() > time.toISOString()} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={stylesModule['card-table']}
          >
            <Paragraph
              style={{
                backgroundColor: taskItem?.lession?.colorText,
              }}
              className={stylesModule['card-item']}
              onClick={() => onClickModal(taskItem)}
            >
              <p className={stylesModule?.text}>{taskItem?.lession?.programName}</p>
              <div className={stylesModule?.textFlex}>
                <p className={stylesModule?.text}>Week {taskItem?.lession?.week}</p>
                <p className={stylesModule?.textPadding}> - </p>
                <p className={stylesModule?.text}>Class period {taskItem?.lession?.classPeriod}</p>
              </div>
              <h3 className={stylesModule?.textUnit}>Unit {taskItem?.lession?.unitIndex}: {taskItem?.lession?.unitName}</h3>
              <p className={stylesModule?.text}>Content: {taskItem?.lession?.lessionName}</p>
              <p className={stylesModule?.text}>Activities: {taskItem?.lession?.activities}</p>
            </Paragraph>
          </div>
        )}
      </Draggable>
    </>
  );
});

Index.propTypes = {
  indexParent: PropTypes.PropTypes.any,
  taskItem: PropTypes.PropTypes.any,
  checkEdit: PropTypes.PropTypes.any,
  index: PropTypes.PropTypes.any,
  timeTable: PropTypes.PropTypes.any,
  time: PropTypes.PropTypes.any,
  check: PropTypes.PropTypes.any,
  checkDisabled: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  indexParent: null,
  taskItem: null,
  checkEdit: null,
  index: null,
  timeTable: null,
  time: null,
  check: null,
  checkDisabled: null,
};

export default Index;