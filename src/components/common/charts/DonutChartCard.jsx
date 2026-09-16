import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#3525cd', '#006591', '#005338', '#ba1a1a'];

const DonutChartCard = ({ title, data, height = 220 }) => (
  <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm">
    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #c7c4d8', fontSize: 12 }} />
        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11 }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default DonutChartCard;
