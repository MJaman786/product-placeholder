import { useMutation } from '@tanstack/react-query';
import { AUTH_LOGIN } from '../../constants/urls';
import makeRequest from '../../utils/helpers/MakeRequest';
import { useAuthStore } from '../../store/Auth/useAuthStore';
import type { LoginPayload, LoginResponse, User } from '../../types/User';

export default function useLogin() {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const res = await makeRequest<LoginResponse>({
        pathname: AUTH_LOGIN,
        method: 'POST',
        values: payload,
        showMessage: false,
        show_error_message: true,
      });

      // DummyJSON login returns token directly in response.data
      const loginData = res?.data;
      if (!loginData?.token) {
        throw new Error('Invalid credentials');
      }

      return loginData;
    },
    onSuccess: (data) => {
      const user: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      };
      login(user, data.token);
    },
  });
}
