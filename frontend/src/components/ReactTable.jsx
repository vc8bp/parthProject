import React from 'react';
import { Table } from 'antd';


const DataTable = ({data, colDefs, size, loading}) => {

    const columns = colDefs.map((column) => {
        const { title, dataIndex, render, isNumber = true } = column;
        const filterable = title === "Symbol"

        let filters = null
        if(filterable){
          filters = []
          const set = new Set(data.map((e) => e[dataIndex]))
          set.forEach(e => filters.push({text: e, value: e }))
        }

        return {
          render: render ? render : null,
          title,
          dataIndex,
          sorter: (a, b) => a[dataIndex] - b[dataIndex],
          filters: filters,
          onFilter: filterable ? (value, record) => record[dataIndex].includes(value) : null,
        };
    });

    return (
      <Table
        loading={loading}
          size={size || "small"}
          style={{width: "100%"}}
          columns={columns}
          dataSource={data}
          pagination={true} 
          rowKey={row => row.id}    
      />
    );
};

export default DataTable;