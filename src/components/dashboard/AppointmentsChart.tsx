import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ChartData {
  month: string;
  total: number;
}

export function AppointmentsChart() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const { data: appointments, error } = await supabase
        .from("appointments")
        .select("date");

      if (error || !appointments) {
        console.error(error);
        return;
      }

      const grouped: Record<string, number> = {};

      appointments.forEach((item) => {
        const month = new Date(item.date).toLocaleString("pt-BR", {
          month: "short",
        });

        grouped[month] = (grouped[month] || 0) + 1;
      });

      const formatted = Object.entries(grouped).map(
        ([month, total]) => ({
          month,
          total,
        })
      );

      setData(formatted);
    };

    fetchAppointments();
  }, []);

  return (
    <div className="bg-card border border-border p-4 rounded-xl h-[300px]">
      <h2 className="text-lg font-semibold mb-4">
        Consultas por mês
      </h2>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            name="Consultas"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
