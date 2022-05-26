/* eslint-disable no-unused-vars */
import Popover from '@mui/material/Popover';
import {
    createElement,
    FC,
    useCallback,
    useState,
    memo,
    MouseEvent,
    ReactNode,
    ReactElement,
    useRef,
} from 'react';
import { ChannelPopoverProps } from '@modules/channel/channel-popover.interface';
import _ from 'lodash';
import { InjectedComponentProps } from 'khamsa';
import { ChannelListProps } from '@modules/channel/channel-list.interface';
import { ChannelListComponent } from '@modules/channel/channel-list.component';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import styled from '@mui/material/styles/styled';

const ChannelPopoverWrapper = styled(Popover)(() => {
    return `
        .popover-header {
            padding: 0;
        }
    `;
});

const ChannelPopover: FC<InjectedComponentProps<ChannelPopoverProps>> = ({
    Trigger,
    declarations,
    channelListProps,
    popoverProps = {},
}) => {
    const ChannelList = declarations.get<FC<ChannelListProps>>(ChannelListComponent);

    const anchorEl = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState<boolean>(false);

    const handleClick = () => {
        setVisible(true);
    };

    const handleClose = () => {
        setVisible(false);
    };

    return (
        <Box ref={anchorEl}>
            {
                createElement(Trigger, {
                    open: visible,
                    handleOpen: handleClick,
                })
            }
            <ChannelPopoverWrapper
                open={visible}
                anchorEl={anchorEl.current}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                {...popoverProps}
            >
                <ChannelList
                    {
                        ...(
                            _.isFunction(channelListProps)
                                ? channelListProps({ handleClose })
                                : channelListProps
                        )
                    }
                    searchProps={{
                        InputProps: {
                            startAdornment: <Icon className="icon-search" />,
                            sx: {
                                border: 0,
                            },
                        },
                    }}
                    headerProps={{
                        className: 'popover-header',
                    }}
                />
            </ChannelPopoverWrapper>
        </Box>
    );
};

export default memo(ChannelPopover, (prevProps, nextProps) => {
    console.log(prevProps, nextProps);
    return true;
});
