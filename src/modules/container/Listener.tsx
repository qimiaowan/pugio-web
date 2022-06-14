import { getContainer } from 'khamsa';
import {
    FC,
    useEffect,
} from 'react';
import { StoreService } from '@modules/store/store.service';
import shallow from 'zustand/shallow';
import { useParams } from 'react-router-dom';

const Listener: FC = () => {
    const container = getContainer(Listener);
    const storeService = container.get<StoreService>(StoreService);

    const { client_id: clientId } = useParams();
    const {
        selectedClientId,
        setWindowInnerHeight,
        setWindowInnerWidth,
    } = storeService.useStore((state) => {
        const {
            selectedClientId,
            setWindowInnerHeight,
            setWindowInnerWidth,
        } = state;

        return {
            selectedClientId,
            setWindowInnerHeight,
            setWindowInnerWidth,
        };
    }, shallow);

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

    useEffect(() => {
        const storageSelectedClientId = localStorage.getItem('app.selectedClientId') || '';

        if (!clientId && !storageSelectedClientId && !selectedClientId) {
            window.location.hash = '/home/clients';
        }
    }, [selectedClientId, clientId]);

    useEffect(() => {
        if (clientId && clientId !== 'null') {
            localStorage.setItem('app.selectedClientId', clientId);
        }
    }, [clientId]);

    return (<></>);
};

export default Listener;
