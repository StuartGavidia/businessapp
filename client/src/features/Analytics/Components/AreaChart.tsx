import {  XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { useEffect, useState } from 'react';

const AreaChartComponent = (props: any) => {
    const { transactionData } = props;
    const [lineChartData, setLineChartData] = useState<any[]>([])

    useEffect(() => {
        // Filter transactions for the current month
        const currentMonthTransactions = transactionData.filter((transaction: any) => {
            const transactionDate = new Date(transaction.transaction_date);
            const currentDate = new Date();
            return (
                transactionDate.getMonth() === currentDate.getMonth() &&
                transactionDate.getFullYear() === currentDate.getFullYear()
            );
        });

        console.log("currentMonthTransactions", currentMonthTransactions)

        // Create cumulative expenses data for each day of the month
        const currentDate = new Date();
        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const cumulativeExpensesData = Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const dailyTransactions = currentMonthTransactions.filter((transaction: any) => {
                const transactionDate = new Date(transaction.transaction_date);
                return transactionDate.getDate() <= day;
            });
            const cumulativeExpense = dailyTransactions.reduce((total: any, transaction: any) => total + transaction.amount, 0);
            return { name: day.toString(), expense: cumulativeExpense };
        });

        setLineChartData(cumulativeExpensesData);

        // Optionally, return a cleanup function
        return () => {
            // Cleanup logic here
        };
    }, [transactionData]);

    return (

            <AreaChart width={1000} height={500} margin={{ right: 30 }} data={lineChartData}>
                <YAxis />
                <XAxis dataKey='name' />
                <CartesianGrid strokeDasharray='5 5'/>
                <Tooltip />

                <Area
                type='monotone'
                dataKey='expense'
                stroke='#2563eb'
                fill='black'

                />

                <Area
                type='monotone'
                dataKey='expense'
                stroke='#7c3aed'
                fill='white'

                />
            </AreaChart>

    )
};

export default AreaChartComponent
