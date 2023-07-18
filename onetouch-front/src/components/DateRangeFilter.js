import { useEffect, useState } from "react";
import {
  DateRangePicker,
  DateRangePickerItem,
  DateRangePickerValue,
} from "@tremor/react";
import { ptBR } from "date-fns/locale";
import {
  endOfMonth,
  startOfMonth,
  subDays,
  subMonths,
  subYears,
} from "date-fns";

export default function DateRangeFilter({onChange}) {
  const [value, setValue] = useState({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  useEffect(() => {
    onChange(value)
  }, [value])


  return (
    <DateRangePicker
      value={value}
      defaultValue={value}
      onValueChange={(value) => setValue(value)}
      locale={ptBR}
      selectPlaceholder="Selecionar"
      color="primary"
      
    >
      <DateRangePickerItem key="today" value="today" from={new Date()}>
        Hoje
      </DateRangePickerItem>
      <DateRangePickerItem
        key="yesterday"
        value="yesterday"
        from={subDays(new Date(), 1)}
        to={subDays(new Date(), 1)}
      >
        Ontem
      </DateRangePickerItem>
      <DateRangePickerItem
        key="last-7-days"
        value="last-7-days"
        from={subDays(new Date(), 7)}
      >
        Últimos 7 dias
      </DateRangePickerItem>
      <DateRangePickerItem
        key="last-30-days"
        value="last-30-days"
        from={subDays(new Date(), 30)}
      >
        Últimos 30 dias
      </DateRangePickerItem>
      <DateRangePickerItem
        key="last-90-days"
        value="last-90-days"
        from={subDays(new Date(), 90)}
      >
        Últimos 90 dias
      </DateRangePickerItem>
      <DateRangePickerItem
        key="this-month"
        value="this-month"
        from={startOfMonth(new Date())}
        to={endOfMonth(new Date())}
      >
        Esse mês
      </DateRangePickerItem>
      <DateRangePickerItem
        key="last-month"
        value="last-month"
        from={startOfMonth(subMonths(new Date(), 1))}
        to={endOfMonth(subMonths(new Date(), 1))}
      >
        Último mês
      </DateRangePickerItem>
      <DateRangePickerItem
        key="last-year"
        value="last-year"
        from={subYears(new Date(), 1)}
        to={new Date()}
      >
        Último ano
      </DateRangePickerItem>
    </DateRangePicker>
  );
}