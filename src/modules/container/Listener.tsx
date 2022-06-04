import { getContainer } from 'khamsa';
import {
    FC,
    useEffect,
} from 'react';
import {
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { UtilsService } from '@modules/utils/utils.service';
import { StoreService } from '@modules/store/store.service';
import shallow from 'zustand/shallow';

const Listener: FC = () => {
    const container = getContainer(Listener);
    const utilsService = container.get<UtilsService>(UtilsService);
    const storeService = container.get<StoreService>(StoreService);

    const location = useLocation();
    const navigate = useNavigate();
    const {
        pathnameReady,
        selectedClientId,
        setPathnameReady,
        setWindowInnerHeight,
        setWindowInnerWidth,
    } = storeService.useStore((state) => {
        const {
            pathnameReady,
            selectedClientId,
            setPathnameReady,
            setWindowInnerHeight,
            setWindowInnerWidth,
        } = state;

        return {
            pathnameReady,
            selectedClientId,
            setPathnameReady,
            setWindowInnerHeight,
            setWindowInnerWidth,
        };
    }, shallow);

    useEffect(() => {
        if (location && pathnameReady) {
            localStorage.setItem('app.pathname', utilsService.serializeLocation(location));
        }
    }, [location, pathnameReady]);

    useEffect(() => {
        const pathname = localStorage.getItem('app.pathname') || '';

        if (pathname && !pathnameReady) {
            navigate(pathname);
        }

        if (!pathnameReady) {
            if (pathname) {
                navigate(pathname);
            } else if (selectedClientId) {
                navigate(`/client/${selectedClientId}`);
            } else {
                navigate('/clients/list');
            }
        }

        setPathnameReady();
    }, [pathnameReady]);

    useEffect(() => {
        const handler = () => {
            setWindowInnerWidth(window.innerWidth);
            setWindowInnerHeight(window.innerHeight);
        };

        window.addEventListener('resize', handler);

        return () => {
            window.removeEventListener('resize', handler);
        };
    }, []);

    return (<></>);
};

export default Listener;
