import { RegistrationFormData, SignInFormData } from "../utils/types";

class UserServiceAPI {
    private static instance: UserServiceAPI;
  
    private constructor() {
      // private constructor so no outsider can create an instance
    }
  
    public static getInstance(): UserServiceAPI {
      if (!UserServiceAPI.instance) {
        UserServiceAPI.instance = new UserServiceAPI();
      }
      return UserServiceAPI.instance;
    }
  
    public async registerUser(userData: RegistrationFormData) {
        return await fetch('/users/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
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

    public async loginUser(userData: SignInFormData) {
        return fetch('/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
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
  
export default UserServiceAPI;
  