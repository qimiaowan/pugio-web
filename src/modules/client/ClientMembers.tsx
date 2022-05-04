/* eslint-disable no-unused-vars */
import {
    FC,
    useState,
} from 'react';
import Box, { BoxProps } from '@mui/material/Box';
import clsx from 'clsx';
import { InjectedComponentProps } from 'khamsa';
import { UtilsService } from '@modules/utils/utils.service';
import { QueryClientMembersResponseDataItem } from '@modules/client/client.interface';
import { ClientService } from '@modules/client/client.service';
import _ from 'lodash';
import { useDebounce } from 'ahooks';
import { useParams } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { ClientMemberTab } from '@modules/client/client-members.interface';
import '@modules/client/client-members.component.less';

const ClientMembers: FC<InjectedComponentProps<BoxProps>> = ({
    className = '',
    declarations,
    ...props
}) => {
    const clientService = declarations.get<ClientService>(ClientService);
    const utilsService = declarations.get<UtilsService>(UtilsService);

    const { client_id: clientId } = useParams();
    const [searchValue, setSearchValue] = useState<string>('');
    const [role, setRole] = useState<number>(2);
    const [tabs, setTabs] = useState<ClientMemberTab[]>([]);
    const debouncedSearchValue = useDebounce(searchValue);

    const {
        data: queryClientMembersResponseData,
        loadMore: queryMoreClientMembers,
        loading: queryClientsLoading,
        loadingMore: queryClientsLoadingMore,
    } = utilsService.useLoadMore<QueryClientMembersResponseDataItem> (
        (data) => clientService.queryClientMembers(
            {
                clientId,
                role,
                ..._.pick(data, ['lastCursor', 'size']),
                search: debouncedSearchValue,
            },
        ),
        {
            reloadDeps: [
                clientId,
                role,
                debouncedSearchValue,
            ],
        },
    );

    return (
        <Box
            {...props}
            className={clsx('client-members', className)}
        >
            <Box className="header">
                <Box className="header-controls-wrapper"></Box>
                <Box className="header-controls-wrapper"></Box>
            </Box>
            <Divider />
            <Box className="single-column">
            </Box>
        </Box>
    );
};

export default ClientMembers;
