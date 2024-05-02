
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

interface BarChartProps {
    combinedTransactions: any[]
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const BarChartComponent: React.FC<BarChartProps> = ({ combinedTransactions }) => {
    const [barChartData, setBarChartData] = useState<any[]>([])

    useEffect(() => {
        const today = new Date();
        const monthsInYear = 12;

        const monthlyTotals = Array.from({ length: monthsInYear }, (_, index) => {
            const month = (today.getMonth() - index + 12) % 12; // Calculate previous months
            const year = today.getFullYear() - Math.floor(index / 12); // Adjust year if needed

            // Filter transactions for the specific month and year
            const monthlyTransactions = combinedTransactions.filter((transaction: any) => {
                const transactionDate = new Date(transaction.transaction_date);
                return (
                    transactionDate.getMonth() === month &&
                    transactionDate.getFullYear() === year
                );
            });

            // Calculate total amount spent in the month
            const totalAmount = monthlyTransactions.reduce((total, transaction) => total + transaction.amount, 0);

            // Format data for Recharts
            return { name: monthNames[month], expense: totalAmount };
        });

        // Reverse the array to have the latest month first
        setBarChartData(monthlyTotals.reverse());
    }, [combinedTransactions]);

    const formatYAxis = (tick: any) => `$${tick}`;

    return (

        <BarChart width={1000} height={600} margin={{ right: 30 }} data={barChartData}>
            <YAxis tickFormatter={formatYAxis}/>
            <XAxis dataKey='name' />
            <CartesianGrid strokeDasharray='5 5' />
            <Tooltip />

            <Bar
                type='monotone'
                dataKey='expense'
                stroke='#3a4d39'
                fill='#3a4d39'
                stackId='1'
                barSize={20}
            />

        </BarChart>

    )
};

export default BarChartComponent