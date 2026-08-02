import { useActionState } from 'react';

import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { z, ZodError } from 'zod';
import { AxiosError } from 'axios';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const signInSchema = z.object({
  email: z.email({ message: 'Email inválido' }),
  password: z.string().trim().min(1, { message: 'Informe a senha' }),
});

export function SignIn() {
  const [state, formAction, isLoading] = useActionState(signIn, null);

  const auth = useAuth();

  async function signIn(_: { message: string } | null, formData: FormData) {
    try {
      const userData = signInSchema.parse({
        email: formData.get('email'),
        password: formData.get('password'),
      });

      const response = await api.post('/sessions', userData);
      auth.saveDataToLocalStorage(response.data);

      return null;
    } catch (error) {
      if (error instanceof ZodError) {
        return { message: error.issues[0].message };
      }

      if (error instanceof AxiosError) {
        return {
          message: error.response?.data.message || 'Erro ao fazer login',
        };
      }

      return { message: 'Erro ao fazer login' };
    }
  }

  return (
    <form
      className="w-full flex flex-col gap-4"
      action={formAction}
      method="post"
    >
      <Input
        name="email"
        required
        legend="Email"
        type="email"
        placeholder="seu@email.com"
      />

      <Input
        name="password"
        required
        legend="Senha"
        type="password"
        placeholder="senha123"
      />

      <p className="text-sm text-red-600 text-center font-medium my-4">
        {state?.message}
      </p>

      <Button type="submit" isLoading={isLoading}>
        Entrar
      </Button>

      <a
        href="/signup"
        className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear"
      >
        Criar conta
      </a>
    </form>
  );
}
