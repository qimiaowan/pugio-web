import {
    FC,
    useEffect,
    useRef,
    useState,
} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { ClientMenuItemProps } from '@modules/client/client-menu-item.interface';
import styled from '@mui/material/styles/styled';
import _ from 'lodash';
import useTheme from '@mui/material/styles/useTheme';
import Tooltip from '@mui/material/Tooltip';

const ClientMenuItemWrapper = styled(Box)(({ theme }) => {
    const mode = theme.palette.mode;

    return `
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
        text-decoration: none;
        color: ${theme.palette.text.primary};
        padding: ${theme.spacing(2)};
        width: 100px;
        box-sizing: border-box;

        .title {
            font-size: 10px;
            text-decoration: none;
            max-width: 92px;
        }

        .icon {
            display: flex;
            align-items: center;

            .pugio-icons {
                font-size: 18px;
            }
        }

        &.full-width {
            flex-direction: row;

            .icon {
                margin-right: 5px;
            }
        }

        &.active {
            &, &:hover {
                background-color: ${mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300]};
            }
        }

        &:hover {
            background-color: ${mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[200]};
        }

        &.active, &:hover {
            color: ${mode === 'dark' ? theme.palette.grey[100] : theme.palette.grey[800]};
        }
    `;
});

const ClientMenuItem: FC<ClientMenuItemProps> = ({
    title,
    icon,
    active = false,
    fullWidth = false,
    skeleton = false,
}) => {
    const theme = useTheme();
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState<number>(100);
    const [skeletonFill, setSkeletonFill] = useState<string>('transparent');

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const [observationData] = entries;

            if (observationData) {
                const currentWidth = _.get(observationData, 'borderBoxSize[0].inlineSize');

                if (_.isNumber(currentWidth)) {
                    setWidth(currentWidth || 100);
                }
            }
        });

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [ref.current]);

    useEffect(() => {
        setSkeletonFill(
            theme.palette.mode === 'dark'
                ? theme.palette.grey[800]
                : theme.palette.grey[200],
        );
    }, [theme]);

    return (
        skeleton
            ? <Box
                style={{
                    width,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: `${theme.spacing(fullWidth ? 1.5 : 2)} 0`,
                }}
            >
                {
                    fullWidth
                        ? <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={width * 0.7}
                            height={width * 0.7 * 32 / 120}
                            viewBox="0 0 120 32"
                        >
                            <g>
                                <rect x="42" y="0" width="96" height="32" rx="3" fill={skeletonFill} />
                                <rect y="0" width="32" height="32" rx="3" fill={skeletonFill}  x="0"/>
                            </g>
                        </svg>
                        : <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={width * 0.2}
                            height={width * 0.2 * 65 / 50}
                            viewBox="0 0 50 65"
                        >
                            <g>
                                <rect x="0" y="55" width="50" height="10" rx="3" fill={skeletonFill} />
                                <rect y="0" width="50" height="50" rx="3" fill={skeletonFill} x="0"/>
                            </g>
                        </svg>
                }
            </Box>
            : <Tooltip
                title={title}
                arrow={true}
                placement="right"
                sx={{ userSelect: 'none' }}
                onClick={() => {
                    return false;
                }}
            >
                <ClientMenuItemWrapper
                    ref={ref}
                    className={clsx('client-menu-item', {
                        active,
                        'full-width': fullWidth,
                    })}
                >
                    <Box className="icon">{icon}</Box>
                    <Typography classes={{ root: 'title' }} noWrap={true}>{title}</Typography>
                </ClientMenuItemWrapper>
            </Tooltip>
    );
};

export default ClientMenuItem;
