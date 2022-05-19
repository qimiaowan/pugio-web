/* eslint-disable no-unused-vars */
import {
    FC,
    useState,
    MouseEvent as SyntheticMouseEvent,
} from 'react';
import {
    ChannelListItemMode,
    ChannelListItemProps,
} from '@modules/channel/channel-list-item.interface';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Icon from '@mui/material/Icon';
import styled from '@mui/material/styles/styled';
import useTheme from '@mui/material/styles/useTheme';
import clsx from 'clsx';
import _ from 'lodash';

const ChannelListItemWrapper = styled('div')(({theme}) => {
    const mode = theme.palette.mode;
    return `
        height: 120px;
        cursor: pointer;
        display: inline-block;
        user-select: none;
        position: relative;

        &:hover {
            background-color: ${mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.03)'};
        }

        &:active:focus,
        &:active:not(:focus):not(:focus-within) {
            background-color: ${mode === 'dark' ? 'rgba(255, 255, 255, 0.01)' : 'rgba(0, 0, 0, 0.05)'};
        }

        .action-wrapper {
            padding-right: 5px;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            padding: 5px;
            background-color: ${mode === 'dark' ? 'rgba(255, 255, 255, 0.75)' : 'rgba(0, 0, 0, 0.75)'}
        }

        .content-wrapper {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            img {
                pointer-events: none;
            }

            .text {
                color: ${theme.palette.text.primary};
                margin-top: 10px;
            }
        }
    `;
});

const ChannelListItem: FC<ChannelListItemProps> = ({
    data = {},
    style,
    builtIn = false,
    width,
    mode = 'app-entry',
    menu = [],
    onClick,
}) => {
    const {
        name,
        avatar,
        description = '',
    } = data;

    let channelListItemDisplayMode: ChannelListItemMode;

    if (mode === 'app-entry' || mode === 'list-item') {
        channelListItemDisplayMode = mode;
    } else {
        channelListItemDisplayMode = 'app-entry';
    }

    const theme = useTheme();
    const [opacity, setOpacity] = useState<number>(0);

    return (
        <ChannelListItemWrapper
            style={{
                ...style,
                width,
            }}
            onMouseEnter={() => {
                setOpacity(1);
            }}
            onMouseLeave={() => {
                setOpacity(0);
            }}
            onClick={onClick}
        >
            {
                menu.length > 0 && (
                    <Box className="action-wrapper" style={{ opacity }}>
                        {
                            menu.map((menuItem, index) => {
                                return (
                                    <IconButton
                                        key={index}
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            if (_.isFunction(menuItem.onClick)) {
                                                menuItem.onClick(event);
                                            }
                                        }}
                                    >
                                        <Icon className={clsx('icon', menuItem.icon)} />
                                    </IconButton>
                                );
                            })
                        }
                    </Box>
                )
            }
            <Box className="content-wrapper">
                <Box
                    component="img"
                    style={{
                        width: width * 0.3,
                        height: width * 0.3,
                    }}
                    src={avatar || '/static/images/channel_avatar_fallback.svg'}
                />
                <Typography classes={{ root: 'text' }} variant="subtitle2">{name}</Typography>
            </Box>
        </ChannelListItemWrapper>
    );
};

export default ChannelListItem;
