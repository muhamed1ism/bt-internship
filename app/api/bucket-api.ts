import {
  AssignUserBucketsFormValues,
  CreateCategoryFormValues,
  CreateLevelFormValues,
  UpdateCategoryFormValues,
  UpdateLevelFormValues,
} from '@app/schemas';
import { BASE_URL, ENDPOINTS } from './api-config';
import { getAuthHeaders } from '@app/lib/firebase';

export const getAllCategoriesApi = async () => {
  const { uri, method } = ENDPOINTS.bucket.category.getAll;
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch bucket categories');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch bucket categories: ', error);
    throw error;
  }
};

export const getCategoryByIdApi = async (categoryId: string) => {
  const { uri, method } = ENDPOINTS.bucket.category.getById(categoryId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch bucket categories');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch bucket categories: ', error);
    throw error;
  }
};

export const createCategoryApi = async (formData: CreateCategoryFormValues) => {
  const { uri, method } = ENDPOINTS.bucket.category.create;
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create bucket category');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create bucket category: ', error);
    throw error;
  }
};

export const updateCategoryApi = async (formData: UpdateCategoryFormValues, categoryId: string) => {
  const { uri, method } = ENDPOINTS.bucket.category.update(categoryId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update bucket category');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to update bucket category: ', error);
    throw error;
  }
};

export const deleteCategoryApi = async (categoryId: string) => {
  const { uri, method } = ENDPOINTS.bucket.category.delete(categoryId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to delete bucket category');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to delete bucket category: ', error);
    throw error;
  }
};

export const getAllCategoryLevelsApi = async (categoryId: string) => {
  const { uri, method } = ENDPOINTS.bucket.level.getAll(categoryId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch bucket levels');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch bucket levels: ', error);
    throw error;
  }
};

export const getUserCategoryLevelApi = async (categoryId: string) => {
  const { uri, method } = ENDPOINTS.bucket.level.getUserLevel(categoryId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch my bucket level');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch my bucket level: ', error);
    throw error;
  }
};

export const createLevelApi = async (formData: CreateLevelFormValues, categoryId: string) => {
  const { uri, method } = ENDPOINTS.bucket.level.create(categoryId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to create bucket level');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to create bucket level: ', error);
    throw error;
  }
};

export const updateLevelApi = async (formData: UpdateLevelFormValues, levelId: string) => {
  const { uri, method } = ENDPOINTS.bucket.level.update(levelId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to update bucket level');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to update bucket level: ', error);
    throw error;
  }
};

export const deleteLevelApi = async (levelId: string) => {
  const { uri, method } = ENDPOINTS.bucket.level.delete(levelId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to delete bucket level');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to delete bucket level: ', error);
    throw error;
  }
};

export const getUserBucketsByIdApi = async (userId: string) => {
  const { uri, method } = ENDPOINTS.bucket.user.getByUserId(userId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch user buckets');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch user buckets: ', error);
    throw error;
  }
};

export const getMyUserBucketsApi = async () => {
  const { uri, method } = ENDPOINTS.bucket.user.getMy;
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || 'Failed to fetch user buckets');
    }

    return res.json();
  } catch (error) {
    console.error('Failed to fetch user buckets: ', error);
    throw error;
  }
};

export const assignUserBucketsApi = async (
  formData: AssignUserBucketsFormValues,
  userId: string,
) => {
  const { uri, method } = ENDPOINTS.bucket.user.assign(userId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify(formData),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to assign user's buckets");
    }

    return res.json();
  } catch (error) {
    console.error("Failed to assign user's buckets: ", error);
    throw error;
  }
};

export const promoteUserBucketApi = async (userId: string, categoryId: string) => {
  const { uri, method } = ENDPOINTS.bucket.user.promote(userId, categoryId);
  const authHeaders = await getAuthHeaders();

  try {
    const res = await fetch(BASE_URL + uri, {
      method,
      headers: {
        ...authHeaders,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to promote user's bucket level");
    }

    return res.json();
  } catch (error) {
    console.error("Failed to promote user's bucket level: ", error);
    throw error;
  }
};
