import * as React from 'react';
import { validatePayload } from 'lib/validator';

type AuthenticationFormValues = {
  firstName: string,
  lastName: string,
  email: string,
  username: string,
  password: string,
  confirmPassword: string,
  errors: Record<string, string[]>,

}

export interface AuthenticationProps {
  values: AuthenticationFormValues,
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  handleSubmit: (trigger: string) => (event: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  errors: {},
};

const {
  SIGN_UP_REDIRECT_URL = 'http://localhost:8080/signup/redirect'
} = process.env;

export default function withAuthenticationContainer(WrappedComponent) {
  return function AuthenticationContainer(props: Record<string, any>) {
    const [values, setValues] = React.useState(initialState);

    function handleChange({ target: { value, name } }: React.ChangeEvent<HTMLInputElement>) {
      setValues({
        ...values,
        [name]: value,
      });
    }

    function handleBlur({ target: { value, name } }: React.FocusEvent<HTMLInputElement>) {
      if (value) {
        setValues({
          ...values,
          errors: {
            ...values.errors,
            [name]: [],
          }
        });
      }
    }

    function handleSubmit(trigger: string) {
      return function (event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        switch (trigger) {
          case 'SIGN_UP':
            return handleSignUp();
          case 'NEW_PASSWORD':
            return handleAuthOperation(
                'changeUserPassword',
                'changePassword');
          default:
            return handleSignUp();
        }
      }
    }

    async function handleSignUp() {
      const { signUp } = props;
      const errors = await validatePayload(values, 'signUp');
      if (errors) {
        return setValues({
          ...values,
          errors,
        });
      }

      return signUp({ ...values, redirectURL: SIGN_UP_REDIRECT_URL });
    }

    async function handleAuthOperation(schemaKey, validFuncName) {
      const errors = await validatePayload(values, schemaKey);
      if (errors) {
        return setValues({
          ...values,
          errors,
        });
      }
        return props[validFuncName](values);
    }

    function composeProps() {
      return {
        values,
        handleChange,
        handleBlur,
        handleSubmit,
        ...props,
      }
    }

    // TypeScript doesn't recognize WrappedComponent in JSX here
    // So I defaulted to using React.createElement
    return React.createElement(WrappedComponent, composeProps());
  }
}



