import { Injectable } from 'khamsa';
import logo from '@modules/brand/logo.svg';
import { ThemeOptions } from '@mui/material/styles';
import createTheme from '@mui/material/styles/createTheme';
import theme from '@lenconda/shuffle-mui-theme';
import createStyles from '@mui/material/styles/createStyles';
import Color from 'color';

@Injectable()
export class BrandService {
    public getLogo() {
        return logo;
    }

    public getTheme() {
        const pugioTheme = createTheme(theme, {
            palette: {
                secondary: {
                    main: '#ededed',
                },
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
                                fontSize: 12,
                            },
                        },
                        iconSizeSmall: {
                            '.pugio-icons': {
                                fontSize: 6,
                                lineHeight: '10px',
                            },
                        },
                        iconSizeLarge: {
                            '.pugio-icons': {
                                fontSize: 16,
                            },
                        },
                    },
                    variants: [
                        {
                            props: {
                                color: 'error',
                                variant: 'contained',
                            },
                            style: createStyles((data) => {
                                return {
                                    color: 'white',
                                    backgroundColor: data.theme.palette.error.main,
                                    '&:hover': {
                                        backgroundColor: Color(data.theme.palette.error.main).darken(0.1).toString(),
                                    },
                                    '&:active': {
                                        backgroundColor: Color(data.theme.palette.error.main).darken(0.15).toString(),
                                    },
                                };
                            }),
                        },
                        {
                            props: {
                                color: 'secondary',
                                variant: 'contained',
                            },
                            style: createStyles((data) => {
                                return {
                                    // color: data.theme.text.primary,
                                    backgroundColor: data.theme.palette.secondary.main,
                                    '&:hover': {
                                        backgroundColor: Color(data.theme.palette.secondary.main).darken(0.1).toString(),
                                    },
                                    '&:active': {
                                        backgroundColor: Color(data.theme.palette.secondary.main).darken(0.15).toString(),
                                    },
                                };
                            }),
                        },
                    ],
                },
            },
        } as ThemeOptions);

        return pugioTheme;
    }
}
