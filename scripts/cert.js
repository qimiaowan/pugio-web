const mkcert = require('mkcert');
const fs = require('fs-extra');
const path = require('path');

const ca = mkcert.createCA({
    organization: 'Local Dev CA',
    countryCode: 'US',
    state: 'New Jersey',
    locality: 'Trenton',
    validityDays: 365,
});

ca.then((caInfo) => {
    const {
        key: caKey,
        cert: caCert,
    } = caInfo;

    const cert = mkcert.createCert({
        domains: [
            '127.0.0.1',
            'localhost',
            'example.com',
            '*.example.com',
        ],
        caKey,
        caCert,
        validityDays: 365,
    });

    const caDirname = path.resolve(__dirname, '../ca');
    const certFilePathname = path.resolve(caDirname, 'pugio.cert.pem');
    const keyFilePathname = path.resolve(caDirname, 'pugio.key.pem');
    const caCertFilePathname = path.resolve(caDirname, 'root.cert.pem');

    cert.then((certInfo) => {
        if (fs.existsSync(caDirname)) {
            if (!fs.statSync(caDirname).isDirectory()) {
                fs.removeSync(caDirname);
            }
        } else {
            fs.mkdirpSync(caDirname);
        }

        const {
            cert,
            key,
        } = certInfo;

        fs.writeFileSync(certFilePathname, Buffer.from(cert));
        fs.writeFileSync(keyFilePathname, Buffer.from(key));
        fs.writeFileSync(caCertFilePathname, Buffer.from(caCert));
    });
});
