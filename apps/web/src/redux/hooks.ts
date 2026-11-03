import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// À utiliser dans toute l'app à la place de useDispatch et useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Session de l'utilisateur : { status, user, accessToken }
export const useAuth = () => useAppSelector((state) => state.auth);
