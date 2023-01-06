import React, { memo } from 'react';
import { Typography } from 'antd';
import { Draggable } from 'react-beautiful-dnd';
import moment from 'moment';
import PropTypes from 'prop-types';


import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import stylesModule from '../../styles.module.scss';

const { Paragraph } = Typography;

const Index = memo(({ index, task, keyItem, searchDate, checkEdit }) => (
  <Draggable
    key={index}
    draggableId={`{"name":"${task?.name}","key":"${keyItem}"},"index":${index}`}
    index={index}
    isDragDisabled={new Date(searchDate?.fromDate).toISOString() < new Date(moment()).toISOString() && new Date(searchDate?.toDate).toISOString() < new Date(moment()).toISOString() || !checkEdit}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={stylesModule['card-menuLeft']}
      >
        <Paragraph
          style={{
            backgroundColor: task.colorText,
          }}
          className={stylesModule['card-item']}
        >
          <p className={stylesModule?.text}>{task?.programName}</p>
          <div className={stylesModule?.textFlex}>
            <p className={stylesModule?.text}>Week {task?.week}</p>
            <p className={stylesModule?.textPadding}> - </p>
            <p className={stylesModule?.text}>Class period {task?.classPeriod}</p>
          </div>
          <h3 className={stylesModule?.textUnit}>Unit {task?.unitIndex}: {task?.unitName}</h3>
          <p className={stylesModule?.text}>{task?.name}</p>
        </Paragraph>
      </div>
    )}
  </Draggable>
));

Index.propTypes = {
  index: PropTypes.PropTypes.any,
  task: PropTypes.PropTypes.any,
  keyItem: PropTypes.PropTypes.any,
  checkEdit: PropTypes.PropTypes.any,
  searchDate: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  index: null,
  task: null,
  keyItem: null,
  checkEdit: false,
  searchDate: {},
};

export default Index;