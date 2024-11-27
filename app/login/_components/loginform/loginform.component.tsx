'use client'

import React, { useRef, useState } from 'react';
import useForm, { FormState } from '../../../../hooks/useform/useform.hook';
import Input from '../../../../components/input/input.component';
import Button from '../../../../components/button/button.component';
import Link from 'next/link';
import useAuth from '../../../../hooks/useauth/useauth.hook';

const LoginForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const { handleLogin } = useAuth();
  const [ loading, setLoading ] = useState<boolean>();

  const initialState: FormState = {
    email_usuario: '',
    senha: '',
  };

  const submitCallback = async (values: FormState) => {
    try {
      setLoading(true)
      await handleLogin(values);
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    } finally {
      setLoading(false)
    }
  };

  const { data, errors, handleChange, handleSubmit } = useForm(
    formRef,
    initialState,
    submitCallback
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} className='w-full flex flex-col gap-8'>
      <div>
        <Input
          type="email"
          name="email_usuario"
          value={data.email_usuario}
          handleChange={(_, e) => handleChange(e)}
          label="Email:"
          customError={errors.email_usuario}
          required
          className='w-full'
          disabled={loading}
        />
      </div>

      <div>
        <Input
          type="password"
          name="senha"
          value={data.senha}
          handleChange={(_, e) => handleChange(e)}
          label="Senha:"
          customError={errors.senha}
          required
          className='w-full'
          disabled={loading}
        />
      </div>

      <Button type="submit" disabled={loading} className='text-white bg-black'>
        {loading ? 'Aguarde...' : 'Entrar'}
      </Button>

      <aside className="text-center flex flex-col gap-2 justify-center items-center">
        <p>Ainda não tem uma conta?</p>
        <Link href="/register" className="hover:underline transition-all ease-in-out">Criar conta</Link>
      </aside>
    </form>
  );
};

export default LoginForm;
