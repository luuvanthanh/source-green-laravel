import { isArray, pickBy, isEmpty, get as getLodash, toString, omit, size } from 'lodash';
import { notification } from 'antd';
import moment from 'moment';
import Tag from '@/components/CommonComponent/Tag';
import Text from '@/components/CommonComponent/Text';
import { variables } from './variables';
import { Helper } from '.';

export default class Helpers {
  static getPrice = (value, number = 0) => {
    if (value) {
      return `${`${parseFloat(value).toFixed(number)}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} đ`;
    }
    return null;
  };

  static convertIncludes = (include = []) => {
    if (!isEmpty(include)) {
      return include.join(',');
    }
    return undefined;
  };

  static getPercent = (value) => {
    if (value) {
      return `${parseFloat(value)} %`;
    }
    return null;
  };

  static getDate = (value, format = variables.DATE_FORMAT.DATE) => {
    if (value) {
      return moment.utc(value).local().format(format);
    }
    return null;
  };

  static getDateSearch = (value, format = variables.DATE_FORMAT.DATE_AFTER) => {
    if (value) {
      return moment(value).format(format);
    }
    return null;
  };

  static slugify = (text) => {
    const from = 'ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;';
    const to = 'aaaaaeeeeeiiiiooooouuuunc------';
    if (text) {
      text.toLowerCase();
      const newText = text
        .split('')
        .map((letter, i) => letter.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i)));
      return (
        newText
          .toString() // Cast to string
          .toLowerCase() // Convert the string to lowercase letters
          .trim() // Remove whitespace from both sides of a string
          .replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a')
          .replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e')
          .replace(/(ì|í|ị|ỉ|ĩ)/g, 'i')
          .replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o')
          .replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u')
          .replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y')
          .replace(/(đ)/g, 'd')
          .replace(/\s+/g, '-') // Replace spaces with -
          .replace(/&/g, '-y-') // Replace & with 'and'
          // eslint-disable-next-line no-useless-escape
          .replace(/[^\w\-]+/g, '') // Remove all non-word chars
          // eslint-disable-next-line no-useless-escape
          .replace(/\-\-+/g, '-')
      ); // Replace multiple - with single -
    }
    return null;
  };

  /**
   * Get value of a property in an object by a path, example: "post.user.name"
   * @param {object} obj The object to query.
   * @param {string} path The path of the property to get., like "post.user.name" or "name"
   * @param {*} defaultValue the default value
   * @returns {*} the value
   * @static
   * @memberof Helpers
   */
  static get = (obj = {}, path = '', defaultValue) => getLodash(obj, path, defaultValue);

  /**
   *Set a date and return it
   * @param {*} originValue the origin value
   * @param {*} targetValue the target value
   * @param {object} format the formats
   * @param {string} format.originValue the format of the originValue
   * @param {string} format.targetValue the format of the targetValue
   * @param {array} attributes the attributes which are set for a new value
   * @param {object} add an object data which defines input for "moment.add()" method
   * @param {object} subtract an object data which defines input for "moment.subtract()" method
   * @returns {moment} the moment instace
   * @static
   * @memberof Helpers
   */
  static setDate = ({
    originValue = null,
    targetValue = null,
    format = {
      originValue: undefined,
      targetValue: undefined,
    },
    attributes = ['year', 'month', 'date'],
    add = {},
    subtract = {},
    isUTC = false,
  }) => {
    if (!originValue && (!targetValue || isEmpty(add) || isEmpty(subtract))) {
      return undefined;
    }
    const formatOrigin = Helpers.get(format, 'originValue');
    const formatTarget = Helpers.get(format, 'targetValue');
    let result = formatOrigin ? moment(originValue, formatOrigin) : moment(originValue);
    if (isUTC) {
      result = result.utcOffset(0);
    }
    if (targetValue) {
      const options = {};
      attributes.forEach((attr) => {
        options[attr] = formatTarget
          ? moment(targetValue, formatTarget).get(attr)
          : moment(targetValue).get(attr);
      });
      result = result.set(options);
    }
    if (!isEmpty(add)) {
      const keys = Object.keys(add);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        result = moment(result).add(add[key], `${key}`);
      }
    }
    if (!isEmpty(subtract)) {
      const keys = Object.keys(subtract);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i];
        result = moment(result).subtract(subtract[key], `${key}`);
      }
    }
    return result;
  };

  /**
   * Check a value is a valid datetime
   * @param {*} value
   * @param {object} options a options which defines conditions to check the valu
   * @param {string} options.format the format of the date value
   * @param {moment} options.before the before datetime
   * @param {moment} options.after the after datetime
   * @returns {boolean} isValid
   * @static
   * @memberof Helpers
   */
  static isValidDateTime = (value, options = {}) => {
    if (value === undefined) {
      return false;
    }
    const defaultFormat = variables.DATE_FORMAT.DATE;
    let format = Helpers.get(options, 'format');
    let isValid = format ? moment(value, format).isValid() : moment(value).isValid();
    const {
      same = {
        value: null,
        format: defaultFormat,
      },
      before = {
        value: null,
        format: defaultFormat,
      },
      after = {
        value: null,
        format: defaultFormat,
      },
    } = options;
    if (same && same.value) {
      format = same.format || defaultFormat;
      const sameDate = moment(same.value).format(format);
      const originDate = moment(value).format(format);
      if (!moment(originDate, format).isSame(moment(sameDate, format))) {
        isValid = false;
      }
    }
    if (before && before.value) {
      format = before.format || defaultFormat;
      const beforeDate = moment(before.value).format(format);
      const originDate = moment(value).format(format);
      if (!moment(originDate, format).isBefore(moment(beforeDate, format))) {
        isValid = false;
      }
    }
    if (after && after.value) {
      format = after.format || defaultFormat;
      const afterDate = moment(after.value).format(format);
      const originDate = moment(value).format(format);
      if (!moment(originDate, format).isAfter(moment(afterDate, format))) {
        isValid = false;
      }
    }
    return isValid;
  };

  /**
   *Get the datetime by format
   * @param {*} obj.value the datetime value
   * @param {string} obj.format the format which will be used to convert the value
   * @param {boolean} obj.isUTC if true, the value will be converted to UTC time (default use local time)
   * @param {boolean} obj.isString if true, the value will be returned as a string
   * @returns {moment} the moment instance
   * @static
   * @memberof Helpers
   */
  static getDateTime = ({
    value = undefined,
    format = null,
    isUTC = true,
    isString = true,
  } = {}) => {
    if (!value || !moment(value).isValid()) {
      return undefined;
    }
    const newValue = isUTC ? moment(value).utc() : moment(value).utc().local();
    let result = newValue;
    if (isString && isEmpty(format)) {
      result = moment(newValue).format();
    }
    if (isString && !isEmpty(format)) {
      result = moment(newValue).format(format);
    }
    if (!isString && isEmpty(format)) {
      result = moment(moment(newValue).format());
    }
    if (!isString && !isEmpty(format)) {
      result = moment(moment(newValue).format(format), format);
    }
    return result;
  };

  /**
   *Get the datetime by format from utc
   * @param {*} obj.value the datetime value
   * @param {string} obj.format the format which will be used to convert the value
   * @returns {moment} the moment instance
   * @static
   * @memberof Helpers
   */
  static getDateTimeFromUTC = ({ value = undefined, format = null } = {}) => {
    if (!value || !moment(value).isValid()) {
      return undefined;
    }
    if (value && format) {
      return moment.utc(value).local().format(format);
    }
    return moment.utc(value).local();
  };

  static addObjectToArray = (array, data) => {
    if (isArray(data)) {
      return [...array, ...data];
    }
    return [...array, data];
  };

  static convertParamSearch = (search) => {
    let objects = {};
    Object.keys(pickBy(search, (value) => value)).forEach((key) => {
      if (
        Object.prototype.hasOwnProperty.call(
          pickBy(search, (value) => {
            if (isArray(value)) {
              return !isEmpty(value.filter((item) => item))
                ? value.filter((item) => item)
                : undefined;
            }
            return value;
          }),
          key,
        )
      ) {
        objects = {
          ...objects,
          [`${key}`]: pickBy(search, (value) => value)[key],
        };
      }
    });
    if (!isEmpty(objects)) {
      return objects;
    }
    return undefined;
  };

  static convertParamSearchConvert = (search, type = '') => {
    const arr = [];
    if (type === variables.QUERY_STRING) {
      Object.keys(
        pickBy(search, (value) => {
          if (isArray(value)) {
            return !isEmpty(value.filter((item) => item))
              ? value.filter((item) => item)
              : undefined;
          }
          return value;
        }),
      ).forEach((key) => {
        if (
          Object.prototype.hasOwnProperty.call(
            pickBy(search, (value) => value),
            key,
          )
        ) {
          if (isArray(pickBy(search, (value) => value)[key])) {
            arr.push(`${key}=${pickBy(search, (value) => value)[key].filter((item) => item)}`);
          } else {
            arr.push(`${key}=${pickBy(search, (value) => value)[key]}`);
          }
        }
      });
      return arr.join('&');
    }
    Object.keys(pickBy(search, (value) => value)).forEach((key) => {
      if (
        Object.prototype.hasOwnProperty.call(
          pickBy(search, (value) => {
            if (isArray(value)) {
              return !isEmpty(value.filter((item) => item))
                ? value.filter((item) => item)
                : undefined;
            }
            return value;
          }),
          key,
        )
      ) {
        arr.push(`${key}:${pickBy(search, (value) => value)[key]}`);
      }
    });
    return arr.join(';');
  };

  static disabledDate = (current) => {
    return current && current <= moment().startOf('day');
  };

  static disabledDateFuture = (current) => {
    return current && current >= moment().endOf('day');
  };

  static serialOrder(page, index, size = variables.PAGINATION.PAGE_SIZE) {
    const num = (page - 1) * size + index + 1;
    return num;
  }

  static getPagination = (page, limit) => {
    return {
      skipCount: toString((Number(page) - 1) * Number(limit)),
      maxResultCount: limit,
    };
  };

  static convertTreeSelect = (items = [], keyValue = 'value', keyLabel = 'label') => {
    return items.map((item) => ({
      [`${keyValue}`]: item.id,
      [`${keyLabel}`]: item.name,
      children: this.convertTreeSelect(item.children),
    }));
  };

  static convertSelectSingle = (items = []) => {
    return items.map((item) => ({
      id: item,
      name: item,
    }));
  };

  static convertRadioSingle = (items = []) => {
    return items.map((item) => ({
      value: item,
      label: item,
    }));
  };

  static isJSON = (text) => {
    if (text) {
      if (
        /^[\],:{}\s]*$/.test(
          text
            .replace(/\\["\\/bfnrtu]/g, '@')
            .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g, ']')
            .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
        )
      ) {
        return true;
      }
      return false;
    }
    return false;
  };

  static romanize(num) {
    const roman = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    };
    let str = '';
    let number = num;
    Object.keys(roman).forEach((item) => {
      const q = Math.floor(number / roman[item]);
      number -= q * roman[item];
      str += item.repeat(q);
    });
    return str;
  }

  /**
   * Function convert tree to flat
   * @param {array} items data need convert
   */
  static flatten = (items) => {
    if (!isEmpty(items)) {
      const array = Array.isArray(items) ? items : [items];
      return array.reduce((acc, value) => {
        let dataNew = acc.push(omit(value, 'children'));
        if (value.children) {
          dataNew = acc.concat(Helper.flatten(value.children));
          delete dataNew.children;
        }
        return dataNew;
      }, []);
    }
    return [];
  };

  /**
   * Function convert flat to tree
   * @param {array} items data need convert
   * @param {interger} id id of record
   * @param {string} key key of parentId
   */
  static nest = (items, id = null, key = 'parentId') =>
    items
      .filter((item) => item[key] === id)
      .map((item) => ({ ...item, children: Helper.nest(items, item.id) }));

  static removeEmptyChildren = (items = []) => {
    return items.map((item) => {
      const { children, ...other } = item;
      if (size(children)) {
        return {
          ...other,
          children: Helper.removeEmptyChildren(item.children),
        };
      }
      return other;
    });
  };

  static exportExcel = async (path, paramSearch, nameFile = 'total.xlsx') => {
    const params = {
      ...pickBy(paramSearch, (value) => value),
    };
    const url = new URL(`${API_URL}${path}`);
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        url.searchParams.append(key, params[key]);
      }
    });
    await fetch(url, {
      method: 'GET',
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          const data = nameFile;
          response.blob().then((blob) => {
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = data;
            link.click();
          });
        } else {
          notification.error({
            message: 'Thất bại',
            description: 'Bạn đã tải excel không thành công',
          });
        }
      })
      .catch(() => {
        notification.error({
          message: 'Thất bại',
          description: 'Bạn đã tải excel không thành công',
        });
      });
  };

  static sttList(page, index, size = variables.PAGINATION.SIZE) {
    const num = (page - 1) * size + index + 1;
    return num;
  }

  static getTwoDate = (startDate, endDate, format = variables.DATE_FORMAT.DATE_SLASH) => {
    if (startDate && endDate) {
      return `${moment(startDate).format(format)} - ${moment(endDate).format(format)}`;
    }
    if (startDate) return moment(startDate).format(format);
    if (endDate) return moment(endDate).format(format);
    return null;
  };
}
