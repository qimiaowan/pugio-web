import Box from '@mui/material/Box';
import styled from '@mui/material/styles/styled';
import { InjectedComponentProps } from 'khamsa';
import {
    FC,
    useCallback,
} from 'react';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import { ExceptionComponent } from '@modules/brand/exception.component';
import { LocaleService } from '@modules/locale/locale.service';
import { ExceptionProps } from '@modules/brand/exception.interface';
import {
    useNavigate,
    useParams,
} from 'react-router-dom';

const StyledBox = styled(Box)(({ theme }) => {
    return `
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;

        &.exception {
            justify-content: center;
            align-items: center;
        }
    `;
});

const ClientStatus: FC<InjectedComponentProps> = ({
    declarations,
}) => {
    const Exception = declarations.get<FC<ExceptionProps>>(ExceptionComponent);
    const localeService = declarations.get<LocaleService>(LocaleService);

    const navigate = useNavigate();
    const { client_id: clientId } = useParams();
    const getLocaleText = localeService.useLocaleContext('pages.clientStatus');

    const handleUnsupportedNavigate = useCallback(() => {
        navigate(`/client/${clientId}/workstation`);
    }, [clientId]);

    return (
        <StyledBox className="exception">
            <Exception
                imageSrc="/static/images/not_supported.svg"
                title={getLocaleText('unsupported.title')}
                subTitle={getLocaleText('unsupported.subTitle')}
            >
                <Button
                    variant="text"
                    color="primary"
                    size="small"
                    startIcon={<Icon className="icon-apps" />}
                    onClick={handleUnsupportedNavigate}
                >{getLocaleText('unsupported.goToWorkstation')}</Button>
            </Exception>
        </StyledBox>
    );
};

export default ClientStatus;
