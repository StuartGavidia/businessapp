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

    public async getUser(userId) {
      return await fetch(`/users/get?username=${userId}`)
                  .then(response => response.json())
                  .then(data => {return data})
                  .catch(error => console.error('Error:' + error))
    }


    public async updateUser(userData: RegistrationFormData) {
      return await fetch('/users/update', {
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


  public async updatePassword(userData: RegistrationFormData) {
    return await fetch('/users/updatePassword', {
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
        .then((data: { userId: string }) => {
            return data.userId
        })
    }

    public async logoutUser() {
        const response = await fetch('/users/logout', {
          method: 'POST'
        });

        if (!response.ok) {
            throw new Error('Failed to logout user');
        }

        return response
    }

    public async isLoggedIn() {
        const response = await fetch('/users/isLoggedIn', {
          method: 'GET'
        });

        if (!response.ok) {
          throw new Error('User is not authenticated or logged in');
        }

        return response
    }

    public async usersInCompany() {
      const response = await fetch('/users/usersInCompany', {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error('User is not authenticated or logged in');
      }

      const data = response.json();
      return data;
    }
  }

export default UserServiceAPI;
