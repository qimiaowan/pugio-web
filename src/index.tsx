import ReactDOM from 'react-dom';
import './index.less';
import { App as KhamsaApp } from 'khamsa';
import reportWebVitals from './report-web-vitals';
import { AppModule } from './app.module';
import { HashRouter } from 'react-router-dom';

ReactDOM.render(
    <KhamsaApp
        module={AppModule}
        RouterComponent={HashRouter}
    />,
    document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
