import {
    FC,
    useEffect,
    useState,
} from 'react';
import { UserSelectorProps } from '@modules/user/user-selector.interface';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Icon from '@mui/material/Icon';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { InjectedComponentProps } from 'khamsa';
import { LocaleService } from '@modules/locale/locale.service';
import SimpleBar from 'simplebar-react';
import clsx from 'clsx';
import _ from 'lodash';
import '@modules/user/user-selector.component.less';

const UserSelector: FC<InjectedComponentProps<UserSelectorProps>> = ({
    declarations,
    className,
    onSelectUsers,
    ...props
}) => {
    const localeService = declarations.get<LocaleService>(LocaleService);

    const [mode, setMode] = useState<string>('search');
    const [dialogContentHeight, setDialogContentHeight] = useState<number>(0);
    const [dialogContentElement, setDialogContentElement] = useState<HTMLDivElement>(null);
    const getComponentLocaleText = localeService.useLocaleContext('components.userSelector');
    const getAppLocaleText = localeService.useLocaleContext('app');

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            const [observationData] = entries;

            if (observationData) {
                const blockSize = _.get(observationData, 'borderBoxSize[0].blockSize');

                if (_.isNumber(blockSize)) {
                    setDialogContentHeight(blockSize);
                }
            }
        });

        if (dialogContentElement) {
            observer.observe(dialogContentElement);
        }

        return () => {
            observer.disconnect();
        };
    }, [dialogContentElement]);

    return (
        <Dialog
            {...props}
            disableEscapeKeyDown={true}
            maxWidth="sm"
            fullWidth={true}
            className={clsx('user-selector', className)}
        >
            <DialogTitle classes={{ root: 'title' }}>
                <Box>
                    <ToggleButtonGroup value={mode}>
                        {
                            ['search', 'selected'].map((mode) => {
                                return (
                                    <ToggleButton
                                        key={mode}
                                        value={mode}
                                        onClick={() => setMode(mode)}
                                    >{getComponentLocaleText(mode)}</ToggleButton>
                                );
                            })
                        }
                    </ToggleButtonGroup>
                </Box>
                <TextField classes={{ root: 'search' }} placeholder={getAppLocaleText('searchPlaceholder')} />
                <Box>
                    <IconButton><Icon className="icon-close" /></IconButton>
                </Box>
            </DialogTitle>
            <DialogContent
                classes={{ root: 'content' }}
                ref={(ref) => setDialogContentElement(ref as unknown as HTMLDivElement)}
            >
                <SimpleBar style={{ maxHeight: dialogContentHeight - 1 || 720 }}>
                    {/* TODO */}
                    {
                        new Array(200).fill(null).map((value, index) => {
                            return (
                                <p key={index}>{Math.random()}</p>
                            );
                        })
                    }
                </SimpleBar>
            </DialogContent>
            <DialogActions>
                <Button>{getComponentLocaleText('cancel')}</Button>
                <Button color="primary">{getComponentLocaleText('ok')}</Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserSelector;
