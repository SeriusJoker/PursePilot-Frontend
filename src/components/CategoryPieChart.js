import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28BFA'];

function CategoryPieChart({ categoryData, title }) {
  const data = Object.keys(categoryData).map((key, index) => ({
    name: key,
    value: categoryData[key] || 0,
    color: COLORS[index % COLORS.length]
  })).filter(item => item.value > 0); 

  console.log(`${title} Chart Processed Data:`, data); // ✅ Debug log

  if (data.length === 0) {
    return <p>No {title.toLowerCase()} recorded.</p>; // ✅ Handle empty data case
  }

  return (
    <div>
      <h4 className="text-center">{title}</h4> {/* ✅ Added Title */}
      <PieChart width={400} height={300}>
        <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default CategoryPieChart;
