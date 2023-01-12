import React, { memo } from 'react';
import { variables } from '@/utils';
import { Typography } from 'antd';
import classnames from 'classnames';
import { Droppable } from 'react-beautiful-dnd';
import moment from 'moment';

import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import ItemDraggeble from './item-draggeble';

import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import stylesModule from '../../styles.module.scss';

const { Paragraph } = Typography;

const Index = memo(({
  indexParent,
  classItem,
  indexItem,
  valueParent,
  checkDisabled,
  dataTasks,
  keyItem,
  timeTable,
  time,
  getListStyle,
  checkEdit
}) => {

  const formTable = (indexParent, classItem, indexItem, valueParent, checkDisabled, dataTasks, key, timeTable, time) => {
    if (indexParent === 0) {
      return <Paragraph className="header-row" >{classItem?.day}  {indexItem !== 0 && moment(classItem?.date).format(variables.DATE_FORMAT.DATE_MONTH)}</Paragraph>;
    }
    if (indexItem === 0) {
      return <div
        className={classnames(stylesModule['item-col'], 'p10')}
      >
        {valueParent?.fromTime} - {valueParent?.toTime}
      </div>;
    }
    if (isEmpty(checkDisabled) || timeTable?.toISOString() > time?.toISOString()) {
      return <Droppable
        isDropDisabled
        key={indexParent} droppableId={`{"date":"${classItem?.date}","key":"${key}","dragId":"${valueParent?.dragId}"}`} index={`${indexItem}-${key}`}>
        {(provided, snapshot) => (
          <div
            {...provided?.droppableProps}
            ref={provided.innerRef}
            style={getListStyle(snapshot?.isDraggingOver)}
            className={classnames(stylesModule['item-col'], stylesModule['item-Disabled'])}
          >
            {!isEmpty(dataTasks) && dataTasks?.lessions?.map((taskItem, index) => (
              <ItemDraggeble
                taskItem={taskItem}
                index={index}
                indexParent={indexParent}
                checkEdit={checkEdit}
                timeTable={timeTable}
                time={time}
                check
              />
            ))}
          </div>
        )
        }
      </Droppable>;
    }
    if (!isEmpty(checkDisabled)) {
      return (
        <Droppable
          key={indexParent} droppableId={`{"date":"${classItem?.date}","key":"${key}","dragId":"${valueParent?.dragId}"}`} index={`${indexItem}-${key}`} isDragDisabled={!checkEdit}>
          {(provided, snapshot) => (
            <div
              {...provided?.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot?.isDraggingOver)}
              className={stylesModule['item-col']}
            >
              {!isEmpty(dataTasks) && dataTasks?.lessions?.map((taskItem, index) => (
                <ItemDraggeble
                  taskItem={taskItem}
                  index={index}
                  indexParent={indexParent}
                  checkEdit={checkEdit}
                  check={false}
                />
              ))}
            </div>
          )
          }
        </Droppable>
      );
    }
    return "";
  };
  return (
    <>
      {formTable(indexParent, classItem, indexItem, valueParent, checkDisabled, dataTasks, keyItem, timeTable, time)}
    </>
  );
});

Index.propTypes = {
  indexParent: PropTypes.PropTypes.any,
  classItem: PropTypes.PropTypes.any,
  indexItem: PropTypes.PropTypes.any,
  valueParent: PropTypes.PropTypes.any,
  checkDisabled: PropTypes.PropTypes.any,
  dataTasks: PropTypes.PropTypes.any,
  keyItem: PropTypes.PropTypes.any,
  timeTable: PropTypes.PropTypes.any,
  time: PropTypes.PropTypes.any,
  checkEdit: PropTypes.PropTypes.any,
  getListStyle: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  indexParent: null,
  classItem: null,
  indexItem: null,
  valueParent: null,
  checkDisabled: null,
  dataTasks: null,
  keyItem: null,
  timeTable: null,
  time: null,
  checkEdit: false,
  getListStyle: {},
};

export default Index;