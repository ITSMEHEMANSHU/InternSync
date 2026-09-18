import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const BarChartCard = ({ title, data, dataKey, xKey = 'name', color = '#3525cd', height = 200 }) => (
  <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-sm">
    <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-4">{title}</h3>
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#c7c4d8" strokeOpacity={0.4} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#464555' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: '#464555' }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #c7c4d8', fontSize: 12 }} />
        <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default BarChartCard;
