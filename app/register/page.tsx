import React from 'react';
import RegisterForm from './_components/registerform/registerform.component';

const RegisterPage = () => {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full bg-[#e3017e]">
        <section className='shadow-md p-16 max-w-[900px] rounded-md bg-white flex flex-col gap-8 justify-center items-center'>
            <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
            <RegisterForm />
        </section>
    </main>
  );
};

export default RegisterPage;