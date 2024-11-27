import { ChangeEvent, FormEvent, RefObject, useCallback, useEffect, useState } from 'react';

export interface FormState {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  [key: string]: any;
}

interface ErrorsState {
  [key: string]: string;
}

type SetCustomErrorsFunction = (target: HTMLFormElement) => ErrorsState;

type SubmitCallbackFunction = (values: FormState, target?: FormEvent<HTMLFormElement>) => Promise<void>;

const useForm = (
  formRef: RefObject<HTMLFormElement>,
  initialState: FormState,
  submitCallback: SubmitCallbackFunction,
  errorCallback?: (error: Error) => Promise<void>,
  setCustomErrors?: SetCustomErrorsFunction
) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<ErrorsState>({});
  const [errorsCount, setErrorsCount] = useState(0);
  const form = formRef.current;

  useEffect(() => {
    handleErrors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const countErrors = (errorsObject: ErrorsState) => {
    const count = Object.keys(errorsObject).length;
    setErrorsCount(count);
    return count;
  };

  const validateDefault = useCallback(() => {
    if (form === null) {
      return {};
    }
    const formData = new FormData(form);
    const isFormValid = form.checkValidity();
    const newErrors: ErrorsState = {};
    if (!isFormValid) {
      for (const [name] of formData) {
        const element = form.elements.namedItem(name);
        if (element instanceof HTMLInputElement) {
          newErrors[name] = element.validationMessage;
        }
      }
    }
    return newErrors;
  }, [form]);

  const handleErrors = useCallback(async () => {
    if (form === null) {
      return { validationErrors: {}, count: 0 };
    }
    const newErrors = validateDefault();
    const customErrors = setCustomErrors?.(form);
    const validationErrors = { ...newErrors, ...customErrors };
    setErrors(validationErrors);
    return { validationErrors, count: countErrors(validationErrors) };
  }, [validateDefault, setCustomErrors, form]);

  const handleSubmit = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const { count, validationErrors } = await handleErrors();
    if (count) {
      setLoading(false);
      if (errorCallback instanceof Function) {
        await errorCallback(new Error('Form inválido', { cause: validationErrors }));
      }
      return;
    }
    await submitCallback(data, e);
    setLoading(false);
  }, [loading, handleErrors, submitCallback, data, errorCallback]);

  const handleChange = useCallback(async (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    const keys = name.split('.');
    setData((oldData) => {
      const newData = { ...oldData };
      let current = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });

    await handleErrors();
  }, [handleErrors]);

  return { data, setData, errors, errorsCount, loadingSubmit: loading, handleChange, handleSubmit, handleErrors };
};

export default useForm;