import { BudgetFormData, StripeAccountData, RegularTransactionFormData, IncomeTransactionFormData } from "../utils/types";


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

    public async storeStripeAccountID(stripeAccountID: StripeAccountData) {
        return await fetch('/analytics/stripeAccountID', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(stripeAccountID)
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

    public async checkStripeAccountID() {
        try {
            const response = await fetch('/analytics/checkStripeAccountID', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to retrieve Stripe Account ID')
            }

            const data = await response.json()
            return data;
        } catch (error) {
            console.error('Error fetching Stripe Account ID:', error)
            throw error;
        }
    }

    public async getStripeBalance() {
        try {
            const response = await fetch('/analytics/getStripeBalance', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to retrieve user\'s account balance')
            }

            const data = await response.json()
            return data;
        } catch(error) {
            console.error("Error fetching user'\s account balance", error)
            throw error;
        }
    }

    public async createRegularTransaction(regularTransactionData: RegularTransactionFormData) {
        return await fetch('/analytics/createRegularTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(regularTransactionData)
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

    public async getRegularTransactions(): Promise<RegularTransactionFormData[]> {

        try {
            const response = await fetch('/analytics/fetchRegularTransactionData', {
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
            console.error('Error fetching transactions data:', error);
            throw error; 
        }
    }

    public async createIncomeTransaction(incomeTransactionData: IncomeTransactionFormData) {
        return await fetch('/analytics/createIncomeTransaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'

            },
            body: JSON.stringify(incomeTransactionData)
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

    public async deleteBudget(account_name: string) {
        try {
            const response = await fetch('/analytics/deleteBudget', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ account_name: account_name })
            });
    
            if (!response.ok) {
                const errorData: { error?: string } = await response.json();
                const errorMessage = typeof errorData.error === 'string' ? errorData.error : 'Unknown error';
                throw new Error(errorMessage);
            }
    
            const data = await response.json();
            console.log(data.message);
        } catch (error) {
            if (error instanceof Error) {
                console.log('Error deleting budget:', error.message);
            } else {
                console.log('Unexpected error occurred while deleting the budget');
            }
        }
    }

}

export default BudgetServiceAPI;