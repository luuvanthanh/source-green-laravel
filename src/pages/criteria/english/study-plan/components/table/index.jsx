import React, { memo } from 'react';
import styles from '@/assets/styles/Common/common.scss';
import Button from '@/components/CommonComponent/Button';
import Text from '@/components/CommonComponent/Text';
import { Helper, variables } from '@/utils';
import classnames from 'classnames';
import Loading from '@/components/CommonComponent/Loading';
import moment from 'moment';

import { debounce } from 'lodash';
import PropTypes from 'prop-types';

import {
  LeftOutlined,
  RightOutlined,
} from '@ant-design/icons';

import FormTable from './form-table';


import '@/assets/styles/Modules/TimeTables/styles.module.scss';
import stylesModule from '../../styles.module.scss';


const Index = memo(({
  searchDate,
  search,
  loading,
  formatColumns,
  arrDate,
  getListStyle,
  setSearchDate,
  checkEdit,
  checkUse,
  setCheckUse }) => {


  const debouncedSearchDate = debounce((fromDate = moment(), toDate = moment()) => {
    setSearchDate((prev) => ({
      ...prev,
      fromDate: Helper.getDate(fromDate, variables.DATE_FORMAT.DATE_AFTER),
      toDate: Helper.getDate(toDate, variables.DATE_FORMAT.DATE_AFTER),
    }));
  });

  const titleDateTable = () => Helper.getDate(
    moment(searchDate.fromDate).endOf('week'),
    variables.DATE_FORMAT.MONTH_FULL_ENGLISH,
  );

  const onCheckUse = (type) => {
    const text = "Data has changed, do you want to delete the data?";
    if (checkUse) {
      Helper.confirmDeleteEnglish({
        callback: () => {
          if (type === 'left') {
            setCheckUse(false);
            debouncedSearchDate(
              moment(searchDate.fromDate).subtract(1, 'weeks'),
              moment(searchDate.toDate).subtract(1, 'weeks').endOf('week'),
            );
          }
          if (type === 'right') {
            setCheckUse(false);
            debouncedSearchDate(
              moment(searchDate.fromDate).add(1, 'weeks'),
              moment(searchDate.toDate).add(1, 'weeks').endOf('week'),
            );
          }
          if (type === 'today') {
            setCheckUse(false);
            debouncedSearchDate(moment(), moment().endOf('week'));
          }
        },
      }, text);
    }
    else if (type === 'left') {
      debouncedSearchDate(
        moment(searchDate.fromDate).subtract(1, 'weeks'),
        moment(searchDate.toDate).subtract(1, 'weeks').endOf('week'),
      );
    }
    else if (type === 'right') {
      debouncedSearchDate(
        moment(searchDate.fromDate).add(1, 'weeks'),
        moment(searchDate.toDate).add(1, 'weeks').endOf('week'),
      );
    }
    else if (type === 'today') {
      debouncedSearchDate(moment(), moment().endOf('week'));
    }
  };

  return (
    <div className="activiies-block">
      <div className={stylesModule['header-table']}>
        <div className='d-flex'>
          <Button
            className={stylesModule.btnStyle}
            onClick={() => {
              onCheckUse("left");
            }}
          >
            <LeftOutlined className={stylesModule.colorIcon} />
          </Button>
          <Button
            className={stylesModule.btnStyle}
            onClick={() => {
              onCheckUse("right");
            }}
          >
            <RightOutlined className={stylesModule.colorIcon} />
          </Button>
        </div>
        <div className={classnames('d-flex align-items-end', styles['title-time-table'])}>
          <Text color="dark" size="large-medium">
            {titleDateTable(search.type)}
          </Text>
        </div>
        <div>
          <Button
            permission="TKB"
            color="white"
            className="ml-2"
            onClick={() => {
              onCheckUse('today');
            }}
          >
            Today
          </Button>
        </div>
      </div>
      <div className={classnames(styles['block-table'], 'block', styles['table-loading'])}>
        <Loading
          loading={loading['englishStudyPlan/GET_DATA']}
          params={{
            type: 'container',
          }}
        >
          <div className="wrapper-droppable">
            <div className='d-block'>
              {
                Object.entries(formatColumns)
                  .map(([keyItem, valueParent], indexParent) => (
                    <div className='d-flex'>
                      {arrDate.map((classItem, indexItem) => {
                        const dataTasks = valueParent?.tasks
                          .find(i => i?.date === classItem?.date);
                        const checkDisabled = valueParent?.dayOfWeeks?.find(i => i === classItem?.dayfull);
                        const dataTime = Helper.getDateUtc(moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }));
                        const timeTable = new Date(dataTime);
                        const time = new Date(classItem?.date);
                        return (
                          <div className="col-block-study-plane" key={indexItem}>
                            <FormTable
                              indexParent={indexParent}
                              classItem={classItem}
                              indexItem={indexItem}
                              valueParent={valueParent}
                              checkDisabled={checkDisabled}
                              dataTasks={dataTasks}
                              keyItem={keyItem}
                              timeTable={timeTable}
                              time={time}
                              getListStyle={getListStyle}
                              checkEdit={checkEdit}
                            />
                          </div>
                        );
                      })}
                    </div>))
              }
            </div>
          </div>
        </Loading>
      </div>
    </div>
  );
});

Index.propTypes = {
  searchDate: PropTypes.PropTypes.any,
  search: PropTypes.PropTypes.any,
  loading: PropTypes.PropTypes.any,
  formatColumns: PropTypes.PropTypes.any,
  arrDate: PropTypes.PropTypes.any,
  getListStyle: PropTypes.PropTypes.any,
  setSearchDate: PropTypes.PropTypes.any,
  checkEdit: PropTypes.PropTypes.any,
  checkUse: PropTypes.PropTypes.any,
  setCheckUse: PropTypes.PropTypes.any,
};

Index.defaultProps = {
  searchDate: null,
  search: null,
  loading: null,
  formatColumns: {},
  arrDate: [],
  getListStyle: {},
  setSearchDate: null,
  checkEdit: false,
  checkUse: false,
  setCheckUse: null,
};

export default Index;