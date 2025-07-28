import { auth, getAuthHeaders, googleProvider } from '@app/lib/firebase';
import { signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { BASE_URL, ENDPOINTS } from './api-config';
import { RegisterFormValues } from '@app/schemas';

export const registerApi = async (formData: RegisterFormValues) => {
  const { uri, method } = ENDPOINTS.auth.register;

  const payload = {
    ...formData,
    dateOfBirth: formData.dateOfBirth
      ? new Date(
          Date.UTC(
            formData.dateOfBirth.getFullYear(),
            formData.dateOfBirth.getMonth(),
            formData.dateOfBirth.getDate(),
          ),
        )
      : undefined,
  };

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
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

    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.auth.googleSignIn;

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
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

export const googleRegisterApi = async (formData: RegisterFormValues) => {
  try {
    const authHeaders = await getAuthHeaders();
    const { uri, method } = ENDPOINTS.auth.googleRegister;

    const payload = {
      ...formData,
      dateOfBirth: formData.dateOfBirth
        ? new Date(
            Date.UTC(
              formData.dateOfBirth.getFullYear(),
              formData.dateOfBirth.getMonth(),
              formData.dateOfBirth.getDate(),
            ),
          )
        : undefined,
    };

    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(payload),
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
