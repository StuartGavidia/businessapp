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
        .then((data: {message: string}) => {
            console.log(data.message);
        })
    }

}

export default BudgetServiceAPI;