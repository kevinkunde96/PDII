import { Card, Title, AreaChart, Subtitle } from "@tremor/react";
import React, { useState, useEffect } from 'react'
import { api } from "../axios";
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { startOfDay, endOfDay } from 'date-fns'

export default function AreaChartTasks ({startDate, endDate})  {
  const [tasks, setTasks] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const updateData = () => {
      setRefetch(!refetch)
  }


  useEffect(() => {
      if (startDate && endDate) {
          const start = startOfDay(startDate)
          const end = endOfDay(endDate)

          api.get("/taskscountglobal", { params: { startDate: start?.toISOString(), endDate: end?.toISOString() } }).then((response) => {
              const data = response.data;
              setTasks(data);
          });
      }
  }, [refetch, startDate, endDate]);

  return (
    <Card>
      <Title>Quantidade de tarefas</Title>
      <Subtitle>
        Relação de tarefas entre equipe e empresa
      </Subtitle>
      <AreaChart
        className="h-72 mt-8"
        data={tasks}
        index="date"
        categories={["Meu time", "Empresa"]}
        colors={["indigo", "cyan"]}
      />
    </Card>
  );
}