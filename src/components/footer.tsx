import React from 'react';

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer
            style={{
                backgroundColor: '#222',
                color: '#fff',
                padding: '20px 0',
                textAlign: 'center'
            }}
        >
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div>
                    © {currentYear} TrulyNgl. All rights reserved.
                </div>
                <div style={{ marginTop: '10px' }}>
                    <a
                        href="https://www.linkedin.com/in/vaidik-kathal-a22b17298/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#fff', marginRight: '15px' }}
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://github.com/VaidikKindaCodes"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#fff', marginRight: '15px' }}
                    >
                        GitHub
                    </a>
                    <a
                        href="https://www.instagram.com/vaidik.06/"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#fff' }}
                    >
                        Instagram
                    </a>
                </div>
                <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
                    made with love by Vaidik
                </div>
            </div>
        </footer>
    );
}

export default Footer;