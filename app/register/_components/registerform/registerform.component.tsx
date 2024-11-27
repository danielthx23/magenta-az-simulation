'use client'

import React, { useRef } from 'react';
import useForm, { FormState } from '../../../../hooks/useform/useform.hook';
import Input from '../../../../components/input/input.component';
import FileInput from '../../../../components/fileinput/fileinput.component';
import Button from '../../../../components/button/button.component';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toastAlerta } from '../../../../utils/toastalerta/toastalerta.util';

const RegisterForm = () => {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const initialState: FormState = {
    imagem: null,
    email_usuario: '',
    nickname_usuario: '',
    senha: '', 
  };

  const submitCallback = async (values: FormState) => {
    try {
      const reader = new FileReader();
      let base64String = undefined;

      if (values.imagem) {
        reader.readAsDataURL(values.imagem);
      }
  
      reader.onloadend = async () => {
        base64String = reader.result; 
      };

      const response = await fetch('/api/usuarios', {
        method: 'POST',
        body: JSON.stringify({
          email_usuario: values.email_usuario,
          nickname_usuario: values.nickname_usuario,
          senha: values.senha,
          imagem: base64String, 
        }),
        headers: {
          'Content-Type': 'application/json', 
        },
      });

      if (!response.ok) {
        throw new Error(`Falha ao registrar usuário: ${response.statusText}`);
      }

      toastAlerta('Usuário registrado com sucesso!', 'sucesso');
      router.push('/login');
  
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      toastAlerta('Erro ao registrar usuário', 'erro');
    }
  };

  async function submitErrorCallback(error: Error) {
    if (error.cause && Object.keys(error.cause).length) {
        let message = 'Erro ao realizar registro:\n\n';
        for (const key in error.cause) {
            const causes = error.cause as { [key: string]: string };
            message += `- ${causes[key]}\n`;
        }
        console.log(message); 
        toastAlerta('Erro ao registrar usuário', 'erro');
    }
  }

  const { data, errors, loadingSubmit, handleChange, handleSubmit } = useForm(
    formRef,
    initialState,
    submitCallback, 
    submitErrorCallback,
    (form) => {
      const errors: { [key: string]: string } = {};

      const imagem = form.elements.namedItem('imagem') as HTMLInputElement;
      const email_usuario = form.elements.namedItem('email_usuario') as HTMLInputElement;
      const nickname_usuario = form.elements.namedItem('nickname_usuario') as HTMLInputElement;
      const senha = form.elements.namedItem('senha') as HTMLInputElement;
    
      const maxFileSize = 1 * 1024 * 1024;
    
      if (imagem && imagem.files && imagem.files[0]) {
        if (imagem.files[0].size > maxFileSize) {
          errors.imagem = "O tamanho do arquivo não pode exceder 1 MB.";
        }
      }
    
      if (!email_usuario || !email_usuario.value.trim()) {
        errors.email_usuario = "O email é obrigatório.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email_usuario.value)) {
        errors.email_usuario = "O email informado não é válido.";
      }
    
      if (!nickname_usuario || !nickname_usuario.value.trim()) {
        errors.nickname_usuario = "O apelido é obrigatório.";
      }
    
      if (!senha || !senha.value.trim()) {
        errors.senha = "A senha é obrigatória.";
      } else if (senha.value.length < 6) {
        errors.senha = "A senha deve ter pelo menos 6 caracteres.";
      }
    
      return errors;
    }
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    handleChange({
      target: {
        name: 'imagem',
        value: file, // Store the file directly
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className='w-full flex flex-col gap-8'>
      <div>
        <FileInput
          handleChange={(_, e) => handleImageChange(e)}
          customError={errors.imagem}
          name="imagem"
          wrapperClassName='w-full flex justify-center'
        />
      </div>

      <div>
        <Input
          type="email"
          name ="email_usuario"
          value={data.email_usuario}
          handleChange={(_, e) => handleChange(e)}
          label="Email:"
          customError={errors.email_usuario}
          required
          className='w-full'
          disabled={loadingSubmit}
        />
      </div>

      <div>
        <Input
          type="text"
          name="nickname_usuario"
          value={data.nickname_usuario}
          handleChange={(_, e) => handleChange(e)}
          label="Apelido:"
          customError={errors.nickname_usuario}
          required
          className='w-full'
           disabled={loadingSubmit}
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
           disabled={loadingSubmit}
        />
      </div>

      <Button type="submit" disabled={loadingSubmit} handleClick={() => handleSubmit} className='text-white bg-black'>
        {loadingSubmit ? 'Aguarde...' : 'Registrar Usuário!'}
      </Button>

      <aside className="text-center flex flex-col gap-2 justify-center items-center">
        <p>Já tem uma conta?</p>
        <Link href="/login" className="hover:underline transition-all ease-in-out">Entrar na conta</Link>
      </aside>
    </form>
  );
};

export default RegisterForm;