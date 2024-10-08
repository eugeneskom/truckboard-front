import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const splitDimensions = (dims: string): [string, string, string] => {
  const [length, width, height] = dims.split('x');
  return [length || '', width || '', height || ''];
};

import { GetServerSidePropsContext } from 'next';
import Cookies from 'js-cookie';

export function getToken() {
  return Cookies.get('token');
}

export function setToken(token: string) {
  Cookies.set('token', token);
}

export function removeToken() {
  Cookies.remove('token');
}

export function withAuth(gssp: any) {
  return async (context: GetServerSidePropsContext) => {
    const { req, res } = context;
    const token = req.cookies.token;

    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return await gssp(context);
  };
}