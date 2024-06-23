export let globalRole = ''; 

import { useRouter } from 'next/router'; 

export function checkRole(expectedRole) {
  const router = useRouter();
  const storedToken = localStorage.getItem('token');

  if (storedToken) {
    const decodedToken = jwtDecode(storedToken);
    const tokenRole = decodedToken.role;

    if (tokenRole !== expectedRole) {
      router.push('/unauthorized'); 
    }
  }
}
