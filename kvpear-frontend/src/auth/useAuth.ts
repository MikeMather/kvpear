import { authContext } from '@/components/context/authContext';
import { UserType } from '@/database/models/user';
import { useContext } from 'react';


export default function useAuth(): { user: UserType | null, isLoading: boolean } {
  const { user, isLoading } = useContext(authContext);
  return { user, isLoading };
}