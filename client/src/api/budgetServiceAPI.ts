import { BudgetFormData } from "../utils/types";


class BudgetServiceAPI {
    private static instance: BudgetServiceAPI;

    private constructor() {

    }

    public static getInstance(): BudgetServiceAPI {
        if (!BudgetServiceAPI.instance) {
            BudgetServiceAPI.instance = new BudgetServiceAPI();
        }

        return BudgetServiceAPI.instance;
    }

    public async createBudget(budgetData: BudgetFormData) {
        return await fetch('/analytics/budget', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(budgetData)
        })
            .then((response: Response) => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error);
                    });
                }
                return response.json();
            })
            .then((data: { message: string }) => {
                console.log(data.message);
            })
    }

    public async getBudget(): Promise<BudgetFormData[]> {

        try {
            const response = await fetch('/analytics/budget', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                return data;
            } else {
                throw new Error('Response is not in JSON format');
            }

        } catch (error) {
            console.error('Error fetching budget data:', error);
            throw error; 
        }
    }

    public async createStripeCustomer() {
        try {
            const response = await fetch('/analytics/createStripeCustomer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to create Stripe customer');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creating Stripe customer:', error);
            throw error;
        }
    }

    public async createFinancialConnectionSession() {
        try {
            const response = await fetch('/analytics/createFinancialConnectionsSession', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to initiate Financial Connections session');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error initiating Financial Connections session:', error);
            throw error;
        }
    }

}

export default BudgetServiceAPI;