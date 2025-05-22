import { auth, getCurrentUser, googleProvider } from '@app/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { BASE_URL, ENDPOINTS } from './api-config';

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

export const registerApi = async (formData: registerFormDataType) => {
  try {
    const res = await fetch(BASE_URL + ENDPOINTS.auth.register.uri, {
      method: ENDPOINTS.auth.register.method,
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

export const googleSignInApi = async () => {
  try {
    await signInWithPopup(auth, googleProvider);

    const user = await getCurrentUser();
    const idToken = await user?.getIdToken();

    const res = await fetch(BASE_URL + ENDPOINTS.auth.googleSignIn.uri, {
      method: ENDPOINTS.auth.googleSignIn.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + idToken,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Google register failed');
    }

    return await res.json();
  } catch (error) {
    console.error('Google register failed: ', error);
    throw error;
  }
};

export const googleRegisterApi = async (formData: registerFormDataType) => {
  try {
    const user = await getCurrentUser();
    const idToken = await user?.getIdToken();

    const res = await fetch(BASE_URL + ENDPOINTS.auth.googleRegister.uri, {
      method: ENDPOINTS.auth.googleRegister.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + idToken,
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
    const idToken = await user?.getIdToken();

    const res = await fetch(BASE_URL + ENDPOINTS.auth.currentUser.uri, {
      method: ENDPOINTS.auth.currentUser.method,
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
