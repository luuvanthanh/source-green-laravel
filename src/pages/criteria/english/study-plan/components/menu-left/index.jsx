import React, { memo } from 'react';
import FormItem from '@/components/CommonComponent/FormItem';
import { variables } from '@/utils';
import { Scrollbars } from 'react-custom-scrollbars';
import { Input } from 'antd';
import classnames from 'classnames';
import InfiniteScroll from 'react-infinite-scroller';
import { Droppable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import { isEmpty, head } from 'lodash';
import {
  SearchOutlined,
} from '@ant-design/icons';

import Item from './item';

import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import stylesModule from '../../styles.module.scss';

const Index = memo(({ setSearchLeft, searchLeft, setDataUnit, setFormatColumns, formatColumns, dataProgram, index, keyItem, dataUnit, searchText, setSearchText, formatTextSearch, searchDate, program, value, checkEdit }) => {

  const onProgram = (e) => {
    setSearchLeft({ ...searchLeft, programId: e });
    if (!isEmpty(e)) {
      const data = program?.filter(i => i?.id === e);
      setDataUnit(head(data)?.units);
      setFormatColumns({ ...formatColumns, "columns-1": { tasks: dataProgram?.filter(i => i?.programId === e) } });
    } else {
      setFormatColumns({ ...formatColumns, "columns-1": { tasks: dataProgram } });
    }
  };
  const onProgramUnit = (e) => {
    if (!isEmpty(e)) {
      setFormatColumns({ ...formatColumns, "columns-1": { tasks: dataProgram?.filter(i => i?.idUnit === e) } });
    } else {
      setFormatColumns({ ...formatColumns, "columns-1": { tasks: dataProgram?.filter(i => i?.programId === searchLeft?.programId) } });
    }
  };

  return (
    <Droppable key={index} droppableId={keyItem}>
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <div className={classnames(stylesModule['block-table'], "p0")}>
            <div className="p10 border-bottom">
              <FormItem
                data={[{ id: null, name: 'All program' }, ...program]}
                name="programId"
                bordered={false}
                type={variables.SELECT}
                placeholder="-Choose program-"
                onChange={onProgram}
              />
            </div>
            <div className="p10 border-bottom">
              <FormItem
                data={[{ id: null, name: 'All Unit' }, ...dataUnit]}
                name="UnitId"
                bordered={false}
                type={variables.SELECT}
                placeholder="-Choose unit-"
                onChange={onProgramUnit}
              />
            </div>
            <div className="p10 border-bottom">
              <Input
                prefix={<SearchOutlined style={{
                  marginRight: '10px',
                }} />}
                placeholder="Search"
                value={searchText}
                bordered={false}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Scrollbars autoHeight autoHeightMax="calc(100vh - 390px)">
              <InfiniteScroll
                pageStart={0}
                useWindow={false}
                initialLoad={false}
              >
                {formatTextSearch(value.tasks).map((task, index) => (
                  <Item
                    index={index}
                    task={task}
                    keyItem={keyItem}
                    searchDate={searchDate}
                    checkEdit={checkEdit}
                  />
                ))}
              </InfiniteScroll>
            </Scrollbars>
          </div>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
});

Index.propTypes = {
  index: PropTypes.PropTypes.any,
  keyItem: PropTypes.PropTypes.any,
  onProgram: PropTypes.PropTypes.any,
  dataUnit: PropTypes.PropTypes.any,
  onProgramUnit: PropTypes.PropTypes.any,
  searchText: PropTypes.PropTypes.any,
  setSearchText: PropTypes.PropTypes.any,
  formatTextSearch: PropTypes.PropTypes.any,
  searchDate: PropTypes.PropTypes.any,
  program: PropTypes.PropTypes.any,
  value: PropTypes.PropTypes.any,
  checkEdit: PropTypes.PropTypes.any,
  setSearchLeft: PropTypes.PropTypes.any,
  searchLeft: PropTypes.PropTypes.any,
  setDataUnit: PropTypes.PropTypes.any,
  setFormatColumns: PropTypes.PropTypes.any,
  formatColumns: PropTypes.PropTypes.any,
  dataProgram: PropTypes.PropTypes.any,

};

Index.defaultProps = {
  index: null,
  keyItem: null,
  onProgram: () => { },
  dataUnit: [],
  onProgramUnit: () => { },
  searchText: null,
  setSearchText: null,
  formatTextSearch: () => { },
  searchDate: {},
  program: [],
  value: null,
  checkEdit: false,
  setSearchLeft: null,
  searchLeft: null,
  setDataUnit: null,
  setFormatColumns: null,
  formatColumns: null,
  dataProgram: null,
};

export default Index;