import { auth } from '@app/lib/firebase';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';

interface registerFormDataType {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  dateOfBirth: Date;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  dateOfBirth: Date;
  roleId: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

const getCurrentUser = (): Promise<ReturnType<typeof getAuth>['currentUser']> => {
  const auth = getAuth();
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const registerApi = async (formData: registerFormDataType) => {
  try {
    const res = await fetch(apiUrl + '/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Register failed');
    }

    return res.json();
  } catch (error) {
    console.error('Register failed: ', error);
    throw error;
  }
};

export const loginApi = async (email: string, password: string) => {
  await signInWithEmailAndPassword(auth, email, password).catch((error) => {
    if (error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password');
    } else {
      throw new Error('Login failed. Please try again.');
    }
  });
};

export const logoutApi = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout failed: ', error);
    throw error;
  }
};

export const currentUserApi = async (): Promise<User | null> => {
  try {
    const user = await getCurrentUser();

    if (!user) {
      throw new Error('User not found');
    }

    const idToken = await user?.getIdToken();
    const res = await fetch(apiUrl + '/api/auth/current-user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
    });

    if (!res.ok) throw new Error('Unauthorized');

    return await res.json();
  } catch (error) {
    console.error('Error fetching current user: ', error);
    throw error;
  }
};
