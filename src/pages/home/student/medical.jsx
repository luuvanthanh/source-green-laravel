import { memo, useEffect, useState } from 'react';
import { Form, Image, Checkbox } from 'antd';
import { useSelector, useDispatch } from 'dva';
import _ from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { v4 as uuidv4 } from 'uuid';

import FormItem from '@/components/CommonComponent/FormItem';
import { variables, Helper } from '@/utils';
import Table from '@/components/CommonComponent/Table';

import styles from '../index.scss';
import variablesModules from '../variables';

const Index = memo(({ studentId }) => {
  const dispatch = useDispatch();
  const [ { medicals }, loading] = useSelector(({ loading: { effects }, studentHomePage }) => [
    studentHomePage,
    effects,
  ]);

  const [search, setSearch] = useState({
    classId: undefined,
    page: variables.PAGINATION.PAGE,
    limit: variables.PAGINATION.SIZEMAX,
    status: '',
    TimeCode: '',
    AppliedDate: null
  });

  const onLoad = () => {
    dispatch({
      type: 'studentHomePage/GET_DATA_MEDICAL',
      payload: {
        StudentId: studentId,
        ...search,
        AppliedDate: Helper.getDateTime({
          value: Helper.setDate({
            ...variables.setDateData,
            originValue: search.AppliedDate,
          }),
          isUTC: true,
        }),
      },
    });
  };

  useEffect(() => {
    onLoad();
  }, [search, studentId]);


  /**
   * Function header table
   */
  const header = () => [
    {
      title: 'Tên Bệnh',
      key: 'diseaseName',
      className: 'min-width-250',
      width: 250,
      render: (record) => {
        const obj = {
          children:  record?.diseaseName || '',
          props: {
            rowSpan: record?.lengthDrinkingTimes || 0
          }
        };
        return obj;
      }
    },
    {
      title: 'Thời gian uống',
      key: 'timeCode',
      className: 'min-width-140',
      width: 140,
      render: (row) => {
        const obj = {
          children: row?.timeCode ? variablesModules.STATUS_TIME_CODE_NAME[row?.timeCode] : '',
          props: {
            rowSpan: row?.lengthMedicineTime || 0
          }
        };
        return obj;
      }
    },
    {
      title: 'Thuốc',
      key: 'image',
      className: 'min-width-300',
      width: 300,
      render: (record) => (
        <div className="d-flex align-items-center">
          <Image.PreviewGroup>
            {Helper.isJSON(record?.medicine?.files) &&
              JSON.parse(record?.medicine?.files).map((item, index) => (
                <div key={index} className={styles['group-image']}>
                  <Image
                    key={index}
                    width={42}
                    height={42}
                    src={`${API_UPLOAD}${item}`}
                    data-viewmore={`+${JSON.parse(record?.medicine?.files)?.length - 1}`}
                    fallback="/default-upload.png"
                  />
                </div>
            ))}
          </Image.PreviewGroup>
          <p className="mb0 ml10">{record?.medicine?.name}</p>
        </div>
      ),
    },
    {
      title: 'Đơn vị',
      key: 'position',
      className: 'min-width-120',
      align: 'center',
      width: 120,
      render: (record) => record?.medicine.unit || ''
    },
    {
      title: 'Liều lượng',
      key: 'amount',
      className: 'min-width-120',
      align: 'center',
      width: 120,
      render: (record) => record?.medicineAmount || ''
    },
    {
      title: 'Ghi chú',
      key: 'note',
      className: 'min-width-300',
      width: 300,
      render: (record) => record?.medicine?.note
    },
    {
      title: 'Nhận thuốc',
      key: 'getMedicine',
      align: 'center',
      className: 'min-width-120',
      render: (record) => <Checkbox checked={record?.isReceived || false} />,
    },
    {
      title: 'Cho thuốc',
      key: 'giveMedicine',
      align: 'center',
      className: 'min-width-120',
      render: (record) => <Checkbox checked={record?.isDrunk || false} />,
    },
  ];

  const handleSearch = _.debounce((value, name) => {
    setSearch((prevSearch) => ({
      ...prevSearch,
      [name]: value
    }));
  }, 300);

  const getLengthMedicineTime = (data, index) => {
    if (data?.length > 0) {
      if (index === 0) {
        return data?.length;
      }
      return 0;
    }
    return 1;
  };

  const getLenghtDrinkingTimes = (data, index, indexChild) => {
    let length = 0;
    data.forEach(item => {
      length += item.medicineTimes.length;
    });
    if (length > 0) {
      if (index === 0 && indexChild === 0) {
        return length;
      }
      return 0;
    }
    return 1;
  };

  const convertMedical = (data) => {
    if (_.isEmpty(data)) {
      return [];
    }
    const result = [];
    data.forEach(item => {
      if (!_.isEmpty(item.drinkingTimes)) {
        item.drinkingTimes.forEach((child, index) => {
          if (!_.isEmpty(child.medicineTimes)) {
            child?.medicineTimes.forEach((itemChild, indexChild) => result.push({
              id: uuidv4(),
              lengthDrinkingTimes: getLenghtDrinkingTimes(item.drinkingTimes, index, indexChild),
              appliedDate: item.medical.appliedDate,
              creationTime: item.medical.creationTime,
              diseaseName: item.medical.diseaseName,
              medicineLocation: item.medical.medicineLocation,
              status: item.medical.status,
              timeCode: child.timeCode,
              lengthMedicineTime: getLengthMedicineTime(child?.medicineTimes, indexChild),
              medicineAmount: itemChild.medicineAmount,
              isDrunk: itemChild?.isDrunk,
              isReceived: itemChild?.isReceived,
              medicine: { ...itemChild?.medicine }
            }));
          }
        });
      }
    });
    return result;
  };

  return (
    <div className={classnames(styles['container-bus'], 'mt20')}>
      <Form initialValues={{
        ...search,
        AppliedDate: _.get(search, 'AppliedDate') ? moment(search?.AppliedDate) : null,
      }}>
        <div className="row">
          <div className="col-md-4 col-xl-2">
            <FormItem
              name="AppliedDate"
              type={variables.DATE_PICKER}
              onChange={(event) => handleSearch(event, 'AppliedDate')}
            />
          </div>
          <div className="col-md-4 col-xl-2">
            <FormItem
              data={variablesModules.STATUS_TIME_CODE}
              name="TimeCode"
              type={variables.SELECT}
              onChange={(event) => handleSearch(event, 'TimeCode')}
            />
          </div>
          {/* <div className="col-md-4 col-xl-2">
            <FormItem
              data={variablesModules.STATUS_NOTE}
              name="status"
              type={variables.SELECT}
              onChange={(event) => handleSearch(event, 'status')}
            />
          </div> */}
        </div>
      </Form>
      <Table
        bordered
        columns={header()}
        dataSource={convertMedical(medicals)}
        loading={loading['studentHomePage/GET_DATA_MEDICAL']}
        pagination={false}
        params={{
          header: header(),
          type: 'table',
        }}
        rowKey={(record) => record.id}
        scroll={{ x: '100%'}}
      />
    </div>
  );
});

Index.propTypes = {
  studentId: PropTypes.string,
};

Index.defaultProps = {
  studentId: '',
};

export default Index;
