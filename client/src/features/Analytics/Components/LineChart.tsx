import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';

import { useEffect, useState } from 'react';

interface LineChartProps {
    combinedTransactions: any[]
}

const LineChartComponent: React.FC<LineChartProps> = ({ combinedTransactions }) => {
    const [lineChartData, setLineChartData] = useState<any[]>([])
    const today = new Date();

    useEffect(() => {

        {/* Create array containing transactions from current month */ }
        const currentMonthTransactions = combinedTransactions.filter((transaction: any) => {
            const transactionDate = new Date(transaction.transaction_date);
            
            return (
                transactionDate.getMonth() === today.getMonth() &&
                transactionDate.getFullYear() === today.getFullYear()
            );
        });

        console.log("currentMonthTransactions", currentMonthTransactions)

        {/* Create array containing transactions from last month */ }
        const lastMonthTransactions = combinedTransactions.filter((transaction: any) => {
            const transactionDate = new Date(transaction.transaction_date)
            const today = new Date();
            const firstDayOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

            return (
                transactionDate.getMonth() === firstDayOfLastMonth.getMonth() &&
                transactionDate.getFullYear() === firstDayOfLastMonth.getFullYear()

            )
        })

        const totalSpendLastMonth = lastMonthTransactions.reduce((total: any, transactions: any) => total + transactions.amount, 0);
        console.log("total spent last month", totalSpendLastMonth)

        console.log("lastMonthTransactions:", lastMonthTransactions)

        // Create cumulative expenses data for each day of the month
        
        const currentDay = today.getDate();
        const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();

        {/* Set Daily Linear Progression Ratio */}
        const lastMonthDailySpendRatio = totalSpendLastMonth / daysInMonth;
        let cumulativeLastMonthSpend = 0;

        const cumulativeExpensesData = Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;

            const dailyTransactions = currentMonthTransactions.filter((transaction: any) => {
                const transactionDate = new Date(transaction.transaction_date);
                return transactionDate.getDate() <= day;
            });

            cumulativeLastMonthSpend += lastMonthDailySpendRatio; 
    
            const cumulativeExpense = day <= currentDay ?
            dailyTransactions.reduce((total: any, transaction: any) => total + transaction.amount, 0) :
            null;
            return { name: day.toString(), expense: cumulativeExpense, totalLastMonth: cumulativeLastMonthSpend };
        });

        console.log("cumulative", cumulativeExpensesData)

        setLineChartData(cumulativeExpensesData);

        // Optionally, return a cleanup function
        return () => {
            // Cleanup logic here
        };

    }, [combinedTransactions]);

    return (

        <LineChart width={1000} height={500} margin={{ right: 30 }} data={lineChartData}>
            <YAxis />
            <XAxis dataKey='name' />
            <CartesianGrid strokeDasharray='5 5' />
            <Tooltip />

            <Line
                type='monotone'
                dataKey='expense'
                stroke='#dc3545'
                fill='#dc3545'
                
            />

            <Line
                type='monotone'
                dataKey='totalLastMonth'
                stroke='#3a4d39'
                fill='#3a4d39'
                
            />

        </LineChart>

    )
};

export default LineChartComponent