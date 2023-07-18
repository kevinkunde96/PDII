import React, { useState, useEffect } from 'react';
// import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from "../axios";
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Card, Title, BarChart, Subtitle } from "@tremor/react";
import { startOfDay, endOfDay } from 'date-fns'

export default function ChartBar({
  label,
  startDate,
  endDate,
}) {
  const [filterBy, setFilterBy] = useState('day')
  const [tasks, setTasks] = useState([]);
  const [refetch, setRefetch] = useState(false);
  const updateData = () => {
    setRefetch(!refetch)
  }


  useEffect(() => {
    if (startDate && endDate) {
      const start = startOfDay(startDate)
      const end = endOfDay(endDate)


      api.get("/alltasks", { params: { startDate: start?.toISOString(), endDate: end?.toISOString() } }).then((response) => {
        const data = response.data;
        setTasks(data);
      });
    }
  }, [refetch, startDate, endDate]);

  return (
    <Card>
      <Title>Número de tarefas por usuário</Title>
      <Subtitle>
        Total de tarefas no intervalo de {startDate?.toLocaleDateString('pt-BR')} e {endDate?.toLocaleDateString('pt-BR')}
      </Subtitle>
      <BarChart
        className="mt-6"
        data={tasks}
        index="name"
        categories={["Quantidade de tarefas"]}
        colors={["blue"]}
        // valueFormatter={dataFormatter}
        yAxisWidth={48}
      />
    </Card>
  );
}
