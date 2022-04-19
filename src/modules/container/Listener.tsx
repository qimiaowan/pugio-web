import { InjectedComponentProps } from 'khamsa';
import {
    FC,
    PropsWithChildren,
    useEffect,
} from 'react';
import {
    useLocation,
    useNavigate,
} from 'react-router-dom';
import { UtilsService } from '@modules/utils/utils.service';
import { StoreService } from '@modules/store/store.service';
import shallow from 'zustand/shallow';

const Listener: FC<PropsWithChildren<InjectedComponentProps>> = ({ declarations }) => {
    const utilsService = declarations.get<UtilsService>(UtilsService);
    const storeService = declarations.get<StoreService>(StoreService);

    const location = useLocation();
    const navigate = useNavigate();
    const [
        pathnameReady,
        setPathnameReady,
    ] = storeService.useStore((state) => {
        const {
            pathnameReady,
            setPathnameReady,
        } = state;
        return [pathnameReady, setPathnameReady];
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

        setPathnameReady();
    }, [pathnameReady]);

    return (<></>);
};

export default Listener;
