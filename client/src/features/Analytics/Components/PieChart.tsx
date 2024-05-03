import { useEffect, useState } from 'react';
import { PieChart, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell } from 'recharts';
import './PieChart.css'

interface BarChartProps {
  combinedTransactions: any[]
}

interface BulletProps {
  backgroundColor: string;
  size: string;
}

interface CustomizedLegendProps {
  payload?: any[];
}


const PieChartComponent: React.FC<BarChartProps> = ({ combinedTransactions }) => {
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const today = new Date();

  const colors = [
    '#DC3545', '#0099CC', '#FFCC00', '#663399', '#FF6600', '#00CC66', '#CC3399', '#333399'
  ]

  const Bullet: React.FC<BulletProps> = ({ backgroundColor, size }) => {
    return (
      <div
        className="CircleBullet"
        style={{
          backgroundColor,
          width: size,
          height: size
        }}
      ></div>
    );
  };


  const CustomizedLegend: React.FC<CustomizedLegendProps> = ({ payload = [] }) => {

    return (
      <ul className="LegendList">
        {payload.map((entry, index) => (
          <li key={`item-${index}`}>
            <div className="BulletLabel">
              <Bullet backgroundColor={entry.color} size="10px" />
              <div className="BulletLabelText"> {entry.payload.payload.name}: {entry.payload.payload.value.toFixed(2)}%</div>
            </div>
          </li>
        ))}
      </ul>

    );
  };

  useEffect(() => {

    const currentMonthTransactions = combinedTransactions.filter((transaction: any) => {
      const transactionDate = new Date(transaction.transaction_date);

      return (
        transactionDate.getMonth() === today.getMonth() &&
        transactionDate.getFullYear() === today.getFullYear()
      );
    });

    const totalMonthlySpend = currentMonthTransactions.reduce((total: any, transaction: any) => total + transaction.amount, 0);

    const budgetMap = new Map<string, number>();
    currentMonthTransactions.forEach(transaction => {
      const { account_name, amount } = transaction;
      if (budgetMap.has(account_name)) {
        const currentTotal = budgetMap.get(account_name);
        budgetMap.set(account_name, currentTotal + amount)
      } else {
        budgetMap.set(account_name, amount)
      }
    })

    const formattedPieChartData = Array.from(budgetMap).map(([account_name, total]) => {
      const percentage = (total / totalMonthlySpend) * 100;
      return { name: account_name, value: percentage };
    });

    setPieChartData(formattedPieChartData);
    console.log(formattedPieChartData);

  }, [combinedTransactions])

  return (

    <PieChart data={pieChartData} width={730} height={400}>
      <Pie
        data={pieChartData}
        dataKey='value'
        nameKey='name'
        cx='50%'
        cy='45%'
        innerRadius={100}
        outerRadius={140}
      >
        {pieChartData.map((account_name, index) => (
          <Cell
            key={`cell-${index}`}
            fill={colors[index % colors.length]}
          />
        ))}
      </Pie>
      <Legend content={<CustomizedLegend payload={pieChartData}/>} />

    </PieChart>

  )
};

export default PieChartComponent