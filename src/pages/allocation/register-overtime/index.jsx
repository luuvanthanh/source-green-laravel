import { memo, useState } from 'react';
import { Tabs, } from 'antd';
import _ from 'lodash';
import TuitionTable from './registration-limit';
import FoodTable from './registration-time';

const { TabPane } = Tabs;

const Index = memo(() => {
  const [tab, setTab] = useState('tuition');
  const [feeDetail, setFeeDetail] = useState([]);
  const [moneyMeal, setMoneyMeal] = useState([]);
  const [errorTable, setErrorTable] = useState({
    tuition: false,
    food: false,
    other: false,
  });

  const changeTab = (key) => {
    setTab(key);
  };

  const checkProperties = (object) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const key in object) {
      if (object[key] === '' || object[key] === null) return true;
    }
    return false;
  };

  const checkValidate = (data, name) => {
    let pass = !_.isEmpty(data) ? data.find((item) => !!checkProperties(item)) : true;
    if (name === 'other') {
      pass = !_.isEmpty(data) ? data.find((item) => !!checkProperties(item)) : false;
    }
    setErrorTable((prev) => ({
      ...prev,
      [name]: !!pass,
    }));
    return !!pass;
  };


  const tabs = () => [
    {
      id: 'tuition',
      name: 'Giới hạn đăng ký',
      component: (
        <TuitionTable
          feeDetail={feeDetail}
          setFeeDetail={setFeeDetail}
          error={errorTable.tuition}
          checkValidate={checkValidate}
        />
      ),
    },
    {
      id: 'food',
      name: 'Thời gian đăng ký',
      component: (
        <FoodTable
          moneyMeal={moneyMeal}
          setMoneyMeal={setMoneyMeal}
          error={errorTable.food}
          checkValidate={checkValidate}
        />
      ),
    },
  ];

  return (
    <Tabs onChange={changeTab} activeKey={tab} className="test-12 p20">
      {tabs().map(({ id, name, component }) => (
        <TabPane
          tab={<span className={errorTable[id] ? 'text-danger' : ''}>{name}</span>}
          key={id}
        >
          {component}
        </TabPane>
      ))}
    </Tabs>
  );
});

export default Index;
