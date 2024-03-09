import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const lineChartData = [
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

const LineChartComponent = () => {
    return (

            <LineChart width={1000} height={500} margin={{ right: 30 }} data={lineChartData}>
                <YAxis />
                <XAxis dataKey='name' />
                <CartesianGrid strokeDasharray='5 5'/>
                <Tooltip />

                <Line
                type='monotone' 
                dataKey='allowance'
                stroke='#2563eb'
                fill='black'
            
                />

                <Line
                type='monotone'
                dataKey='expense'
                stroke='#7c3aed'
                fill='white'

                />
            </LineChart>

    )
};

export default LineChartComponent