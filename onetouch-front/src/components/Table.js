import React from 'react'
import classNames from 'classnames'
import get from 'lodash.get'
export default function Table({ columns, data, onRowClick, className }) {

// if(userData && data){
//     for (let i = 0; i < data.length; i++) {
//         const element = data[i];
//         element.userName = userData.find((user) => user?.id === element?.userId)?.name 
//     }
// }

    return (<>
     
        <table className={classNames("min-w-full divide-y divide-gray-200", className)}>
            <thead className="bg-gray-50">
                <tr >
                    {columns?.map((column) => (
                        <th  key={column.key} className={"px-5 whitespace-nowrap py-3.5 text-sm font-normal text-left rtl:text-right text-gray-500" + column.className}>
                            {column?.render?.(column) || column.title}
                        </th>
                    ))}
                </tr>
            </thead>
          {data && (
            <tbody className="bg-white divide-y divide-gray-200">
            { data.map((item, index) => (
                    <tr
                        onClick={() => onRowClick?.(item)}
                        key={index}
                        className={classNames('', {
                            "cursor-pointer hover:bg-slate-50": !!onRowClick,
                        })}
                    >
                        {columns.map((column) => (
                            <td className='px-5 whitespace-nowrap' key={column.key}>
                                {column?.renderValue?.(item) || get(item, column.key)}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
           )}
        </table>
     
        </>

    )
}
