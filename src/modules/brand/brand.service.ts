import { Injectable } from 'khamsa';
import logo from '@modules/brand/logo.svg';
import {
    ThemeOptions,
    createStyles,
} from '@mui/material/styles';
import createTheme from '@mui/material/styles/createTheme';
import { createMuiTheme } from '@lenconda/shuffle-mui-theme';

@Injectable()
export class BrandService {
    public getLogo() {
        return logo;
    }

    public getTheme() {
        const pugioTheme = createTheme(
            createMuiTheme({
                variants: {
                    primary: '#4b768b',
                },
            }),
            {
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
                                    fontSize: 14,
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
                                    fontSize: 18,
                                },
                            },
                        },
                    },
                    MuiDialogContentText: {
                        styleOverrides: {
                            root: createStyles((data) => {
                                if (data?.theme.palette.mode === 'light') {
                                    return {
                                        color: data?.theme.palette.text.primary,
                                    };
                                }

                                return {};
                            }),
                        },
                    },
                },
            } as ThemeOptions);

        return pugioTheme;
    }
}
