import { Injectable } from 'khamsa';
import { ThemeOptions } from '@mui/material/styles';
import createTheme from '@mui/material/styles/createTheme';
import { createMuiTheme } from '@lenconda/shuffle-mui-theme';
import { createElement } from 'react';
import Box from '@mui/material/Box';
import { ConfigService } from '@modules/config/config.service';
import * as vectors from '@modules/brand/vectors';

@Injectable()
export class BrandService {
    public constructor(
        private readonly configService: ConfigService,
    ) {}

    public getVectors(type: string) {
        return vectors[type];
    }

    public getTheme(mode: 'light' | 'dark' = 'light') {
        const pugioTheme = createTheme(
            createMuiTheme({
                variants: {
                    primary: '#4b768b',
                },
                mode,
            }),
            {
                palette: {
                    divider: mode === 'light'
                        ? '#e6e6e6'
                        : '#424242',
                },
                components: {
                    MuiIcon: {
                        defaultProps: {
                            baseClassName: 'pugio-icons',
                        },
                        styleOverrides: {
                            root: {
                                width: 'initial',
                                height: 'initial',
                                fontSize: 12,
                            },
                            fontSizeSmall: {
                                fontSize: 6,
                            },
                            fontSizeLarge: {
                                fontSize: 16,
                            },
                        },
                    },
                    MuiListItemText: {
                        defaultProps: {
                            disableTypography: true,
                        },
                        styleOverrides: {
                            root: {
                                fontSize: 13,
                            },
                        },
                    },
                    MuiListItemIcon: {
                        styleOverrides: {
                            root: {
                                minWidth: 24,
                            },
                        },
                    },
                    MuiListItem: {
                        styleOverrides: {
                            root: {
                                userSelect: 'none',
                                cursor: 'pointer',
                            },
                        },
                    },
                    MuiTextField: {
                        defaultProps: {
                            InputProps: {
                                classes: {
                                    input: 'input',
                                },
                            },
                        },
                    },
                    MuiInputBase: {
                        styleOverrides: {
                            root: {
                                height: '100%',
                            },
                        },
                    },
                    MuiButton: {
                        defaultProps: {
                            color: 'secondary',
                            variant: 'contained',
                        },
                        styleOverrides: {
                            sizeMedium: {
                                fontSize: 12,
                                lineHeight: '17px',
                                paddingTop: 7,
                                paddingRight: 10,
                                paddingBottom: 7,
                                paddingLeft: 10,
                            },
                            sizeSmall: {
                                fontSize: 6,
                                lineHeight: '6px',
                                paddingTop: 7,
                                paddingRight: 10,
                                paddingBottom: 7,
                                paddingLeft: 10,
                                fontWeight: 700,
                            },
                            sizeLarge: {
                                fontSize: 14,
                                paddingTop: 7,
                                paddingRight: 10,
                                paddingBottom: 7,
                                paddingLeft: 10,
                            },
                            iconSizeMedium: {
                                '.pugio-icons': {
                                    fontSize: 14,
                                },
                            },
                            iconSizeSmall: {
                                '.pugio-icons': {
                                    fontSize: 6,
                                    lineHeight: '12px',
                                },
                            },
                            iconSizeLarge: {
                                '.pugio-icons': {
                                    fontSize: 18,
                                },
                            },
                        },
                    },
                    MuiListItemButton: {
                        defaultProps: {
                            sx: (theme) => ({
                                borderRadius: 0,

                                '&:hover, &.Mui-selected': {
                                    color: theme.palette.mode === 'dark'
                                        ? 'white'
                                        : theme.palette.grey[900],
                                    '& *': {
                                        color: theme.palette.mode === 'dark'
                                            ? 'white'
                                            : theme.palette.grey[900],
                                    },
                                },
                            }),
                        },
                    },
                    MuiAvatar: {
                        defaultProps: {
                            children: createElement(
                                Box,
                                {
                                    component: 'img',
                                    // @ts-ignore
                                    src: this.configService.DEFAULT_PICTURE_URL,
                                    width: '100%',
                                    height: '100%',
                                },
                            ),
                        },
                        styleOverrides: {
                            root: {
                                width: 'auto',
                                height: 'auto',
                                '&, & img': {
                                    pointerEvents: 'none',
                                },
                            },
                        },
                    },
                },
            } as ThemeOptions,
        );

        return pugioTheme;
    }
}
