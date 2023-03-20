import React, { memo, useEffect, useState } from 'react';
import { useParams } from 'umi';
import { useSelector } from 'dva';
import { isEmpty } from 'lodash';

const Index = () => {
  const params = useParams();
  const [{ dataReport }] = useSelector(({ menu }) => [menu]);
  const [path, setPath] = useState();

  useEffect(() => {
    if (params.type && !isEmpty(dataReport)) {
      const data = dataReport?.map(i => i?.children?.map(k => ({ ...k, idParent: i?.id }))).flat(Infinity);
      setPath(data.find((item) => item?.idParent === params.type || item.id === params.type));
    }
  }, [params.type, dataReport]);

  return (
    <div className="card p20">
      {path ? (
        <div>
          <iframe src={path.scriptCode} width="100%" height="800" title="web" />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default memo(Index);
