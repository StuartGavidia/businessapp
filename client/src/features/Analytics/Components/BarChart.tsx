import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const barChartData = [
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

const BarChartComponent = () => {
    return (

            <BarChart width={1000} height={500} margin={{ right: 30 }} data={barChartData}>
                <YAxis />
                <XAxis dataKey='name' />
                <CartesianGrid strokeDasharray='5 5'/>
                <Tooltip />

                <Bar
                type='monotone' 
                dataKey='allowance'
                stroke='#2563eb'
                fill='black'
                stackId='1'
                />

                <Bar
                type='monotone'
                dataKey='expense'
                stroke='#7c3aed'
                fill='white'
                stackId='1'
                />
            </BarChart>

    )
};

export default BarChartComponent