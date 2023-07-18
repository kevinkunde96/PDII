import React, { useState, useEffect } from 'react'
import { Card, Title, DonutChart, Subtitle } from "@tremor/react";
import { api } from "../axios";
import { Box, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { startOfDay, endOfDay } from 'date-fns'
export default function DonutBar({ data, startDate, endDate }) {

    const [tasks, setTasks] = useState([]);
    const [refetch, setRefetch] = useState(false);
    const updateData = () => {
        setRefetch(!refetch)
    }


    useEffect(() => {
        if (startDate && endDate) {
            const start = startOfDay(startDate)
            const end = endOfDay(endDate)


            api.get("/taskscount", { params: { startDate: start?.toISOString(), endDate: end?.toISOString() } }).then((response) => {
                const data = response.data;
                setTasks(data);
            });

        }
    }, [refetch, startDate, endDate]);

    return (
        <Card className="flex flex-col items-start justify-center">
            <Title>Tarefas da minha equipe</Title>
            <Subtitle>
                Quantidade de tarefas concluidas e não concluidas
            </Subtitle>
            <DonutChart
                className='w-full h-72 m-auto'
                data={tasks}
                category="Quantidade de tarefas"
                index="name"
                colors={["slate", "violet"]}
            />
        </Card>
    )
}
