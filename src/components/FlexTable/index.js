import React, {
  useState, useRef, useEffect, useCallback
} from 'react';
import PropTypes from 'prop-types';
import {
  Table, Input, Checkbox, Button
} from 'antd';
import debounce from 'lodash/debounce'
import './index.less';

const FlexTable = (props) => {
  const [page, setPage] = useState(1);
  const [scrollState, setScrollState] = useState({ x: false, y: false });
  const [oldColumnsLen, setOldColumnsLen] = useState(0);
  const [oldExpandedRowKeys, setOldExpandedRowKeys] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [pageSize, setPageSize] = useState(null);
  const [filterKey, setFilterKey] = useState('');
  const [filterRes, setFilterRes] = useState({});
  const tableRef = useRef();

  const chgScrollState = useCallback((obj) => {
    if (props.scrollStateChange) {
      props.scrollStateChange(obj);
    }
    setScrollState(obj);
  }, [props]);

  const setScroll = useCallback(() => {
    if (tableRef && tableRef.current) {
      const tableWrap = tableRef.current;
      const pagination = tableWrap.getElementsByClassName('ant-pagination');
      const body = tableWrap.getElementsByClassName('ant-table-tbody')[0];

      const headerHeight = props.showHeader !== undefined && !props.showHeader
        ? 0 : tableWrap.getElementsByClassName('ant-table-thead')[0].clientHeight;
      const paginationHeight = pagination.length > 0
        ? pagination[0].clientHeight + 32 : 0; // margin 32
      const tableWrapHeight = tableWrap.clientHeight;
      const tableWrapWidth = tableWrap.clientWidth;
      const yScroll = body.clientHeight + headerHeight + paginationHeight > tableWrapHeight;
      const bodyWidth = body.clientWidth;

      const xScroll = bodyWidth > tableWrapWidth;
      const x = bodyWidth;
      const border = props.bordered ? 1 : 0;
      const y = tableWrapHeight - headerHeight - paginationHeight - border;
      // 传出当前scroll状态
      if (props.scrollStateChange) {
        props.scrollStateChange({ x: xScroll, y: yScroll });
      }
      setScrollState({
        x: xScroll ? x : undefined,
        y: yScroll ? y : undefined
      });

    }
  }, [props]);

  useEffect(() => {
    // 列改变时重新计算scroll状态
    if (oldColumnsLen !== props.columns.length) {
      if (oldColumnsLen > props.columns.length) {
        chgScrollState({ x: true, y: true });
      }
      setOldColumnsLen(props.columns.length);
      return;
    }
    setScroll();
  }, [
      props.dataSource.length,
      props.columns.length,
      oldColumnsLen,
      chgScrollState,
      setScroll
    ]);

  useEffect(() => {
    const expandChgFlag = oldExpandedRowKeys.some((e) => !props.expandedRowKeys.includes(e));
    if (expandChgFlag || oldExpandedRowKeys.length !== props.expandedRowKeys.length) {
      chgScrollState({ x: true, y: true });
      setOldExpandedRowKeys(props.expandedRowKeys);
    }
  }, [
      props.expandedRowKeys,
      oldExpandedRowKeys,
      chgScrollState
    ]);

  useEffect(() => {
    let tableSize = {
      height: 0,
      width: 0
    };
    let windowSize = {
      height: window.innerHeight,
      width: window.innerWidth
    };

    const isWindowResize = () => {
      const { innerHeight, innerWidth } = window;
      if (innerHeight !== windowSize.height || innerWidth !== window.innerWidth) {
        windowSize = {
          height: innerHeight,
          width: innerWidth
        };
        return true;
      }
      return false;
    };

    const setRect = (width, height) => {
      if (tableSize.height !== height || tableSize.width !== width) {
        tableSize = { height, width };
        setScroll(width, height);
      }
    };

    const mutationObserverSetRect = () => {
      if (tableRef && tableRef.current) {
        const height = tableRef.current.clientHeight;
        const width = tableRef.current.clientWidth;
        setRect(width, height);
      }
    };

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        const windowResizeFlag = isWindowResize();
        const { width, height } = entries[0].contentRect;
        if (windowResizeFlag) {
          setRect(width, height);
        } else {
          setTimeout(() => setRect(width, height), 500);
        }
      });
      resizeObserver.observe(tableRef.current);
      return () => {
        resizeObserver.disconnect();
      };
    }

    // 使用MutationObserver模拟ResizeObserver
    const target = document.body;
    const observer = new MutationObserver(() => {
      const windowResizeFlag = isWindowResize();
      if (windowResizeFlag) {
        mutationObserverSetRect();
      } else {
        setTimeout(mutationObserverSetRect, 450);
      }
    });
    observer.observe(target, {
      attributes: true,
      subtree: true
    });
    return () => {
      observer.disconnect();
    };
  }, [setScroll]);

  const onScrollEvent = () => {
    if (!tableRef.current) return;
    const scrollBody = tableRef.current.getElementsByClassName('ant-table-body')[0];
    if (scrollBody.scrollHeight - scrollBody.clientHeight === scrollBody.scrollTop) {
      const index = page + 1;
      props.loadMethod(index);
      setPage(index);
    }
  };
  const onScrollCapture = debounce(onScrollEvent);

  const handleChange = (pagination, filters, sorter, extra) => {
    if (pagination.pageSize !== pageSize || filters !== filterOptions) {
      // 等待新的数据渲染完毕后再次计算宽高
      requestAnimationFrame(setScroll);
      setPageSize(pagination.pageSize);
      const res = {};
      // 😊为columns单列设置customExcelFilter时，filterIcon中的filtered针对全选改为false
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.length === 0) return;
        res[key] = value;
      });
      setFilterOptions(res);
    }
    if (props.onChange) props.onChange(pagination, filters, sorter, extra);
  };

  const onExpand = (expanded, record) => {
    if (props.onExpand) props.onExpand(expanded, record);
    requestAnimationFrame(setScroll);
  };

  const setSelectFilter = (key, value) => {
    setFilterRes({ ...filterRes, [key]: value });
  };

  const onConfrim = (dataIndex, selectedKeys, confirm) => {
    setSelectFilter(dataIndex, selectedKeys);
    confirm();
  };

  const getColumnSearchProps = (item) => {
    const { dataIndex, filters } = item;
    if (!filters) return {};
    const ALL = (filters || []).map((e) => e.value);
    const selected = filterRes[dataIndex];
    const selectedKeys = (selected || ALL);
    return {
      filterDropdown: (operation) => {
        const { setSelectedKeys, confirm } = operation;
        const filterOption = (filters || []).filter((e) => (e.text || '').includes(filterKey.trim()));
        const filterSelectedKeys = selectedKeys.filter((e) => filterOption
          .find((i) => i.value === e));
        // 默认选择所有
        const updateFilter = () => {
          if (!selected) return;
          setSelectFilter(dataIndex, []);
        };
        const onCheckboxChange = (checked, e) => {
          updateFilter();
          let data = selectedKeys.slice();
          if (checked) {
            data.push(e.value);
          }
          if (!checked) {
            let index = data.indexOf(e.value);
            if (index === -1) {
              index = ALL.indexOf(e.value);
              data = ALL.slice();
            }
            data.splice(index, 1);
          }
          setSelectFilter(dataIndex, data);
        };
        return (
          <div className="filterWrap">
            <div className="inputWrap">
              <Input
                placeholder="搜索"
                onChange={(e) => setFilterKey(e.target.value)}
                value={filterKey}
              />
            </div>
            <div className="checkboxWrap">
              <Checkbox
                className="checkbox"
                indeterminate={filterSelectedKeys.length < filterOption.length
                  && !!filterSelectedKeys.length}
                onChange={(e) => {
                  updateFilter();
                  setSelectFilter(dataIndex, e.target.checked ? ALL : []);
                }}
                checked={filterSelectedKeys.length === filterOption.length || !selected}
              >
                (全选)
              </Checkbox>
              <Checkbox.Group
                value={!selected ? ALL : selectedKeys}
                className="checkboxGroup"
              >
                {filterOption.map((e) => (
                  <Checkbox
                    value={e.value}
                    key={e.value}
                    className="checkbox"
                    onChange={(i) => onCheckboxChange(i.target.checked, e)}
                  >
                    <div title={e.text} className="text">{e.text}</div>
                  </Checkbox>
                ))}
              </Checkbox.Group>
            </div>
            <div className="btnWrap">
              <Button
                type="primary"
                onClick={() => {
                  setSelectedKeys(selectedKeys);
                  onConfrim(dataIndex, selectedKeys, confirm);
                }}
                size="small"
                style={{ marginRight: 8, width: 60 }}
                disabled={selected && selectedKeys.length === 0}
              >
                确定
              </Button>
              <Button
                onClick={() => onConfrim(dataIndex, selectedKeys, confirm)}
                size="small"
                style={{ width: 60 }}
              >
                取消
              </Button>
            </div>
          </div>
        );
      },
      onFilterDropdownVisibleChange: (visible) => {
        if (!visible) setFilterKey('');
        if (visible) {
          setSelectFilter(dataIndex, filterOptions[dataIndex]);
        }
        if (item.onFilterDropdownVisibleChange) {
          item.onFilterDropdownVisibleChange(visible);
        }
      },
      filterIcon: (filtered) => {
        const res = (filterRes[item.dataIndex] || ALL);
        const flag = filtered && res.length !== ALL.length;
        if (item.filterIcon) {
          return item.filterIcon(flag);
        }
        return false;
      }
    };
  };

  const setColumn = () => {
    const { columns } = props;
    let res = columns.some((e) => e.ellipsis)
      ? columns
      : columns.map((item, index) => ({ ...item, ellipsis: index === 0 }));
    res = res.map((e) => {
      if (!e.customExcelFilter) return e;
      return {
        ...e,
        ...getColumnSearchProps(e)
      };
    });
    return res;
  };

  return (
    <div
      ref={tableRef}
      className="flex-table"
      onScrollCapture={props.loadMethod ? onScrollCapture : undefined}
    >
      <Table
        {...props}
        scroll={scrollState}
        columns={setColumn()}
        onChange={handleChange}
        onExpand={onExpand}
      />
    </div>
  );
};

FlexTable.defaultProps = {
  loadMethod: false,
  onExpand: undefined,
  bordered: false,
  showHeader: true,
  onChange: undefined,
  scrollStateChange: undefined,
  expandedRowKeys: [],
};

// 限制props参数类型
FlexTable.propTypes = {
  dataSource: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  loadMethod: PropTypes.oneOfType([PropTypes.func, PropTypes.bool]),
  showHeader: PropTypes.bool,
  onExpand: PropTypes.func,
  bordered: PropTypes.bool,
  onChange: PropTypes.func,
  scrollStateChange: PropTypes.func,
  expandedRowKeys: PropTypes.array,
};

export default FlexTable;
