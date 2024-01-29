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
            throw error; // Propagate the error to the caller
        }
    }

}

export default BudgetServiceAPI;