import { useState } from 'react';
import { useNavigate } from 'react-router';

import { Input } from '../components/Input';
import { Button } from '../components/Button';

import { z, ZodError } from 'zod';
import { AxiosError } from 'axios';
import { api } from '../services/api';

const signUpSchema = z
  .object({
    name: z.string().min(3, { message: 'Informe o nome' }),
    email: z.email({ message: 'Email inválido' }),
    password: z
      .string()
      .trim()
      .min(6, { message: 'A senha deve ter pelo menos 6 caracteres' }),
    passwordConfirm: z.string({ message: 'Confirme a senha' }).trim(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'As senhas não são iguais',
    path: ['passwordConfirm'],
  });

export function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  async function onSubmit(e: React.SubmitEvent) {
    e.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const data = signUpSchema.parse({
        name,
        email,
        password,
        passwordConfirm,
      });

      await api.post('/users', data);

      if (confirm('Cadastrado com sucesso! Deseja fazer login?')) {
        navigate('/');
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return setErrorMessage(error.issues[0].message);
      }

      if (error instanceof AxiosError) {
        return setErrorMessage(
          error.response?.data.message || 'Erro ao cadastrar usuário',
        );
      }

      setErrorMessage('Erro ao cadastrar usuário');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={onSubmit}>
      <Input
        required
        legend="Nome"
        type="text"
        placeholder="Seu nome"
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        required
        legend="Email"
        type="email"
        placeholder="seu@email.com"
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        required
        legend="Senha"
        type="password"
        placeholder="senha123"
        onChange={(e) => setPassword(e.target.value)}
      />

      <Input
        required
        legend="Confirmação da senha"
        type="password"
        placeholder="senha123"
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />

      <p className="text-sm text-red-600 text-center font-medium my-4">
        {errorMessage}
      </p>

      <Button type="submit" isLoading={isLoading}>
        Cadastrar
      </Button>

      <a
        href="/"
        className="text-sm font-semibold text-gray-100 mt-10 mb-4 text-center hover:text-green-800 transition ease-linear"
      >
        Já tem uma conta? Faça login
      </a>
    </form>
  );
}
