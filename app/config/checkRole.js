import { useRouter } from 'next/router';
import { globalRole } from './globalRole'; 

export function checkRole(expectedRole) {
  const router = useRouter();
  const storedToken = localStorage.getItem('token');

  if (storedToken) {
    const decodedToken = jwtDecode(storedToken);
    const tokenRole = decodedToken.role;

    if (tokenRole !== expectedRole) {
      router.push('/'); 
    }
  }
}
