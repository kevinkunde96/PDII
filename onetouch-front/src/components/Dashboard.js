import { api } from "../axios";
import React from 'react';
import { useState, useEffect } from 'react';
import ChartBar from './ChartBar';
import DonutBar from './DonutBar';
import AreaChartTasks from './AreaChartTasks';
import { Box } from '@mui/material';
import DateRangeFilter from "./DateRangeFilter";


export default function Dashboard() {

  const [data, setData] = useState([])
  const [range, setRange] = useState({
    from: new Date(),
    to: new Date(),
  })

  return (
    <Box>
      <div className="flex justify-between w-full px-12">
        <h2 className="text-2xl font-bold ">Dashboard</h2>
        <DateRangeFilter onChange={value => setRange({
          ...value
        })} />
      </div>


      <div className="gap-8 px-12 grid md:grid-cols-2 lg:grid-cols-3 mt-6 grid-cols-1">
        <ChartBar
          startDate={range.from}
          endDate={range.to}
        />

        <DonutBar
          startDate={range.from}
          endDate={range.to}
        />
        
        <AreaChartTasks
          startDate={range.from}
          endDate={range.to}
        />
      </div>
    </Box>
  );

}
