import { useEffect, useState} from 'react';
import { PieChart, Pie, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const areaChartData = [
    {
        name: 'Jan',
        allowance: 2500,
        expense: 1500
    },
    {
        name: 'Feb',
        allowance: 5500,
        expense: 4500
    },
    {
        name: 'Mar',
        allowance: 2400,
        expense: 4500
    },
    {
        name: 'Apr',
        allowance: 7800,
        expense: 6500
    },
    {
        name: 'May',
        allowance: 2300,
        expense: 1200
    },
    {
        name: 'Jun',
        allowance: 4500,
        expense: 3700
    }
]

interface BarChartProps {
    combinedTransactions: any[]
}

const PieChartComponent: React.FC<BarChartProps> = ({ combinedTransactions }) => {

    const [pieChartData, setPieChartData] = useState<any[]>([]);
    const today = new Date();
    

    useEffect(() => {

    })

    return (

        <PieChart>
            <Pie 
            dataKey=''
            nameKey=''
            cx='50%'
            cy='50%'
            innerRadius={60}
            outerRadius={80}
            fill="#82ca9d" label
            
            />
        </PieChart>

    )
};

export default PieChartComponent