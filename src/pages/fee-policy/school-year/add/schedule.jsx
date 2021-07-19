import { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import moment from 'moment';
import Table from '@/components/CommonComponent/Table';


const Index = memo(({ rangeDate }) => {
  const [schedules, setSchedules] = useState([]);

  const getWeek = (index, NumberStartDate) => {
    if ((NumberStartDate === 5 || NumberStartDate === 6) && index === 0) {
      return '';
    }
    if ((NumberStartDate === 5 || NumberStartDate === 6) && index !== 0) {
      return `Tuần ${(index / 7)}`;
    }
    return `Tuần ${(index / 7) + 1}`;
  };

  const renderData = (data) => {
    const result = [];
    if (_.isEmpty(data)) {
      return result;
    }
    const NumberStartDate = Number(moment(data[0], 'DD/MM/YYYY').day()) > 0 ? Number(moment(data[0], 'DD/MM/YYYY').day()) - 1 : 6;
    const startDate = moment(data[0]).add(-NumberStartDate, 'days').startOf('month');
    const endDate = moment(data[1]).endOf('month');
    const length = endDate.diff(startDate, 'days') + 1;
    let number = 0;

    for (let i = 0; i < length; i += 1) {
      if (_.isInteger(i / 7)) {
        const startMonth = moment(startDate).add(i + 6, 'days');
        const endMonth = moment(startMonth).endOf('month');
        const numberSameMonth = Number(moment(endMonth).diff(moment(startMonth), 'weeks')) + 1;
        let numberMonth = 0;
        if (number === i / 7) {
          number += numberSameMonth;
          numberMonth = numberSameMonth;
        } else {
          numberMonth = 0;
        }
        const date = {
          id: i,
          month: `Tháng ${(i + 6 >= length) ? moment(data[1]).format('MM') : moment(startDate).add(i + 6, 'days').format('MM')}`,
          numberMonth,
          week: getWeek(i, NumberStartDate),
          monday: ((i >= length ) || (i < NumberStartDate)) ? '' : moment(startDate).add(i, 'days').format('DD'),
          tuesday: ((i + 1 >= length) || (i + 1 < NumberStartDate)) ? '' : moment(startDate).add(i + 1, 'days').format('DD'),
          wednesday: ((i + 2 >= length) || (i + 2 < NumberStartDate)) ? '' : moment(startDate).add(i + 2, 'days').format('DD'),
          thursday: ((i + 3 >= length) || (i + 3 < NumberStartDate)) ? '' : moment(startDate).add(i + 3, 'days').format('DD'),
          friday: ((i + 4 >= length) || (i + 4 < NumberStartDate)) ? '' : moment(startDate).add(i + 4, 'days').format('DD'),
          saturday: ((i + 5 >= length) || (i + 5 < NumberStartDate)) ? '' : moment(startDate).add(i + 5, 'days').format('DD'),
          sunday: ((i + 6 >= length) || (i + 6 < NumberStartDate)) ? '' : moment(startDate).add(i + 6, 'days').format('DD'),
        };
        result.push(date);
      }
    };
    return result;
  };

  useEffect(() => {
    const response = renderData(rangeDate);
    setSchedules(response);
  }, [rangeDate]);

  /**
   * Function header table
   */
  const header = () => [
    {
      title: 'Tháng',
      key: 'month',
      className: 'min-width-250',
      render: (record) => {
        const obj = {
          children:  record?.month || '',
          props: {
            rowSpan: record?.numberMonth || 0
          }
        };
        return obj;
      }
    },
    {
      title: 'Tuần',
      key: 'week',
      className: 'min-width-250',
      render: (record) => record?.week || '',
    },
    {
      title: 'Thứ Hai',
      key: 'monday',
      className: 'min-width-150',
      width: 150,
      align: 'center',
      render: (record) => record?.monday || '',
    },
    {
      title: 'Thứ Ba',
      key: 'tuesday',
      className: 'min-width-150',
      width: 150,
      align: 'center',
      render: (record) => record?.tuesday || '',
    },
    {
      title: 'Thứ Tư',
      key: 'wednesday',
      className: 'min-width-150',
      width: 150,
      align: 'center',
      render: (record) => record?.wednesday || '',
    },
    {
      title: 'Thứ Năm',
      key: 'thursday',
      className: 'min-width-150',
      width: 150,
      align: 'center',
      render: (record) => record?.thursday || '',
    },
    {
      title: 'Thứ Sáu',
      key: 'friday',
      className: 'min-width-150',
      width: 150,
      align: 'center',
      render: (record) => record?.friday || '',
    },
    {
      title: 'Thứ Bảy',
      key: 'saturday',
      className: 'min-width-150',
      width: 150,
      align: 'center',
      render: (record) => record?.saturday || '',
    },
    {
      title: 'Chủ nhật',
      key: 'sunday',
      className: 'min-width-150',
      width: 150,
      align: 'center',
      render: (record) => record?.sunday || '',
    },
  ];

  return (
    <div className="p20">
      <Table
        bordered
        columns={header()}
        dataSource={schedules}
        className="table-edit"
        isEmpty
        pagination={false}
        params={{
          header: header(),
          type: 'table',
        }}
        rowKey={(record) => record.id}
        scroll={{ x: '100%' }}
      />
    </div>
  );
});

Index.propTypes = {
  rangeDate: PropTypes.arrayOf(PropTypes.any),
};

Index.defaultProps = {
  rangeDate: [],
};

export default Index;
